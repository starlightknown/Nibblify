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
- Full-text search with Elasticsearch
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

### Browser Extension
- Create a browser extension for quick saving
- Implement authentication in the extension
- Add context menu integration
- Build a popup interface for quick actions

# Nibblify Setup Guide

## Prerequisites

- Python 3.9+
- PostgreSQL 14+
- Node.js and npm (for frontend)
- Elasticsearch 8.x

## Initial Setup

### 1. Database Setup

PostgreSQL needs to be installed and running. On macOS:

```bash
# Install PostgreSQL (if not already installed)
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Create postgres superuser (if not exists)
createuser -s postgres

# Create database (if not exists)
createdb -U postgres nibblify
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following configuration:

```env
# Database settings
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=nibblify

# Elasticsearch settings
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_HOST=localhost
ELASTICSEARCH_PORT=9200

# JWT Settings
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=11520

# First superuser
FIRST_SUPERUSER=admin@example.com
FIRST_SUPERUSER_PASSWORD=admin123

# CORS settings
BACKEND_CORS_ORIGINS=["http://localhost","http://localhost:8080","http://localhost:3000"]
```

### 3. Elasticsearch Setup

1. Install and start Elasticsearch:
```bash
# Install Elasticsearch
brew install elasticsearch

# Start Elasticsearch service
brew services start elasticsearch
```

2. Verify Elasticsearch is running:
```bash
curl http://localhost:9200
```

3. If you get SSL/HTTPS errors, modify elasticsearch.yml:
```yaml
xpack.security.enabled: false
xpack.security.http.ssl.enabled: false
```

### 4. Backend Setup

1. Initialize the database:
```bash
# Initialize database schema and create initial superuser
python3 -c "from app.db.init_db import init_db; from app.db.session import SessionLocal; init_db(SessionLocal())"
```

2. Start the FastAPI backend:
```bash
uvicorn app.main:app --reload
```

### 5. Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

## Common Issues and Troubleshooting

### 1. Database Connection Issues

If you see errors like "role 'postgres' does not exist":
```bash
# Create the postgres superuser
createuser -s postgres
```

If database connection fails:
- Verify PostgreSQL is running: `brew services list | grep postgresql`
- Check database exists: `psql -U postgres -l`
- Verify credentials in .env match your PostgreSQL setup

### 2. Elasticsearch Issues

If you get SSL/HTTPS errors:
1. Stop Elasticsearch: `brew services stop elasticsearch`
2. Edit `/usr/local/etc/elasticsearch/elasticsearch.yml`
3. Add or modify:
   ```yaml
   xpack.security.enabled: false
   xpack.security.http.ssl.enabled: false
   ```
4. Start Elasticsearch: `brew services start elasticsearch`

### 3. Authentication Issues

If you get 500 errors during login:
1. Verify database is initialized
2. Check if tables are created: `psql -U postgres nibblify -c "\dt"`
3. Verify superuser exists in database
4. Default superuser credentials:
   - Email: admin@example.com
   - Password: admin123

### 4. CORS Issues

If you get CORS errors:
1. Verify BACKEND_CORS_ORIGINS in .env includes your frontend URL
2. Check if frontend is making requests to correct backend URL
3. Verify API_V1_STR prefix is being used correctly

## API Documentation

Once the server is running, you can access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development Tips

1. Use the logging endpoints for debugging
2. Check both frontend console and backend logs for errors
3. Use the Swagger UI to test API endpoints directly
4. Monitor Elasticsearch logs for indexing issues

## Security Notes

For production deployment:
1. Change default superuser credentials
2. Use strong SECRET_KEY
3. Configure proper SSL/TLS
4. Set up proper authentication for Elasticsearch
5. Configure proper CORS settings
6. Use environment-specific .env files
