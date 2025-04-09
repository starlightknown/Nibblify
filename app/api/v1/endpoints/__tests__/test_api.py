import requests
import json
import os
from typing import Dict, Any, Optional

# API base URL
BASE_URL = "http://localhost:8000/api/v1"

# Superuser credentials (from app/core/config.py)
SUPERUSER = {
    "email": "admin@example.com",
    "password": "admin123"
}

# Test document data
TEST_DOCUMENT = {
    "title": "Test Document",
    "content": "This is a test document content for API testing.",
    "is_archived": False
}

# Test document update data
TEST_DOCUMENT_UPDATE = {
    "title": "Updated Test Document",
    "content": "This is the updated content of the test document."
}

# Test search query
TEST_SEARCH_QUERY = {
    "query": "test",
    "filters": {},
    "page": 1,
    "limit": 10
}

def get_token() -> str:
    """Get authentication token for the superuser."""
    response = requests.post(
        f"{BASE_URL}/login/access-token",
        data={"username": SUPERUSER["email"], "password": SUPERUSER["password"]}
    )
    if response.status_code != 200:
        print(f"Failed to get token: {response.text}")
        return ""
    
    return response.json()["access_token"]

def test_create_document(token: str) -> Optional[Dict[str, Any]]:
    """Test creating a document."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{BASE_URL}/knowledge/documents",
        json=TEST_DOCUMENT,
        headers=headers
    )
    
    if response.status_code != 200:
        print(f"Failed to create document: {response.text}")
        return None
    
    print("✅ Document created successfully")
    return response.json()

def test_get_documents(token: str) -> bool:
    """Test getting all documents."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        f"{BASE_URL}/knowledge/documents",
        headers=headers
    )
    
    if response.status_code != 200:
        print(f"Failed to get documents: {response.text}")
        return False
    
    documents = response.json()
    print(f"✅ Retrieved {len(documents)} documents")
    return True

def test_get_document(token: str, document_id: int) -> bool:
    """Test getting a specific document."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        f"{BASE_URL}/knowledge/documents/{document_id}",
        headers=headers
    )
    
    if response.status_code != 200:
        print(f"Failed to get document: {response.text}")
        return False
    
    print(f"✅ Retrieved document with ID {document_id}")
    return True

def test_update_document(token: str, document_id: int) -> bool:
    """Test updating a document."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.put(
        f"{BASE_URL}/knowledge/documents/{document_id}",
        json=TEST_DOCUMENT_UPDATE,
        headers=headers
    )
    
    if response.status_code != 200:
        print(f"Failed to update document: {response.text}")
        return False
    
    print(f"✅ Updated document with ID {document_id}")
    return True

def test_search_documents(token: str) -> bool:
    """Test searching documents."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{BASE_URL}/knowledge/documents/search",
        json=TEST_SEARCH_QUERY,
        headers=headers
    )
    
    if response.status_code != 200:
        print(f"Failed to search documents: {response.text}")
        return False
    
    result = response.json()
    print(f"✅ Searched documents, found {len(result.get('documents', []))} results")
    return True

def test_delete_document(token: str, document_id: int) -> bool:
    """Test deleting a document."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.delete(
        f"{BASE_URL}/knowledge/documents/{document_id}",
        headers=headers
    )
    
    if response.status_code != 200:
        print(f"Failed to delete document: {response.text}")
        return False
    
    print(f"✅ Deleted document with ID {document_id}")
    return True

def main():
    """Run all API tests."""
    print("Starting API tests...")
    
    # Get authentication token
    token = get_token()
    if not token:
        print("❌ Failed to get authentication token. Exiting.")
        return
    
    print("✅ Authentication successful")
    
    # Test document operations
    document = test_create_document(token)
    if not document:
        print("❌ Failed to create test document. Exiting.")
        return
    
    document_id = document["id"]
    
    # Test getting all documents
    test_get_documents(token)
    
    # Test getting specific document
    test_get_document(token, document_id)
    
    # Test updating document
    test_update_document(token, document_id)
    
    # Test searching documents
    test_search_documents(token)
    
    # Test deleting document
    test_delete_document(token, document_id)
    
    print("✅ All API tests completed successfully")

if __name__ == "__main__":
    main() 