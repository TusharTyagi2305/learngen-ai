import os
import sys

backend_dir = os.path.abspath(os.path.dirname(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.core.database import SessionLocal
from app.models.all_models import User

db = SessionLocal()
users = db.query(User).all()
print(f"Total Users in DB: {len(users)}")
for u in users:
    masked_email = u.email[:3] + "***@" + u.email.split("@")[-1] if "@" in u.email else "***"
    print(f"User ID: {u.id}, Email: {masked_email}, Full Name: {u.full_name}, Role: {u.role}, Is Active: {u.is_active}")
db.close()
