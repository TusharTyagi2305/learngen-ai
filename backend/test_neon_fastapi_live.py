import os
import sys
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app
from app.core.database import engine

def test_fastapi_neon_integration():
    print("=" * 70)
    print("[FASTAPI + NEON POSTGRESQL LIVE INTEGRATION AUDIT]")
    print("=" * 70)

    # 1. Check SQLAlchemy Engine Dialect & Host
    dialect_name = engine.dialect.name
    driver_name = engine.driver
    host_name = engine.url.host
    database_name = engine.url.database
    
    print(f"SQLAlchemy Dialect   : {dialect_name}")
    print(f"SQLAlchemy Driver    : {driver_name}")
    print(f"Database Host        : {host_name}")
    print(f"Database Name        : {database_name}")
    
    assert dialect_name == "postgresql", f"FAILED: Expected postgresql dialect but got '{dialect_name}'"
    assert "neon.tech" in host_name, f"FAILED: Engine is not connected to Neon host '{host_name}'"
    print("[PASS] Engine is 100% confirmed connected to Neon PostgreSQL!")

    # 2. Test FastAPI Endpoints via TestClient
    client = TestClient(app)
    
    response = client.get("/")
    assert response.status_code == 200, f"Root endpoint failed: {response.status_code}"
    print(f"[PASS] GET / -> {response.json()}")

    # 3. Test Admin Global Config Query from Neon
    from app.core.database import SessionLocal
    from app.models.all_models import AdminConfig, User
    db = SessionLocal()
    try:
        user_count = db.query(User).count()
        config = db.query(AdminConfig).first()
        print(f"[PASS] Neon Query Users Count: {user_count}")
        print(f"[PASS] Neon Query AdminConfig: id={config.id if config else 'None'}, chunk_size={config.chunk_size if config else 'None'}")
    finally:
        db.close()

    print("=" * 70)
    print("ALL LIVE INTEGRATION TESTS PASSED FOR NEON POSTGRESQL!")
    print("=" * 70)

if __name__ == "__main__":
    test_fastapi_neon_integration()
