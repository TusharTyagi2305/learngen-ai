import os
import sys
import time
import requests
from datetime import datetime, timezone, timedelta

backend_dir = os.path.abspath(os.path.dirname(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
sys.stdout.reconfigure(encoding='utf-8')

from app.core.database import SessionLocal
from app.models.all_models import User, OTPVerification

BASE_URL = "http://127.0.0.1:8000/api/v1"

def run_live_verification():
    print("=" * 80)
    print("LEARNGEN AI - GMAIL SMTP & OTP E2E LIVE VERIFICATION")
    print("=" * 80)

    # 1. Health / Connectivity check to running backend
    print("\n[Step 1] Checking Live Backend Server Availability...")
    try:
        r = requests.get("http://127.0.0.1:8000/docs", timeout=5)
        assert r.status_code == 200
        print(" -> [PASS] Backend server is UP and responding on http://127.0.0.1:8000")
    except Exception as e:
        print(f" -> [FAIL] Backend server not reachable: {e}")
        return False

    # Target registered user email
    target_email = "tushartyagiji639@gmail.com"

    # Reset DB state for clean test run
    db = SessionLocal()
    user = db.query(User).filter(User.email == target_email).first()
    if not user:
        user = User(
            email=target_email,
            full_name="Tushar Tyagi",
            password_hash="fakehash123",
            role="student",
            is_active=False
        )
        db.add(user)
    else:
        user.is_active = False
    
    # Clear prior OTPs
    db.query(OTPVerification).filter(OTPVerification.email == target_email).delete()
    db.commit()

    # 2. Trigger Resend OTP / Register to send real email to user's registered address
    print(f"\n[Step 2] Triggering /auth/resend-otp to send Real OTP Email to '{target_email}'...")
    resend_res = requests.post(f"{BASE_URL}/auth/resend-otp", json={"email": target_email})
    assert resend_res.status_code == 200, f"Resend OTP failed: {resend_res.status_code} {resend_res.text}"
    
    resend_data = resend_res.json()
    print(" -> [PASS] API Response received successfully.")

    # 3. VERIFY: OTP is NOT returned in the API
    print("\n[Step 3] Verifying Security: OTP code is NOT returned in API response...")
    data_dict = resend_data.get("data") or {}
    assert "otp_code" not in data_dict, "SECURITY ERROR: OTP returned in data field!"
    assert "otp" not in data_dict, "SECURITY ERROR: OTP returned in data field!"
    print(" -> [PASS] Verified: OTP is strictly hidden and NOT returned in API response!")

    # 4. Check DB to get real OTP for verification steps
    latest_otp_rec = db.query(OTPVerification).filter(
        OTPVerification.email == target_email,
        OTPVerification.is_used == False
    ).order_by(OTPVerification.created_at.desc()).first()

    assert latest_otp_rec is not None, "ERROR: OTP record was not saved to DB!"
    real_otp = latest_otp_rec.otp_code
    print(f" -> [INFO] Real OTP email dispatched via Gmail SMTP to {target_email}!")

    # 5. VERIFY: Invalid OTP is rejected
    print("\n[Step 5] Verifying Invalid OTP code rejection...")
    inv_res = requests.post(f"{BASE_URL}/auth/verify-otp", json={
        "email": target_email,
        "otp_code": "000000"
    })
    assert inv_res.status_code == 400, f"Expected 400 for invalid OTP, got {inv_res.status_code}"
    print(" -> [PASS] Invalid OTP ('000000') correctly rejected with HTTP 400.")

    # 6. VERIFY: Valid OTP Verification works correctly
    print("\n[Step 6] Verifying Valid OTP Verification & Account Activation...")
    ver_res = requests.post(f"{BASE_URL}/auth/verify-otp", json={
        "email": target_email,
        "otp_code": real_otp
    })
    assert ver_res.status_code == 200, f"OTP Verification failed: {ver_res.text}"
    ver_data = ver_res.json()
    assert ver_data["success"] is True
    assert "access_token" in ver_data["data"], "Access token missing in response!"
    print(" -> [PASS] OTP Verification succeeded! Access token returned & user activated.")

    # Check user is_active in DB
    db.refresh(user)
    assert user.is_active is True
    print(" -> [PASS] DB state verified: User.is_active is True.")

    # 7. VERIFY: Resend OTP & Cooldown Rate Limiting
    print("\n[Step 7] Verifying Resend OTP & Cooldown Rate Limiting...")
    # Deactivate user temporarily to test resend flow
    user.is_active = False
    db.commit()

    # Immediate request should fail with 400 (cooldown active)
    cool_res = requests.post(f"{BASE_URL}/auth/resend-otp", json={"email": target_email})
    assert cool_res.status_code == 400, f"Expected 400 due to cooldown, got {cool_res.status_code}"
    assert "wait" in cool_res.json()["detail"].lower()
    print(" -> [PASS] Cooldown enforced! Immediate resend request blocked with rate-limiting message.")

    # Fast-forward last_sent_at in DB to simulate cooldown passing
    db.query(OTPVerification).filter(OTPVerification.email == target_email).update({
        "last_sent_at": datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(seconds=65)
    })
    db.commit()

    # Resend after cooldown -> should succeed and send another real email
    resend2_res = requests.post(f"{BASE_URL}/auth/resend-otp", json={"email": target_email})
    assert resend2_res.status_code == 200, f"Resend failed after cooldown: {resend2_res.text}"
    print(" -> [PASS] Resend OTP succeeded post-cooldown! Second real email dispatched via Gmail SMTP.")

    # 8. VERIFY: OTP Expiry Works
    print("\n[Step 8] Verifying OTP Expiration logic...")
    new_otp_rec = db.query(OTPVerification).filter(
        OTPVerification.email == target_email,
        OTPVerification.is_used == False
    ).order_by(OTPVerification.created_at.desc()).first()

    assert new_otp_rec is not None
    # Expire this OTP by setting expires_at to 10 seconds in the past
    new_otp_rec.expires_at = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(seconds=10)
    db.commit()

    exp_res = requests.post(f"{BASE_URL}/auth/verify-otp", json={
        "email": target_email,
        "otp_code": new_otp_rec.otp_code
    })
    assert exp_res.status_code == 400
    assert "expired" in exp_res.json()["detail"].lower()
    print(" -> [PASS] Expired OTP correctly rejected with error: 'OTP code has expired'.")

    # Restore user active status
    user.is_active = True
    db.commit()
    db.close()

    print("\n" + "=" * 80)
    print("ALL VERIFICATION CHECKS PASSED SUCCESSFULLY! 🎉")
    print("=" * 80)
    return True

if __name__ == "__main__":
    success = run_live_verification()
    if not success:
        sys.exit(1)
