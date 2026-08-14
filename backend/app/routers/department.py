from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user

from app.models.user import User

from app.schemas.department import (
    DepartmentCreate,
    DepartmentResponse
)

from app.crud.department import (
    create_department,
    get_departments,
    update_department,
    delete_department,
    get_department
)
from app.core.permissions import teacher_required

router = APIRouter(
    prefix="/departments",
    tags=["Departments"]
)


@router.post("/")
def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(teacher_required)
):

    if current_user.role != "teacher":
        raise HTTPException(
            status_code=403,
            detail="Teachers only."
        )

    return create_department(
        db,
        department
    )


@router.get(
    "/",
    response_model=list[DepartmentResponse]
)
def read_departments(
    db: Session = Depends(get_db)
):
    return get_departments(db)


@router.put(
    "/{department_id}",
    response_model=DepartmentResponse
)
def edit_department(
    department_id: int,
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "teacher":
        raise HTTPException(
            status_code=403,
            detail="Teachers only."
        )

    updated = update_department(
        db,
        department_id,
        department
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Department not found."
        )

    return updated


@router.delete(
    "/{department_id}"
)
def remove_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "teacher":
        raise HTTPException(
            status_code=403,
            detail="Teachers only."
        )

    deleted = delete_department(
        db,
        department_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Department not found."
        )

    return {
        "message": "Department deleted successfully."
    }