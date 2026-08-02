"""
Download SentenceTransformer model with progress prints.
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

if __name__ == "__main__":
    print("Starting SentenceTransformer('all-MiniLM-L6-v2') model download...")
    from sentence_transformers import SentenceTransformer

    model = SentenceTransformer("all-MiniLM-L6-v2")
    print("Model loaded successfully!")
    vecs = model.encode(["Testing SentenceTransformers embeddings generation."])
    print(f"Test embedding generated! Vector shape: {vecs.shape}")
