# Nibblify API

A production-ready FastAPI application with authentication system and personal knowledge base.

## Features

### Authentication
- User registration and login
- JWT token authentication
- PostgreSQL database integration
- Password hashing with bcrypt
- SQLAlchemy ORM
- Pydantic models for request/response validation
- Environment-based configuration

### Knowledge Base
- Document management (create, read, update, delete)
- File uploads (PDF, text, etc.)
- AI-powered tagging using OpenAI
- Full-text search with Elasticsearch
- Manual and automatic tagging
- Document archiving

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy the environment file and update the variables:
```bash
cp .env.example .env
```

4. Set up PostgreSQL database and update the `.env` file with your database credentials.

5. Set up Elasticsearch:
   - Install Elasticsearch (https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html)
   - Start Elasticsearch service
   - Update `ELASTICSEARCH_URL` in `.env` if needed

6. Generate a secure secret key:
```bash
openssl rand -hex 32
```
Update the `SECRET_KEY` in your `.env` file with the generated value.

7. (Optional) Set up OpenAI API key for AI tagging:
   - Get an API key from OpenAI (https://platform.openai.com/api-keys)
   - Add it to your `.env` file as `OPENAI_API_KEY`

8. Run the application:
```bash
uvicorn app.main:app --reload
```

## API Documentation

Once the application is running, you can access:
- Swagger UI documentation: http://localhost:8000/docs
- ReDoc documentation: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/v1/login/access-token`: Login to get access token
- `POST /api/v1/register`: Register a new user

### Knowledge Base
- `POST /api/v1/knowledge/documents`: Create a new document
- `POST /api/v1/knowledge/documents/upload`: Upload a document file
- `GET /api/v1/knowledge/documents`: List all documents
- `GET /api/v1/knowledge/documents/{document_id}`: Get a specific document
- `PUT /api/v1/knowledge/documents/{document_id}`: Update a document
- `DELETE /api/v1/knowledge/documents/{document_id}`: Delete a document
- `POST /api/v1/knowledge/documents/search`: Search documents
- `POST /api/v1/knowledge/tags`: Create a new tag
- `GET /api/v1/knowledge/tags`: List all tags

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- CORS middleware is enabled
- Environment variables for sensitive data
- SQL injection protection through SQLAlchemy
- Request validation using Pydantic models
- File upload size limits
- User-specific data isolation

## Next Steps

### Frontend Development
- Create a Next.js application with Chakra UI
- Implement authentication flow
- Build document management interface
- Create search interface with filters
- Develop tag management UI

### Browser Extension
- Create a browser extension for quick saving
- Implement authentication in the extension
- Add context menu integration
- Build a popup interface for quick actions
