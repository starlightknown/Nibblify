from typing import List, Dict, Any, Optional
from elasticsearch import Elasticsearch
from app.core.config import settings
from app.models.knowledge import Document, Tag, AITag

class ElasticsearchService:
    def __init__(self):
        self.es = Elasticsearch(settings.ELASTICSEARCH_URL)
        self.index_name = "documents"
        self._ensure_index()

    def _ensure_index(self):
        """Ensure the documents index exists with proper mappings"""
        if not self.es.indices.exists(index=self.index_name):
            self.es.indices.create(
                index=self.index_name,
                body={
                    "mappings": {
                        "properties": {
                            "id": {"type": "long"},
                            "user_id": {"type": "long"},
                            "title": {"type": "text", "analyzer": "standard"},
                            "content": {"type": "text", "analyzer": "standard"},
                            "file_type": {"type": "keyword"},
                            "url": {"type": "keyword"},
                            "created_at": {"type": "date"},
                            "updated_at": {"type": "date"},
                            "is_archived": {"type": "boolean"},
                            "tags": {"type": "keyword"},
                            "ai_tags": {"type": "keyword"},
                            "ai_tag_confidences": {"type": "float"}
                        }
                    }
                }
            )

    def index_document(self, document: Document, tags: List[Tag], ai_tags: List[AITag]):
        """Index a document in Elasticsearch"""
        doc_data = {
            "id": document.id,
            "user_id": document.user_id,
            "title": document.title,
            "content": document.content,
            "file_type": document.file_type,
            "url": str(document.url) if document.url else None,
            "created_at": document.created_at.isoformat() if document.created_at else None,
            "updated_at": document.updated_at.isoformat() if document.updated_at else None,
            "is_archived": document.is_archived,
            "tags": [tag.name for tag in tags],
            "ai_tags": [tag.name for tag in ai_tags],
            "ai_tag_confidences": {tag.name: tag.confidence/100 for tag in ai_tags if tag.confidence}
        }
        
        self.es.index(index=self.index_name, id=document.id, body=doc_data)

    def search_documents(
        self, 
        user_id: int, 
        query: str, 
        filters: Optional[Dict[str, Any]] = None,
        page: int = 1,
        limit: int = 20
    ) -> Dict[str, Any]:
        """Search for documents"""
        # Base query to ensure user can only see their own documents
        must = [{"term": {"user_id": user_id}}]
        
        # Add text search if query is provided
        if query:
            must.append({
                "multi_match": {
                    "query": query,
                    "fields": ["title^3", "content", "tags^2", "ai_tags^2"],
                    "type": "best_fields",
                    "fuzziness": "AUTO"
                }
            })
        
        # Add filters if provided
        if filters:
            for key, value in filters.items():
                if key == "tags":
                    must.append({"terms": {"tags": value}})
                elif key == "file_type":
                    must.append({"term": {"file_type": value}})
                elif key == "is_archived":
                    must.append({"term": {"is_archived": value}})
        
        # Execute search
        response = self.es.search(
            index=self.index_name,
            body={
                "query": {
                    "bool": {
                        "must": must
                    }
                },
                "from": (page - 1) * limit,
                "size": limit,
                "sort": [{"_score": "desc"}, {"created_at": "desc"}]
            }
        )
        
        # Extract document IDs from search results
        doc_ids = [hit["_id"] for hit in response["hits"]["hits"]]
        
        return {
            "doc_ids": doc_ids,
            "total": response["hits"]["total"]["value"]
        }

    def delete_document(self, document_id: int):
        """Delete a document from the index"""
        try:
            self.es.delete(index=self.index_name, id=document_id)
            return True
        except:
            return False

# Create a singleton instance
es_service = ElasticsearchService() 