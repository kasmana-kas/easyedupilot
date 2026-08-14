from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String(255),
        nullable=False
    )

    subject = Column(
        String(100),
        nullable=False
    )

    topic = Column(
        String(255),
        nullable=False
    )

    difficulty = Column(
        String(50),
        nullable=False
    )

    share_code = Column(
        String(20),
        unique=True,
        index=True,
        nullable=False
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    creator = relationship(
        "User",
        back_populates="quizzes"
    )

    questions = relationship(
        "Question",
        back_populates="quiz",
        cascade="all, delete-orphan"
    )

    attempts = relationship(
        "QuizAttempt",
        back_populates="quiz",
        cascade="all, delete-orphan"
    )

    module_id = Column(
        Integer,
        ForeignKey("modules.id")
    )

    module = relationship(
        "Module",
        back_populates="quizzes"
    )