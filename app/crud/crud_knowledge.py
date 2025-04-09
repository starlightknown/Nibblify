from typing import List, Optional, Union, Dict, Any
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.knowledge import Document
from app.schemas.knowledge import DocumentCreate, DocumentUpdate
from app.core.elasticsearch import es_service
import os

class CRUDDocument(CRUDBase[Document, DocumentCreate, DocumentUpdate]):
    def create_with_user(
        self, db: Session, *, obj_in: DocumentCreate, user_id: int
    ) -> Document:
        # Create document
        db_obj = Document(
            title=obj_in.title,
            content=obj_in.content,
            file_path=obj_in.file_path,
            file_type=obj_in.file_type,
            url=obj_in.url,
            user_id=user_id,
            is_archived=obj_in.is_archived
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        # Index in Elasticsearch
        es_service.index_document(db_obj)
        
        return db_obj
    
    def update_with_user(
        self, db: Session, *, db_obj: Document, obj_in: Union[DocumentUpdate, Dict[str, Any]]
    ) -> Document:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        
        # Update document
        document = super().update(db, db_obj=db_obj, obj_in=update_data)
        
        # Re-index in Elasticsearch
        es_service.index_document(document)
        
        return document
    
    def remove_with_user(self, db: Session, *, id: int, user_id: int) -> Document:
        obj = db.query(self.model).filter(self.model.id == id, self.model.user_id == user_id).first()
        if obj:
            # Delete file if exists
            if obj.file_path and os.path.exists(obj.file_path):
                os.remove(obj.file_path)
                
            # Delete from Elasticsearch
            es_service.delete_document(obj.id)
            
            # Delete from database
            db.delete(obj)
            db.commit()
        return obj
    
    def get_multi_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Document]:
        return (
            db.query(self.model)
            .filter(self.model.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def search(
        self, db: Session, *, user_id: int, query: str, filters: Optional[Dict[str, Any]] = None,
        page: int = 1, limit: int = 20
    ) -> Dict[str, Any]:
        # Search in Elasticsearch
        search_result = es_service.search_documents(
            user_id=user_id,
            query=query,
            filters=filters,
            page=page,
            limit=limit
        )
        
        # Get documents from database
        if search_result["doc_ids"]:
            documents = (
                db.query(self.model)
                .filter(self.model.id.in_(search_result["doc_ids"]))
                .all()
            )
        else:
            documents = []
            
        return {
            "documents": documents,
            "total": search_result["total"],
            "page": page,
            "limit": limit
        }

document = CRUDDocument(Document) 