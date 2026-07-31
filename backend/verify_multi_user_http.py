import os
import sys
import time
import requests

backend_dir = os.path.abspath(os.path.dirname(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
sys.stdout.reconfigure(encoding='utf-8')

from app.core.database import SessionLocal
from app.models.all_models import User, OTPVerification

BASE_URL = "http://127.0.0.1:8000/api/v1"

def run_multi_user_http_verification():
    print("=" * 80)
    print("LEARNGEN AI — MULTI-USER LIVE HTTP RECIPIENT VERIFICATION")
    print("=" * 80)

    # Healthcheck backend server
    print("\n[Step 1] Verifying Backend Server Health...")
    r = requests.get("http://127.0.0.1:8000/docs", timeout=5)
    assert r.status_code == 200
    print(" -> [PASS] Backend server is UP and responding on http://127.0.0.1:8000")

    user_a_email = "example1@gmail.com"
    user_b_email = "example2@gmail.com"

    db = SessionLocal()

    # Clear prior test records for User A & User B
    print("\n[Step 2] Cleaning prior DB records for User A & User B...")
    for target in [user_a_email, user_b_email]:
        db.query(OTPVerification).filter(OTPVerification.email == target).delete()
        db.query(User).filter(User.email == target).delete()
    db.commit()

    # 1. Register User A via Live HTTP
    print(f"\n[Step 3] Dispatching /auth/register HTTP POST for User A ({user_a_email})...")
    res_a = requests.post(f"{BASE_URL}/auth/register", json={
        "email": user_a_email,
        "full_name": "User A Tester",
        "password": "Password123!",
        "role": "student"
    }, timeout=15)

    assert res_a.status_code in [200, 201], f"User A registration failed: {res_a.status_code} {res_a.text}"
    data_a = res_a.json()
    assert data_a["success"] is True
    assert data_a["data"]["email"] == user_a_email
    assert "otp_code" not in data_a.get("data", {}), "SECURITY ERROR: OTP returned in API response!"
    print(f" -> [PASS] User A registration API response OK. Recipient confirmed as '{user_a_email}'.")

    # Fetch User A's generated OTP from DB
    otp_a_rec = db.query(OTPVerification).filter(
        OTPVerification.email == user_a_email,
        OTPVerification.is_used == False
    ).order_by(OTPVerification.created_at.desc()).first()
    assert otp_a_rec is not None, "User A OTP record missing in DB!"
    otp_a = otp_a_rec.otp_code
    print(f" -> [PASS] User A OTP successfully generated in DB for '{user_a_email}'.")

    # Wait to avoid 60s cooldown collision if needed
    time.sleep(1)

    # 2. Register User B via Live HTTP
    print(f"\n[Step 4] Dispatching /auth/register HTTP POST for User B ({user_b_email})...")
    res_b = requests.post(f"{BASE_URL}/auth/register", json={
        "email": user_b_email,
        "full_name": "User B Tester",
        "password": "Password123!",
        "role": "student"
    }, timeout=15)

    assert res_b.status_code in [200, 201], f"User B registration failed: {res_b.status_code} {res_b.text}"
    data_b = res_b.json()
    assert data_b["success"] is True
    assert data_b["data"]["email"] == user_b_email
    assert "otp_code" not in data_b.get("data", {}), "SECURITY ERROR: OTP returned in API response!"
    print(f" -> [PASS] User B registration API response OK. Recipient confirmed as '{user_b_email}'.")

    # Fetch User B's generated OTP from DB
    otp_b_rec = db.query(OTPVerification).filter(
        OTPVerification.email == user_b_email,
        OTPVerification.is_used == False
    ).order_by(OTPVerification.created_at.desc()).first()
    assert otp_b_rec is not None, "User B OTP record missing in DB!"
    otp_b = otp_b_rec.otp_code
    print(f" -> [PASS] User B OTP successfully generated in DB for '{user_b_email}'.")

    # 3. Verify uniqueness of OTPs
    print("\n[Step 5] Verifying unique OTP generation per recipient...")
    assert otp_a != otp_b, "CRITICAL ERROR: User A and User B received identical OTP codes!"
    print(f" -> [PASS] Verified: User A ({user_a_email}) and User B ({user_b_email}) generated distinct OTPs!")

    # 4. Verify OTP verification works for User A
    print(f"\n[Step 6] Verifying OTP verification & account activation for User A ({user_a_email})...")
    ver_a = requests.post(f"{BASE_URL}/auth/verify-otp", json={
        "email": user_a_email,
        "otp_code": otp_a
    }, timeout=10)
    assert ver_a.status_code == 200, f"User A OTP verification failed: {ver_a.text}"
    assert ver_a.json()["success"] is True
    assert "access_token" in ver_a.json()["data"]
    print(f" -> [PASS] User A verified successfully! Access token returned.")

    # 5. Verify OTP verification works for User B
    print(f"\n[Step 7] Verifying OTP verification & account activation for User B ({user_b_email})...")
    ver_b = requests.post(f"{BASE_URL}/auth/verify-otp", json={
        "email": user_b_email,
        "otp_code": otp_b
    }, timeout=10)
    assert ver_b.status_code == 200, f"User B OTP verification failed: {ver_b.text}"
    assert ver_b.json()["success"] is True
    assert "access_token" in ver_b.json()["data"]
    print(f" -> [PASS] User B verified successfully! Access token returned.")

    db.close()
    print("\n" + "=" * 80)
    print("ALL MULTI-USER LIVE HTTP RECIPIENT CHECKS PASSED 100%! 🎉")
    print("=" * 80)
    return True

if __name__ == "__main__":
    success = run_multi_user_http_verification()
    if not success:
        sys.exit(1)
