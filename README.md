# LearnGen AI — Production RAG 2.0 AI Learning Platform

LearnGen AI is a full-stack, enterprise-grade academic RAG 2.0 platform featuring multi-tenant vector security, PostgreSQL 17 relational database backend, grounded LLM response generation, automatic source citations, document summarization, viva preparation packs, and dynamic MCQ quiz/flashcard generators.

---

## Architecture Overview

```
+------------------------------------------------------------------+
|                     React + Vite Frontend UI                      |
|       (Dashboard, RAG Chat, Documents, Quiz, Flashcards)          |
+------------------------------------------------------------------+
                                | REST API (JWT Bearer Auth)
                                v
+------------------------------------------------------------------+
|                  Python FastAPI Backend (/api/v1)                |
+------------------------------------------------------------------+
        |                        |                        |
        v                        v                        v
+---------------+        +---------------+        +---------------+
| Relational DB |        | Embedding Engine|      | Vector Storage|
| PostgreSQL 17 |        | Sentence-     |        | ChromaDB      |
| (SQLAlchemy / |        | Transformers  |        | Persistent    |
| Alembic)      |        | (384d Dense)  |        | Vault         |
+---------------+        +---------------+        +---------------+
                                 |
                                 v
                 +-------------------------------+
                 | Grounded Gemini AI Service    |
                 | (google-genai / gemini-flash) |
                 +-------------------------------+
```

---

## Setup & Installation Instructions

### 1. Prerequisites
- **Node.js**: v18+ and npm
- **Python**: 3.10+ (tested on Python 3.10-3.14)
- **PostgreSQL 17**: Running on port 5432 with database `learngen_ai`.

---

### 2. Backend Setup
1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   pip install google-genai psycopg[binary] alembic
   ```

---

### 3. Environment & PostgreSQL Configuration
Create or update `backend/.env`:
```env
APP_ENV=development
APP_NAME=LearnGen AI Backend
API_V1_PREFIX=/api/v1
SECRET_KEY=learngen-ai-production-super-secret-jwt-key-2026-xyz
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120
REFRESH_TOKEN_EXPIRE_DAYS=7

# PostgreSQL 17 Database Connection String
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/learngen_ai

UPLOAD_DIR=./uploads
VECTOR_DB_DIR=./vector_db
MAX_UPLOAD_SIZE_MB=25

# Gemini AI & RAG Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-flash-latest
EMBEDDING_MODEL=all-MiniLM-L6-v2

# Brevo Transactional Email API Configuration
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@learngen.ai
EMAIL_FROM_NAME=LearnGen AI

ALLOWED_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000","http://localhost:5173"]
```

---

### 6. Production Email Setup (Brevo API on Render)

LearnGen AI uses the official **Brevo (Sendinblue) REST API** for transactional emails (OTP verification, welcome emails, password resets, admin notifications).

#### Render Environment Variables:
Add the following environment variables to your Render Web Service dashboard:

```env
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@learngen.ai
EMAIL_FROM_NAME=LearnGen AI
```

- **`BREVO_API_KEY`**: Your API key generated from [brevo.com](https://brevo.com).
- **`EMAIL_FROM`**: The sender identity. You should use a verified domain sender (e.g. `noreply@yourdomain.com`).
- **`EMAIL_FROM_NAME`**: The sender name (e.g. `LearnGen AI`).
```

---

### 4. Database Schema Migration & Data Import
1. Run Alembic migration to create schema on PostgreSQL:
   ```bash
   python -m alembic upgrade head
   ```
2. Migrate existing relational records from SQLite backup into PostgreSQL:
   ```bash
   python migrate_sqlite_to_postgres.py
   ```

---

### 5. Frontend Setup
1. In the project root directory:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

---

## How Document Indexing, RAG & Citations Work

1. **Document Upload & Text Extraction**: When a file (PDF, DOCX, PPTX, TXT) is uploaded via `/api/v1/documents/upload`, the backend parses pages and tracks line ranges (`L1-L3`).
2. **Chunking & Dense Embeddings**: Documents are recursively chunked into 512-token windows with 50-token overlap. `SentenceTransformer('all-MiniLM-L6-v2')` generates dense 384-dimensional vector embeddings.
3. **Multi-Tenant ChromaDB Persistence**: Chunks and vectors are tagged with `user_id` and stored in persistent ChromaDB at `./vector_db`. User A cannot access or query User B's documents.
4. **Cosine Similarity Search**: Queries calculate top-K cosine similarity scores against indexed chunks.
5. **Grounded Prompt & Citations**: The retrieved source chunks are injected into Gemini system instructions. Gemini is explicitly constrained to answer ONLY using supplied document context. Answers include exact source citations (`[Document, Page X, Line Y]`).

---

## Verification Tests & Research Evaluation

### 1. Run Master PostgreSQL E2E Verification Suite
```bash
cd backend
python e2e_full_verification.py
```
*Tests Auth, PostgreSQL document metadata persistence, 384d Embeddings, ChromaDB, User Isolation Security, Multi-Doc Filtering, 5-Question RAG, Anti-Hallucination, Quiz, Flashcards, Summary, Viva, and Purge.*

### 2. Run Backend RAG Unit Tests
```bash
python test_rag.py
```

### 3. Run Research Evaluation Data Generator
```bash
python evaluation/export_research_evaluation.py
```

### 4. Run RAG vs Non-RAG Comparative Evaluation
```bash
python evaluation/rag_vs_non_rag_eval.py
```

---

## Troubleshooting Guide

- **`psycopg` / `libpq` DLL Not Found**:
  Run `pip install "psycopg[binary]" psycopg-binary`.
- **Alembic Target Database Error**:
  Ensure `DATABASE_URL` in `backend/.env` is accessible and database `learngen_ai` exists.
- **PowerShell `npm.ps1` Execution Policy Error**:
  Run `cmd.exe /c "npm run build"` or update PowerShell execution policy via `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`.

<!-- update 1 -->
<!-- update 2 -->
<!-- update 3 -->
<!-- update 4 -->
<!-- update 5 -->
<!-- update 6 -->
<!-- update 7 -->
<!-- update 8 -->
<!-- update 9 -->
<!-- update 10 -->
<!-- update 11 -->
<!-- update 12 -->
<!-- update 13 -->
<!-- update 14 -->
<!-- update 15 -->
<!-- update 16 -->
<!-- update 17 -->
<!-- update 18 -->
<!-- update 19 -->
<!-- update 20 --><!-- Update 1 -->
<!-- Update 2 -->
<!-- Update 3 -->
<!-- Update 4 -->
<!-- Update 5 -->
<!-- Update 6 -->
<!-- Update 7 -->
<!-- Update 8 -->
<!-- Update 9 -->
<!-- Update 10 -->
<!-- Update 11 -->
<!-- Update 12 -->
<!-- Update 13 -->
<!-- Update 14 -->
<!-- Update 15 -->
<!-- Update 16 -->
<!-- Update 17 -->
<!-- Update 18 -->
<!-- Update 19 -->
<!-- Update 20 -->
<!-- Update 21 -->
<!-- Update 22 -->
<!-- Update 23 -->
<!-- Update 24 -->
<!-- Update 25 -->
<!-- Update 26 -->
<!-- Update 27 -->
<!-- Update 28 -->
<!-- Update 29 -->
<!-- Update 30 -->
<!-- Update 31 -->
<!-- Update 32 -->
<!-- Update 33 -->
<!-- Update 34 -->
<!-- Update 35 -->
<!-- Update 36 -->
<!-- Update 37 -->
<!-- Update 38 -->
<!-- Update 39 -->
<!-- Update 40 -->
<!-- Update 41 -->
<!-- Update 42 -->
<!-- Update 43 -->
<!-- Update 44 -->
<!-- Update 45 -->
<!-- Update 46 -->
<!-- Update 47 -->
<!-- Update 48 -->
<!-- Update 49 -->
<!-- Update 50 -->
<!-- Update 51 -->
<!-- Update 52 -->
<!-- Update 53 -->
<!-- Update 54 -->
<!-- Update 55 -->
<!-- Update 56 -->
<!-- Update 57 -->
<!-- Update 58 -->
<!-- Update 59 -->
<!-- Update 60 -->
<!-- Update 61 -->
<!-- Update 62 -->
<!-- Update 63 -->
<!-- Update 64 -->
<!-- Update 65 -->
<!-- Update 66 -->
<!-- Update 67 -->
<!-- Update 68 -->
<!-- Update 69 -->
<!-- Update 70 -->
<!-- Update 71 -->
<!-- Update 72 -->
<!-- Update 73 -->
<!-- Update 74 -->
<!-- Update 75 -->
<!-- Update 76 -->
<!-- Update 77 -->
<!-- Update 78 -->
<!-- Update 79 -->
