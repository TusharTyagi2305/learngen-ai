from typing import Generator, Optional, List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import decode_token
from app.core.exceptions import UnauthorizedException, ForbiddenException
from app.models.all_models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """
    Decodes bearer JWT token and retrieves authenticated active user.
    Strictly rejects unauthenticated or invalid tokens.
    """
    if token:
        try:
            payload = decode_token(token)
            if payload and payload.get("type") == "access":
                user_id = payload.get("sub")
                user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
                if user:
                    return user
        except Exception:
            pass

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication token required",
        headers={"WWW-Authenticate": "Bearer"}
    )

def require_role(allowed_roles: List[str]):
    """
    RBAC dependency requiring current user to have one of allowed_roles (or super_admin).
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.is_super_admin or (current_user.role and current_user.role.lower() == "super_admin"):
            return current_user
        if not current_user.role or current_user.role.lower() not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Action requires one of these roles: {allowed_roles}"
            )
        return current_user
    return role_checker

def require_permission(permission_name: str):
    """
    RBAC dependency requiring specific permission string (or super_admin).
    """
    def permission_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.is_super_admin or current_user.role == "super_admin":
            return current_user
        
        user_perms = current_user.permissions or []
        if isinstance(user_perms, list) and ("*" in user_perms or permission_name in user_perms):
            return current_user
            
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Forbidden: Required permission '{permission_name}' not granted"
        )
    return permission_checker

def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Requires authenticated user to be Admin or Super Admin.
    """
    if current_user.is_super_admin or (current_user.role and current_user.role.lower() in ["admin", "super_admin"]):
        return current_user
    
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Forbidden: Admin access required"
    )

def require_super_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Requires authenticated user to be Super Admin strictly.
    """
    if current_user.is_super_admin or (current_user.role and current_user.role.lower() == "super_admin"):
        return current_user
        
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Forbidden: Super Admin privileges required"
    )

