import os
import sys

# Force UTF-8
os.environ["PYTHONIOENCODING"] = "utf-8"
sys.stdout.reconfigure(encoding='utf-8')

print("=== Checking Python Packages & AI Models ===")

# 1. Sentence Transformers
try:
    from sentence_transformers import SentenceTransformer
    print("[+] Loading SentenceTransformer model ('all-MiniLM-L6-v2')...")
    st_model = SentenceTransformer('all-MiniLM-L6-v2')
    vec = st_model.encode(["LearnGen AI test sentence"], show_progress_bar=False)
    print(f"[SUCCESS] SentenceTransformer loaded! Vector shape: {vec.shape} (384d dense embeddings)")
except Exception as e:
    print(f"[ERROR] SentenceTransformer failed: {e}")

# 2. ChromaDB
try:
    import chromadb
    print(f"[+] ChromaDB version: {chromadb.__version__}")
    client = chromadb.PersistentClient(path="./vector_db")
    col = client.get_or_create_collection("test_verification_coll")
    print(f"[SUCCESS] ChromaDB PersistentClient created at ./vector_db")
except Exception as e:
    print(f"[ERROR] ChromaDB failed: {e}")

# 3. Google Generative AI (Gemini SDK)
try:
    import google.generativeai as genai
    print(f"[+] Google GenerativeAI SDK version: {genai.__version__}")
    
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if api_key:
        genai.configure(api_key=api_key)
        print("[+] Listing supported Gemini models for generateContent:")
        try:
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    print(f"   - {m.name}")
        except Exception as e:
            print(f"   [Notice] List models request error (check API Key): {e}")
    else:
        print("[NOTICE] GEMINI_API_KEY is not set in environment or backend/.env.")
except Exception as e:
    print(f"[ERROR] Google GenerativeAI SDK failed: {e}")

print("=== Check Completed ===")
