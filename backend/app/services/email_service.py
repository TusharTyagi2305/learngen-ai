import logging
import requests
from typing import Optional
from app.core.config import settings

# Configure production logger for Brevo Email events
logger = logging.getLogger("learngen.email")

class EmailService:
    """
    Production Email Service utilizing the official Brevo (Sendinblue) REST API.
    Handles transactional OTP verification emails, welcome emails, password resets,
    and admin notifications with resilient error handling and non-blocking delivery.
    """

    @staticmethod
    def is_brevo_configured() -> bool:
        """
        Validates if BREVO_API_KEY is present and properly formatted.
        """
        api_key = settings.BREVO_API_KEY.strip() if settings.BREVO_API_KEY else ""
        return bool(api_key and api_key.startswith("xkeysib-"))

    @classmethod
    def _send_email(
        cls,
        recipient_email: str,
        subject: str,
        html_content: str,
        text_content: str
    ) -> bool:
        """
        Internal wrapper to dispatch email using Brevo REST API.
        Logs email request, success ID, and exact failure details without crashing APIs.
        """
        recipient = recipient_email.strip() if recipient_email else ""
        if not recipient:
            logger.error("[BREVO FAILURE] Recipient email is empty or invalid.")
            return False

        if not cls.is_brevo_configured():
            logger.warning(
                f"[BREVO DEMO MODE] BREVO_API_KEY is not configured in environment. "
                f"Skipping live Brevo API call for recipient '{recipient}'. Subject: '{subject}'"
            )
            return False

        api_key = settings.BREVO_API_KEY.strip()
        sender_email = settings.EMAIL_FROM or "noreply@learngen.ai"
        sender_name = settings.EMAIL_FROM_NAME or "LearnGen AI"

        logger.info(f"[BREVO REQUEST] Attempting email delivery to '{recipient}' | Subject: '{subject}' | From: '{sender_name} <{sender_email}>'")

        try:
            url = "https://api.brevo.com/v3/smtp/email"
            headers = {
                "accept": "application/json",
                "api-key": api_key,
                "content-type": "application/json"
            }
            payload = {
                "sender": {"name": sender_name, "email": sender_email},
                "to": [{"email": recipient}],
                "subject": subject,
                "htmlContent": html_content,
                "textContent": text_content
            }
            
            response = requests.post(url, headers=headers, json=payload, timeout=10)
            
            if response.status_code in (200, 201, 202):
                response_data = response.json()
                email_id = response_data.get("messageId", "Unknown")
                logger.info(f"[BREVO SUCCESS] Email delivered successfully to '{recipient}'! Brevo Message ID: {email_id}")
                return True
            else:
                logger.error(
                    f"[BREVO FAILURE] Failed to deliver email to '{recipient}'. "
                    f"Subject: '{subject}' | Status Code: {response.status_code} | Response: {response.text}"
                )
                return False

        except Exception as exc:
            logger.error(
                f"[BREVO FAILURE] Exception occurred while delivering email to '{recipient}'. "
                f"Subject: '{subject}' | Error: {str(exc)}",
                exc_info=True
            )
            return False

    @classmethod
    def send_otp_email(cls, recipient_email: str, otp_code: str) -> bool:
        """
        Dispatches a 6-digit OTP verification email for account activation.
        """
        recipient_email = recipient_email.strip() if recipient_email else ""
        subject = f"{otp_code} is your LearnGen AI verification code"

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>LearnGen AI Verification Code</title>
          <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 0; }}
            .container {{ max-width: 560px; margin: 35px auto; background: #131b2e; border: 1px solid #1e293b; border-radius: 14px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }}
            .header {{ text-align: center; padding-bottom: 20px; border-bottom: 1px solid #1e293b; }}
            .brand {{ font-size: 26px; font-weight: 800; color: #06b6d4; letter-spacing: -0.5px; }}
            .otp-container {{ text-align: center; padding: 24px 0; }}
            .otp-box {{ background: #0f172a; border: 1px solid #06b6d4; border-radius: 10px; padding: 18px 24px; display: inline-block; margin: 20px 0; }}
            .otp-code {{ font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #38bdf8; font-family: monospace; }}
            .footer {{ text-align: center; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 16px; font-size: 12px; color: #64748b; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="brand">⚡ LearnGen AI</div>
            </div>
            <div class="otp-container">
              <h2 style="color: #f8fafc; margin-bottom: 8px;">Verify Your Email Address</h2>
              <p style="color: #94a3b8; font-size: 15px; margin-top: 0;">Use the following 6-digit verification code to activate your account:</p>
              <div class="otp-box"><div class="otp-code">{otp_code}</div></div>
              <p style="color: #64748b; font-size: 13px;">This code will expire in {settings.OTP_EXPIRE_MINUTES} minutes. If you did not request this email, please ignore it.</p>
            </div>
            <div class="footer">
              &copy; LearnGen AI RAG Studio &bull; Grounded AI Study Workspace
            </div>
          </div>
        </body>
        </html>
        """

        text_content = (
            f"LearnGen AI Verification Code: {otp_code}\n\n"
            f"Use this 6-digit code to activate your account. Code expires in {settings.OTP_EXPIRE_MINUTES} minutes."
        )

        return cls._send_email(
            recipient_email=recipient_email,
            subject=subject,
            html_content=html_content,
            text_content=text_content
        )

    @classmethod
    def send_welcome_email(cls, recipient_email: str, user_name: str) -> bool:
        """
        Dispatches a welcome email to newly activated users.
        """
        recipient_email = recipient_email.strip() if recipient_email else ""
        name_display = user_name.strip() if user_name else "Student"
        subject = f"Welcome to LearnGen AI, {name_display}! 🚀"

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to LearnGen AI</title>
          <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 0; }}
            .container {{ max-width: 560px; margin: 35px auto; background: #131b2e; border: 1px solid #1e293b; border-radius: 14px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }}
            .header {{ text-align: center; padding-bottom: 20px; border-bottom: 1px solid #1e293b; }}
            .brand {{ font-size: 26px; font-weight: 800; color: #06b6d4; letter-spacing: -0.5px; }}
            .content {{ padding: 24px 0; line-height: 1.6; color: #cbd5e1; }}
            .cta-btn {{ display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: #ffffff; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 8px; margin-top: 20px; text-align: center; }}
            .footer {{ text-align: center; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 16px; font-size: 12px; color: #64748b; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="brand">⚡ LearnGen AI RAG Studio</div>
            </div>
            <div class="content">
              <h2 style="color: #f8fafc; margin-bottom: 12px;">Welcome Aboard, {name_display}! 👋</h2>
              <p>Your account is officially active. You now have full access to LearnGen AI's 3D Grounded Study Tutor, PDF/PPTX chunking, dynamic MCQ quizzes, and AI study roadmaps.</p>
              <p>Upload your research papers or lecture notes to get started instantly!</p>
              <div style="text-align: center;">
                <a href="https://learngen-ai.vercel.app" class="cta-btn">Launch Workspace Dashboard &rarr;</a>
              </div>
            </div>
            <div class="footer">
              &copy; LearnGen AI Studio &bull; Transforming Notes into Interactive 3D Knowledge
            </div>
          </div>
        </body>
        </html>
        """

        text_content = (
            f"Welcome to LearnGen AI, {name_display}!\n\n"
            f"Your account is officially active. Access your 3D Grounded Study Workspace at https://learngen-ai.vercel.app"
        )

        return cls._send_email(
            recipient_email=recipient_email,
            subject=subject,
            html_content=html_content,
            text_content=text_content
        )

    @classmethod
    def send_password_reset_email(cls, recipient_email: str, reset_token: str) -> bool:
        """
        Dispatches a password reset security email containing the reset token.
        """
        recipient_email = recipient_email.strip() if recipient_email else ""
        subject = "Reset Your LearnGen AI Password 🔑"

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset LearnGen AI Password</title>
          <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 0; }}
            .container {{ max-width: 560px; margin: 35px auto; background: #131b2e; border: 1px solid #1e293b; border-radius: 14px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }}
            .header {{ text-align: center; padding-bottom: 20px; border-bottom: 1px solid #1e293b; }}
            .brand {{ font-size: 26px; font-weight: 800; color: #3b82f6; letter-spacing: -0.5px; }}
            .token-box {{ background: #0f172a; border: 1px solid #3b82f6; border-radius: 8px; padding: 14px; word-break: break-all; font-family: monospace; color: #60a5fa; margin: 18px 0; text-align: center; }}
            .footer {{ text-align: center; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 16px; font-size: 12px; color: #64748b; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="brand">🔒 Security Notification</div>
            </div>
            <div style="padding: 20px 0;">
              <h3 style="color: #f8fafc;">Password Reset Requested</h3>
              <p style="color: #94a3b8; font-size: 14px;">We received a request to reset your LearnGen AI password. Use your security token below:</p>
              <div class="token-box">{reset_token}</div>
              <p style="color: #64748b; font-size: 13px;">If you did not request a password reset, please ignore this email.</p>
            </div>
            <div class="footer">
              &copy; LearnGen AI Security Team
            </div>
          </div>
        </body>
        </html>
        """

        text_content = (
            f"LearnGen AI Password Reset\n\n"
            f"Reset Token: {reset_token}\n\n"
            f"If you did not request this password reset, please ignore this email."
        )

        return cls._send_email(
            recipient_email=recipient_email,
            subject=subject,
            html_content=html_content,
            text_content=text_content
        )

    @classmethod
    def send_admin_notification_email(cls, admin_email: str, event_title: str, event_details: str) -> bool:
        """
        Dispatches system alert notifications to administrators.
        """
        admin_email = admin_email.strip() if admin_email else ""
        subject = f"[Admin Alert] {event_title}"

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>System Admin Alert</title>
          <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 0; }}
            .container {{ max-width: 580px; margin: 35px auto; background: #131b2e; border: 1px solid #ef4444; border-radius: 14px; padding: 32px; }}
            .header {{ text-align: center; padding-bottom: 16px; border-bottom: 1px solid #1e293b; }}
            .alert-title {{ color: #f87171; font-size: 20px; font-weight: 700; margin-top: 16px; }}
            .details-box {{ background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 13px; color: #cbd5e1; white-space: pre-wrap; margin: 16px 0; }}
            .footer {{ text-align: center; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 16px; font-size: 12px; color: #64748b; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="color: #f8fafc; margin: 0;">🛡️ LearnGen AI Admin Monitor</h2>
            </div>
            <div>
              <div class="alert-title">{event_title}</div>
              <div class="details-box">{event_details}</div>
            </div>
            <div class="footer">
              LearnGen AI Automated Security & Audit Notification
            </div>
          </div>
        </body>
        </html>
        """

        text_content = f"ADMIN ALERT: {event_title}\n\nDetails:\n{event_details}"

        return cls._send_email(
            recipient_email=admin_email,
            subject=subject,
            html_content=html_content,
            text_content=text_content
        )

email_service = EmailService()
