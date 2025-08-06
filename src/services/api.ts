// API Service for DocuMentor
const API_BASE_URL = 'http://localhost:8000';

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

class DocuMentorAPI {
  async ask(question: string, sourceFilter?: string): Promise<AskResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          source_filter: sourceFilter,
          k: 5,
          temperature: 0.1,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling ask API:', error);
      throw error;
    }
  }

  async search(query: string, k = 10, sourceFilter?: string): Promise<SearchResponse> {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        k,
        source_filter: sourceFilter,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  }

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  }

  async uploadDocument(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload error: ${response.status}`);
    }

    return await response.json();
  }

  // Stream API for real-time responses
  async askStream(
    question: string,
    sourceFilter: string | undefined,
    onChunk: (chunk: any) => void
  ) {
    const response = await fetch(`${API_BASE_URL}/stream-ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        source_filter: sourceFilter,
        k: 5,
        temperature: 0.1,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Stream error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            onChunk(data);
          } catch (e) {
            console.error('Error parsing SSE:', e);
          }
        }
      }
    }
  }
}

export const documenterAPI = new DocuMentorAPI();
export default documenterAPI;