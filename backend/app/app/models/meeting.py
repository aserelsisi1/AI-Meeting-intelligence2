from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.database import Base

class Meeting(Base):


 __tablename__ = "meetings"

 id = Column(
    Integer,
    primary_key=True,
    index=True
)

 user_id = Column(
    Integer,
    ForeignKey("users.id"),
    nullable=False
)

 title = Column(
    String(255),
    nullable=False
)

 description = Column(
    Text,
    nullable=True
)

 meeting_date = Column(
    DateTime,
    nullable=True
)

 file_name = Column(
    String(255),
    nullable=True
)

 file_type = Column(
    String(100),
    nullable=True
)

 file_path = Column(
    String(500),
    nullable=True
)

 duration = Column(
    Integer,
    nullable=True
)

 status = Column(
    String(50),
    nullable=True
)

 transcription = Column(
    Text,
    nullable=True
)

 summary = Column(
    Text,
    nullable=True
)

 created_at = Column(
    DateTime,
    default=datetime.utcnow
)

 participants = relationship(
    "Participant",
    backref="meeting",
    cascade="all, delete-orphan"
)

