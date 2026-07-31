import os
import sys
import smtplib
from datetime import datetime, timezone, timedelta

# Ensure backend directory is in path
backend_dir = os.path.abspath(os.path.dirname(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.core.config import settings
from app.services.email_service import email_service
from app.core.database import SessionLocal
from app.models.all_models import User, OTPVerification

def test_smtp():
    print("=== Step 1: Testing Direct Gmail SMTP Connection & Auth ===")
    print(f"SMTP Host: {settings.SMTP_HOST}")
    print(f"SMTP Port: {settings.SMTP_PORT}")
    print(f"SMTP TLS: {settings.SMTP_TLS}")
    print(f"SMTP SSL: {settings.SMTP_SSL}")
    
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print("ERROR: SMTP_USER or SMTP_PASSWORD is not set in backend/.env!")
        return False

    # Mask email username for privacy (e.g. user***@gmail.com)
    user_masked = settings.SMTP_USER[:3] + "***@" + settings.SMTP_USER.split("@")[-1] if "@" in settings.SMTP_USER else "***"
    print(f"SMTP User: {user_masked}")
    print("Attempting smtplib connection...")

    try:
        if settings.SMTP_SSL:
            server = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15)
        else:
            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15)
            if settings.SMTP_TLS:
                server.starttls()
        
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        print("SUCCESS: SMTP Authentication succeeded!")
        server.quit()
        return True
    except Exception as e:
        # Sanitize exception message so password/secret isn't accidentally included
        err_msg = str(e)
        if settings.SMTP_PASSWORD and settings.SMTP_PASSWORD in err_msg:
            err_msg = err_msg.replace(settings.SMTP_PASSWORD, "********")
        print(f"FAILURE: SMTP Authentication/Connection Error: {err_msg}")
        return False

if __name__ == "__main__":
    success = test_smtp()
    if not success:
        sys.exit(1)
