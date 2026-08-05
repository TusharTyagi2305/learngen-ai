import os
import sys
import logging

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.core.config import settings
from app.core.database import engine, SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_audit():
    print("=== DATABASE AUDIT START ===")
    
    # 3. Print the exact DATABASE_URL that FastAPI is using at runtime (mask password)
    masked_url = settings.DATABASE_URL
    if "@" in masked_url and ":" in masked_url.split("@")[0]:
        parts = masked_url.split("@")
        cred_part = parts[0]
        host_part = parts[1]
        user_pass = cred_part.split("://")[1]
        user = user_pass.split(":")[0]
        masked_url = f"postgresql+psycopg://{user}:***@{host_part}"
    print(f"3. FastAPI Runtime DATABASE_URL: {masked_url}")

    # 4. Print engine.url
    print(f"4. engine.url: {str(engine.url).replace(engine.url.password, '***') if engine.url.password else engine.url}")

    with engine.connect() as conn:
        # 5. Print current_database()
        db_name = conn.execute(text("SELECT current_database();")).scalar()
        print(f"5. current_database(): {db_name}")

        # 6. Print current_schema()
        schema_name = conn.execute(text("SELECT current_schema();")).scalar()
        print(f"6. current_schema(): {schema_name}")

        # 7. Print inet_server_addr()
        try:
            server_addr = conn.execute(text("SELECT inet_server_addr();")).scalar()
            print(f"7. inet_server_addr(): {server_addr}")
        except Exception as e:
            print(f"7. inet_server_addr(): Error - {e}")

        # 8. Print inet_server_port()
        try:
            server_port = conn.execute(text("SELECT inet_server_port();")).scalar()
            print(f"8. inet_server_port(): {server_port}")
        except Exception as e:
            print(f"8. inet_server_port(): Error - {e}")

        # 9. Print SELECT version()
        version = conn.execute(text("SELECT version();")).scalar()
        print(f"9. PostgreSQL version: {version}")

    print("=== DATABASE AUDIT END ===")

if __name__ == "__main__":
    run_audit()
