import os
import sys
import logging
from unittest.mock import patch, MagicMock

# Setup logging to console
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.services.email_service import EmailService, email_service

def verify_resend_email_suite():
    print("=" * 70)
    print("LEARNGEN AI - RESEND TRANSACTIONAL EMAIL SUITE VERIFICATION")
    print("=" * 70)

    test_email = "student_test@example.com"
    test_otp = "854921"
    test_name = "Aarav Sharma"
    test_reset_token = "resend_security_reset_token_xyz987"
    admin_email = "admin@learngen.ai"

    print("\n[Check 1] Resend Configuration Validation...")
    print(f" -> RESEND_API_KEY Configured: {EmailService.is_resend_configured()}")
    print(f" -> EMAIL_FROM Identity: '{settings.EMAIL_FROM}'")

    print("\n[Check 2] Testing Email Methods with Resend API Mocking...")

    with patch("resend.Emails.send") as mock_resend_send:
        # Mock successful Resend API response dictionary
        mock_resend_send.return_value = {"id": "res_msg_test_8849204910"}

        # Temporarily force API key for mock testing if missing
        original_key = settings.RESEND_API_KEY
        settings.RESEND_API_KEY = "re_test_key_for_verification_suite"

        try:
            # 1. Test OTP Email
            print("\n 1. Dispatching OTP Verification Email...")
            otp_res = email_service.send_otp_email(recipient_email=test_email, otp_code=test_otp)
            assert otp_res is True, "OTP email dispatch failed!"
            print(f"    [PASS] send_otp_email succeeded! Resend payload 'to': {mock_resend_send.call_args[0][0]['to']}")

            # 2. Test Welcome Email
            print("\n 2. Dispatching Welcome Email...")
            welcome_res = email_service.send_welcome_email(recipient_email=test_email, user_name=test_name)
            assert welcome_res is True, "Welcome email dispatch failed!"
            print(f"    [PASS] send_welcome_email succeeded! Subject: '{mock_resend_send.call_args[0][0]['subject']}'")

            # 3. Test Password Reset Email
            print("\n 3. Dispatching Password Reset Email...")
            reset_res = email_service.send_password_reset_email(recipient_email=test_email, reset_token=test_reset_token)
            assert reset_res is True, "Password reset email dispatch failed!"
            print(f"    [PASS] send_password_reset_email succeeded!")

            # 4. Test Admin Notification Email
            print("\n 4. Dispatching Admin Notification Email...")
            admin_res = email_service.send_admin_notification_email(
                admin_email=admin_email,
                event_title="New User Registered",
                event_details=f"Student {test_name} ({test_email}) created an account."
            )
            assert admin_res is True, "Admin notification email dispatch failed!"
            print(f"    [PASS] send_admin_notification_email succeeded!")

            print(f"\n -> Total Resend API calls invoked: {mock_resend_send.call_count} / 4")

        finally:
            settings.RESEND_API_KEY = original_key

    print("\n[Check 3] Testing Graceful Exception Handling when Resend API Fails...")
    with patch("resend.Emails.send") as mock_resend_fail:
        mock_resend_fail.side_effect = RuntimeError("Resend API 401 Unauthorized / Invalid API Key")
        original_key = settings.RESEND_API_KEY
        settings.RESEND_API_KEY = "re_test_invalid_key"

        try:
            fail_res = email_service.send_otp_email(recipient_email=test_email, otp_code="111222")
            assert fail_res is False, "Expected False return on Resend exception!"
            print("    [PASS] Exception gracefully caught, logged, and returns False without crashing application!")
        finally:
            settings.RESEND_API_KEY = original_key

    print("\n" + "=" * 70)
    print("ALL RESEND EMAIL VERIFICATION CHECKS PASSED 100%! 🎉")
    print("=" * 70)

if __name__ == "__main__":
    verify_resend_email_suite()
