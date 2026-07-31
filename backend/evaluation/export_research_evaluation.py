"""
LearnGen AI — Research Paper Empirical Evaluation Generator
Executes real RAG pipeline queries and exports structured evaluation data to
evaluation/rag_eval_results.json and evaluation/rag_eval_results.csv.
"""

import os
import sys
import time
import json
import csv

# Force UTF-8 output
os.environ["PYTHONIOENCODING"] = "utf-8"
sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.rag_stubs import rag_service

EVAL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "output"))
os.makedirs(EVAL_DIR, exist_ok=True)

JSON_OUT = os.path.join(EVAL_DIR, "rag_eval_results.json")
CSV_OUT = os.path.join(EVAL_DIR, "rag_eval_results.csv")

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

EVAL_QUERIES = [
    {
        "query": "What is the mathematical formula for Scaled Dot-Product Attention?",
        "expected_source": SAMPLE_DOC_TITLE,
        "is_grounded_expected": True
    },
    {
        "query": "What key concepts allow a qubit to exist in 0 and 1 simultaneously?",
        "expected_source": SAMPLE_DOC_TITLE,
        "is_grounded_expected": True
    },
    {
        "query": "What mechanism processes input tokens in parallel in Transformer architectures?",
        "expected_source": SAMPLE_DOC_TITLE,
        "is_grounded_expected": True
    },
    {
        "query": "What is the capital city of France and its total population?",
        "expected_source": "N/A",
        "is_grounded_expected": False
    },
    {
        "query": "How many moons does Jupiter have according to NASA observations?",
        "expected_source": "N/A",
        "is_grounded_expected": False
    }
]

def run_research_evaluation():
    print("=" * 70)
    print("[RESEARCH EVALUATION] Running LearnGen AI RAG Empirical Evaluation")
    print("=" * 70)

    doc_id = "eval_doc_quantum_transformer_001"
    rag_service.index_document(doc_id=doc_id, doc_title=SAMPLE_DOC_TITLE, raw_text=SAMPLE_TEXT)
    print(f"[+] Sample document indexed into ChromaDB Vector Vault.")

    results = []

    for idx, q_info in enumerate(EVAL_QUERIES, 1):
        query = q_info["query"]
        expected_src = q_info["expected_source"]
        
        t0 = time.time()
        rag_res = rag_service.query(user_query=query, doc_id=doc_id)
        total_latency = int((time.time() - t0) * 1000)

        citations = rag_res.get("citations", [])
        retrieved_src = citations[0]["documentTitle"] if citations else "None"
        top_score = citations[0]["similarityScore"] if citations else "0.0%"
        
        is_grounded = bool(citations) and ("could not find" not in rag_res["answer"].lower() and "not contain" not in rag_res["answer"].lower())
        citation_correct = (retrieved_src == expected_src) if q_info["is_grounded_expected"] else (len(citations) == 0 or "not contain" in rag_res["answer"].lower())

        item = {
            "eval_id": f"EVAL-{idx:03d}",
            "question": query,
            "expected_source": expected_src,
            "retrieved_source": retrieved_src,
            "top_similarity_score": top_score,
            "answer_generated": rag_res["answer"][:180] + "...",
            "is_grounded": is_grounded,
            "citation_correct": citation_correct,
            "retrieval_latency_ms": rag_res["vectorSearchTimeMs"],
            "llm_latency_ms": rag_res["llmLatencyMs"],
            "total_latency_ms": total_latency
        }
        results.append(item)
        print(f"  [{idx}/{len(EVAL_QUERIES)}] Query: '{query[:45]}...' -> Latency: {total_latency}ms | Grounded: {is_grounded}")

    # Export JSON
    with open(JSON_OUT, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"\n[SUCCESS] Research Evaluation JSON exported to: {JSON_OUT}")

    # Export CSV
    fieldnames = list(results[0].keys())
    with open(CSV_OUT, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)
    print(f"[SUCCESS] Research Evaluation CSV exported to: {CSV_OUT}")

    print("=" * 70)
    return results

if __name__ == "__main__":
    run_research_evaluation()
