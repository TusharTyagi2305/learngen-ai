import os
from dotenv import load_dotenv
load_dotenv('.env')

key = os.getenv('GEMINI_API_KEY')
print("Testing top text generation models...")

from google import genai
client = genai.Client(api_key=key)

candidates = [
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash-lite-001",
    "gemini-2.5-flash-lite",
    "gemini-flash-latest",
    "gemini-pro-latest",
    "gemini-2.0-flash-001"
]

for m in candidates:
    try:
        print(f"Testing '{m}'...", end=" ", flush=True)
        res = client.models.generate_content(model=m, contents="Hello")
        if res and res.text:
            print(f"[SUCCESS] Result: '{res.text.strip()[:40]}'")
            print(f"\nFOUND WORKING MODEL: {m}")
            break
    except Exception as e:
        err = str(e)
        if "404" in err:
            print("FAILED (404 Not Found)")
        elif "429" in err:
            print("FAILED (429 Quota Exceeded)")
        else:
            print(f"FAILED ({err[:50]})")
