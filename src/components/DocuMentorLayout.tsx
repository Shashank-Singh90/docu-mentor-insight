import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DocuMentorSidebar } from './DocuMentorSidebar';
import { DocuMentorHeader } from './DocuMentorHeader';
import { ChatInterface } from './ChatInterface';
import { WelcomeScreen } from './WelcomeScreen';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sources?: string[];
  confidence?: number;
  responseTime?: number;
}

export interface DocuMentorLayoutProps {
  children?: React.ReactNode;
}

export function DocuMentorLayout({ children }: DocuMentorLayoutProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('documentor-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('documentor-theme', newDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: generateMockResponse(content),
        role: 'assistant',
        timestamp: new Date(),
        sources: ['LangChain Documentation', 'FastAPI Guide'],
        confidence: Math.floor(85 + Math.random() * 15),
        responseTime: 1.2 + Math.random() * 1.5,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (query: string): string => {
    const responses = [
      `Here's how to work with ${query.includes('LangChain') ? 'LangChain' : 'the API'}:\n\n\`\`\`python\nfrom langchain import LLMChain\nfrom langchain.llms import OpenAI\n\n# Initialize the LLM\nllm = OpenAI(temperature=0.7)\n\n# Create a chain\nchain = LLMChain(llm=llm, prompt=prompt)\nresult = chain.run(input_text="Your input here")\nprint(result)\n\`\`\`\n\nThis example demonstrates the basic usage pattern. The key concepts to understand are:\n\n1. **Chain Creation**: LangChain uses chains to connect different components\n2. **LLM Integration**: Various language models can be plugged in\n3. **Prompt Templates**: Structured prompts for consistent results\n\nWould you like me to explain any specific part in more detail?`,
      `For ${query.includes('FastAPI') ? 'FastAPI' : 'this framework'}, here's a complete example:\n\n\`\`\`python\nfrom fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\nfrom typing import List\n\napp = FastAPI(title="DocuMentor API")\n\nclass QueryModel(BaseModel):\n    question: str\n    source: str = "all"\n\n@app.post("/ask")\nasync def ask_question(query: QueryModel):\n    try:\n        # Process the question\n        response = await process_query(query.question)\n        return {\n            "answer": response,\n            "sources": ["Documentation"],\n            "confidence": 0.95\n        }\n    except Exception as e:\n        raise HTTPException(status_code=500, detail=str(e))\n\nif __name__ == "__main__":\n    import uvicorn\n    uvicorn.run(app, host="0.0.0.0", port=8000)\n\`\`\`\n\nKey features shown:\n- **Type Safety**: Pydantic models for request/response validation\n- **Async Support**: Non-blocking request handling\n- **Error Handling**: Proper HTTP exception handling\n- **Documentation**: Auto-generated API docs available at /docs`,
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const hasMessages = messages.length > 0;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DocuMentorSidebar
          selectedSource={selectedSource}
          onSourceChange={setSelectedSource}
          messages={messages}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <div className="flex-1 flex flex-col">
          <DocuMentorHeader
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          
          <main className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {hasMessages ? (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1"
                >
                  <ChatInterface
                    messages={messages}
                    isLoading={isLoading}
                    onSendMessage={handleSendMessage}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1"
                >
                  <WelcomeScreen onSendMessage={handleSendMessage} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}