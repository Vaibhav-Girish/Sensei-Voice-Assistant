from google import genai

from app.config import GEMINI_API_KEY
from app.prompts import SYSTEM_PROMPT


class GeminiService:
    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.model = "gemini-2.5-flash"

    def generate_response(self, user_message: str) -> str:
        """
        Sends the user's message to Gemini and returns the response.
        """

        prompt = f"""
{SYSTEM_PROMPT}

User:
{user_message}

Sensei:
"""

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
            )

            if response.text:
                return response.text.strip()

            return "I'm sorry, I couldn't generate a response."

        except Exception as e:
            return f"Error: {str(e)}"