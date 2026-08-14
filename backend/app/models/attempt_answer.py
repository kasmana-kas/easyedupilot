from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class AttemptAnswer(Base):
    __tablename__ = "attempt_answers"

    id = Column(Integer, primary_key=True, index=True)

    attempt_id = Column(
        Integer,
        ForeignKey("quiz_attempts.id")
    )

    question_id = Column(
        Integer,
        ForeignKey("questions.id")
    )

    selected_answer = Column(String)

    correct = Column(Boolean)

    attempt = relationship(
        "QuizAttempt",
        back_populates="answers"
    )

    question = relationship("Question")