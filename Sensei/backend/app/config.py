from pathlib import Path
from dotenv import load_dotenv
import os

# Locate backend/.env regardless of where the app is run from
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_FILE)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError(
        f"❌ GEMINI_API_KEY not found.\nExpected .env at: {ENV_FILE}"
    )