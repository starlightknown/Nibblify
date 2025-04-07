from typing import List, Dict, Any
import os
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from app.core.config import settings
from app.schemas.knowledge import AITagCreate

class AITaggingService:
    def __init__(self):
        self.model = ChatOpenAI(
            model_name="gpt-3.5-turbo",
            temperature=0.2,
            api_key=settings.OPENAI_API_KEY
        )
        
        self.tag_parser = PydanticOutputParser(pydantic_object=AITagCreate)
        
        self.tag_prompt = ChatPromptTemplate.from_messages([
            ("system", """
            You are an AI assistant that analyzes documents and suggests relevant tags.
            For each document, generate 3-5 relevant tags that describe its content, topic, and purpose.
            Each tag should be concise (1-3 words) and specific.
            
            {format_instructions}
            """),
            ("human", """
            Document Title: {title}
            Document Content: {content}
            
            Generate relevant tags for this document.
            """)
        ])
    
    def generate_tags(self, title: str, content: str) -> List[AITagCreate]:
        """Generate AI tags for a document"""
        if not settings.OPENAI_API_KEY:
            return []
            
        try:
            # Format the prompt with the document content
            prompt = self.tag_prompt.format_messages(
                title=title,
                content=content[:4000] if content else "",  # Limit content length
                format_instructions=self.tag_parser.get_format_instructions()
            )
            
            # Generate tags using the model
            response = self.model.invoke(prompt)
            
            # Parse the response into AITagCreate objects
            tags = self.tag_parser.parse(response.content)
            
            # If tags is a single tag, convert to list
            if isinstance(tags, AITagCreate):
                tags = [tags]
                
            return tags
        except Exception as e:
            print(f"Error generating AI tags: {e}")
            return []
    
    def extract_content_from_file(self, file_path: str) -> str:
        """Extract text content from a file based on its type"""
        file_ext = os.path.splitext(file_path)[1].lower()
        
        if file_ext == '.pdf':
            return self._extract_from_pdf(file_path)
        elif file_ext in ['.txt', '.md', '.html']:
            return self._extract_from_text(file_path)
        else:
            return ""
    
    def _extract_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF files"""
        try:
            from PyPDF2 import PdfReader
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            print(f"Error extracting PDF content: {e}")
            return ""
    
    def _extract_from_text(self, file_path: str) -> str:
        """Extract text from text-based files"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except Exception as e:
            print(f"Error extracting text content: {e}")
            return ""

# Create a singleton instance
ai_tagging_service = AITaggingService() 