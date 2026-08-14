from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.module import (
    ModuleCreate,
    ModuleResponse
)

from app.crud.module import (
    create_module,
    get_modules,
    get_module,
    delete_module
)

router = APIRouter(
    prefix="/modules",
    tags=["Modules"]
)


@router.post("/", response_model=ModuleResponse)
def add_module(
    module: ModuleCreate,
    db: Session = Depends(get_db)
):
    return create_module(db, module)


@router.get("/", response_model=list[ModuleResponse])
def read_modules(
    db: Session = Depends(get_db)
):
    return get_modules(db)


@router.get("/{module_id}", response_model=ModuleResponse)
def read_module(
    module_id: int,
    db: Session = Depends(get_db)
):
    module = get_module(db, module_id)

    if not module:
        raise HTTPException(
            status_code=404,
            detail="Module not found"
        )

    return module


@router.delete("/{module_id}")
def remove_module(
    module_id: int,
    db: Session = Depends(get_db)
):
    module = delete_module(db, module_id)

    if not module:
        raise HTTPException(
            status_code=404,
            detail="Module not found"
        )

    return {"message": "Module deleted successfully"}