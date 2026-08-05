import os
import sys
import logging
from datetime import datetime
import secrets

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.core.config import settings
from app.core.database import SessionLocal, engine
from app.models.all_models import User
from app.api.v1.auth import register_user
from app.schemas.schemas import UserRegister
from fastapi import BackgroundTasks

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_registration():
    print("=== START REGISTRATION TEST ===")
    db = SessionLocal()
    
    test_email = f"test_{secrets.token_hex(4)}@example.com"
    test_pass = "TestPass123!"
    
    print(f"Target Email: {test_email}")
    
    # Check rows before
    count_before = db.query(User).count()
    print(f"User count before: {count_before}")
    
    user_data = UserRegister(
        full_name="Test Audit User",
        email=test_email,
        password=test_pass,
        role="student"
    )
    
    bg_tasks = BackgroundTasks()
    
    try:
        print("Calling register_user()...")
        res = register_user(request=user_data, background_tasks=bg_tasks, db=db)
        print(f"register_user() returned: {res}")
        
        # In FastAPI, endpoints don't commit if you don't commit yourself? Wait, auth.py DOES db.commit()!
    except Exception as e:
        print(f"Error during registration: {e}")
        
    db.close()
    
    # New session to check if it's there
    db2 = SessionLocal()
    count_after = db2.query(User).count()
    print(f"User count after: {count_after}")
    
    user_in_db = db2.query(User).filter(User.email == test_email).first()
    if user_in_db:
        print(f"User FOUND in DB! ID: {user_in_db.id}")
    else:
        print("User NOT FOUND in DB after registration!!")
        
    # Execute direct SQL
    with engine.connect() as conn:
        print("\nDirect SQL Query on users table:")
        result = conn.execute(text("SELECT id, email, is_active FROM users ORDER BY created_at DESC LIMIT 5"))
        for row in result:
            print(f"- {row}")
            
    db2.close()
    print("=== END REGISTRATION TEST ===")

if __name__ == "__main__":
    test_registration()
