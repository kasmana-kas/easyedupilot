from app.database.session import engine
from app.database.base import Base

from app.models.user import User
from app.models.quiz import Quiz
from app.models.question import Question
from app.models.module import Module
from app.models.department import Department
from app.models.attempt import QuizAttempt
from app.models.attempt_answer import AttemptAnswer
from app.database.base import Base
from app.database.session import engine

def init_db():
    Base.metadata.create_all(bind=engine)