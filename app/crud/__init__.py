from app.crud.crud_user import user
from app.crud.crud_knowledge import document, tag

# Export all CRUD operations
__all__ = ["user", "document", "tag"]

# This file is intentionally left empty to make the directory a Python package 