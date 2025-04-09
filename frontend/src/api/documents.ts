import client from './client';
import { Document, CreateDocumentInput, UpdateDocumentInput, SearchResult } from '../types/document';

const documentsApi = {
  getAll: async (): Promise<Document[]> => {
    const response = await client.get<Document[]>('/knowledge/documents');
    return response.data;
  },

  getById: async (id: number | string): Promise<Document> => {
    const response = await client.get<Document>(`/knowledge/documents/${id}`);
    return response.data;
  },

  create: async (data: CreateDocumentInput): Promise<Document> => {
    const response = await client.post<Document>('/knowledge/documents', data);
    return response.data;
  },

  update: async (id: number | string, data: UpdateDocumentInput): Promise<Document> => {
    const response = await client.put<Document>(`/knowledge/documents/${id}`, data);
    return response.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await client.delete(`/knowledge/documents/${id}`);
  },

  search: async (query: string, filters?: Record<string, any>, page: number = 1, limit: number = 20): Promise<SearchResult> => {
    const response = await client.post<SearchResult>('/knowledge/documents/search', {
      query,
      filters,
      page,
      limit
    });
    return response.data;
  },

  upload: async (formData: FormData): Promise<Document> => {
    const response = await client.post<Document>('/knowledge/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default documentsApi; 