import requests

from app.core.config import settings


def generate_quiz(topic: str):

    prompt = f"""
Create a quiz on {topic}.

Generate exactly 5 multiple-choice questions.

Each question should have:

Question

Option A

Option B

Option C

Option D

Correct Answer

Return ONLY valid JSON.
"""

    response = requests.post(
        f"{settings.OLLAMA_URL}/api/generate",
        json={
            "model": settings.OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
        },
    )

    return response.json()["response"]