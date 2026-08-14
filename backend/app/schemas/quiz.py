from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# =========================================================
# QUESTION SCHEMAS
# =========================================================

class QuestionCreate(BaseModel):
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str


class QuestionResponse(BaseModel):
    id: int
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str

    class Config:
        from_attributes = True


# =========================================================
# QUIZ SCHEMAS
# =========================================================

class QuizCreate(BaseModel):
    title: str
    subject: str
    topic: str
    difficulty: str


class QuizResponse(BaseModel):
    id: int
    title: str
    subject: str
    topic: str
    difficulty: str
    share_code: str
    created_by: Optional[int] = None

    class Config:
        from_attributes = True

# =========================================================
# AI QUIZ REQUEST
# =========================================================

class AIQuizRequest(BaseModel):
    title: str
    subject: str
    topic: str
    difficulty: str
    number_of_questions: int


# =========================================================
# QUIZ WITH QUESTIONS
# =========================================================

class QuizWithQuestionsResponse(BaseModel):
    id: int
    title: str
    subject: str
    topic: str
    difficulty: str
    share_code: str
    created_by: Optional[int]
    questions: List[QuestionResponse]

    class Config:
        from_attributes = True


# =========================================================
# STUDENT SUBMISSION
# =========================================================

class StudentAnswer(BaseModel):
    question_id: int
    selected_answer: str


class QuizSubmission(BaseModel):
    answers: List[StudentAnswer]


# =========================================================
# QUIZ RESULT
# =========================================================

class QuizReviewItem(BaseModel):
    question_id: int
    question: str

    option_a: str
    option_b: str
    option_c: str
    option_d: str

    selected_answer: Optional[str] = None
    correct_answer: str
    is_correct: bool


class QuizResult(BaseModel):
    total_questions: int
    correct_answers: int
    score_percentage: float
    passed: bool
    review: List[QuizReviewItem]

# =========================================================
# STUDENT RESULTS
# =========================================================

class StudentResultResponse(BaseModel):
    quiz_id: int
    quiz_title: str
    subject: str
    score: int
    total_questions: int
    percentage: float
    passed: bool
    submitted_at: datetime

    class Config:
        from_attributes = True


# =========================================================
# TEACHER DASHBOARD
# =========================================================

class TeacherDashboard(BaseModel):
    total_quizzes: int
    total_attempts: int
    average_score: float
    pass_rate: float


# =========================================================
# TEACHER QUIZZES
# =========================================================

class TeacherQuizResponse(BaseModel):
    id: int
    title: str
    subject: str
    topic: str
    difficulty: str
    share_code: str

    class Config:
        from_attributes = True


# =========================================================
# TEACHER RESULTS
# =========================================================

class TeacherResultResponse(BaseModel):
    student_name: str
    email: str
    score: int
    total_questions: int
    percentage: float
    passed: bool
    submitted_at: datetime

    class Config:
        from_attributes = True