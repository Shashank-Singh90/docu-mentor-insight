import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineSparkles,
  HiOutlineDocumentText,
  HiOutlineLightBulb,
  HiOutlineCommandLine,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowRight
} from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import { ChatInput } from './ChatInput';

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void;
}

const sampleQuestions = [
  {
    icon: HiOutlineCommandLine,
    category: "LangChain",
    question: "How do I create a basic LangChain chain with OpenAI?",
    description: "Learn the fundamentals of setting up LangChain chains"
  },
  {
    icon: HiOutlineSparkles,
    category: "FastAPI",
    question: "What's the best way to handle authentication in FastAPI?",
    description: "Implement secure JWT authentication patterns"
  },
  {
    icon: HiOutlineLightBulb,
    category: "React",
    question: "When should I use useCallback vs useMemo?",
    description: "Optimize performance with the right React hooks"
  },
  {
    icon: HiOutlineDocumentText,
    category: "Django",
    question: "How do I set up database relationships in Django?",
    description: "Master ForeignKey and ManyToMany relationships"
  },
];

const features = [
  {
    icon: HiOutlineMagnifyingGlass,
    title: "Instant Search",
    description: "Get answers from thousands of documentation pages in seconds"
  },
  {
    icon: HiOutlineCommandLine,
    title: "Code Examples",
    description: "Receive working code snippets with detailed explanations"
  },
  {
    icon: HiOutlineSparkles,
    title: "Source Citations",
    description: "Every answer includes links to original documentation"
  },
  {
    icon: HiOutlineLightBulb,
    title: "Smart Suggestions",
    description: "Get related questions and follow-up recommendations"
  },
];

export function WelcomeScreen({ onSendMessage }: WelcomeScreenProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSampleQuestion = (question: string) => {
    setInputValue(question);
    setTimeout(() => onSendMessage(question), 100);
  };

  const handleSubmit = (message: string) => {
    onSendMessage(message);
  };

  return (
    <div className="flex-1 bg-gradient-chat flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center"
                >
                  <span className="text-3xl">🧠</span>
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-2 bg-gradient-primary rounded-full opacity-20 blur-md"
                />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-4">
              Welcome to <span className="gradient-text">DocuMentor</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your AI-powered documentation assistant. Get instant answers from LangChain, FastAPI, React, 
              Django, and more with intelligent search and code examples.
            </p>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 text-center"
                >
                  <feature.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Sample Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-center mb-6">
              Try asking about...
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {sampleQuestions.map((sample, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 cursor-pointer group"
                  onClick={() => handleSampleQuestion(sample.question)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <sample.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-primary">{sample.category}</span>
                        <HiOutlineArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <h3 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                        {sample.question}
                      </h3>
                      <p className="text-xs text-muted-foreground">{sample.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="border-t border-border bg-card/50 backdrop-blur-sm p-6"
      >
        <div className="max-w-4xl mx-auto">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            placeholder="Ask about LangChain, FastAPI, React, Django, or any other documentation..."
            disabled={false}
          />
          <p className="text-xs text-muted-foreground text-center mt-3">
            Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd> + <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> to send
          </p>
        </div>
      </motion.div>
    </div>
  );
}