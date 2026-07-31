import sys
import os
from datetime import datetime

os.environ["PYTHONUNBUFFERED"] = "1"
sys.stdout.reconfigure(encoding='utf-8')

print("="*70, flush=True)
print("LEARNGEN AI - ENTERPRISE ADMIN DASHBOARD END-TO-END VERIFICATION", flush=True)
print("="*70, flush=True)

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.models.all_models import User, Document, ChatSession, AdminConfig
from app.core.security import create_access_token, get_password_hash

client = TestClient(app)

# 1. Ensure Admin User Exists
db = SessionLocal()
admin = db.query(User).filter(User.email == "tushar@learngen.ai").first()
if not admin:
    admin = User(
        email="tushar@learngen.ai",
        full_name="Tushar Tyagi",
        password_hash=get_password_hash("Password123!"),
        role="admin",
        is_active=True
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)

admin_token = create_access_token(subject=admin.id, role="admin")
headers = {"Authorization": f"Bearer {admin_token}"}

test_results = []

def run_test(name, endpoint, method="GET", json_body=None):
    try:
        if method == "GET":
            r = client.get(endpoint, headers=headers)
        elif method == "POST":
            r = client.post(endpoint, headers=headers, json=json_body)
        elif method == "PATCH":
            r = client.patch(endpoint, headers=headers, json=json_body)

        status_ok = r.status_code == 200
        res_json = r.json() if status_ok else {}
        success_ok = res_json.get("success", False)

        if status_ok and success_ok:
            print(f"[PASS] {name:<35} -> {endpoint} (HTTP 200)", flush=True)
            test_results.append((name, "PASS", "HTTP 200 - OK"))
        else:
            print(f"[FAIL] {name:<35} -> {endpoint} (Status {r.status_code})", flush=True)
            test_results.append((name, "FAIL", f"Status: {r.status_code}"))
    except Exception as e:
        print(f"[FAIL] {name:<35} -> {endpoint} Exception: {e}", flush=True)
        test_results.append((name, "FAIL", str(e)))

print("\nExecuting Admin API Suite Verification...", flush=True)
run_test("1. Dashboard Overview Stats", "/api/v1/admin/dashboard-stats")
run_test("2. Document Analytics", "/api/v1/admin/document-analytics")
run_test("3. Vector Database Analytics", "/api/v1/admin/vector-analytics")
run_test("4. Vector Action Rebuild", "/api/v1/admin/vector-actions/rebuild_index", method="POST")
run_test("5. AI RAG Telemetry", "/api/v1/admin/rag-analytics")
run_test("6. Chat Analytics", "/api/v1/admin/chat-analytics")
run_test("7. Quiz Analytics", "/api/v1/admin/quiz-analytics")
run_test("8. Flashcard Analytics", "/api/v1/admin/flashcard-analytics")
run_test("9. System Health Monitor", "/api/v1/admin/system-health")
run_test("10. Database Monitor", "/api/v1/admin/database-monitor")
run_test("11. Table Rows Inspector (users)", "/api/v1/admin/database-table/users")
run_test("12. Vector Explorer", "/api/v1/admin/vector-explorer")
run_test("13. User Management Workbench", "/api/v1/admin/users")
run_test("14. File Manager Browser", "/api/v1/admin/file-manager")
run_test("15. System Audit Logs", "/api/v1/admin/logs")
run_test("16. API Monitor Telemetry", "/api/v1/admin/api-monitor")
run_test("17. System Settings Hyperparameters", "/api/v1/admin/settings")
run_test("18. Create System Backup ZIP", "/api/v1/admin/backup/create", method="POST")
run_test("19. List System Backups", "/api/v1/admin/backup/list")

print("\n" + "="*70, flush=True)
print("FINAL ADMIN VERIFICATION SUMMARY REPORT", flush=True)
print("="*70, flush=True)
pass_count = sum(1 for _, status_str, _ in test_results if status_str == "PASS")
fail_count = len(test_results) - pass_count

for name, status_str, detail in test_results:
    print(f" - {name:<40}: {status_str} ({detail})", flush=True)

print(f"\nTOTAL TESTS: {len(test_results)} | PASSED: {pass_count} | FAILED: {fail_count}", flush=True)
print("="*70, flush=True)
db.close()
