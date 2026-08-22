from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from app.database import Base


class ActionItem(Base):

    __tablename__ = "action_items"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    meeting_id = Column(
        Integer,
        ForeignKey("meetings.id"),
        nullable=False,
        index=True
    )

    task = Column(
        String(1000),
        nullable=False
    )

    owner = Column(
        String(255),
        nullable=True
    )

    deadline = Column(
        String(255),
        nullable=True
    )

    priority = Column(
        String(50),
        nullable=True
    )