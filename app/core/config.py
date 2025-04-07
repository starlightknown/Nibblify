from typing import Any, Dict, Optional, List
from pydantic import PostgresDsn, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Nibblify"
    
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "nibblify"
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    # Elasticsearch settings
    ELASTICSEARCH_URL: Optional[str] = None
    ELASTICSEARCH_HOST: str = "localhost"
    ELASTICSEARCH_PORT: int = 9200
    ELASTICSEARCH_USERNAME: Optional[str] = None
    ELASTICSEARCH_PASSWORD: Optional[str] = None

    # OpenAI settings
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-3.5-turbo"

    # JWT Settings
    SECRET_KEY: str = "your-secret-key-here"  # Change this in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    # File Upload Settings
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB

    # First superuser
    FIRST_SUPERUSER: str = "admin@example.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin123"

    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost", "http://localhost:8080", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        db_name = values.get("POSTGRES_DB", "")
        return f"postgresql://{values.get('POSTGRES_USER')}:{values.get('POSTGRES_PASSWORD')}@{values.get('POSTGRES_SERVER')}/{db_name}"

    @validator("ELASTICSEARCH_HOST", pre=True)
    def parse_elasticsearch_host(cls, v: Any, values: Dict[str, Any]) -> Any:
        if "ELASTICSEARCH_URL" in values and values["ELASTICSEARCH_URL"]:
            from urllib.parse import urlparse
            url = urlparse(values["ELASTICSEARCH_URL"])
            return url.hostname
        return v

    @validator("ELASTICSEARCH_PORT", pre=True)
    def parse_elasticsearch_port(cls, v: Any, values: Dict[str, Any]) -> Any:
        if "ELASTICSEARCH_URL" in values and values["ELASTICSEARCH_URL"]:
            from urllib.parse import urlparse
            url = urlparse(values["ELASTICSEARCH_URL"])
            return url.port or 9200
        return v

settings = Settings() 