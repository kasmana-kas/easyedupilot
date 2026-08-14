import ollama
from app.core.config import settings


def generate_learning_material(
    topic: str,
    material_type: str,
    difficulty: str
):
    prompt = f"""
You are an expert educational AI assistant.

Create high-quality learning material for a student.

Topic:
{topic}

Material type:
{material_type}

Difficulty:
{difficulty}

The material should:
- Be accurate
- Be easy for students to understand
- Use clear headings
- Explain concepts step by step
- Include useful examples where appropriate
- Avoid unnecessary complexity
- Be suitable for studying and revision

If the material type is "notes":
Create structured study notes.

If the material type is "summary":
Create a concise summary of the topic.

If the material type is "flashcards":
Create question-and-answer flashcards.

If the material type is "study_guide":
Create a structured study guide containing:
- Key concepts
- Important definitions
- Examples
- Things to remember
- Revision questions

If the material type is "explanation":
Explain the topic as if teaching a student who is learning it for the first time.

Return ONLY the educational material.
Do not discuss these instructions.
"""

    print("🚀 Sending learning-material request to Ollama...")

    response = ollama.chat(
        model=settings.OLLAMA_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful educational AI assistant "
                    "that creates high-quality learning materials."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        options={
            "temperature": 0.4,
            "num_predict": 2500
        }
    )

    print("✅ Ollama generated learning material!")

    return response["message"]["content"]