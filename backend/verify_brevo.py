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

def verify_brevo_email_suite():
    print("=" * 70)
    print("LEARNGEN AI - BREVO TRANSACTIONAL EMAIL SUITE VERIFICATION")
    print("=" * 70)

    test_email = "student_test@example.com"
    test_otp = "854921"
    test_name = "Aarav Sharma"
    test_reset_token = "brevo_security_reset_token_xyz987"
    admin_email = "admin@learngen.ai"

    print("\n[Check 1] Brevo Configuration Validation...")
    print(f" -> BREVO_API_KEY Configured: {EmailService.is_brevo_configured()}")
    print(f" -> EMAIL_FROM Identity: '{settings.EMAIL_FROM}'")

    print("\n[Check 2] Testing Email Methods with Brevo API Mocking...")

    with patch("requests.post") as mock_brevo_send:
        # Mock successful Brevo API response dictionary
        mock_response = MagicMock()
        mock_response.status_code = 201
        mock_response.json.return_value = {"messageId": "brevo_msg_test_8849204910"}
        mock_brevo_send.return_value = mock_response

        # Temporarily force API key for mock testing if missing
        original_key = settings.BREVO_API_KEY
        settings.BREVO_API_KEY = "xkeysib-test_key_for_verification_suite"

        try:
            # 1. Test OTP Email
            print("\n 1. Dispatching OTP Verification Email...")
            otp_res = email_service.send_otp_email(recipient_email=test_email, otp_code=test_otp)
            assert otp_res is True, "OTP email dispatch failed!"
            print(f"    [PASS] send_otp_email succeeded! Brevo payload 'to': {mock_brevo_send.call_args[1]['json']['to']}")

            # 2. Test Welcome Email
            print("\n 2. Dispatching Welcome Email...")
            welcome_res = email_service.send_welcome_email(recipient_email=test_email, user_name=test_name)
            assert welcome_res is True, "Welcome email dispatch failed!"
            print(f"    [PASS] send_welcome_email succeeded! Subject: '{mock_brevo_send.call_args[1]['json']['subject']}'")

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

            print(f"\n -> Total Brevo API calls invoked: {mock_brevo_send.call_count} / 4")

        finally:
            settings.BREVO_API_KEY = original_key

    print("\n[Check 3] Testing Graceful Exception Handling when Brevo API Fails...")
    with patch("requests.post") as mock_brevo_fail:
        mock_response_fail = MagicMock()
        mock_response_fail.status_code = 401
        mock_response_fail.text = "Unauthorized"
        mock_brevo_fail.return_value = mock_response_fail
        
        original_key = settings.BREVO_API_KEY
        settings.BREVO_API_KEY = "xkeysib-test_invalid_key"

        try:
            fail_res = email_service.send_otp_email(recipient_email=test_email, otp_code="111222")
            assert fail_res is False, "Expected False return on Brevo exception!"
            print("    [PASS] Exception gracefully caught, logged, and returns False without crashing application!")
        finally:
            settings.BREVO_API_KEY = original_key

    print("\n" + "=" * 70)
    print("ALL BREVO EMAIL VERIFICATION CHECKS PASSED 100%! 🎉")
    print("=" * 70)

if __name__ == "__main__":
    verify_brevo_email_suite()
