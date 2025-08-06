import type { 
  AskRequest, 
  AskResponse, 
  SearchRequest, 
  SearchResponse,
  UploadResponse,
  Source,
  Conversation,
  FeedbackRequest,
  ApiError 
} from '@/types/api';

const API_BASE_URL = 'http://localhost:8000';

class DocuMentorApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'DocuMentorApiError';
  }
}

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorMessage = `Request failed: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // If we can't parse error JSON, use the default message
      }
      
      throw new DocuMentorApiError(errorMessage, response.status, response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof DocuMentorApiError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new DocuMentorApiError(
        'Network error: Unable to connect to the server. Please check your connection and try again.',
        0,
        'Network Error'
      );
    }
    
    throw new DocuMentorApiError(
      'An unexpected error occurred. Please try again.',
      500,
      'Unknown Error'
    );
  }
}

// API Methods
export const api = {
  // Ask a question to the AI
  async ask(request: AskRequest): Promise<AskResponse> {
    return apiRequest<AskResponse>('/ask', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  // Search documentation
  async search(request: SearchRequest): Promise<SearchResponse> {
    const params = new URLSearchParams({
      query: request.query,
      ...(request.source && { source: request.source }),
      ...(request.limit && { limit: request.limit.toString() }),
    });

    return apiRequest<SearchResponse>(`/search?${params}`);
  },

  // Upload a document
  async uploadDocument(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest<UploadResponse>('/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  // Get available sources
  async getSources(): Promise<Source[]> {
    return apiRequest<Source[]>('/sources');
  },

  // Get conversation history
  async getHistory(): Promise<Conversation[]> {
    return apiRequest<Conversation[]>('/history');
  },

  // Submit feedback
  async submitFeedback(request: FeedbackRequest): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/feedback', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  // Get conversation by ID
  async getConversation(conversationId: string): Promise<Conversation> {
    return apiRequest<Conversation>(`/conversations/${conversationId}`);
  },

  // Delete conversation
  async deleteConversation(conversationId: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/conversations/${conversationId}`, {
      method: 'DELETE',
    });
  },

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return apiRequest<{ status: string; timestamp: string }>('/health');
  },
};

// Export the ApiError class for error handling
export { DocuMentorApiError as ApiError };

// Utility function to check if error is an API error
export function isApiError(error: unknown): error is DocuMentorApiError {
  return error instanceof DocuMentorApiError;
}