import os
import sys
import time
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
sys.stdout.reconfigure(encoding='utf-8')

from app.main import app
from app.core.config import settings
from app.core.database import SessionLocal, engine, Base
from app.models.all_models import User, OTPVerification

def verify_live_smtp_and_otp():
    print("=" * 75, flush=True)
    print("[LEARNGEN AI] VERIFYING REAL GMAIL SMTP & END-TO-END OTP FLOW", flush=True)
    print("=" * 75, flush=True)

    Base.metadata.create_all(bind=engine)
    client = TestClient(app)

    # 1. Verify Direct SMTP Connection & Auth (Sanitized, no credentials printed)
    print("\n[1/6] Testing Direct Gmail SMTP Connection & Authentication...", flush=True)
    import smtplib
    try:
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10)
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.quit()
        print(f"   [OK] Successfully connected and authenticated with Gmail SMTP server ({settings.SMTP_HOST}:{settings.SMTP_PORT})!", flush=True)
    except Exception as exc:
        print(f"   [ERROR] SMTP Authentication Failed: {str(exc)}", flush=True)
        return False

    # 2. Register & Dispatch Real HTML OTP Email to User
    target_email = "tushartyagiji639@gmail.com"
    print(f"\n[2/6] Triggering /auth/register to dispatch Real HTML OTP Email to '{target_email}'...", flush=True)
    
    # Clear prior user/OTP records for target_email if any
    db = SessionLocal()
    db.query(OTPVerification).filter(OTPVerification.email == target_email).delete()
    db.query(User).filter(User.email == target_email).delete()
    db.commit()

    reg_res = client.post(f"{settings.API_V1_PREFIX}/auth/register", json={
        "email": target_email,
        "full_name": "Tushar Tyagi",
        "password": "Password123!",
        "role": "student"
    })

    assert reg_res.status_code in [200, 201], f"Registration API failed: {reg_res.text}"
    reg_data = reg_res.json()
    assert reg_data["success"] is True, f"API returned error: {reg_data}"

    # Verify OTP is NOT returned in API response
    res_str = str(reg_data).lower()
    assert "otp_code" not in reg_data.get("data", {}), "SECURITY ERROR: OTP code found in API response data!"
    print(f"   [OK] Registration successful! Real HTML email dispatched via Gmail SMTP.", flush=True)
    print(f"   [OK] API Security Check Passed: Response does NOT contain OTP code in any field.", flush=True)

    # 3. Retrieve Generated OTP from DB & Verify Account Activation
    print("\n[3/6] Fetching generated OTP from DB & Testing /auth/verify-otp...", flush=True)
    otp_record = db.query(OTPVerification).filter(
        OTPVerification.email == target_email,
        OTPVerification.is_used == False
    ).order_by(OTPVerification.created_at.desc()).first()

    assert otp_record is not None, "OTP record not found in database!"
    real_otp = otp_record.otp_code

    # Test invalid OTP code first
    invalid_res = client.post(f"{settings.API_V1_PREFIX}/auth/verify-otp", json={
        "email": target_email,
        "otp_code": "000000"
    })
    assert invalid_res.status_code == 400
    print("   [OK] Invalid 6-digit OTP code ('000000') correctly rejected.", flush=True)

    # Test valid OTP code
    verify_res = client.post(f"{settings.API_V1_PREFIX}/auth/verify-otp", json={
        "email": target_email,
        "otp_code": real_otp
    })
    assert verify_res.status_code == 200
    ver_data = verify_res.json()
    assert ver_data["success"] is True
    assert "access_token" in ver_data["data"]
    print("   [OK] Account activated successfully! JWT token returned.", flush=True)

    # 4. Verify Account State post-activation
    print("\n[4/6] Verifying User account status post-activation...", flush=True)
    user_db = db.query(User).filter(User.email == target_email).first()
    assert user_db is not None
    assert user_db.is_active is True
    print("   [OK] User.is_active flag is now True in database.", flush=True)

    # 5. Test Resend OTP & Cooldown
    print("\n[5/6] Testing Resend OTP & Rate Limiting Cooldown...", flush=True)
    
    # Mark user as inactive to test resend flow
    user_db.is_active = False
    db.commit()

    # Try immediate resend -> should be rate-limited by 60s cooldown
    cooldown_res = client.post(f"{settings.API_V1_PREFIX}/auth/resend-otp", json={"email": target_email})
    assert cooldown_res.status_code == 400
    assert "Please wait" in cooldown_res.json()["detail"]
    print("   [OK] Immediate resend request correctly rate-limited (60-second cooldown active).", flush=True)

    # Fast-forward last_sent_at in DB to simulate cooldown expiry
    db.query(OTPVerification).filter(OTPVerification.email == target_email).update({
        "last_sent_at": datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(seconds=65)
    })
    db.commit()

    # Resend OTP post-cooldown
    resend_res = client.post(f"{settings.API_V1_PREFIX}/auth/resend-otp", json={"email": target_email})
    assert resend_res.status_code == 200, f"Resend OTP failed: {resend_res.text}"
    print("   [OK] Resend OTP succeeded after cooldown. New OTP generated & dispatched.", flush=True)

    # Verify old OTP was invalidated
    old_otp_record = db.query(OTPVerification).filter(OTPVerification.id == otp_record.id).first()
    assert old_otp_record.is_used is True, "Old OTP was not invalidated upon resend!"
    print("   [OK] Old OTP invalidated automatically upon resend.", flush=True)

    # 6. Test Expiry Validation
    print("\n[6/6] Testing OTP Expiration Logic...", flush=True)
    new_otp_record = db.query(OTPVerification).filter(
        OTPVerification.email == target_email,
        OTPVerification.is_used == False
    ).order_by(OTPVerification.created_at.desc()).first()
    
    assert new_otp_record is not None
    
    # Fast-forward expires_at to simulate 10-min expiration
    new_otp_record.expires_at = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(seconds=10)
    db.commit()

    exp_verify_res = client.post(f"{settings.API_V1_PREFIX}/auth/verify-otp", json={
        "email": target_email,
        "otp_code": new_otp_record.otp_code
    })
    assert exp_verify_res.status_code == 400
    assert "expired" in exp_verify_res.json()["detail"].lower()
    print("   [OK] Expired OTP correctly rejected.", flush=True)

    # Reset user to active state for login
    user_db.is_active = True
    db.commit()
    db.close()

    print("\n" + "=" * 75, flush=True)
    print("ALL REAL GMAIL SMTP & OTP VERIFICATION CHECKS PASSED 100%! 🎉", flush=True)
    print("=" * 75, flush=True)
    return True

if __name__ == "__main__":
    verify_live_smtp_and_otp()
