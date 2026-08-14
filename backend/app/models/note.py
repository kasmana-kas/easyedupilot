from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.base import Base


class Note(Base):
    __tablename__ = "notes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # Random classroom-sharing ID
    # Example: EDP-A7K92Q
    share_code = Column(
        String(20),
        unique=True,
        nullable=False,
        index=True
    )

    title = Column(
        String(255),
        nullable=False
    )

    content = Column(
        Text,
        nullable=True
    )

    note_type = Column(
        String(50),
        default="ai_generated",
        nullable=False
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # Teacher who created the note
    creator = relationship(
        "User",
        back_populates="notes"
    )

    # Keep this relationship for now because
    # the database already has NoteShare.
    # We will stop using it for access control.
    shares = relationship(
        "NoteShare",
        back_populates="note",
        cascade="all, delete-orphan"
    )