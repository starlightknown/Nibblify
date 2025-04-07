from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, HttpUrl

# Tag schemas
class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class Tag(TagBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

# AI Tag schemas
class AITagBase(BaseModel):
    name: str
    confidence: int

class AITagCreate(AITagBase):
    document_id: int

class AITag(AITagBase):
    id: int
    document_id: int
    created_at: datetime

    class Config:
        orm_mode = True

# Document schemas
class DocumentBase(BaseModel):
    title: str
    content: Optional[str] = None
    file_path: Optional[str] = None
    file_type: Optional[str] = None
    url: Optional[HttpUrl] = None
    is_archived: Optional[bool] = False

class DocumentCreate(DocumentBase):
    tag_ids: Optional[List[int]] = []

class DocumentUpdate(DocumentBase):
    title: Optional[str] = None
    tag_ids: Optional[List[int]] = None

class Document(DocumentBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    tags: List[Tag] = []
    ai_tags: List[AITag] = []

    class Config:
        orm_mode = True

# Search schemas
class SearchQuery(BaseModel):
    query: str
    skip: int = 0
    limit: int = 100

class SearchResult(BaseModel):
    id: int
    title: str
    content: str
    score: float
    created_at: datetime
    user_id: int

    class Config:
        orm_mode = True 