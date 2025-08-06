export interface Source {
  content: string;
  metadata: {
    source: string;
    title: string;
    url?: string;
    doc_type?: string;
  };
  score: number;
}

export interface AskResponse {
  answer: string;
  sources: Source[];
  response_time: number;
  confidence: number;
}

export interface SearchResponse {
  results: Source[];
  total_found: number;
  response_time: number;
}

export interface StatsResponse {
  total_documents?: number;
  sources?: string[];
  llm_model?: string;
  status?: string;
  [key: string]: any;
}

export interface UploadResponse {
  status: string;
  message: string;
  chunks_created?: number;
}