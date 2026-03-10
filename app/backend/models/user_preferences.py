from core.database import Base
from sqlalchemy import Column, DateTime, Integer, String


class User_preferences(Base):
    __tablename__ = "user_preferences"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    selected_branch = Column(String, nullable=True)
    subscription_tier = Column(String, nullable=True)
    subscription_status = Column(String, nullable=True)
    stripe_customer_id = Column(String, nullable=True)
    stripe_subscription_id = Column(String, nullable=True)
    subscription_end_date = Column(DateTime(timezone=True), nullable=True)