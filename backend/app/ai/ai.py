import ollama

def generate_quiz(topic: str, difficulty: str, number_of_questions: int):
    prompt = f"""
Generate exactly {number_of_questions} multiple choice questions.

Topic: {topic}
Difficulty: {difficulty}

Return ONLY valid JSON.

{{
  "questions": [
    {{
      "question": "",
      "option_a": "",
      "option_b": "",
      "option_c": "",
      "option_d": "",
      "correct_answer": "A"
    }}
  ]
}}
"""

    print("🚀 Sending request to Ollama...")

    response = ollama.chat(
    model="qwen3:4b",
    think=False,
    messages=[
        {
            "role": "system",
            "content": (
                "You are an AI quiz generator. "
                "Return ONLY valid JSON. "
                "Do not explain anything."
            )
        },
        {
            "role": "user",
            "content": prompt
        }
    ],
    options={
        "temperature": 0.2,
        "num_predict": 256
    }
)

    print("✅ Ollama replied!")
    print(response["message"]["content"])

    return response["message"]["content"]