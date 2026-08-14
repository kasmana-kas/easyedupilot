from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.base import Base


class NoteShare(Base):
    __tablename__ = "note_shares"

    id = Column(Integer, primary_key=True, index=True)

    note_id = Column(
        Integer,
        ForeignKey("notes.id"),
        nullable=False
    )

    shared_with = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    note = relationship(
        "Note",
        back_populates="shares"
    )

    student = relationship(
        "User",
        back_populates="shared_notes"
    )