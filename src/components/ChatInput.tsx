import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlinePaperAirplane,
  HiOutlineMicrophone,
  HiOutlineStop
} from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask about documentation...",
  disabled = false
}: ChatInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      // Stop recording logic here
    } else {
      setIsRecording(true);
      // Start recording logic here
    }
  };

  const canSubmit = value.trim().length > 0 && !disabled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative bg-card border border-border rounded-lg transition-all duration-200",
        isFocused && "ring-2 ring-ring shadow-lg",
        disabled && "opacity-50"
      )}
    >
      <div className="flex items-end gap-2 p-3">
        {/* Text Input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className="chat-input resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[48px] max-h-32"
            rows={1}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          {/* Voice Input Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 flex-shrink-0"
                onClick={handleVoiceToggle}
                disabled={disabled}
              >
                <motion.div
                  animate={{ 
                    scale: isRecording ? [1, 1.2, 1] : 1,
                    rotate: isRecording ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: isRecording ? Infinity : 0 
                  }}
                >
                  {isRecording ? (
                    <HiOutlineStop className="h-4 w-4 text-destructive" />
                  ) : (
                    <HiOutlineMicrophone className="h-4 w-4" />
                  )}
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isRecording ? 'Stop recording' : 'Voice input'}
            </TooltipContent>
          </Tooltip>

          {/* Send Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: canSubmit ? 1.05 : 1 }}
                whileTap={{ scale: canSubmit ? 0.95 : 1 }}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={cn(
                    "send-button flex-shrink-0",
                    canSubmit && "shadow-lg"
                  )}
                >
                  <motion.div
                    animate={{ 
                      x: canSubmit ? [0, 2, 0] : 0 
                    }}
                    transition={{ 
                      duration: 0.5, 
                      repeat: canSubmit ? Infinity : 0,
                      repeatDelay: 2
                    }}
                  >
                    <HiOutlinePaperAirplane className="h-4 w-4" />
                  </motion.div>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              Send message (Ctrl+Enter)
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -top-12 left-0 right-0 bg-destructive/10 border border-destructive/20 rounded-lg p-2"
        >
          <div className="flex items-center justify-center gap-2 text-destructive">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-destructive rounded-full"
            />
            <span className="text-sm font-medium">Recording...</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}