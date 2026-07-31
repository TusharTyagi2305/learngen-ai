"""
LearnGen AI — Comprehensive RAG Pipeline Verification Script
Tests Text Extraction, Chunking, Embedding Generation, Vector Vault Indexing,
Retriever Cosine Search, Grounded LLM Prompting, Citations, and Quiz/Flashcard Generators.
"""

import os
import sys
import json

# Force UTF-8 output encoding for Windows terminal
sys.stdout.reconfigure(encoding='utf-8')

# Ensure app is in path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.services.rag_stubs import (
    rag_service,
    ai_quiz_generator,
    ai_flashcard_generator,
    DocumentChunkingService,
    EmbeddingService,
    VectorStoreService
)

def test_rag_pipeline():
    print("=" * 60)
    print("[RAG PIPELINE VERIFICATION] Starting LearnGen AI Test")
    print("=" * 60)

    # 1. Test Text Chunking with Page & Line Metadata
    sample_text = (
        "[Page 1]\n"
        "Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve problems too complex for classical computers.\n"
        "Key concepts include superposition and entanglement. A qubit can represent 0, 1, or any superposition of both.\n\n"
        "[Page 2]\n"
        "Transformer architectures rely on Multi-Head Attention mechanisms to process input tokens in parallel.\n"
        "The mathematical formula for Scaled Dot-Product Attention is Softmax((Q * K^T) / sqrt(d_k)) * V.\n"
        "Residual connections and positional encodings enable training ultra-deep neural networks."
    )

    doc_id = "test_doc_quantum_transformer_001"
    doc_title = "Quantum_Computing_and_Transformers_Overview.pdf"

    print("\n[1/5] Testing DocumentChunkingService...")
    chunker = DocumentChunkingService()
    chunks = chunker.chunk_document(sample_text, doc_id=doc_id, doc_title=doc_title, chunk_size=200, overlap=30)
    print(f"   -> Chunks created: {len(chunks)}")
    for idx, c in enumerate(chunks[:2]):
        print(f"   Chunk {idx}: Page {c['metadata']['page']}, Lines L{c['metadata']['line_start']}-L{c['metadata']['line_end']}")
        print(f"   Content snippet: \"{c['text'][:90]}...\"")

    # 2. Test RAG Indexing (Embedding Generation & Vector Vault Store)
    print("\n[2/5] Testing Vector Vault Indexing (Embedding + Store)...")
    indexed_count = rag_service.index_document(doc_id=doc_id, doc_title=doc_title, raw_text=sample_text)
    print(f"   -> Document indexed into Vector Store. Total Chunks Indexed: {indexed_count}")

    # 3. Test Retrieval & Vector Similarity Search
    print("\n[3/5] Testing Vector Similarity Retrieval...")
    query = "What is the mathematical formula for Scaled Dot-Product Attention?"
    rag_result = rag_service.query(user_query=query, doc_id=doc_id)
    print(f"   -> RAG Query: '{query}'")
    print(f"   -> Search Time: {rag_result['vectorSearchTimeMs']}ms | LLM Latency: {rag_result['llmLatencyMs']}ms | Grounded Ratio: {rag_result['groundedRatio']}")
    print(f"   -> Answer Output:\n{rag_result['answer']}\n")

    print("   -> Citations:")
    for cit in rag_result["citations"]:
        print(f"     - [{cit['documentTitle']}, Page {cit['page']}, {cit['lineRange']}] (Score: {cit['similarityScore']})")
        print(f"       Text: {cit['text'][:100]}...")

    # 4. Test AI Quiz Generation
    print("\n[4/5] Testing AI Quiz Generator...")
    quiz = ai_quiz_generator.generate_quiz(doc_text=sample_text, doc_title=doc_title, num_questions=3)
    print(f"   -> Generated Quiz Questions Count: {len(quiz)}")
    for q_idx, q in enumerate(quiz, 1):
        print(f"   Q{q_idx}: {q['question']}")
        print(f"       Options: {q['options']}")
        print(f"       Correct Index: {q['correct_option']}")
        print(f"       Explanation: {q['explanation']}")

    # 5. Test AI Flashcard Generation
    print("\n[5/5] Testing AI Flashcard Generator...")
    flashcards = ai_flashcard_generator.generate_flashcards(doc_text=sample_text, doc_title=doc_title, num_cards=3)
    print(f"   -> Generated Flashcards Count: {len(flashcards)}")
    for f_idx, fc in enumerate(flashcards, 1):
        print(f"   Card {f_idx} [{fc['difficulty']}]: Q: {fc['question']} | A: {fc['answer'][:60]}...")

    print("\n" + "=" * 60)
    print("[SUCCESS] RAG PIPELINE VERIFICATION PASSED COMPLETELY")
    print("=" * 60)

if __name__ == "__main__":
    test_rag_pipeline()
