from app.services.ai import generate_quiz

print("Testing AI...\n")

quiz = generate_quiz(
    topic="Python Variables",
    difficulty="Easy",
    number_of_questions=5
)

print("\n========== RESULT ==========\n")
print(quiz)