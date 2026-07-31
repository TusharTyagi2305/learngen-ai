from app.services.rag_stubs import rag_service

res = rag_service.query("give me all important question from the pdf for my exam prepration")
print("=== RAG BROAD QUERY TEST OUTPUT ===")
print("Source Type:", res.get("source_type"))
print("Source Label:", res.get("source_label"))
print("\n=== ANSWER SNIPPET ===")
print(res["answer"][:600])
