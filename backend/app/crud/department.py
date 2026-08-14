from sqlalchemy.orm import Session

from app.models.department import Department
from app.schemas.department import DepartmentCreate


def create_department(
    db: Session,
    department: DepartmentCreate
):
    db_department = Department(
        name=department.name
    )

    db.add(db_department)
    db.commit()
    db.refresh(db_department)

    return db_department


def get_departments(db: Session):
    return db.query(Department).all()


def get_department(
    db: Session,
    department_id: int
):
    return (
        db.query(Department)
        .filter(Department.id == department_id)
        .first()
    )


def update_department(
    db: Session,
    department_id: int,
    department: DepartmentCreate
):
    db_department = get_department(
        db,
        department_id
    )

    if not db_department:
        return None

    db_department.name = department.name

    db.commit()
    db.refresh(db_department)

    return db_department


def delete_department(
    db: Session,
    department_id: int
):
    db_department = get_department(
        db,
        department_id
    )

    if not db_department:
        return None

    db.delete(db_department)
    db.commit()

    return db_department