from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field

# Standard ApiResponse Envelope Schema
class ApiResponse(BaseModel):
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[Any] = None

# User & Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: Optional[str] = "student"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OTPResendRequest(BaseModel):
    email: EmailStr

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp_code: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserProfileOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: str

# Document Schemas
class DocumentOut(BaseModel):
    id: str
    title: str
    type: str
    size: str
    pages: int
    chunksCount: int
    uploadedAt: str
    status: str
    vectorCollection: Optional[str] = None
    summary: Optional[str] = None

class DocumentUpdate(BaseModel):
    title: Optional[str] = None

# Chat Schemas
class Citation(BaseModel):
    documentTitle: str
    docId: str
    page: int
    lineRange: str
    text: str
    score: float

class ChatMessageCreate(BaseModel):
    text: str
    doc_id: Optional[str] = None
    search_external: Optional[bool] = False

class ChatMessageOut(BaseModel):
    id: str
    sender: str
    text: str
    citations: Optional[List[Citation]] = []
    timestamp: str

class ChatSessionOut(BaseModel):
    id: str
    title: str
    active_doc_id: Optional[str] = None
    created_at: str

# Quiz Schemas
class QuizOption(BaseModel):
    idx: int
    text: str

class QuizQuestionOut(BaseModel):
    id: str
    question: str
    options: List[str]
    correctOption: int
    explanation: Optional[str] = None

class QuizOut(BaseModel):
    id: str
    title: str
    doc: str
    questions: List[QuizQuestionOut]

class QuizSubmitRequest(BaseModel):
    answers: Dict[str, int] # question_id -> chosen option index

class QuizSubmitResult(BaseModel):
    quiz_id: str
    score: int
    total: int
    percentage: float

# Flashcard Schemas
class FlashcardOut(BaseModel):
    id: str
    deck: str
    question: str
    answer: str
    difficulty: str
    mastered: bool
    doc: str

class FlashcardMasteryUpdate(BaseModel):
    mastered: bool

# Study Plan Schemas
class StudyTaskCreate(BaseModel):
    title: str
    duration_mins: int = 45
    priority: str = "Medium"

class StudyTaskOut(BaseModel):
    id: str
    title: str
    duration_mins: int
    priority: str
    completed: bool

class StudyPlanOut(BaseModel):
    id: str
    name: str
    exam_date: Optional[str] = None
    tasks: List[StudyTaskOut]

# Admin & Settings Schemas
class AdminConfigOut(BaseModel):
    chunkSize: int
    overlap: int
    topK: int
    temperature: float

class AdminConfigUpdate(BaseModel):
    chunkSize: Optional[int] = None
    overlap: Optional[int] = None
    topK: Optional[int] = None
    temperature: Optional[float] = None
