import random
import string

from sqlalchemy.orm import Session

from app.models.note import Note


# ==========================================
# GENERATE RANDOM NOTE ID
# ==========================================

def generate_share_code(db: Session):

    characters = string.ascii_uppercase + string.digits

    while True:

        random_part = "".join(
            random.choices(
                characters,
                k=6
            )
        )

        share_code = f"EDP-{random_part}"

        existing = (
            db.query(Note)
            .filter(
                Note.share_code == share_code
            )
            .first()
        )

        if not existing:
            return share_code


# ==========================================
# CREATE NOTE
# ==========================================

def create_note(
    db: Session,
    title: str,
    content: str,
    note_type: str,
    created_by: int
):

    share_code = generate_share_code(db)

    db_note = Note(
        share_code=share_code,
        title=title,
        content=content,
        note_type=note_type,
        created_by=created_by
    )

    db.add(db_note)
    db.commit()
    db.refresh(db_note)

    return db_note


# ==========================================
# GET NOTE BY DATABASE ID
# ==========================================

def get_note(
    db: Session,
    note_id: int
):

    return (
        db.query(Note)
        .filter(
            Note.id == note_id
        )
        .first()
    )


# ==========================================
# GET NOTE BY RANDOM NOTE ID
# ==========================================

def get_note_by_share_code(
    db: Session,
    share_code: str
):

    return (
        db.query(Note)
        .filter(
            Note.share_code == share_code.upper()
        )
        .first()
    )


# ==========================================
# DELETE NOTE
# ==========================================

def delete_note(
    db: Session,
    note_id: int
):

    note = get_note(
        db,
        note_id
    )

    if note:
        db.delete(note)
        db.commit()

    return note