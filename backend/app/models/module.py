from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class Module(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(150), nullable=False)

    department_id = Column(
        Integer,
        ForeignKey("departments.id")
    )

    department = relationship(
        "Department",
        back_populates="modules"
    )

    quizzes = relationship(
        "Quiz",
        back_populates="module"
    )