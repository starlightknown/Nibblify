# Nibblify API

A production-ready FastAPI application with authentication system.

## Features

- User registration and login
- JWT token authentication
- PostgreSQL database integration
- Password hashing with bcrypt
- SQLAlchemy ORM
- Pydantic models for request/response validation
- Environment-based configuration

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

5. Generate a secure secret key:
```bash
openssl rand -hex 32
```
Update the `SECRET_KEY` in your `.env` file with the generated value.

6. Run the application:
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

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- CORS middleware is enabled
- Environment variables for sensitive data
- SQL injection protection through SQLAlchemy
- Request validation using Pydantic models
