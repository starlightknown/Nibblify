import axios from 'axios';

export interface Document {
  id: string;
  title: string;
  content: string;
  file_path?: string;
  file_type?: string;
  created_at: string;
  updated_at?: string;
  user_id?: number;
  is_archived?: boolean;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const documentsApi = {
  getAll: async (): Promise<Document[]> => {
    const response = await axios.get(`${API_URL}/documents`);
    return response.data;
  },

  getById: async (id: string): Promise<Document> => {
    const response = await axios.get(`${API_URL}/documents/${id}`);
    return response.data;
  },

  create: async (document: Omit<Document, 'id' | 'created_at' | 'updated_at'>): Promise<Document> => {
    const response = await axios.post(`${API_URL}/documents`, document);
    return response.data;
  },

  update: async (id: string, document: Partial<Document>): Promise<Document> => {
    const response = await axios.put(`${API_URL}/documents/${id}`, document);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/documents/${id}`);
  },
}; 