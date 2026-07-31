import os
import shutil
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_user
from app.core.config import settings
from app.core.exceptions import BadRequestException, NotFoundException, ForbiddenException
from app.models.all_models import User, Document
from app.schemas.schemas import ApiResponse, DocumentOut, DocumentUpdate
from app.services.text_extractor import text_extractor
from app.services.rag_stubs import rag_service, ai_summary_generator, ai_viva_generator

router = APIRouter(prefix="/documents", tags=["Document Management"])

ALLOWED_EXTENSIONS = {"pdf", "docx", "pptx", "txt"}

@router.post("/upload", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename:
        raise BadRequestException("Invalid filename")

    filename = file.filename
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise BadRequestException(f"Unsupported file format '.{ext}'. Supported: PDF, DOCX, PPTX, TXT")

    # Safe unique filename
    safe_filename = f"{uuid.uuid4().hex}_{filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size_bytes = os.path.getsize(file_path)
    file_size_str = f"{file_size_bytes / (1024 * 1024):.1f} MB" if file_size_bytes >= 1024 * 1024 else f"{file_size_bytes / 1024:.1f} KB"

    # Real Text Extraction Engine (pypdf, python-docx, python-pptx, txt)
    extraction_result = text_extractor.extract_text(file_path, ext)

    doc_type_upper = ext.upper()
    collection_name = f"vault_{doc_type_upper.lower()}_v1"

    new_doc = Document(
        user_id=current_user.id,
        title=filename,
        stored_filename=safe_filename,
        file_type=doc_type_upper,
        file_size=file_size_str,
        pages=extraction_result["pages"],
        chunks_count=0,
        status="ready",
        extracted_text=extraction_result["text"][:10000],
        vector_collection=collection_name,
        summary=f"Vector indexed {doc_type_upper} document."
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    # Index document into ChromaDB Vector Vault with user_id tag
    real_chunks_count = rag_service.index_document(
        doc_id=new_doc.id,
        doc_title=filename,
        raw_text=extraction_result["text"],
        user_id=current_user.id
    )

    new_doc.chunks_count = real_chunks_count or extraction_result["chunks_count"]
    new_doc.summary = f"Vector indexed {doc_type_upper} document with {new_doc.chunks_count} chunks in persistent ChromaDB."
    db.commit()

    return ApiResponse(
        success=True,
        message="Document uploaded, text extracted, and indexed into vector vault successfully",
        data={
            "id": new_doc.id,
            "title": new_doc.title,
            "type": new_doc.file_type,
            "size": new_doc.file_size,
            "pages": new_doc.pages,
            "chunksCount": new_doc.chunks_count,
            "status": new_doc.status,
            "uploadedAt": new_doc.created_at.strftime("%Y-%m-%d")
        }
    )

@router.get("", response_model=ApiResponse)
def list_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    docs = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.created_at.desc()).all()
    out = [
        {
            "id": d.id,
            "title": d.title,
            "type": d.file_type,
            "size": d.file_size,
            "pages": d.pages,
            "chunksCount": d.chunks_count,
            "uploadedAt": d.created_at.strftime("%Y-%m-%d"),
            "status": d.status,
            "vectorCollection": d.vector_collection,
            "summary": d.summary
        }
        for d in docs
    ]
    return ApiResponse(success=True, data=out)

@router.delete("/{doc_id}", response_model=ApiResponse)
def delete_document(
    doc_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise NotFoundException("Document not found or access denied")

    # Remove stored file if exists
    file_path = os.path.join(settings.UPLOAD_DIR, doc.stored_filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception:
            pass

    # Remove document chunks from vector vault
    rag_service.delete_document(doc_id)

    db.delete(doc)
    db.commit()

    return ApiResponse(success=True, message=f"Document '{doc.title}' deleted successfully")

@router.patch("/{doc_id}", response_model=ApiResponse)
def rename_document(
    doc_id: str,
    update_in: DocumentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise NotFoundException("Document not found")

    if update_in.title:
        doc.title = update_in.title
        db.commit()

    return ApiResponse(success=True, message="Document updated", data={"id": doc.id, "title": doc.title})

@router.get("/{doc_id}/summary", response_model=ApiResponse)
def generate_document_summary(
    doc_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise NotFoundException("Document not found or access denied")

    text = doc.extracted_text or doc.summary or ""
    summary_data = ai_summary_generator.generate_summary(doc_text=text, doc_title=doc.title)
    return ApiResponse(success=True, data=summary_data)

@router.get("/{doc_id}/viva", response_model=ApiResponse)
def generate_viva_preparation(
    doc_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise NotFoundException("Document not found or access denied")

    text = doc.extracted_text or doc.summary or ""
    viva_data = ai_viva_generator.generate_viva_prep(doc_text=text, doc_title=doc.title)
    return ApiResponse(success=True, data=viva_data)

@router.post("/{doc_id}/reindex", response_model=ApiResponse)
def reindex_document(
    doc_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise NotFoundException("Document not found or access denied")

    file_path = os.path.join(settings.UPLOAD_DIR, doc.stored_filename)
    if not os.path.exists(file_path):
        raise NotFoundException("Physical document file missing on server")

    ext = doc.file_type.lower()
    extraction_result = text_extractor.extract_text(file_path, ext)
    
    real_chunks_count = rag_service.index_document(
        doc_id=doc.id,
        doc_title=doc.title,
        raw_text=extraction_result["text"],
        user_id=current_user.id
    )

    doc.extracted_text = extraction_result["text"][:10000]
    doc.chunks_count = real_chunks_count or extraction_result["chunks_count"]
    doc.pages = extraction_result["pages"]
    doc.summary = f"Re-indexed {doc.file_type} document with {doc.chunks_count} chunks using OCR engine."
    db.commit()

    return ApiResponse(
        success=True,
        message=f"Document '{doc.title}' successfully re-extracted and re-indexed into vector vault ({doc.chunks_count} chunks)",
        data={
            "id": doc.id,
            "title": doc.title,
            "chunksCount": doc.chunks_count,
            "pages": doc.pages
        }
    )

