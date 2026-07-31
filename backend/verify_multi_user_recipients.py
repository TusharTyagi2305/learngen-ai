import os
import sys
import time
from unittest.mock import patch, MagicMock

backend_dir = os.path.abspath(os.path.dirname(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
sys.stdout.reconfigure(encoding='utf-8')

from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.core.database import SessionLocal, engine, Base
from app.models.all_models import User, OTPVerification
from app.services.email_service import email_service

def verify_multi_user_recipients():
    print("=" * 80)
    print("LEARNGEN AI — MULTI-USER OTP RECIPIENT VERIFICATION")
    print("=" * 80)

    Base.metadata.create_all(bind=engine)
    client = TestClient(app)
    db = SessionLocal()

    user_a_email = "example1@gmail.com"
    user_b_email = "example2@gmail.com"

    # Step 1: Reset DB state for User A and User B
    print("\n[Step 1] Resetting DB state for User A and User B...")
    for target in [user_a_email, user_b_email]:
        db.query(OTPVerification).filter(OTPVerification.email == target).delete()
        db.query(User).filter(User.email == target).delete()
    db.commit()

    # Step 2: Register User A (example1@gmail.com)
    print(f"\n[Step 2] Registering User A ({user_a_email})...")
    with patch.object(email_service, "send_otp_email") as mock_send_a:
        res_a = client.post(f"{settings.API_V1_PREFIX}/auth/register", json={
            "email": user_a_email,
            "full_name": "User A",
            "password": "Password123!",
            "role": "student"
        })
        assert res_a.status_code in [200, 201], f"User A registration failed: {res_a.text}"
        data_a = res_a.json()
        assert data_a["success"] is True
        assert "otp_code" not in data_a.get("data", {}), "SECURITY ERROR: OTP code returned in API!"
        assert data_a["data"]["email"] == user_a_email

        # Verify send_otp_email received recipient_email = request.email ("example1@gmail.com")
        mock_send_a.assert_called_once()
        kwargs_a = mock_send_a.call_args[1]
        assert kwargs_a.get("recipient_email") == user_a_email, f"Expected recipient_email='{user_a_email}', got '{kwargs_a.get('recipient_email')}'"
        print(f" -> [PASS] Verified: send_otp_email called with recipient_email='{user_a_email}' (request.email).")
        print(" -> [PASS] Verified: OTP is NOT exposed in API response.")

    # Fetch User A's OTP from DB
    otp_a_rec = db.query(OTPVerification).filter(
        OTPVerification.email == user_a_email,
        OTPVerification.is_used == False
    ).order_by(OTPVerification.created_at.desc()).first()
    assert otp_a_rec is not None, "User A OTP not saved in DB!"
    otp_a = otp_a_rec.otp_code

    # Step 3: Register User B (example2@gmail.com)
    print(f"\n[Step 3] Registering User B ({user_b_email})...")
    with patch.object(email_service, "send_otp_email") as mock_send_b:
        res_b = client.post(f"{settings.API_V1_PREFIX}/auth/register", json={
            "email": user_b_email,
            "full_name": "User B",
            "password": "Password123!",
            "role": "student"
        })
        assert res_b.status_code in [200, 201], f"User B registration failed: {res_b.text}"
        data_b = res_b.json()
        assert data_b["success"] is True
        assert "otp_code" not in data_b.get("data", {}), "SECURITY ERROR: OTP code returned in API!"
        assert data_b["data"]["email"] == user_b_email

        # Verify send_otp_email received recipient_email = request.email ("example2@gmail.com")
        mock_send_b.assert_called_once()
        kwargs_b = mock_send_b.call_args[1]
        assert kwargs_b.get("recipient_email") == user_b_email, f"Expected recipient_email='{user_b_email}', got '{kwargs_b.get('recipient_email')}'"
        print(f" -> [PASS] Verified: send_otp_email called with recipient_email='{user_b_email}' (request.email).")
        print(" -> [PASS] Verified: OTP is NOT exposed in API response.")

    # Fetch User B's OTP from DB
    otp_b_rec = db.query(OTPVerification).filter(
        OTPVerification.email == user_b_email,
        OTPVerification.is_used == False
    ).order_by(OTPVerification.created_at.desc()).first()
    assert otp_b_rec is not None, "User B OTP not saved in DB!"
    otp_b = otp_b_rec.otp_code

    # Step 4: Verify distinct OTP generation for each user
    print("\n[Step 4] Verifying User A and User B received distinct, unique OTPs...")
    assert otp_a != otp_b, "CRITICAL ERROR: User A and User B generated identical OTP codes!"
    print(f" -> [PASS] Verified: User A ({user_a_email}) and User B ({user_b_email}) generated distinct OTPs!")

    # Step 5: Test underlying EmailService MIME headers construction with mocked smtplib in email_service
    print("\n[Step 5] Testing EmailService MIME construction & SMTP transport headers...")
    with patch("app.services.email_service.smtplib") as mock_smtplib:
        mock_server = MagicMock()
        mock_smtplib.SMTP.return_value = mock_server

        # Test User A MIME headers
        email_service.send_otp_email(recipient_email=user_a_email, otp_code=otp_a)
        mock_server.sendmail.assert_called_once()
        send_args_a = mock_server.sendmail.call_args[0]
        assert send_args_a[1] == [user_a_email], f"Expected sendmail recipient [{user_a_email}], got {send_args_a[1]}"
        assert f"To: {user_a_email}" in send_args_a[2]
        assert "From: LearnGen AI Security" in send_args_a[2]
        print(f" -> [PASS] Verified MIME To header: 'To: {user_a_email}'")

        mock_server.reset_mock()

        # Test User B MIME headers
        email_service.send_otp_email(recipient_email=user_b_email, otp_code=otp_b)
        mock_server.sendmail.assert_called_once()
        send_args_b = mock_server.sendmail.call_args[0]
        assert send_args_b[1] == [user_b_email], f"Expected sendmail recipient [{user_b_email}], got {send_args_b[1]}"
        assert f"To: {user_b_email}" in send_args_b[2]
        assert "From: LearnGen AI Security" in send_args_b[2]
        print(f" -> [PASS] Verified MIME To header: 'To: {user_b_email}'")

    # Step 6: Verify User A OTP code does not work for User B
    print("\n[Step 6] Verifying User A's OTP code is rejected for User B...")
    cross_res = client.post(f"{settings.API_V1_PREFIX}/auth/verify-otp", json={
        "email": user_b_email,
        "otp_code": otp_a
    })
    assert cross_res.status_code == 400
    print(" -> [PASS] Cross-user OTP submission correctly rejected with HTTP 400!")

    # Step 7: Verify User A activates with User A's OTP
    print("\n[Step 7] Verifying User A account activation with User A's OTP...")
    ver_a_res = client.post(f"{settings.API_V1_PREFIX}/auth/verify-otp", json={
        "email": user_a_email,
        "otp_code": otp_a
    })
    assert ver_a_res.status_code == 200
    assert ver_a_res.json()["success"] is True
    print(" -> [PASS] User A verified & activated successfully!")

    # Step 8: Verify User B activates with User B's OTP
    print("\n[Step 8] Verifying User B account activation with User B's OTP...")
    ver_b_res = client.post(f"{settings.API_V1_PREFIX}/auth/verify-otp", json={
        "email": user_b_email,
        "otp_code": otp_b
    })
    assert ver_b_res.status_code == 200
    assert ver_b_res.json()["success"] is True
    print(" -> [PASS] User B verified & activated successfully!")

    db.close()
    print("\n" + "=" * 80)
    print("MULTI-USER OTP RECIPIENT VERIFICATION PASSED 100%! 🎉")
    print("=" * 80)
    return True

if __name__ == "__main__":
    verify_multi_user_recipients()
