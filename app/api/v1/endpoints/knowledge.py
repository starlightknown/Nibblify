from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
import os
import uuid
from app.core.config import settings
from PyPDF2 import PdfReader
import io

router = APIRouter()

# Document endpoints
@router.post("/documents", response_model=schemas.Document)
def create_document(
    *,
    db: Session = Depends(deps.get_db),
    document_in: schemas.DocumentCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new document.
    """
    document = crud.document.create_with_user(
        db=db, obj_in=document_in, user_id=current_user.id
    )
    return document

@router.post("/documents/upload", response_model=schemas.Document)
async def upload_document(
    *,
    db: Session = Depends(deps.get_db),
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload and create a document from a PDF file.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Create upload directory if it doesn't exist
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    try:
        # Save the file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Extract text from PDF
        pdf_reader = PdfReader(io.BytesIO(content))
        text_content = ""
        for page in pdf_reader.pages:
            text_content += page.extract_text() + "\n"
        
        # Create document
        document_in = schemas.DocumentCreate(
            title=os.path.splitext(file.filename)[0],
            content=text_content,
            file_path=file_path,
            file_type="pdf",
            is_archived=False
        )
        
        document = crud.document.create_with_user(
            db=db, obj_in=document_in, user_id=current_user.id
        )
        return document
        
    except Exception as e:
        # Clean up file if something goes wrong
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@router.get("/documents", response_model=List[schemas.Document])
def read_documents(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve documents.
    """
    documents = crud.document.get_multi_by_user(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )
    return documents

@router.get("/documents/{document_id}", response_model=schemas.Document)
def read_document(
    *,
    db: Session = Depends(deps.get_db),
    document_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get document by ID.
    """
    document = crud.document.get(db=db, id=document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    if document.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return document

@router.put("/documents/{document_id}", response_model=schemas.Document)
def update_document(
    *,
    db: Session = Depends(deps.get_db),
    document_id: int,
    document_in: schemas.DocumentUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a document.
    """
    document = crud.document.get(db=db, id=document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    if document.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    document = crud.document.update_with_user(
        db=db, db_obj=document, obj_in=document_in
    )
    return document

@router.delete("/documents/{document_id}", response_model=schemas.Document)
def delete_document(
    *,
    db: Session = Depends(deps.get_db),
    document_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a document.
    """
    document = crud.document.get(db=db, id=document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    if document.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    document = crud.document.remove_with_user(db=db, id=document_id, user_id=current_user.id)
    return document

@router.post("/documents/search", response_model=schemas.SearchResult)
def search_documents(
    *,
    db: Session = Depends(deps.get_db),
    query: schemas.SearchQuery,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Search documents.
    """
    result = crud.document.search(
        db=db,
        user_id=current_user.id,
        query=query.query,
        filters=query.filters,
        page=query.page,
        limit=query.limit
    )
    return result 