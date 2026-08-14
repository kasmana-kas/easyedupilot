import json
import ollama

from app.core.config import settings


def generate_quiz(
    topic: str,
    difficulty: str,
    number_of_questions: int
):
    """
    Generate multiple-choice quiz questions using Ollama.

    Returns:
        list[dict]: A list of validated quiz questions.
    """

    # =========================================================
    # VALIDATE INPUT
    # =========================================================

    if not topic or not topic.strip():
        raise Exception("Quiz topic cannot be empty.")

    if difficulty not in ["easy", "medium", "hard"]:
        raise Exception("Difficulty must be easy, medium, or hard.")

    if number_of_questions < 1 or number_of_questions > 50:
        raise Exception("Number of questions must be between 1 and 50.")

    # =========================================================
    # PROMPT
    # =========================================================

    prompt = f"""
Generate exactly {number_of_questions} multiple-choice questions.

Topic: {topic}
Difficulty: {difficulty}

Each question MUST contain exactly these fields:

question
option_a
option_b
option_c
option_d
correct_answer

The correct_answer MUST be exactly one of:

A
B
C
D

IMPORTANT RULES:

1. Generate exactly {number_of_questions} questions.
2. Every question must have four options.
3. Each option must contain text.
4. correct_answer must be A, B, C, or D.
5. Return ONLY JSON.
6. Do NOT return Markdown.
7. Do NOT use ```json.
8. Do NOT include explanations.
9. Do NOT include comments.
10. Do NOT include any text before or after the JSON.

The JSON must have this exact structure:

{{
    "questions": [
        {{
            "question": "Question text",
            "option_a": "Option A",
            "option_b": "Option B",
            "option_c": "Option C",
            "option_d": "Option D",
            "correct_answer": "A"
        }}
    ]
}}
"""

    print("\n" + "=" * 60)
    print("🚀 SENDING REQUEST TO OLLAMA")
    print(f"📚 Topic: {topic}")
    print(f"🎯 Difficulty: {difficulty}")
    print(f"🔢 Questions requested: {number_of_questions}")
    print(f"🤖 Ollama model: {settings.OLLAMA_MODEL}")
    print("=" * 60)

    # =========================================================
    # JSON SCHEMA
    # =========================================================

    response_format = {
        "type": "object",
        "properties": {
            "questions": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "question": {
                            "type": "string"
                        },
                        "option_a": {
                            "type": "string"
                        },
                        "option_b": {
                            "type": "string"
                        },
                        "option_c": {
                            "type": "string"
                        },
                        "option_d": {
                            "type": "string"
                        },
                        "correct_answer": {
                            "type": "string",
                            "enum": ["A", "B", "C", "D"]
                        }
                    },
                    "required": [
                        "question",
                        "option_a",
                        "option_b",
                        "option_c",
                        "option_d",
                        "correct_answer"
                    ]
                }
            }
        },
        "required": ["questions"]
    }

    # =========================================================
    # CALL OLLAMA
    # =========================================================

    try:

        response = ollama.chat(
            model=settings.OLLAMA_MODEL,

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a quiz generation AI. "
                        "You MUST return valid JSON only. "
                        "Never return Markdown. "
                        "Never return explanations."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            format=response_format,

            options={
                "temperature": 0,
                "num_predict": 4000
            }
        )

    except Exception as e:

        print("\n❌ OLLAMA REQUEST FAILED")
        print(f"Error: {repr(e)}")

        raise Exception(
            "Unable to connect to Ollama."
        )

    # =========================================================
    # READ OLLAMA RESPONSE
    # =========================================================

    print("\n✅ OLLAMA REPLIED!")

    try:

        content = response["message"]["content"]

    except Exception as e:

        print("\n❌ INVALID OLLAMA RESPONSE STRUCTURE")
        print(response)

        raise Exception(
            "Ollama returned an invalid response."
        )

    print("\n🤖 RAW OLLAMA RESPONSE:")
    print(content)

    # =========================================================
    # CHECK EMPTY RESPONSE
    # =========================================================

    if not content or not content.strip():

        print("\n❌ OLLAMA RETURNED EMPTY CONTENT")

        raise Exception(
            "AI returned an empty response. "
            "Please try generating the quiz again."
        )

    # =========================================================
    # PARSE JSON
    # =========================================================

    try:

        data = json.loads(content)

    except json.JSONDecodeError as e:

        print("\n❌ OLLAMA RETURNED INVALID JSON")
        print(f"Error: {e}")
        print("RAW CONTENT:")
        print(repr(content))

        raise Exception(
            "AI returned invalid JSON. "
            "Please try generating the quiz again."
        )

    # =========================================================
    # VALIDATE TOP LEVEL STRUCTURE
    # =========================================================

    if not isinstance(data, dict):

        raise Exception(
            "AI response must be a JSON object."
        )

    if "questions" not in data:

        raise Exception(
            "AI response is missing the questions field."
        )

    questions = data["questions"]

    if not isinstance(questions, list):

        raise Exception(
            "AI questions field must be a list."
        )

    # =========================================================
    # VALIDATE QUESTION COUNT
    # =========================================================

    if len(questions) != number_of_questions:

        print(
            f"\n⚠️ Expected {number_of_questions} questions "
            f"but AI returned {len(questions)}."
        )

        raise Exception(
            f"AI generated {len(questions)} questions "
            f"instead of {number_of_questions}."
        )

    # =========================================================
    # VALIDATE QUESTIONS
    # =========================================================

    required_fields = [
        "question",
        "option_a",
        "option_b",
        "option_c",
        "option_d",
        "correct_answer"
    ]

    cleaned_questions = []

    for index, question in enumerate(
        questions,
        start=1
    ):

        # -----------------------------------------------------
        # QUESTION MUST BE OBJECT
        # -----------------------------------------------------

        if not isinstance(question, dict):

            raise Exception(
                f"Question {index} is not a valid object."
            )

        # -----------------------------------------------------
        # CHECK REQUIRED FIELDS
        # -----------------------------------------------------

        for field in required_fields:

            if field not in question:

                raise Exception(
                    f"Question {index} is missing "
                    f"field: {field}"
                )

            if not isinstance(
                question[field],
                str
            ):

                raise Exception(
                    f"Question {index} field "
                    f"'{field}' must be text."
                )

            if not question[field].strip():

                raise Exception(
                    f"Question {index} field "
                    f"'{field}' is empty."
                )

        # -----------------------------------------------------
        # NORMALIZE CORRECT ANSWER
        # -----------------------------------------------------

        correct_answer = (
            question["correct_answer"]
            .strip()
            .upper()
        )

        if correct_answer not in [
            "A",
            "B",
            "C",
            "D"
        ]:

            raise Exception(
                f"Question {index} has invalid "
                f"correct_answer: {correct_answer}"
            )

        # -----------------------------------------------------
        # CLEAN QUESTION
        # -----------------------------------------------------

        cleaned_questions.append(
            {
                "question": (
                    question["question"]
                    .strip()
                ),

                "option_a": (
                    question["option_a"]
                    .strip()
                ),

                "option_b": (
                    question["option_b"]
                    .strip()
                ),

                "option_c": (
                    question["option_c"]
                    .strip()
                ),

                "option_d": (
                    question["option_d"]
                    .strip()
                ),

                "correct_answer": correct_answer
            }
        )

    # =========================================================
    # SUCCESS
    # =========================================================

    print("\n" + "=" * 60)
    print("✅ AI QUIZ GENERATED SUCCESSFULLY")
    print(f"❓ Questions generated: {len(cleaned_questions)}")
    print("=" * 60)

    return cleaned_questions