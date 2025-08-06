import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { api, isApiError } from '@/lib/api';
import type { AskRequest } from '@/types/api';
import { DocuMentorSidebar } from './DocuMentorSidebar';
import { DocuMentorHeader } from './DocuMentorHeader';
import { ChatInterface } from './ChatInterface';
import { WelcomeScreen } from './WelcomeScreen';
import { AnimatedBackground } from './AnimatedBackground';
import { CommandPalette } from './CommandPalette';

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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const { toast } = useToast();

  // Initialize dark mode and keyboard shortcuts
  useEffect(() => {
    const savedTheme = localStorage.getItem('documentor-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);

    // Global keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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
      const startTime = Date.now();
      
      // Prepare API request
      const request: AskRequest = {
        question: content,
        source: selectedSource !== 'all' ? selectedSource : undefined,
        conversation_id: conversationId || undefined,
      };

      // Make API call to backend
      const response = await api.ask(request);
      const endTime = Date.now();
      
      // Update conversation ID if it's a new conversation
      if (!conversationId && response.conversation_id) {
        setConversationId(response.conversation_id);
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: response.answer,
        role: 'assistant',
        timestamp: new Date(),
        sources: response.sources,
        confidence: Math.round(response.confidence * 100), // Convert to percentage
        responseTime: (endTime - startTime) / 1000, // Convert to seconds
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Show success toast for first message
      if (messages.length === 0) {
        toast({
          title: "🎉 Welcome to DocuMentor!",
          description: "Your AI documentation assistant is ready to help.",
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorMessage = 'Failed to get response from AI assistant.';
      
      if (isApiError(error)) {
        errorMessage = error.message;
      }

      // Show error message in chat
      const errorResponse: Message = {
        id: `error-${Date.now()}`,
        content: `❌ **Error**: ${errorMessage}\n\nPlease try again or check your connection.`,
        role: 'assistant',
        timestamp: new Date(),
        sources: [],
        confidence: 0,
      };

      setMessages(prev => [...prev, errorResponse]);

      // Show error toast
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommandPaletteSearch = (query: string) => {
    handleSendMessage(query);
  };

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onSearch={handleCommandPaletteSearch}
      />

      <SidebarProvider>
        <div className="min-h-screen flex w-full relative">
          <DocuMentorSidebar
            selectedSource={selectedSource}
            onSourceChange={setSelectedSource}
            messages={messages}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          
          <div className="flex-1 flex flex-col glass-panel">
            <DocuMentorHeader
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
              onOpenCommandPalette={() => setShowCommandPalette(true)}
            />
            
            <main className="flex-1 flex flex-col relative">
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
    </>
  );
}