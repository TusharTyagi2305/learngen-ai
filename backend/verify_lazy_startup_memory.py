import os
import sys
import tracemalloc

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
tracemalloc.start()

def verify_lazy_startup():
    print("=" * 80)
    print("[STARTUP MEMORY AUDIT FOR RENDER FREE PLAN (512MB LIMIT)]")
    print("=" * 80)

    # 1. Import FastAPI App & Routers (Simulating Server Launch)
    t0_mem = tracemalloc.get_traced_memory()[0] / (1024 * 1024)
    from app.main import app
    from app.services.rag_stubs import rag_service
    t1_mem = tracemalloc.get_traced_memory()[0] / (1024 * 1024)

    startup_allocated_mb = round(t1_mem - t0_mem, 2)
    print(f"Memory Allocated for FastAPI & All Routers Startup: {startup_allocated_mb} MB")

    # 2. Assert Zero Preloaded AI Models
    print("-" * 80)
    print("CHECKING LAZY-SINGLETON MODEL STATES AT STARTUP:")
    print(f"  • SentenceTransformer Model Loaded? : {rag_service.embedding._model is not None} (Expected: False)")
    print(f"  • ChromaDB Client Initialized?      : {rag_service.vector_store._client is not None} (Expected: False)")
    print(f"  • Gemini Client Initialized?        : {rag_service.llm._initialized} (Expected: False)")
    print("-" * 80)

    assert rag_service.embedding._model is None, "FAIL: SentenceTransformer loaded prematurely at startup!"
    assert rag_service.vector_store._client is None, "FAIL: ChromaDB loaded prematurely at startup!"
    assert not rag_service.llm._initialized, "FAIL: Gemini client loaded prematurely at startup!"
    assert startup_allocated_mb < 300.0, f"FAIL: Startup memory ({startup_allocated_mb} MB) exceeds 300 MB limit!"

    print(f"[PASS] App startup memory ({startup_allocated_mb} MB) is WELL BELOW 300 MB limit!")
    print("[PASS] ZERO AI models or vector databases preloaded into memory!")
    print("=" * 80)
    print("SUCCESS: SERVER IS FULLY OPTIMIZED FOR RENDER FREE PLAN (512MB)!")
    print("=" * 80)

if __name__ == "__main__":
    verify_lazy_startup()
