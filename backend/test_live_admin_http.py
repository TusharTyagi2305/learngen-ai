import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("="*70)
print("TESTING LIVE FASTAPI ADMIN ENDPOINTS VIA HTTP (http://127.0.0.1:8000)")
print("="*70)

# First get token via login
login_data = json.dumps({"email": "tushar@learngen.ai", "password": "Password123!"}).encode('utf-8')
req = urllib.request.Request("http://127.0.0.1:8000/api/v1/auth/login", data=login_data, headers={"Content-Type": "application/json"})

try:
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        token = res["data"]["access_token"]
        print(f"[AUTH SUCCESS] Obtained Admin Token: {token[:25]}...")
except Exception as e:
    print(f"[AUTH ERROR] Failed to login: {e}")
    sys.exit(1)

headers = {"Authorization": f"Bearer {token}"}
endpoints = [
    ("Dashboard Stats", "/api/v1/admin/dashboard-stats"),
    ("Document Analytics", "/api/v1/admin/document-analytics"),
    ("Vector Analytics", "/api/v1/admin/vector-analytics"),
    ("RAG Telemetry", "/api/v1/admin/rag-analytics"),
    ("Chat Analytics", "/api/v1/admin/chat-analytics"),
    ("Quiz Analytics", "/api/v1/admin/quiz-analytics"),
    ("Flashcard Analytics", "/api/v1/admin/flashcard-analytics"),
    ("System Health", "/api/v1/admin/system-health"),
    ("Database Monitor", "/api/v1/admin/database-monitor"),
    ("Vector Explorer", "/api/v1/admin/vector-explorer"),
    ("User Management", "/api/v1/admin/users"),
    ("File Manager", "/api/v1/admin/file-manager"),
    ("Audit Logs", "/api/v1/admin/logs"),
    ("API Monitor", "/api/v1/admin/api-monitor"),
    ("System Settings", "/api/v1/admin/settings"),
    ("Backup List", "/api/v1/admin/backup/list")
]

passed = 0
for name, ep in endpoints:
    url = f"http://127.0.0.1:8000{ep}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as r:
            data = json.loads(r.read().decode('utf-8'))
            if data.get("success"):
                print(f"[PASS] {name:<25} -> {ep} (HTTP 200)")
                passed += 1
            else:
                print(f"[FAIL] {name:<25} -> {ep} (Response success=False)")
    except Exception as err:
        print(f"[FAIL] {name:<25} -> {ep} ({err})")

print("="*70)
print(f"VERIFICATION COMPLETE: {passed}/{len(endpoints)} ADMIN ENDPOINTS PASSED!")
print("="*70)
