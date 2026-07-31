import os
import sys
import time
from datetime import datetime, timezone, timedelta
from unittest.mock import patch

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
sys.stdout.reconfigure(encoding='utf-8')

from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.core.database import SessionLocal, engine, Base
from app.models.all_models import User, OTPVerification

def test_otp_verification_flow():
    print("=" * 70, flush=True)
    print("[TEST] Running Dedicated SMTP OTP Verification System Unit & E2E Tests", flush=True)
    print("=" * 70, flush=True)

    # Ensure all tables (including otp_verifications) are created
    Base.metadata.create_all(bind=engine)

    client = TestClient(app)
    ts = int(time.time())
    test_email = f"otp_test_{ts}@learngen.ai"

    # Test 1: Register without SMTP credentials configured -> Expect 400 Bad Request with missing credentials error
    print("\n1. Testing unconfigured SMTP exception handling...")
    res_no_smtp = client.post(f"{settings.API_V1_PREFIX}/auth/register", json={
        "email": test_email,
        "full_name": "OTP Test User",
        "password": "Password123!",
        "role": "student"
    })
    assert res_no_smtp.status_code == 400, f"Expected 400, got {res_no_smtp.status_code}: {res_no_smtp.text}"
    assert "SMTP email delivery is not configured" in res_no_smtp.json()["detail"]
    print("   [OK] Clean exception returned when SMTP credentials are missing! (No fake success)", flush=True)

    # Test 2: Register with mocked SMTP -> Expect 201 Created and NO OTP exposed in response
    print("\n2. Testing registration and OTP generation (Mocked SMTP)...", flush=True)
    test_email_2 = f"otp_test_2_{ts}@learngen.ai"
    with patch("app.services.email_service.email_service.send_otp_email") as mock_send:
        res_reg = client.post(f"{settings.API_V1_PREFIX}/auth/register", json={
            "email": test_email_2,
            "full_name": "OTP Test User",
            "password": "Password123!",
            "role": "student"
        })
        assert res_reg.status_code in [200, 201], f"Register failed with status {res_reg.status_code}: {res_reg.text}"
        data = res_reg.json()
        assert data["success"] is True
        # Verify OTP is NOT exposed in response body
        assert "otp" not in str(data).lower() or "verification code sent" in data["message"].lower()
        assert "otp_code" not in data.get("data", {})
        mock_send.assert_called_once()
        print("   [OK] Registration response does NOT expose OTP code!", flush=True)

    # Test 3: Login before verification -> Expect failure
    print("\n3. Testing login on unverified pending account...", flush=True)
    res_login_unverified = client.post(f"{settings.API_V1_PREFIX}/auth/login", json={
        "email": test_email_2,
        "password": "Password123!"
    })
    assert res_login_unverified.status_code == 400
    assert "not verified" in res_login_unverified.json()["detail"].lower()
    print("   [OK] Unverified account login correctly blocked!", flush=True)

    # Test 4: Rate Limiting / Resend Cooldown
    print("\n4. Testing resend rate-limiting cooldown...", flush=True)
    with patch("app.services.email_service.email_service.send_otp_email"):
        res_cooldown = client.post(f"{settings.API_V1_PREFIX}/auth/resend-otp", json={"email": test_email_2})
        assert res_cooldown.status_code == 400
        assert "Please wait" in res_cooldown.json()["detail"]
        print("   [OK] Resend request within 60s cooldown correctly rate-limited!", flush=True)

    # Test 5: Incorrect OTP verification
    print("\n5. Testing invalid OTP submission...", flush=True)
    res_wrong_otp = client.post(f"{settings.API_V1_PREFIX}/auth/verify-otp", json={
        "email": test_email_2,
        "otp_code": "000000"
    })
    assert res_wrong_otp.status_code == 400
    assert "Invalid" in res_wrong_otp.json()["detail"]
    print("   [OK] Incorrect OTP code rejected!", flush=True)

    # Test 6: Successful OTP Verification & Account Activation
    print("\n6. Testing valid OTP verification and activation...", flush=True)
    db = SessionLocal()
    otp_record = db.query(OTPVerification).filter(OTPVerification.email == test_email_2).order_by(OTPVerification.created_at.desc()).first()
    assert otp_record is not None
    real_otp = otp_record.otp_code

    res_verify = client.post(f"{settings.API_V1_PREFIX}/auth/verify-otp", json={
        "email": test_email_2,
        "otp_code": real_otp
    })
    assert res_verify.status_code == 200
    ver_data = res_verify.json()
    assert ver_data["success"] is True
    assert "access_token" in ver_data["data"]
    print("   [OK] Account successfully activated with valid OTP!", flush=True)

    # Test 7: Post-activation login
    print("\n7. Testing login post-activation...", flush=True)
    res_login = client.post(f"{settings.API_V1_PREFIX}/auth/login", json={
        "email": test_email_2,
        "password": "Password123!"
    })
    assert res_login.status_code == 200
    assert res_login.json()["data"]["user"]["is_active"] is True
    print("   [OK] Login successful post-activation!", flush=True)

    db.close()
    print("\n" + "=" * 70, flush=True)
    print("ALL OTP VERIFICATION TESTS PASSED SUCCESSFULLY!", flush=True)
    print("=" * 70, flush=True)

if __name__ == "__main__":
    test_otp_verification_flow()
