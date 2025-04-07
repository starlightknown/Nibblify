from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, HttpUrl

# Document schemas
class DocumentBase(BaseModel):
    title: str
    content: Optional[str] = None
    file_path: Optional[str] = None
    file_type: Optional[str] = None
    url: Optional[HttpUrl] = None
    is_archived: Optional[bool] = False

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(DocumentBase):
    title: Optional[str] = None

class Document(DocumentBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Search schemas
class SearchQuery(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = None
    page: int = 1
    limit: int = 20

class SearchResult(BaseModel):
    documents: List[Document]
    total: int
    page: int
    limit: int

    class Config:
        orm_mode = True 