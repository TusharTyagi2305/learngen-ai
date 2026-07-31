import os
from dotenv import load_dotenv
load_dotenv('.env')

key = os.getenv('GEMINI_API_KEY')
print("Testing Gemini models with provided API Key...")

from google import genai
client = genai.Client(api_key=key)

available_models = [m.name.replace("models/", "") for m in client.models.list()]
print(f"Total available models: {len(available_models)}")

working_models = []

for m in available_models:
    try:
        res = client.models.generate_content(model=m, contents="Hello")
        if res and res.text:
            print(f"[SUCCESS] Model '{m}' works! Sample output: '{res.text.strip()[:50]}'")
            working_models.append(m)
    except Exception as e:
        err_msg = str(e)
        if "404" in err_msg:
            status = "404 Not Found"
        elif "429" in err_msg:
            status = "429 Quota Exceeded"
        else:
            status = err_msg[:60]
        print(f"[FAIL] Model '{m}' -> {status}")

print("\n=== SUMMARY OF WORKING MODELS ===")
for wm in working_models:
    print(f" -> {wm}")
