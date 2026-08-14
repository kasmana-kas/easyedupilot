from sqlalchemy import Column, Integer, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.base import Base


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    quiz_id = Column(
        Integer,
        ForeignKey("quizzes.id")
    )

    score = Column(Integer)

    total_questions = Column(Integer)

    percentage = Column(Float)

    passed = Column(Boolean)

    submitted_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    student = relationship(
        "User",
        back_populates="attempts"
    )

    quiz = relationship(
        "Quiz",
        back_populates="attempts"
    )

    answers = relationship(
        "AttemptAnswer",
        back_populates="attempt",
        cascade="all, delete-orphan"
    )