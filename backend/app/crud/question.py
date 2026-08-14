from sqlalchemy.orm import Session

from app.models.question import Question
from app.schemas.question import (
    QuestionCreate,
    QuestionUpdate
)


def create_question(
    db: Session,
    question: QuestionCreate
):
    db_question = Question(
        question=question.question,
        option_a=question.option_a,
        option_b=question.option_b,
        option_c=question.option_c,
        option_d=question.option_d,
        correct_answer=question.correct_answer,
        quiz_id=question.quiz_id
    )

    db.add(db_question)
    db.commit()
    db.refresh(db_question)

    return db_question


def get_questions_by_quiz(
    db: Session,
    quiz_id: int
):
    return (
        db.query(Question)
        .filter(Question.quiz_id == quiz_id)
        .all()
    )


def get_question(
    db: Session,
    question_id: int
):
    return (
        db.query(Question)
        .filter(Question.id == question_id)
        .first()
    )


def update_question(
    db: Session,
    question_id: int,
    data: QuestionUpdate
):
    question = get_question(db, question_id)

    if not question:
        return None

    question.question = data.question
    question.option_a = data.option_a
    question.option_b = data.option_b
    question.option_c = data.option_c
    question.option_d = data.option_d
    question.correct_answer = data.correct_answer

    db.commit()
    db.refresh(question)

    return question


def delete_question(
    db: Session,
    question_id: int
):
    question = get_question(db, question_id)

    if not question:
        return False

    db.delete(question)
    db.commit()

    return True