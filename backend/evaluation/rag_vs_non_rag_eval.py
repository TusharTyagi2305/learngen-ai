"""
LearnGen AI — Research Evaluation: RAG vs Non-RAG Comparative Analysis
Generates research paper experimentation data comparing:
A. Gemini direct output without retrieved document context
B. Gemini grounded output using LearnGen AI RAG pipeline
"""

import os
import sys
import time
import json

# Force UTF-8 output
os.environ["PYTHONIOENCODING"] = "utf-8"
sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.rag_stubs import rag_service

EVAL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "output"))
os.makedirs(EVAL_DIR, exist_ok=True)
OUT_FILE = os.path.join(EVAL_DIR, "rag_vs_non_rag_comparison.json")

SAMPLE_DOC_TITLE = "Quantum_Computing_Principles_Ch3.pdf"
SAMPLE_TEXT = (
    "[Page 1]\n"
    "Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve problems too complex for classical computers.\n"
    "Key concepts include superposition and entanglement. A qubit can represent 0, 1, or any superposition of both.\n\n"
    "[Page 2]\n"
    "Transformer architectures rely on Multi-Head Attention mechanisms to process input tokens in parallel.\n"
    "The mathematical formula for Scaled Dot-Product Attention is Softmax((Q * K^T) / sqrt(d_k)) * V.\n"
    "Residual connections and positional encodings enable training ultra-deep neural networks."
)

COMPARISON_QUERIES = [
    "What is the mathematical formula for Scaled Dot-Product Attention?",
    "What diagnostic accuracy do CNNs achieve according to our medical chapter?",
    "What is the exact scaling factor used in dot-product attention?"
]

def run_comparison():
    print("=" * 70)
    print("[RAG VS NON-RAG EVALUATION] Research Paper Comparative Experimentation")
    print("=" * 70)

    doc_id = "eval_comp_doc_001"
    rag_service.index_document(doc_id=doc_id, doc_title=SAMPLE_DOC_TITLE, raw_text=SAMPLE_TEXT)

    results = []

    for idx, query in enumerate(COMPARISON_QUERIES, 1):
        print(f"\n[{idx}/{len(COMPARISON_QUERIES)}] Query: '{query}'")

        # Mode A: Non-RAG Direct Generation (no context supplied)
        t0 = time.time()
        non_rag_answer = rag_service.llm.generate_grounded(query=query, matches=[])
        t_non_rag = int((time.time() - t0) * 1000)

        # Mode B: LearnGen RAG Pipeline
        t1 = time.time()
        rag_res = rag_service.query(user_query=query, doc_id=doc_id)
        t_rag = int((time.time() - t1) * 1000)

        comp_item = {
            "query_id": f"COMP-{idx:03d}",
            "user_query": query,
            "mode_A_non_rag": {
                "answer": non_rag_answer[:220] + "...",
                "has_citations": False,
                "latency_ms": t_non_rag
            },
            "mode_B_rag_pipeline": {
                "answer": rag_res["answer"][:220] + "...",
                "citations_count": len(rag_res["citations"]),
                "citations": rag_res["citations"],
                "vector_search_ms": rag_res["vectorSearchTimeMs"],
                "llm_latency_ms": rag_res["llmLatencyMs"],
                "total_latency_ms": t_rag
            }
        }
        results.append(comp_item)

    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print(f"\n[SUCCESS] RAG vs Non-RAG comparison saved to: {OUT_FILE}")
    print("=" * 70)
    return results

if __name__ == "__main__":
    run_comparison()
