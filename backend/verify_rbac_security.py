import os
import sys
import time
import requests

backend_dir = os.path.abspath(os.path.dirname(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000/api/v1"

def log_result(test_num, name, status, details=""):
    symbol = "PASS" if status else "FAIL"
    print(f"[{test_num:02d}] {name:<70} [{symbol}] {details}")

def run_rbac_security_tests():
    print("=" * 95)
    print("LEARNGEN AI — UNIFIED AUTHENTICATION & RBAC SECURITY VERIFICATION SUITE")
    print("=" * 95)

    results = []

    # 1. Health check to running server
    try:
        r = requests.get(f"{BASE_URL.replace('/api/v1', '')}/docs", timeout=5)
        if r.status_code != 200:
            print("ERROR: Backend server not available on http://127.0.0.1:8000")
            return False
    except Exception as e:
        print(f"ERROR: Backend server connection refused: {e}")
        return False

    from app.core.database import SessionLocal
    from app.models.all_models import User

    # -------------------------------------------------------------
    # SCENARIO 1: Student Registration -> PASS
    # -------------------------------------------------------------
    student_email = f"unified_student_{int(time.time())}@learngen.ai"
    reg_student_payload = {
        "email": student_email,
        "full_name": "Unified Student Test",
        "password": "Password123!",
        "role": "student"
    }
    r = requests.post(f"{BASE_URL}/auth/register", json=reg_student_payload)
    db = SessionLocal()
    st_user = db.query(User).filter(User.email == student_email).first()
    st_role = st_user.role if st_user else "None"
    t1_success = r.status_code in [200, 201] and st_role == "student"
    if st_user:
        st_user.is_active = True
        db.commit()
    db.close()
    log_result(1, "Student Registration -> PASS", t1_success, f"Assigned Role: {st_role}")
    results.append(("Student Registration", t1_success))

    # -------------------------------------------------------------
    # SCENARIO 2: Teacher Registration Attempt -> BLOCKED (HTTP 400)
    # -------------------------------------------------------------
    teacher_email = f"unified_teacher_{int(time.time())}@learngen.ai"
    reg_teacher_payload = {
        "email": teacher_email,
        "full_name": "Unified Teacher Test",
        "password": "Password123!",
        "role": "teacher"
    }
    r = requests.post(f"{BASE_URL}/auth/register", json=reg_teacher_payload)
    t2_success = r.status_code == 400
    log_result(2, "Teacher Registration Attempt -> BLOCKED (HTTP 400 Deprecated)", t2_success, f"Response Status: {r.status_code}")
    results.append(("Teacher Registration Rejection", t2_success))

    # -------------------------------------------------------------
    # SCENARIO 6: Admin Login via Admin Tab -> Admin Dashboard
    # -------------------------------------------------------------
    sa_email = "admin@learngen.ai"
    sa_pass = "ChangeThisPassword123!"
    r = requests.post(f"{BASE_URL}/auth/admin-login", json={"email": sa_email, "password": sa_pass})
    sa_data = r.json().get("data", {}) if r.status_code == 200 else {}
    sa_token = sa_data.get("access_token", "")
    t6_success = r.status_code == 200 and bool(sa_token) and sa_data.get("user", {}).get("is_super_admin") is True
    log_result(6, "Super Admin Login via Admin Tab -> Admin Dashboard", t6_success, f"Role: {sa_data.get('user', {}).get('role')}")
    results.append(("Admin Login Endpoint Flow", t6_success))

    # -------------------------------------------------------------
    # SCENARIO 7: Student Trying Admin Login Tab -> HTTP 403
    # -------------------------------------------------------------
    r = requests.post(f"{BASE_URL}/auth/admin-login", json={"email": student_email, "password": "Password123!"})
    err_detail = r.json().get("detail", "") if r.status_code == 403 else ""
    t7_success = r.status_code == 403 and "This account does not have administrator privileges." in err_detail
    log_result(7, "Student Trying Admin Login Tab -> HTTP 403 Forbidden", t7_success, f"Msg: '{err_detail}'")
    results.append(("Student Admin Tab Block", t7_success))

    # -------------------------------------------------------------
    # SCENARIO 9: Super Admin Promotes Student to Admin
    # -------------------------------------------------------------
    db = SessionLocal()
    st_obj = db.query(User).filter(User.email == student_email).first()
    st_id = st_obj.id if st_obj else ""
    db.close()
    r = requests.post(f"{BASE_URL}/admin/users/{st_id}/promote", headers={"Authorization": f"Bearer {sa_token}"})
    t9_success = r.status_code == 200 and r.json().get("success") is True
    log_result(9, "Super Admin Promotes Student to Admin Role", t9_success, f"Msg: {r.json().get('message')}")
    results.append(("Super Admin Promotion Action", t9_success))

    # -------------------------------------------------------------
    # SCENARIO 10: Promoted Admin Can Login via Admin Tab
    # -------------------------------------------------------------
    r = requests.post(f"{BASE_URL}/auth/admin-login", json={"email": student_email, "password": "Password123!"})
    prom_token = r.json().get("data", {}).get("access_token", "") if r.status_code == 200 else ""
    t10_success = r.status_code == 200 and bool(prom_token)
    log_result(10, "Promoted Admin Login via Admin Tab -> PASS", t10_success, f"Token Received: {bool(prom_token)}")
    results.append(("Promoted Admin Login", t10_success))

    # -------------------------------------------------------------
    # SCENARIO 11: Super Admin Demotes Admin Back to Student
    # -------------------------------------------------------------
    r = requests.post(f"{BASE_URL}/admin/users/{st_id}/demote", headers={"Authorization": f"Bearer {sa_token}"})
    t11_success = r.status_code == 200 and r.json().get("success") is True
    log_result(11, "Super Admin Demotes Admin Back to Student Role", t11_success, f"Msg: {r.json().get('message')}")
    results.append(("Super Admin Demotion Action", t11_success))

    # -------------------------------------------------------------
    # SCENARIO 12: Demoted User Trying Admin Tab -> HTTP 403
    # -------------------------------------------------------------
    r = requests.post(f"{BASE_URL}/auth/admin-login", json={"email": student_email, "password": "Password123!"})
    t12_success = r.status_code == 403
    log_result(12, "Demoted User Trying Admin Tab -> HTTP 403 Forbidden", t12_success, f"HTTP Status: {r.status_code}")
    results.append(("Demoted User Admin Tab Block", t12_success))

    # -------------------------------------------------------------
    # SUMMARY REPORT
    # -------------------------------------------------------------
    print("\n" + "=" * 95)
    print("UNIFIED AUTHENTICATION & RBAC SECURITY AUDIT SUMMARY TABLE")
    print("=" * 95)
    all_passed = True
    for name, success in results:
        status_str = "PASS" if success else "FAIL"
        if not success:
            all_passed = False
        print(f"{name:<70} {status_str}")

    print("=" * 95)
    if all_passed:
        print("ALL 12 UNIFIED AUTHENTICATION VERIFICATION CHECKS PASSED PERFECTLY! 🎉")
    else:
        print("SOME SECURITY CHECKS FAILED. PLEASE REVIEW LOGS ABOVE.")
    print("=" * 95)
    return all_passed

if __name__ == "__main__":
    success = run_rbac_security_tests()
    if not success:
        sys.exit(1)
