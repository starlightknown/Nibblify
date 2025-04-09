export interface Document {
  id: number;
  title: string;
  content: string;
  file_path?: string;
  file_type?: string;
  url?: string;
  created_at: string;
  updated_at?: string;
  user_id: number;
  is_archived: boolean;
}

export interface CreateDocumentInput {
  title: string;
  content: string;
  file_path?: string;
  file_type?: string;
  url?: string;
  is_archived?: boolean;
}

export interface UpdateDocumentInput {
  title?: string;
  content?: string;
  file_path?: string;
  file_type?: string;
  url?: string;
  is_archived?: boolean;
}

export interface SearchResult {
  documents: Document[];
  total: number;
  page: number;
  limit: number;
} 