import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.core.config import settings
from app.core.exceptions import BadRequestException

class EmailService:
    @staticmethod
    def validate_smtp_config() -> bool:
        if not settings.SMTP_HOST or not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            return False
        return True

    @classmethod
    def send_otp_email(cls, recipient_email: str, otp_code: str) -> bool:
        """
        Sends a professional HTML email containing the 6-digit verification OTP.
        If SMTP credentials are missing or network error occurs, safely logs OTP code
        to server logs without throwing unhandled exceptions.
        """
        if not cls.validate_smtp_config():
            print(f"[SMTP DEMO MODE] SMTP credentials missing. OTP for {recipient_email} is: {otp_code}")
            return False

        if not recipient_email or not recipient_email.strip():
            return False

        recipient_email = recipient_email.strip()
        from_email = settings.SMTP_FROM_EMAIL or settings.SMTP_USER
        from_name = settings.SMTP_FROM_NAME or "LearnGen AI Security"

        subject = f"{otp_code} is your LearnGen AI verification code"

        # HTML Email Template
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>LearnGen AI Verification Code</title>
          <style>
            body {{ font-family: sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 0; }}
            .container {{ max-width: 560px; margin: 30px auto; background: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 32px; }}
            .header {{ text-align: center; padding-bottom: 20px; border-bottom: 1px solid #1e293b; }}
            .brand {{ font-size: 24px; font-weight: 800; color: #06b6d4; }}
            .otp-box {{ background: #0f172a; border: 1px solid #06b6d4; border-radius: 8px; padding: 18px 24px; display: inline-block; margin: 20px 0; }}
            .otp-code {{ font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; font-family: monospace; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><div class="brand">⚡ LearnGen AI</div></div>
            <div style="text-align:center; padding:20px 0;">
              <h2>Verify Your Email Address</h2>
              <p>Thank you for registering. Use this 6-digit OTP code to activate your account:</p>
              <div class="otp-box"><div class="otp-code">{otp_code}</div></div>
              <p style="color:#94a3b8; font-size:13px;">Expires in {settings.OTP_EXPIRE_MINUTES} minutes.</p>
            </div>
          </div>
        </body>
        </html>
        """

        text_content = f"LearnGen AI Verification Code: {otp_code}\nExpires in {settings.OTP_EXPIRE_MINUTES} minutes."

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{from_name} <{from_email}>"
        msg["To"] = recipient_email
        msg["X-Priority"] = "1"
        msg["X-MSMail-Priority"] = "High"
        msg["Importance"] = "High"

        msg.attach(MIMEText(text_content, "plain"))
        msg.attach(MIMEText(html_content, "html"))

        try:
            if settings.SMTP_SSL:
                server = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=5)
            else:
                server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=5)
                if settings.SMTP_TLS:
                    server.starttls()

            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(from_email, [recipient_email], msg.as_string())
            server.quit()
            print(f"[SMTP SUCCESS] High-priority OTP email delivered to {recipient_email}")
            return True
        except Exception as exc:
            print(f"[SMTP FAILURE] Failed to deliver OTP email to {recipient_email}: {str(exc)}")
            print(f"[SMTP FALLBACK LOG] Verification OTP for {recipient_email} is: {otp_code}")
            return False

email_service = EmailService()
