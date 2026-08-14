from sqlalchemy.orm import Session

from app.models.note_share import NoteShare


def share_note_with_student(
    db: Session,
    note_id: int,
    student_id: int
):
    existing_share = (
        db.query(NoteShare)
        .filter(
            NoteShare.note_id == note_id,
            NoteShare.shared_with == student_id
        )
        .first()
    )

    if existing_share:
        return existing_share

    note_share = NoteShare(
        note_id=note_id,
        shared_with=student_id
    )

    db.add(note_share)
    db.commit()
    db.refresh(note_share)

    return note_share


def get_student_note_shares(
    db: Session,
    student_id: int
):
    return (
        db.query(NoteShare)
        .filter(
            NoteShare.shared_with == student_id
        )
        .order_by(
            NoteShare.created_at.desc()
        )
        .all()
    )


def get_note_share(
    db: Session,
    note_id: int,
    student_id: int
):
    return (
        db.query(NoteShare)
        .filter(
            NoteShare.note_id == note_id,
            NoteShare.shared_with == student_id
        )
        .first()
    )


def remove_note_share(
    db: Session,
    note_id: int,
    student_id: int
):
    share = get_note_share(
        db,
        note_id,
        student_id
    )

    if share:
        db.delete(share)
        db.commit()

    return share
