from fastapi import APIRouter
from app.api.v1.endpoints import auth, knowledge

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(knowledge.router, prefix="/knowledge", tags=["knowledge"]) 