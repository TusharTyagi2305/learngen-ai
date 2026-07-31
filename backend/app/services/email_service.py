import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.core.config import settings
from app.core.exceptions import BadRequestException

class EmailService:
    @staticmethod
    def validate_smtp_config():
        """
        Check if required SMTP environment variables are configured.
        Raises BadRequestException if credentials or settings are missing.
        """
        missing = []
        if not settings.SMTP_HOST:
            missing.append("SMTP_HOST")
        if not settings.SMTP_USER:
            missing.append("SMTP_USER")
        if not settings.SMTP_PASSWORD:
            missing.append("SMTP_PASSWORD")

        if missing:
            err_msg = (
                f"SMTP email delivery is not configured. Missing required environment variables in backend/.env: {', '.join(missing)}. "
                "Please configure SMTP credentials (e.g. Gmail SMTP with App Password) to send OTP emails."
            )
            raise BadRequestException(err_msg)

    @classmethod
    def send_otp_email(cls, recipient_email: str, otp_code: str):
        """
        Sends a professional HTML email containing the 6-digit verification OTP.
        Strictly enforces SMTP credentials check before attempting send.
        The recipient (To) is ALWAYS the user's entered email address (recipient_email).
        Sender (From) is configured as 'LearnGen AI Security <from_email>'.
        """
        cls.validate_smtp_config()

        if not recipient_email or not recipient_email.strip():
            raise BadRequestException("Recipient email address is required to send OTP.")

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
            body {{
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: #0b0f19;
              color: #e2e8f0;
              margin: 0;
              padding: 0;
            }}
            .container {{
              max-width: 560px;
              margin: 30px auto;
              background: #131b2e;
              border: 1px solid #1e293b;
              border-radius: 12px;
              padding: 32px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            }}
            .header {{
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 1px solid #1e293b;
            }}
            .brand {{
              font-size: 24px;
              font-weight: 800;
              color: #06b6d4;
              letter-spacing: -0.5px;
            }}
            .subtitle {{
              font-size: 13px;
              color: #94a3b8;
              margin-top: 4px;
            }}
            .content {{
              padding: 24px 0;
              text-align: center;
            }}
            .otp-box {{
              background: #0f172a;
              border: 1px solid #06b6d4;
              border-radius: 8px;
              padding: 18px 24px;
              display: inline-block;
              margin: 20px 0;
            }}
            .otp-code {{
              font-size: 32px;
              font-weight: 800;
              letter-spacing: 8px;
              color: #38bdf8;
              font-family: monospace;
            }}
            .expiry {{
              font-size: 13px;
              color: #f43f5e;
              font-weight: 600;
              margin-top: 6px;
            }}
            .footer {{
              text-align: center;
              border-top: 1px solid #1e293b;
              padding-top: 20px;
              font-size: 12px;
              color: #64748b;
            }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="brand">⚡ LearnGen AI</div>
              <div class="subtitle">Secure Email Verification</div>
            </div>
            <div class="content">
              <h2 style="color: #f8fafc; font-size: 20px; margin-bottom: 8px;">Verify Your Email Address</h2>
              <p style="color: #94a3b8; font-size: 14px; line-height: 1.5;">
                Thank you for registering with LearnGen AI. Please use the following 6-digit One-Time Password (OTP) to activate your account:
              </p>
              
              <div class="otp-box">
                <div class="otp-code">{otp_code}</div>
              </div>
              
              <div class="expiry">⏰ Code expires in {settings.OTP_EXPIRE_MINUTES} minutes</div>
              
              <p style="color: #64748b; font-size: 13px; margin-top: 20px;">
                If you did not request this verification code, please ignore this email or contact security immediately.
              </p>
            </div>
            <div class="footer">
              &copy; 2026 LearnGen AI Platform. Grounded RAG Knowledge Engine.
            </div>
          </div>
        </body>
        </html>
        """

        text_content = (
            f"LearnGen AI Verification Code\n\n"
            f"Your 6-digit verification code is: {otp_code}\n\n"
            f"This code will expire in {settings.OTP_EXPIRE_MINUTES} minutes.\n"
            f"If you did not request this code, please ignore this email."
        )

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{from_name} <{from_email}>"
        msg["To"] = recipient_email

        msg.attach(MIMEText(text_content, "plain"))
        msg.attach(MIMEText(html_content, "html"))

        try:
            if settings.SMTP_SSL:
                server = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10)
            else:
                server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10)
                if settings.SMTP_TLS:
                    server.starttls()

            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(from_email, [recipient_email], msg.as_string())
            server.quit()
        except Exception as exc:
            raise BadRequestException(f"Failed to deliver OTP email via SMTP: {str(exc)}")

email_service = EmailService()
