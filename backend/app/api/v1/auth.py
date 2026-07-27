from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_user
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from app.core.exceptions import ConflictException, UnauthorizedException, BadRequestException
from app.models.all_models import User, RefreshToken, UserSettings
from app.schemas.schemas import ApiResponse, UserRegister, UserLogin, TokenResponse, UserProfileOut

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise ConflictException("An account with this email already exists")

    new_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        password_hash=get_password_hash(user_in.password),
        role=user_in.role or "student"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize user settings
    settings = UserSettings(user_id=new_user.id, default_role=new_user.role)
    db.add(settings)
    db.commit()

    return ApiResponse(
        success=True,
        message="User account registered successfully",
        data={"user_id": new_user.id, "email": new_user.email}
    )

@router.post("/login", response_model=ApiResponse)
def login_user(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email, User.is_active == True).first()
    if not user or not verify_password(user_in.password, user.password_hash):
        raise UnauthorizedException("Invalid email or password")

    access_token = create_access_token(subject=user.id, role=user.role)
    refresh_token_str = create_refresh_token(subject=user.id)

    # Store refresh token record
    ref_token_record = RefreshToken(
        user_id=user.id,
        token=refresh_token_str,
        expires_at=datetime.now(timezone.utc)
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
                "role": user.role
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
            "created_at": current_user.created_at.isoformat()
        }
    )

@router.post("/logout", response_model=ApiResponse)
def logout_user(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(RefreshToken).filter(RefreshToken.user_id == current_user.id).update({"is_revoked": True})
    db.commit()
    return ApiResponse(success=True, message="Successfully logged out")
