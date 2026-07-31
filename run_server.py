import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

import uvicorn

if __name__ == "__main__":
    print("Starting LearnGen AI FastAPI Production Backend on http://127.0.0.1:8000 ...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)
