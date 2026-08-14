from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)

    question = Column(String, nullable=False)

    option_a = Column(String, nullable=False)
    option_b = Column(String, nullable=False)
    option_c = Column(String, nullable=False)
    option_d = Column(String, nullable=False)

    correct_answer = Column(String, nullable=False)

    quiz_id = Column(
        Integer,
        ForeignKey("quizzes.id")
    )

    quiz = relationship(
        "Quiz",
        back_populates="questions"
    )