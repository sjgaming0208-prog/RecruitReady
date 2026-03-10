from core.database import Base
from sqlalchemy import Column, DateTime, Integer, String


class Progress_entries(Base):
    __tablename__ = "progress_entries"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    branch = Column(String, nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    exercises = Column(String, nullable=False)