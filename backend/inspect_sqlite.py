import sqlite3
import shutil
import os

db_path = "learngen_ai.db"
backup_path = "learngen_ai_backup.db"

if os.path.exists(db_path):
    shutil.copy2(db_path, backup_path)
    print(f"[+] Safety backup created: '{backup_path}'")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [row[0] for row in cursor.fetchall() if not row[0].startswith("sqlite")]

print(f"\n[+] SQLite Database Tables ({len(tables)} total):")
for t in tables:
    try:
        count = cursor.execute(f"SELECT COUNT(*) FROM \"{t}\"").fetchone()[0]
        print(f"  - {t}: {count} records")
    except Exception as e:
        print(f"  - {t}: error reading - {e}")

conn.close()
