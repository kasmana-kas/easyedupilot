from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User

from app.schemas.quiz import (
    QuizCreate,
    QuizResponse,
    AIQuizRequest,
    QuizWithQuestionsResponse,
    QuizSubmission,
    QuizResult,
    StudentResultResponse,
    TeacherDashboard,
    TeacherQuizResponse,
    TeacherResultResponse
)

from app.crud.quiz import (
    create_quiz,
    create_ai_quiz,
    get_all_quizzes,
    get_quiz,
    get_quiz_by_share_code,
    submit_quiz,
    get_student_results,
    get_teacher_dashboard,
    get_teacher_quizzes,
    get_teacher_results,
    get_teacher_quiz_results
)

from app.core.permissions import (
    teacher_required,
    student_required,
    teacher_or_student
)

router = APIRouter(
    prefix="/quizzes",
    tags=["Quizzes"]
)


# =========================================================
# CREATE NORMAL QUIZ
# =========================================================

@router.post(
    "/create",
    response_model=QuizResponse
)
def create_new_quiz(
    quiz: QuizCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(teacher_required)
):

    return create_quiz(
        db,
        quiz,
        current_user.id
    )


# =========================================================
# GENERATE AI QUIZ
# =========================================================

@router.post(
    "/generate",
    response_model=QuizResponse
)
def generate_ai_quiz(
    request: AIQuizRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(teacher_required)
):

    try:

        return create_ai_quiz(
            db,
            request,
            current_user
        )

    except Exception as e:

        print(
            "❌ AI QUIZ GENERATION ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to generate quiz."
        )


# =========================================================
# GET ALL QUIZZES
#
# TEACHERS ONLY
# =========================================================

@router.get(
    "/",
    response_model=list[QuizResponse]
)
def get_quizzes(
    db: Session = Depends(get_db),
    current_user: User = Depends(teacher_required)
):

    return get_all_quizzes(db)


# =========================================================
# GET QUIZ BY SHARE CODE
#
# TEACHERS AND STUDENTS
#
# Example:
# GET /quizzes/share/EDU-A7K92P
# =========================================================

@router.get(
    "/share/{share_code}",
    response_model=QuizWithQuestionsResponse
)
def get_quiz_using_share_code(
    share_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(teacher_or_student)
):

    quiz = get_quiz_by_share_code(
        db,
        share_code
    )

    if not quiz:

        raise HTTPException(
            status_code=404,
            detail="Quiz not found. Please check the quiz code."
        )

    return quiz


# =========================================================
# TEACHER VIEW QUIZ
#
# GET /quizzes/teacher/quizzes/{quiz_id}
#
# TEACHER ONLY
# =========================================================

@router.get(
    "/teacher/quizzes/{quiz_id}",
    response_model=QuizWithQuestionsResponse
)
def teacher_view_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(teacher_required)
):

    quiz = get_quiz(
        db,
        quiz_id
    )

    if not quiz:

        raise HTTPException(
            status_code=404,
            detail="Quiz not found."
        )

    # Teacher can only view quizzes created by themselves
    if quiz.created_by != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="You are not allowed to view this quiz."
        )

    return quiz


# =========================================================
# GET QUIZ BY INTERNAL ID
#
# STUDENTS ONLY
#
# GET /quizzes/{quiz_id}
# =========================================================

@router.get(
    "/{quiz_id}",
    response_model=QuizWithQuestionsResponse
)
def get_quiz_by_id(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(student_required)
):

    quiz = get_quiz(
        db,
        quiz_id
    )

    if not quiz:

        raise HTTPException(
            status_code=404,
            detail="Quiz not found."
        )

    return quiz


# =========================================================
# SUBMIT QUIZ
#
# STUDENTS ONLY
#
# POST /quizzes/{quiz_id}/submit
# =========================================================

@router.post(
    "/{quiz_id}/submit",
    response_model=QuizResult
)
def submit_student_quiz(
    quiz_id: int,
    submission: QuizSubmission,
    db: Session = Depends(get_db),
    current_user: User = Depends(student_required)
):

    result = submit_quiz(
        db,
        quiz_id,
        submission,
        current_user
    )

    if result is None:

        raise HTTPException(
            status_code=404,
            detail="Quiz not found."
        )

    return result


# =========================================================
# STUDENT RESULTS
#
# GET /quizzes/student/results
# =========================================================

@router.get(
    "/student/results",
    response_model=list[StudentResultResponse]
)
def get_my_results(
    db: Session = Depends(get_db),
    current_user: User = Depends(student_required)
):

    return get_student_results(
        db,
        current_user.id
    )


# =========================================================
# TEACHER DASHBOARD
#
# GET /quizzes/teacher/dashboard
# =========================================================

@router.get(
    "/teacher/dashboard",
    response_model=TeacherDashboard
)
def teacher_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(teacher_required)
):

    return get_teacher_dashboard(
        db,
        current_user.id
    )


# =========================================================
# TEACHER QUIZZES
#
# GET /quizzes/teacher/quizzes
# =========================================================

@router.get(
    "/teacher/quizzes",
    response_model=list[TeacherQuizResponse]
)
def teacher_quizzes(
    db: Session = Depends(get_db),
    current_user: User = Depends(teacher_required)
):

    return get_teacher_quizzes(
        db,
        current_user.id
    )


# =========================================================
# TEACHER RESULTS FOR ONE QUIZ
#
# GET /quizzes/teacher/quizzes/{quiz_id}/results
# =========================================================

@router.get(
    "/teacher/quizzes/{quiz_id}/results",
    response_model=list[TeacherResultResponse]
)
def teacher_quiz_results(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(teacher_required)
):

    results = get_teacher_quiz_results(
        db,
        quiz_id,
        current_user.id
    )

    if results is None:

        raise HTTPException(
            status_code=404,
            detail="Quiz not found or you are not the owner of this quiz."
        )

    return results


# =========================================================
# ALL TEACHER RESULTS
#
# GET /quizzes/teacher/results
# =========================================================

@router.get(
    "/teacher/results",
    response_model=list[TeacherResultResponse]
)
def teacher_results(
    db: Session = Depends(get_db),
    current_user: User = Depends(teacher_required)
):

    return get_teacher_results(
        db,
        current_user.id
    )