import os
import sys

backend_dir = os.path.abspath(os.path.dirname(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.core.database import engine
from sqlalchemy import text

def run_migration():
    print("Running RBAC Columns Migration on Database...")
    migrations = [
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS permissions JSON;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by VARCHAR(36);",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_by VARCHAR(36);",
        "ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS action VARCHAR(100);",
        "ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45);"
    ]
    with engine.connect() as conn:
        for stmt in migrations:
            try:
                conn.execute(text(stmt))
                conn.commit()
                print(f" -> OK: {stmt}")
            except Exception as e:
                print(f" -> Notice: {stmt} ({e})")
    print("Migration finished successfully.")

if __name__ == "__main__":
    run_migration()
