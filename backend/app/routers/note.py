from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user

from app.models.user import User
from app.models.note import Note

from app.crud.note import (
    create_note,
    get_note,
    get_note_by_share_code,
    delete_note
)

from app.schemas.note import NoteGenerateRequest


router = APIRouter(
    prefix="/notes",
    tags=["Notes"]
)


# =========================================================
# STUDENT: GET SHARED NOTE
# =========================================================

@router.get("/share/{share_code}")
def read_note_by_share_code(
    share_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "student":
        raise HTTPException(
            status_code=403,
            detail="Only students can access shared notes."
        )

    note = get_note_by_share_code(
        db,
        share_code
    )

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found. Please check the Note ID."
        )

    return {
        "success": True,
        "note_id": note.share_code,
        "title": note.title,
        "content": note.content,
        "note_type": note.note_type,
        "created_by": (
            f"{note.creator.first_name} "
            f"{note.creator.last_name}"
        ),
        "created_at": note.created_at
    }


# =========================================================
# TEACHER: GET ALL OWN NOTES
# =========================================================

@router.get("/my")
def get_my_notes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "teacher":
        raise HTTPException(
            status_code=403,
            detail="Only teachers can access their notes."
        )

    notes = (
        db.query(Note)
        .filter(
            Note.created_by == current_user.id
        )
        .order_by(
            Note.created_at.desc()
        )
        .all()
    )

    return {
        "success": True,
        "notes": [
            {
                "note_id": note.share_code,
                "title": note.title,
                "content": note.content,
                "note_type": note.note_type,
                "created_at": note.created_at
            }
            for note in notes
        ]
    }


# =========================================================
# TEACHER: GET ONE OWN NOTE
# =========================================================

@router.get("/my/{share_code}")
def get_my_note(
    share_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "teacher":
        raise HTTPException(
            status_code=403,
            detail="Only teachers can access their own notes."
        )

    note = get_note_by_share_code(
        db,
        share_code
    )

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found."
        )

    if note.created_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to access this note."
        )

    return {
        "success": True,
        "note_id": note.share_code,
        "title": note.title,
        "content": note.content,
        "note_type": note.note_type,
        "created_by": (
            f"{current_user.first_name} "
            f"{current_user.last_name}"
        ),
        "created_at": note.created_at
    }


# =========================================================
# TEACHER: CREATE MANUAL NOTE / STUDY MATERIAL
# =========================================================

@router.post("/")
def create_teacher_note(
    note_data: NoteGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "teacher":
        raise HTTPException(
            status_code=403,
            detail="Only teachers can create notes."
        )

    if not note_data.topic.strip():
        raise HTTPException(
            status_code=400,
            detail="Note title/topic is required."
        )

    if not note_data.content.strip():
        raise HTTPException(
            status_code=400,
            detail="Note content is required."
        )

    note = create_note(
        db=db,
        title=note_data.topic.strip(),
        content=note_data.content.strip(),
        note_type=note_data.material_type,
        created_by=current_user.id
    )

    return {
        "success": True,
        "message": "Note created successfully.",
        "note_id": note.share_code,
        "title": note.title,
        "content": note.content,
        "note_type": note.note_type,
        "created_by": (
            f"{current_user.first_name} "
            f"{current_user.last_name}"
        ),
        "created_at": note.created_at
    }


# =========================================================
# TEACHER: DELETE NOTE
# =========================================================

@router.delete("/{note_id}")
def remove_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "teacher":
        raise HTTPException(
            status_code=403,
            detail="Only teachers can delete notes."
        )

    note = get_note(
        db,
        note_id
    )

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found."
        )

    if note.created_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to delete this note."
        )

    delete_note(
        db,
        note_id
    )

    return {
        "success": True,
        "message": "Note deleted successfully."
    }