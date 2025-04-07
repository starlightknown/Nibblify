from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

# Association table for document-tag relationship
document_tags = Table(
    'document_tags',
    Base.metadata,
    Column('document_id', Integer, ForeignKey('documents.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)

class Document(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    file_path = Column(String, nullable=True)
    file_type = Column(String(50))
    url = Column(String(512))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    user_id = Column(Integer, ForeignKey('users.id'))
    is_archived = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="documents")
    tags = relationship("Tag", secondary=document_tags, back_populates="documents")
    ai_tags = relationship("AITag", back_populates="document")

class Tag(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey('users.id'))
    
    # Relationships
    user = relationship("User", back_populates="tags")
    documents = relationship("Document", secondary=document_tags, back_populates="tags")

class AITag(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    confidence = Column(Integer)  # Confidence score from 0 to 100
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    document_id = Column(Integer, ForeignKey('documents.id'))
    
    # Relationships
    document = relationship("Document", back_populates="ai_tags") 