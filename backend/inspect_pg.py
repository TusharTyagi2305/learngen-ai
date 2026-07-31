import os
from dotenv import load_dotenv
load_dotenv('.env')

db_url = os.getenv('DATABASE_URL')
print("Inspecting PostgreSQL Database...")

from sqlalchemy import create_engine, text
engine = create_engine(db_url)
conn = engine.connect()

tables = [r[0] for r in conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;")).fetchall()]
rev = conn.execute(text("SELECT version_num FROM alembic_version;")).fetchone()[0]

print(f"\n[+] PostgreSQL Database Engine: PostgreSQL 17")
print(f"[+] Total Public Tables: {len(tables)}")
print(f"[+] Alembic Stamped Revision: {rev}")
print("\nTables List:")
for t in tables:
    count = conn.execute(text(f'SELECT COUNT(*) FROM "{t}"')).fetchone()[0]
    print(f"  - {t} ({count} rows)")

conn.close()
