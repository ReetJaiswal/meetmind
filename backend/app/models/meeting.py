from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, DateTime

from app.database import Base


class Meeting(Base):

    __tablename__ = "meetings"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String(255),
        nullable=False
    )

    filename = Column(
        String(255),
        nullable=False
    )

    language = Column(
        String(50),
        nullable=True
    )

    transcript = Column(
        Text,
        nullable=False
    )

    summary = Column(
        Text,
        nullable=True
    )

    key_decisions = Column(
        Text,
        nullable=True
    )

    topics = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )