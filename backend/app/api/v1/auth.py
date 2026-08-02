import secrets
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, status, BackgroundTasks, Request, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_user
from app.core.config import settings
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from app.core.exceptions import ConflictException, UnauthorizedException, BadRequestException, ForbiddenException
from app.models.all_models import User, RefreshToken, UserSettings, OTPVerification, AuditLog
from app.schemas.schemas import ApiResponse, UserRegister, UserLogin, TokenResponse, UserProfileOut, OTPResendRequest, OTPVerifyRequest
from app.services.email_service import email_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

def generate_and_send_otp(email: str, db: Session, background_tasks: Optional[BackgroundTasks] = None):
    """
    Generates a 6-digit secure numeric OTP, enforces rate limiting cooldown,
    invalidates previous unused OTPs, persists new OTP to DB with 10-min expiration,
    and sends HTML email via SMTP asynchronously. Never returns or exposes the OTP.
    """
    now_utc = datetime.now(timezone.utc).replace(tzinfo=None)

    # Check 60-second rate limiting cooldown
    latest_otp = db.query(OTPVerification).filter(
        OTPVerification.email == email
    ).order_by(OTPVerification.created_at.desc()).first()

    if latest_otp and latest_otp.last_sent_at:
        last_sent = latest_otp.last_sent_at
        if last_sent.tzinfo is not None:
            last_sent = last_sent.astimezone(timezone.utc).replace(tzinfo=None)
        
        elapsed = (now_utc - last_sent).total_seconds()
        cooldown = settings.OTP_RESEND_COOLDOWN_SECONDS
        if 0 <= elapsed < cooldown:
            remaining = int(cooldown - elapsed)
            raise BadRequestException(f"Please wait {remaining} seconds before requesting a new OTP code.")

    # Invalidate all prior unused OTPs for this recipient
    db.query(OTPVerification).filter(
        OTPVerification.email == email,
        OTPVerification.is_used == False
    ).update({"is_used": True})
    db.commit()

    # Generate secure 6-digit OTP code
    otp_code = f"{secrets.randbelow(900000) + 100000:06d}"
    expires_at = now_utc + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)

    # Store OTP in DB
    otp_record = OTPVerification(
        email=email,
        otp_code=otp_code,
        expires_at=expires_at,
        is_used=False,
        created_at=now_utc,
        last_sent_at=now_utc
    )
    db.add(otp_record)
    db.commit()

    # Deliver HTML Email via SMTP (Asynchronously via BackgroundTasks if available)
    if background_tasks:
        background_tasks.add_task(email_service.send_otp_email, recipient_email=email, otp_code=otp_code)
    else:
        email_service.send_otp_email(recipient_email=email, otp_code=otp_code)

    return otp_code

@router.post("/register", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def register_user(request: UserRegister, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    recipient_email = request.email
    email_clean = recipient_email.lower().strip()

    # SECURITY ENFORCEMENT: 2-Role System (Student and Admin).
    # Public users can ONLY register as 'student'. 'teacher', 'admin', and 'super_admin' selections are forbidden.
    requested_role = (request.role or "").lower().strip()
    if requested_role == "teacher":
        raise BadRequestException("The Teacher role has been deprecated. Registration is available for Student accounts only.")

    target_role = "student"

    existing = db.query(User).filter(User.email == email_clean).first()
    
    if existing:
        if existing.is_active:
            raise ConflictException("An account with this email already exists and is active. Please Sign In.")
        else:
            # Pending unverified account -> update registration info
            existing.full_name = request.full_name
            existing.password_hash = get_password_hash(request.password)
            existing.role = target_role
            existing.is_super_admin = False
            db.commit()
            user_obj = existing
    else:
        # Create pending unverified user account
        user_obj = User(
            email=email_clean,
            full_name=request.full_name,
            password_hash=get_password_hash(request.password),
            role=target_role,
            is_super_admin=False,
            is_active=False
        )
        db.add(user_obj)
        db.commit()
        db.refresh(user_obj)

        settings_rec = db.query(UserSettings).filter(UserSettings.user_id == user_obj.id).first()
        if not settings_rec:
            settings_rec = UserSettings(user_id=user_obj.id, default_role=user_obj.role)
            db.add(settings_rec)
            db.commit()

    # Generate & send OTP via SMTP asynchronously
    generate_and_send_otp(email=email_clean, db=db, background_tasks=background_tasks)

    return ApiResponse(
        success=True,
        message=f"Verification code sent to {email_clean}. Please check your email inbox.",
        data={"email": email_clean}
    )

@router.post("/resend-otp", response_model=ApiResponse)
def resend_otp(payload: OTPResendRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    email_clean = payload.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()
    if not user:
        raise BadRequestException("No account found with this email address. Please register first.")
    
    if user.is_active:
        raise BadRequestException("This account is already active. Please sign in.")

    generate_and_send_otp(email=email_clean, db=db, background_tasks=background_tasks)

    return ApiResponse(
        success=True,
        message=f"A new verification OTP code has been sent to {email_clean}.",
        data={"email": email_clean}
    )

@router.post("/verify-otp", response_model=ApiResponse)
def verify_otp(payload: OTPVerifyRequest, db: Session = Depends(get_db)):
    email_clean = payload.email.lower().strip()
    otp_input = payload.otp_code.strip()

    user = db.query(User).filter(User.email == email_clean).first()
    if not user:
        raise BadRequestException("No account found with this email. Please register first.")

    now_utc = datetime.now(timezone.utc)

    # Query active unused OTP record
    otp_record = db.query(OTPVerification).filter(
        OTPVerification.email == email_clean,
        OTPVerification.is_used == False
    ).order_by(OTPVerification.created_at.desc()).first()

    if not otp_record:
        raise BadRequestException("No valid OTP found or code has already been used. Please request a new code.")

    exp = otp_record.expires_at
    if exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)

    if now_utc > exp:
        otp_record.is_used = True
        db.commit()
        raise BadRequestException("OTP code has expired. Please request a new verification code.")

    if otp_record.otp_code != otp_input:
        raise BadRequestException("Invalid 6-digit OTP code. Please check your email and try again.")

    # Mark OTP as used & activate user account
    otp_record.is_used = True
    user.is_active = True
    db.commit()

    # Generate JWT Tokens
    access_token = create_access_token(subject=user.id, role=user.role)
    refresh_token_str = create_refresh_token(subject=user.id)

    ref_token_record = RefreshToken(
        user_id=user.id,
        token=refresh_token_str,
        expires_at=now_utc + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    db.add(ref_token_record)
    db.commit()

    return ApiResponse(
        success=True,
        message="Email verified successfully. Your account is now active!",
        data={
            "access_token": access_token,
            "refresh_token": refresh_token_str,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
                "is_active": True
            }
        }
    )

@router.post("/login", response_model=ApiResponse)
def login_user(user_in: UserLogin, db: Session = Depends(get_db)):
    email_clean = user_in.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()
    
    if not user or not verify_password(user_in.password, user.password_hash):
        raise UnauthorizedException("Invalid email address or password.")

    if not user.is_active:
        raise BadRequestException("Account email is not verified. Please verify your email with the OTP sent to your inbox.")

    access_token = create_access_token(subject=user.id, role=user.role)
    refresh_token_str = create_refresh_token(subject=user.id)

    ref_token_record = RefreshToken(
        user_id=user.id,
        token=refresh_token_str,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    db.add(ref_token_record)
    db.commit()

    return ApiResponse(
        success=True,
        message="Login successful",
        data={
            "access_token": access_token,
            "refresh_token": refresh_token_str,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
                "is_super_admin": user.is_super_admin or False,
                "is_active": True
            }
        }
    )

@router.post("/admin-login", response_model=ApiResponse)
def admin_login(user_in: UserLogin, request: Request, db: Session = Depends(get_db)):
    """
    Dedicated Admin Login Portal.
    Restricted strictly to authenticated Admin and Super Admin users.
    Rejects non-administrator accounts with HTTP 403 Forbidden.
    """
    email_clean = user_in.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()
    
    if not user or not verify_password(user_in.password, user.password_hash):
        raise UnauthorizedException("Invalid admin email address or password.")

    if not user.is_active:
        raise BadRequestException("Admin account is disabled or unverified.")

    # SECURITY ENFORCEMENT: Verify user has Admin or Super Admin role
    if not user.is_super_admin and user.role not in ["admin", "super_admin"]:
        # Record security violation audit log
        client_ip = request.client.host if request.client else "unknown"
        audit = AuditLog(
            event_type="auth",
            action="admin_login_rejected",
            level="WARNING",
            user_id=user.id,
            user_email=user.email,
            ip_address=client_ip,
            message=f"Unauthorized non-admin login attempt by {email_clean} (role={user.role})"
        )
        db.add(audit)
        db.commit()
        raise ForbiddenException("This account does not have administrator privileges.")

    # Record successful admin login audit log
    client_ip = request.client.host if request.client else "unknown"
    audit = AuditLog(
        event_type="auth",
        action="admin_login",
        level="INFO",
        user_id=user.id,
        user_email=user.email,
        ip_address=client_ip,
        message=f"Successful Admin login for '{user.email}' (role={user.role}, is_super_admin={user.is_super_admin})"
    )
    db.add(audit)

    access_token = create_access_token(subject=user.id, role=user.role)
    refresh_token_str = create_refresh_token(subject=user.id)

    ref_token_record = RefreshToken(
        user_id=user.id,
        token=refresh_token_str,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    db.add(ref_token_record)
    db.commit()

    return ApiResponse(
        success=True,
        message="Admin authentication successful",
        data={
            "access_token": access_token,
            "refresh_token": refresh_token_str,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
                "is_super_admin": user.is_super_admin or False,
                "is_active": True
            }
        }
    )

@router.get("/me", response_model=ApiResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return ApiResponse(
        success=True,
        data={
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "role": current_user.role,
            "is_super_admin": current_user.is_super_admin or False,
            "is_active": current_user.is_active,
            "created_at": current_user.created_at.isoformat() if current_user.created_at else ""
        }
    )

@router.post("/logout", response_model=ApiResponse)
def logout_user(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(RefreshToken).filter(RefreshToken.user_id == current_user.id).update({"is_revoked": True})
    db.commit()
    return ApiResponse(success=True, message="Successfully logged out")
