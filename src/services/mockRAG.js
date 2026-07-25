// LearnGen AI - Mock RAG Engine & Vector Simulation Service

export const INITIAL_DOCUMENTS = [
  {
    id: "doc-1",
    title: "Quantum_Computing_Principles_Ch3.pdf",
    type: "PDF",
    size: "4.2 MB",
    pages: 42,
    chunksCount: 128,
    uploadedAt: "2026-07-20",
    status: "Indexed",
    vectorCollection: "physics_quantum_v1",
    summary: "Comprehensive guide to quantum qubits, superposition, entanglement, and Shor's algorithm.",
    chunks: [
      {
        id: "chunk-101",
        page: 12,
        lineRange: "L120-L155",
        text: "Quantum superposition allows qubits to exist in linear combinations of |0⟩ and |1⟩ states simultaneously: |Ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1.",
        score: 0.94
      },
      {
        id: "chunk-102",
        page: 18,
        lineRange: "L210-L240",
        text: "Quantum Entanglement creates non-classical correlation between qubit pairs such that measuring state of Qubit A instantaneously determines state of Qubit B regardless of physical separation distance.",
        score: 0.89
      }
    ]
  },
  {
    id: "doc-2",
    title: "Deep_Learning_Architectures_Summary.docx",
    type: "DOCX",
    size: "2.8 MB",
    pages: 26,
    chunksCount: 84,
    uploadedAt: "2026-07-22",
    status: "Indexed",
    vectorCollection: "ai_deep_learning_v2",
    summary: "Covers Transformers, Multi-Head Attention mechanisms, residual connections, and positional encodings.",
    chunks: [
      {
        id: "chunk-201",
        page: 8,
        lineRange: "L80-L115",
        text: "Attention(Q, K, V) = softmax( (Q K^T) / sqrt(d_k) ) V. Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions.",
        score: 0.96
      },
      {
        id: "chunk-202",
        page: 15,
        lineRange: "L170-L200",
        text: "Layer Normalization normalizes activations across features within each training sample, stabilizing deep transformer hidden state dynamics.",
        score: 0.87
      }
    ]
  },
  {
    id: "doc-3",
    title: "Distributed_Systems_Cap_Theorem.pptx",
    type: "PPTX",
    size: "7.1 MB",
    pages: 35,
    chunksCount: 96,
    uploadedAt: "2026-07-23",
    status: "Indexed",
    vectorCollection: "cs_dist_systems",
    summary: "Breakdown of Consistency, Availability, Partition Tolerance trade-offs in distributed database engines.",
    chunks: [
      {
        id: "chunk-301",
        page: 5,
        lineRange: "L45-L70",
        text: "The CAP theorem states that any distributed data store can simultaneously provide at most two out of three guarantees: Consistency, Availability, and Partition Tolerance.",
        score: 0.91
      }
    ]
  }
];

export const INITIAL_FLASHCARDS = [
  {
    id: "fc-1",
    deck: "Quantum Computing",
    question: "What is Quantum Superposition?",
    answer: "The ability of a quantum system (qubit) to exist in multiple states (|0⟩ and |1⟩) simultaneously until measured.",
    difficulty: "Medium",
    mastered: false,
    doc: "Quantum_Computing_Principles_Ch3.pdf"
  },
  {
    id: "fc-2",
    deck: "Deep Learning",
    question: "Why is Scaling Factor sqrt(d_k) used in Scaled Dot-Product Attention?",
    answer: "It prevents large dot-product values from pushing softmax into extremely small gradient regions, avoiding vanishing gradients.",
    difficulty: "Hard",
    mastered: true,
    doc: "Deep_Learning_Architectures_Summary.docx"
  },
  {
    id: "fc-3",
    deck: "Distributed Systems",
    question: "What is the key insight of CAP Theorem?",
    answer: "In the event of a network partition (P), a distributed system must choose between Consistency (C) or Availability (A).",
    difficulty: "Easy",
    mastered: true,
    doc: "Distributed_Systems_Cap_Theorem.pptx"
  }
];

export const INITIAL_QUIZZES = [
  {
    id: "quiz-1",
    title: "Transformer Architectures & Attention",
    doc: "Deep_Learning_Architectures_Summary.docx",
    question: "Which operation computes the scaled dot-product attention weights in Transformer models?",
    options: [
      "softmax( (Q K^T) / sqrt(d_k) ) V",
      "sigmoid( Q * K ) / d_k",
      "tanh( Q + K ) * V",
      "relu( Q K^T ) / sqrt(V)"
    ],
    correctOption: 0,
    explanation: "As stated on page 8 of Deep_Learning_Architectures_Summary.docx, dot-product attention scales by 1/sqrt(d_k) before applying Softmax."
  },
  {
    id: "quiz-2",
    title: "Quantum Superposition & Qubits",
    doc: "Quantum_Computing_Principles_Ch3.pdf",
    question: "What is the normalization constraint for qubit state vector |Ψ⟩ = α|0⟩ + β|1⟩?",
    options: [
      "|α|² + |β|² = 1",
      "α + β = 0",
      "α * β = 1",
      "|α| + |β| = 2"
    ],
    correctOption: 0,
    explanation: "According to Quantum_Computing_Principles_Ch3.pdf (Pg 12), total probability density must equal 1, enforcing |α|² + |β|² = 1."
  }
];

// Simulated RAG Search Query Engine
export function queryRagEngine(userPrompt, documents, ragConfig) {
  const promptLower = userPrompt.toLowerCase();
  
  let matchingChunks = [];
  documents.forEach(doc => {
    doc.chunks.forEach(chunk => {
      let score = 0.75 + Math.random() * 0.2;
      if (promptLower.includes("quantum") || promptLower.includes("qubit") || promptLower.includes("superposition")) {
        if (doc.title.includes("Quantum")) score = 0.95;
      } else if (promptLower.includes("attention") || promptLower.includes("transformer") || promptLower.includes("layer")) {
        if (doc.title.includes("Deep_Learning")) score = 0.96;
      } else if (promptLower.includes("cap") || promptLower.includes("consistency") || promptLower.includes("partition")) {
        if (doc.title.includes("Cap")) score = 0.92;
      }
      
      matchingChunks.push({
        documentTitle: doc.title,
        docId: doc.id,
        page: chunk.page,
        lineRange: chunk.lineRange,
        text: chunk.text,
        score: parseFloat(score.toFixed(2))
      });
    });
  });

  matchingChunks.sort((a, b) => b.score - a.score);
  const topK = matchingChunks.slice(0, ragConfig?.topK || 3);

  let answer = "";
  if (promptLower.includes("quantum") || promptLower.includes("qubit")) {
    answer = `Based on **${topK[0]?.documentTitle || 'Quantum Computing Principles'}**, quantum qubits utilize superposition to exist as linear combinations of |0⟩ and |1⟩ states simultaneously. This allows quantum algorithms to process exponentially large state spaces before collapse upon measurement.`;
  } else if (promptLower.includes("attention") || promptLower.includes("transformer")) {
    answer = `According to **${topK[0]?.documentTitle || 'Deep Learning Architectures'}**, Multi-Head Attention enables models to jointly attend to contextual representations from different subspace projections. The scaling factor $\\sqrt{d_k}$ stabilizes gradient behavior during Softmax normalization.`;
  } else {
    answer = `Based strictly on your indexed document vault context, the system retrieved ${topK.length} relevant passages with an average similarity score of ${topK[0]?.score || 0.91}. The retrieved context directly details: "${topK[0]?.text.slice(0, 120)}..."`;
  }

  return {
    answer,
    citations: topK,
    vectorSearchTimeMs: 42,
    llmLatencyMs: 380,
    hallucinationRisk: "Low (<0.02%)",
    groundedRatio: "99.8%"
  };
}

export const mockRAG = {
  documents: INITIAL_DOCUMENTS,
  flashcards: INITIAL_FLASHCARDS,
  quizzes: INITIAL_QUIZZES,
  queryRagEngine
};

export default mockRAG;
