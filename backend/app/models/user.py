from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String(100), nullable=False)

    last_name = Column(String(100), nullable=False)

    email = Column(String(255), unique=True, nullable=False)

    password = Column(String(255), nullable=False)

    role = Column(String(50), default="student")

    is_active = Column(Boolean, default=True)

    quizzes = relationship(
        "Quiz",
        back_populates="creator"
    )

    attempts = relationship(
        "QuizAttempt",
        back_populates="student"
    )

    notes = relationship(
        "Note",
        back_populates="creator"
    )

    department_id = Column(
        Integer,
        ForeignKey("departments.id"),
        nullable=True
    )

    department = relationship(
        "Department"
    )
    
    shared_notes = relationship(
    "NoteShare",
    back_populates="student",
    cascade="all, delete-orphan"
    )