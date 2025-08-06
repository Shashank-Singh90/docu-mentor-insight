import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  HiOutlineClipboard,
  HiOutlineClipboardDocumentCheck,
  HiOutlineHandThumbUp,
  HiOutlineHandThumbDown,
  HiOutlineShare,
  HiOutlineStar,
  HiOutlineUser
} from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Message } from './DocuMentorLayout';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copiedCode, setCopiedCode] = useState<string>('');
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [isStarred, setIsStarred] = useState(false);
  const { toast } = useToast();
  const messageRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = async (code: string, language: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(`${language}-${Date.now()}`);
      toast({
        title: "Code copied!",
        description: `${language} code copied to clipboard`,
      });
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    toast({
      title: "Feedback submitted",
      description: `Thanks for your ${type === 'up' ? 'positive' : 'constructive'} feedback!`,
    });
  };

  const handleStar = () => {
    setIsStarred(!isStarred);
    toast({
      title: isStarred ? "Response unstarred" : "Response starred",
      description: isStarred ? "Removed from starred responses" : "Saved to starred responses",
    });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast({
        title: "Message copied",
        description: "Message content copied to clipboard for sharing",
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Failed to copy message content",
        variant: "destructive",
      });
    }
  };

  const isUser = message.role === 'user';
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <motion.div
      ref={messageRef}
      className={cn(
        "flex gap-4 group",
        isUser ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
          <span className="text-sm">🧠</span>
        </div>
      )}

      {/* Message Content */}
      <div className={cn(
        "message-bubble group/message",
        isUser ? "message-user" : "message-ai"
      )}>
        {/* Message Text */}
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown
            components={{
              code({ inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match?.[1] || 'text';
                const codeString = String(children).replace(/\n$/, '');
                const copyId = `${language}-${Date.now()}`;

                if (!inline) {
                  return (
                    <div className="code-block group/code">
                      <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b">
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                          {language}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="copy-button"
                          onClick={() => copyToClipboard(codeString, language)}
                        >
                          {copiedCode === copyId ? (
                            <HiOutlineClipboardDocumentCheck className="h-4 w-4 text-success" />
                          ) : (
                            <HiOutlineClipboard className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <SyntaxHighlighter
                        style={isDarkMode ? oneDark as any : oneLight as any}
                        language={language}
                        PreTag="div"
                        className="!mt-0 !mb-0"
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  );
                }

                return (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Message Footer (AI messages only) */}
        {!isUser && (
          <div className="mt-4 space-y-3">
            {/* Sources */}
            {message.sources && message.sources.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {message.sources.map((source, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {source}
                  </Badge>
                ))}
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                {message.confidence && (
                  <span className="flex items-center gap-1">
                    Confidence: {message.confidence}%
                  </span>
                )}
                {message.responseTime && (
                  <span className="flex items-center gap-1">
                    {message.responseTime.toFixed(1)}s
                  </span>
                )}
                <span>{message.timestamp.toLocaleTimeString()}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleFeedback('up')}
                    >
                      <HiOutlineHandThumbUp 
                        className={cn(
                          "h-3 w-3",
                          feedback === 'up' && "text-success fill-current"
                        )} 
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Helpful response</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleFeedback('down')}
                    >
                      <HiOutlineHandThumbDown 
                        className={cn(
                          "h-3 w-3",
                          feedback === 'down' && "text-destructive fill-current"
                        )} 
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Not helpful</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={handleStar}
                    >
                      <HiOutlineStar 
                        className={cn(
                          "h-3 w-3",
                          isStarred && "text-warning fill-current"
                        )} 
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Star response</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={handleShare}
                    >
                      <HiOutlineShare className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share response</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
          <HiOutlineUser className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
}