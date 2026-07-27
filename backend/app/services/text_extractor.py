import os
from pypdf import PdfReader
import docx
from pptx import Presentation

class TextExtractorService:
    @staticmethod
    def extract_text(file_path: str, file_type: str) -> dict:
        """
        Extracts raw text and metadata from PDF, DOCX, PPTX, or TXT files.
        Returns a dict: {"text": str, "pages": int, "chunks_count": int}
        """
        ext = file_type.upper()
        raw_text = ""
        pages_count = 1

        try:
            if ext == "PDF":
                reader = PdfReader(file_path)
                pages_count = len(reader.pages)
                page_texts = []
                for idx, page in enumerate(reader.pages):
                    t = page.extract_text() or ""
                    if t.strip():
                        page_texts.append(f"[Page {idx+1}]\n" + t)
                raw_text = "\n\n".join(page_texts)

            elif ext == "DOCX":
                doc = docx.Document(file_path)
                paras = [p.text for p in doc.paragraphs if p.text.strip()]
                raw_text = "\n".join(paras)
                pages_count = max(1, len(paras) // 5)

            elif ext == "PPTX":
                prs = Presentation(file_path)
                pages_count = len(prs.slides)
                slide_texts = []
                for idx, slide in enumerate(prs.slides):
                    st = []
                    for shape in slide.shapes:
                        if hasattr(shape, "text") and shape.text.strip():
                            st.append(shape.text)
                    if st:
                        slide_texts.append(f"[Slide {idx+1}]\n" + "\n".join(st))
                raw_text = "\n\n".join(slide_texts)

            else: # TXT / Markdown
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    raw_text = f.read()
                pages_count = max(1, len(raw_text) // 2000)

        except Exception as e:
            raw_text = f"Text extraction warning: {str(e)}"
            pages_count = 1

        # Calculate estimated chunks count (e.g. 512 tokens / ~2000 chars per chunk)
        chunk_count = max(1, len(raw_text) // 1500) if raw_text else 0

        return {
            "text": raw_text,
            "pages": pages_count,
            "chunks_count": chunk_count
        }

text_extractor = TextExtractorService()
