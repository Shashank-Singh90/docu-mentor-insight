import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { DocuMentorHeader } from './DocuMentorHeader';
import { DocuMentorSidebar } from './DocuMentorSidebar';
import { ChatInterface } from './ChatInterface';
import { WelcomeScreen } from './WelcomeScreen';
import { CommandPalette } from './CommandPalette';
import { documenterAPI } from '../services/api';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sources?: any[];
  confidence?: number;
  responseTime?: number;
}

export function DocuMentorLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedSource, setSelectedSource] = useState<string | undefined>(undefined);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toast } = useToast();

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Theme management
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the backend API
      const response = await documenterAPI.ask(content, selectedSource);
      
      // Add AI response
      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: response.answer,
        role: 'assistant',
        timestamp: new Date(),
        sources: response.sources,
        confidence: response.confidence,
        responseTime: response.response_time,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Show success toast for first message
      if (messages.length === 0) {
        toast({
          title: "Connected to DocuMentor!",
          description: `Response received in ${response.response_time.toFixed(2)}s`,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: 'Sorry, I encountered an error while processing your request. Please make sure the backend server is running on http://localhost:8000',
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Show error toast
      toast({
        title: "Connection Error",
        description: "Failed to connect to the backend. Please check if the API server is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "All messages have been removed",
    });
  };

  const handleSourceChange = (source: string | undefined) => {
    setSelectedSource(source);
    if (source) {
      toast({
        title: "Source filter applied",
        description: `Showing results from ${source}`,
      });
    } else {
      toast({
        title: "Source filter removed",
        description: "Showing results from all sources",
      });
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const result = await documenterAPI.uploadDocument(file);
      toast({
        title: "Document uploaded",
        description: `${file.name} has been processed successfully`,
      });
      return result;
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Command Palette */}
      <CommandPalette
        open={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
        onSendMessage={handleSendMessage}
      />

      {/* Sidebar */}
      <DocuMentorSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        selectedSource={selectedSource}
        onSourceChange={handleSourceChange}
        onClearChat={handleClearChat}
        onFileUpload={handleFileUpload}
        messagesCount={messages.length}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DocuMentorHeader
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        />

        {/* Chat Area */}
        <motion.main
          className="flex-1 overflow-hidden"
          animate={{
            marginLeft: isSidebarOpen ? 0 : -240,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {messages.length === 0 ? (
            <WelcomeScreen onSendMessage={handleSendMessage} />
          ) : (
            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
            />
          )}
        </motion.main>
      </div>
    </div>
  );
}