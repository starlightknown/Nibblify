import client from './client';

export interface Document {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateDocumentInput {
  title: string;
  content: string;
}

export interface UpdateDocumentInput {
  title?: string;
  content?: string;
}

const documentsApi = {
  getAll: async (): Promise<Document[]> => {
    const response = await client.get<Document[]>('/knowledge/documents');
    return response.data;
  },

  getById: async (id: string): Promise<Document> => {
    const response = await client.get<Document>(`/knowledge/documents/${id}`);
    return response.data;
  },

  create: async (data: CreateDocumentInput): Promise<Document> => {
    const response = await client.post<Document>('/knowledge/documents', data);
    return response.data;
  },

  update: async (id: string, data: UpdateDocumentInput): Promise<Document> => {
    const response = await client.put<Document>(`/knowledge/documents/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/knowledge/documents/${id}`);
  },

  search: async (query: string): Promise<Document[]> => {
    const response = await client.get<Document[]>(`/knowledge/documents/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
};

export default documentsApi; 