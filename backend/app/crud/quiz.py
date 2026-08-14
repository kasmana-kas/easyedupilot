from sqlalchemy.orm import Session, joinedload

from app.models.attempt_answer import AttemptAnswer
from app.services.ai import generate_quiz
from app.models.quiz import Quiz
from app.models.question import Question
from app.models.attempt import QuizAttempt
from app.schemas.quiz import QuizCreate, QuizSubmission

import secrets
import string


# =========================================================
# GENERATE UNIQUE QUIZ SHARE CODE
# =========================================================

def generate_share_code(db: Session):
    while True:

        characters = string.ascii_uppercase + string.digits

        code = (
            "EDU-"
            + "".join(
                secrets.choice(characters)
                for _ in range(6)
            )
        )

        existing = (
            db.query(Quiz)
            .filter(Quiz.share_code == code)
            .first()
        )

        if not existing:
            return code


# =========================================================
# CREATE NORMAL QUIZ
# =========================================================

def create_quiz(
    db: Session,
    quiz: QuizCreate,
    teacher_id: int
):

    share_code = generate_share_code(db)

    db_quiz = Quiz(
        title=quiz.title,
        subject=quiz.subject,
        topic=quiz.topic,
        difficulty=quiz.difficulty,
        share_code=share_code,
        created_by=teacher_id
    )

    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)

    return db_quiz


# =========================================================
# GET ALL QUIZZES
# =========================================================

def get_all_quizzes(db: Session):

    return db.query(Quiz).all()


# =========================================================
# GET QUIZ BY INTERNAL ID
# =========================================================

def get_quiz(
    db: Session,
    quiz_id: int
):

    return (
        db.query(Quiz)
        .options(
            joinedload(Quiz.questions)
        )
        .filter(
            Quiz.id == quiz_id
        )
        .first()
    )


# =========================================================
# GET QUIZ BY SHARE CODE
# =========================================================

def get_quiz_by_share_code(
    db: Session,
    share_code: str
):

    return (
        db.query(Quiz)
        .options(
            joinedload(Quiz.questions)
        )
        .filter(
            Quiz.share_code == share_code.upper()
        )
        .first()
    )


# =========================================================
# CREATE AI QUIZ
# =========================================================

def create_ai_quiz(
    db: Session,
    request,
    current_user
):

    # =====================================================
    # GENERATE QUESTIONS USING AI
    # =====================================================

    questions = generate_quiz(
        request.topic,
        request.difficulty,
        request.number_of_questions
    )

    # =====================================================
    # GENERATE UNIQUE SHARE CODE
    # =====================================================

    share_code = generate_share_code(db)

    # =====================================================
    # CREATE QUIZ
    # =====================================================

    quiz = Quiz(
        title=request.title,
        subject=request.subject,
        topic=request.topic,
        difficulty=request.difficulty,
        share_code=share_code,
        created_by=current_user.id
    )

    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    # =====================================================
    # SAVE QUESTIONS
    # =====================================================

    for q in questions:

        print("\nQUESTION RECEIVED:")
        print(q)

        db_question = Question(
            question=q["question"],
            option_a=q["option_a"],
            option_b=q["option_b"],
            option_c=q["option_c"],
            option_d=q["option_d"],
            correct_answer=q["correct_answer"],
            quiz_id=quiz.id
        )

        db.add(db_question)

    # =====================================================
    # SAVE ALL QUESTIONS
    # =====================================================

    db.commit()
    db.refresh(quiz)

    # =====================================================
    # SUCCESS MESSAGE
    # =====================================================

    print("\n" + "=" * 60)
    print("✅ QUIZ CREATED SUCCESSFULLY")
    print(f"🆔 Quiz ID: {quiz.id}")
    print(f"🔑 Share Code: {quiz.share_code}")
    print(f"📚 Title: {quiz.title}")
    print(f"❓ Questions saved: {len(questions)}")
    print("=" * 60)

    return quiz


# =========================================================
# SUBMIT QUIZ
# =========================================================

def submit_quiz(
    db: Session,
    quiz_id: int,
    submission: QuizSubmission,
    current_user
):
    # =========================================================
    # GET QUIZ
    # =========================================================

    quiz = (
        db.query(Quiz)
        .options(joinedload(Quiz.questions))
        .filter(Quiz.id == quiz_id)
        .first()
    )

    if not quiz:
        return None

    # =========================================================
    # PREPARE CORRECT ANSWERS
    # =========================================================

    correct_answers = {
        question.id: question.correct_answer.strip().upper()
        for question in quiz.questions
    }

    total_questions = len(quiz.questions)

    # =========================================================
    # CHECK ANSWERS
    # =========================================================

    submitted_answers = {}

    for answer in submission.answers:
        submitted_answers[answer.question_id] = (
            answer.selected_answer.strip().upper()
        )

    correct_count = 0

    for question in quiz.questions:

        selected_answer = submitted_answers.get(
            question.id
        )

        correct_answer = correct_answers.get(
            question.id
        )

        if (
            selected_answer
            and correct_answer
            and selected_answer == correct_answer
        ):
            correct_count += 1

    # =========================================================
    # CALCULATE SCORE
    # =========================================================

    percentage = (
        (correct_count / total_questions) * 100
        if total_questions > 0
        else 0
    )

    passed = percentage >= 50

    # =========================================================
    # CREATE QUIZ ATTEMPT
    # =========================================================

    attempt = QuizAttempt(
        student_id=current_user.id,
        quiz_id=quiz.id,
        score=correct_count,
        total_questions=total_questions,
        percentage=round(percentage, 2),
        passed=passed
    )

    db.add(attempt)
    db.flush()

    # =========================================================
    # SAVE STUDENT ANSWERS
    # =========================================================

    for question in quiz.questions:

        selected_answer = submitted_answers.get(
            question.id
        )

        correct_answer = correct_answers.get(
            question.id
        )

        attempt_answer = AttemptAnswer(
            attempt_id=attempt.id,
            question_id=question.id,
            selected_answer=selected_answer,
            correct=(
                selected_answer == correct_answer
                if selected_answer
                else False
            )
        )

        db.add(attempt_answer)

    # =========================================================
    # COMMIT EVERYTHING
    # =========================================================

    db.commit()

    # =========================================================
    # BUILD REVIEW
    # =========================================================

    review = []

    for question in quiz.questions:

        selected_answer = submitted_answers.get(
            question.id
        )

        correct_answer = correct_answers.get(
            question.id
        )

        review.append({
            "question_id": question.id,
            "question": question.question,

            "option_a": question.option_a,
            "option_b": question.option_b,
            "option_c": question.option_c,
            "option_d": question.option_d,

            "selected_answer": selected_answer,

            "correct_answer": correct_answer,

            "is_correct": (
                selected_answer == correct_answer
                if selected_answer
                else False
            )
        })

    # =========================================================
    # RETURN RESULT
    # =========================================================

    return {
        "total_questions": total_questions,
        "correct_answers": correct_count,
        "score_percentage": round(percentage, 2),
        "passed": passed,
        "review": review
    }
# =========================================================
# GET STUDENT RESULTS
# =========================================================

def get_student_results(
    db: Session,
    student_id: int
):
    attempts = (
        db.query(QuizAttempt)
        .filter(
            QuizAttempt.student_id == student_id
        )
        .order_by(
            QuizAttempt.submitted_at.desc()
        )
        .all()
    )

    results = []

    for attempt in attempts:

        quiz = (
            db.query(Quiz)
            .filter(
                Quiz.id == attempt.quiz_id
            )
            .first()
        )

        if not quiz:
            continue

        results.append({
            "quiz_id": quiz.id,
            "quiz_title": quiz.title,
            "subject": quiz.subject,
            "score": attempt.score,
            "total_questions": attempt.total_questions,
            "percentage": attempt.percentage,
            "passed": attempt.passed,
            "submitted_at": attempt.submitted_at
        })

    return results

# =========================================================
# GET TEACHER DASHBOARD
# =========================================================

def get_teacher_dashboard(
    db: Session,
    teacher_id: int
):

    quizzes = (
        db.query(Quiz)
        .filter(
            Quiz.created_by == teacher_id
        )
        .all()
    )

    total_quizzes = len(quizzes)

    quiz_ids = [
        quiz.id
        for quiz in quizzes
    ]

    if not quiz_ids:

        return {
            "total_quizzes": 0,
            "total_attempts": 0,
            "average_score": 0,
            "pass_rate": 0
        }

    attempts = (
        db.query(QuizAttempt)
        .filter(
            QuizAttempt.quiz_id.in_(quiz_ids)
        )
        .all()
    )

    total_attempts = len(attempts)

    if total_attempts == 0:

        return {
            "total_quizzes": total_quizzes,
            "total_attempts": 0,
            "average_score": 0,
            "pass_rate": 0
        }

    average_score = (
        sum(
            attempt.percentage or 0
            for attempt in attempts
        )
        / total_attempts
    )

    passed_attempts = sum(
        1
        for attempt in attempts
        if attempt.passed
    )

    pass_rate = (
        (passed_attempts / total_attempts)
        * 100
    )

    return {
        "total_quizzes": total_quizzes,
        "total_attempts": total_attempts,
        "average_score": round(
            average_score,
            2
        ),
        "pass_rate": round(
            pass_rate,
            2
        )
    }


# =========================================================
# GET TEACHER QUIZZES
# =========================================================

def get_teacher_quizzes(
    db: Session,
    teacher_id: int
):

    return (
        db.query(Quiz)
        .filter(
            Quiz.created_by == teacher_id
        )
        .order_by(
            Quiz.id.desc()
        )
        .all()
    )


# =========================================================
# GET RESULTS FOR ONE TEACHER QUIZ
# =========================================================

def get_teacher_quiz_results(
    db: Session,
    quiz_id: int,
    teacher_id: int
):

    # -----------------------------------------------------
    # MAKE SURE QUIZ EXISTS AND BELONGS TO TEACHER
    # -----------------------------------------------------

    quiz = (
        db.query(Quiz)
        .filter(
            Quiz.id == quiz_id,
            Quiz.created_by == teacher_id
        )
        .first()
    )

    if not quiz:
        return None

    # -----------------------------------------------------
    # GET ATTEMPTS
    # -----------------------------------------------------

    attempts = (
        db.query(QuizAttempt)
        .filter(
            QuizAttempt.quiz_id == quiz_id
        )
        .order_by(
            QuizAttempt.submitted_at.desc()
        )
        .all()
    )

    results = []

    for attempt in attempts:

        student_name = (
            f"{attempt.student.first_name} "
            f"{attempt.student.last_name}"
        )

        results.append({

            "student_name":
                student_name,

            "email":
                attempt.student.email,

            "score":
                attempt.score,

            "total_questions":
                attempt.total_questions,

            "percentage":
                attempt.percentage,

            "passed":
                attempt.passed,

            "submitted_at":
                attempt.submitted_at
        })

    return results


# =========================================================
# GET ALL TEACHER RESULTS
# =========================================================

def get_teacher_results(
    db: Session,
    teacher_id: int
):

    attempts = (
        db.query(QuizAttempt)
        .join(Quiz)
        .filter(
            Quiz.created_by == teacher_id
        )
        .order_by(
            QuizAttempt.submitted_at.desc()
        )
        .all()
    )

    results = []

    for attempt in attempts:

        student_name = (
            f"{attempt.student.first_name} "
            f"{attempt.student.last_name}"
        )

        results.append({

            "student_name":
                student_name,

            "email":
                attempt.student.email,

            "score":
                attempt.score,

            "total_questions":
                attempt.total_questions,

            "percentage":
                attempt.percentage,

            "passed":
                attempt.passed,

            "submitted_at":
                attempt.submitted_at
        })

    return results