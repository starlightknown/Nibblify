from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, func, text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Document(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    file_path = Column(String, nullable=True)
    file_type = Column(String(50))
    url = Column(String(512))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    user_id = Column(Integer, ForeignKey('user.id'))
    is_archived = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="documents")

    @classmethod
    def search(cls, db, user_id: int, query: str, filters: dict = None, page: int = 1, limit: int = 20):
        """Search documents using PostgreSQL full-text search"""
        # Base query
        search_query = db.query(cls).filter(cls.user_id == user_id)
        
        # Add text search if query is provided
        if query:
            search_query = search_query.filter(
                text("to_tsvector('english', title || ' ' || content) @@ plainto_tsquery('english', :query)")
            ).params(query=query)
        
        # Add filters if provided
        if filters:
            if "file_type" in filters:
                search_query = search_query.filter(cls.file_type == filters["file_type"])
            if "is_archived" in filters:
                search_query = search_query.filter(cls.is_archived == filters["is_archived"])
        
        # Get total count
        total = search_query.count()
        
        # Apply pagination
        documents = search_query.order_by(cls.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
        
        return {
            "documents": documents,
            "total": total,
            "page": page,
            "limit": limit
        } 