from fastapi import Depends, HTTPException, status

from app.dependencies.auth import get_current_user


def teacher_required(
    current_user=Depends(get_current_user)
):
    if current_user.role.lower() != "teacher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers can perform this action."
        )

    return current_user


def student_required(
    current_user=Depends(get_current_user)
):
    if current_user.role.lower() != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can perform this action."
        )

    return current_user


def teacher_or_student(
    current_user=Depends(get_current_user)
):
    """
    Allows any authenticated teacher or student
    to view/access a quiz.
    """

    if current_user.role.lower() not in ["teacher", "student"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers and students can perform this action."
        )

    return current_user