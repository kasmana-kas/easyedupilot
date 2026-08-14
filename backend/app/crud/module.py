from sqlalchemy.orm import Session

from app.models.module import Module
from app.schemas.module import ModuleCreate


def create_module(db: Session, module: ModuleCreate):
    db_module = Module(
        name=module.name,
        department_id=module.department_id
    )

    db.add(db_module)
    db.commit()
    db.refresh(db_module)

    return db_module


def get_modules(db: Session):
    return db.query(Module).all()


def get_module(db: Session, module_id: int):
    return (
        db.query(Module)
        .filter(Module.id == module_id)
        .first()
    )


def delete_module(db: Session, module_id: int):
    module = get_module(db, module_id)

    if module:
        db.delete(module)
        db.commit()

    return module