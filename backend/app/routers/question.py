from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.core.permissions import teacher_required

from app.schemas.question import (
    QuestionCreate,
    QuestionUpdate,
    QuestionResponse
)

from app.crud.question import (
    create_question,
    get_questions_by_quiz,
    get_question,
    update_question,
    delete_question
)

router = APIRouter(
    prefix="/questions",
    tags=["Questions"]
)


@router.post(
    "/",
    response_model=QuestionResponse
)
def add_question(
    question: QuestionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(teacher_required)
):
    return create_question(db, question)


@router.get(
    "/quiz/{quiz_id}",
    response_model=list[QuestionResponse]
)
def read_questions(
    quiz_id: int,
    db: Session = Depends(get_db)
):
    return get_questions_by_quiz(db, quiz_id)


@router.put(
    "/{question_id}",
    response_model=QuestionResponse
)
def edit_question(
    question_id: int,
    data: QuestionUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(teacher_required)
):
    question = update_question(
        db,
        question_id,
        data
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found."
        )

    return question


@router.delete("/{question_id}")
def remove_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(teacher_required)
):
    deleted = delete_question(
        db,
        question_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Question not found."
        )

    return {
        "message": "Question deleted successfully."
    }