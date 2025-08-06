// API Types for DocuMentor Backend Integration
export interface AskRequest {
  question: string;
  source?: string;
  conversation_id?: string;
}

export interface AskResponse {
  answer: string;
  sources: string[];
  confidence: number;
  response_time: number;
  conversation_id: string;
}

export interface SearchRequest {
  query: string;
  source?: string;
  limit?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
}

export interface SearchResult {
  title: string;
  content: string;
  source: string;
  url?: string;
  relevance_score: number;
}

export interface UploadResponse {
  document_id: string;
  filename: string;
  status: 'processing' | 'completed' | 'failed';
  message: string;
}

export interface Source {
  id: string;
  name: string;
  description: string;
  document_count: number;
  last_updated: string;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  preview: string;
}

export interface FeedbackRequest {
  message_id: string;
  type: 'positive' | 'negative';
  comment?: string;
}

export interface ApiError {
  detail: string;
  status_code: number;
}