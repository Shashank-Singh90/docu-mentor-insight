import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlineCommandLine
} from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

const quickActions = [
  { id: 'new-chat', title: 'New Chat', description: 'Start a fresh conversation', icon: '💬', shortcut: 'N' },
  { id: 'clear-history', title: 'Clear History', description: 'Clear all conversation history', icon: '🗑️', shortcut: 'C' },
  { id: 'export-chat', title: 'Export Chat', description: 'Export current conversation', icon: '📤', shortcut: 'E' },
  { id: 'settings', title: 'Settings', description: 'Open application settings', icon: '⚙️', shortcut: 'S' },
  { id: 'docs', title: 'Documentation', description: 'View application help', icon: '📚', shortcut: 'D' },
];

const recentSearches = [
  'How to use LangChain with OpenAI',
  'FastAPI authentication setup',
  'React hooks best practices',
  'Django ORM relationships',
  'Node.js async patterns',
];

export function CommandPalette({ isOpen, onClose, onSearch }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredActions = quickActions.filter(action =>
    action.title.toLowerCase().includes(query.toLowerCase()) ||
    action.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredSearches = recentSearches.filter(search =>
    search.toLowerCase().includes(query.toLowerCase())
  );

  const allItems = [...filteredActions, ...filteredSearches.map(search => ({
    id: `search-${search}`,
    title: search,
    description: 'Recent search',
    icon: '🔍',
    shortcut: '',
    isSearch: true as const
  }))];

  type ItemType = typeof quickActions[0] | {
    id: string;
    title: string;
    description: string;
    icon: string;
    shortcut: string;
    isSearch: true;
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    setSelectedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, allItems.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          const selectedItem = allItems[selectedIndex] as ItemType;
          if (selectedItem) {
            if ('isSearch' in selectedItem && selectedItem.isSearch) {
              onSearch(selectedItem.title);
            } else {
              // Handle action
              console.log('Action:', selectedItem.id);
            }
            onClose();
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allItems, onSearch, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        
        {/* Command Palette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl glass-panel rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-4 p-6 border-b border-white/10">
            <HiOutlineCommandLine className="h-5 w-5 text-primary" />
            <div className="flex-1 relative">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-muted" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search actions, docs, or type a question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border-0 text-foreground placeholder:text-foreground-muted focus:outline-none"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <HiOutlineXMark className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <ScrollArea className="max-h-96">
            <div className="p-2">
              {/* Quick Actions */}
              {filteredActions.length > 0 && (
                <div className="mb-4">
                  <div className="px-4 py-2 text-xs font-semibold text-foreground-muted uppercase tracking-wide">
                    Quick Actions
                  </div>
                  {filteredActions.map((action, index) => {
                    const globalIndex = index;
                    return (
                      <motion.div
                        key={action.id}
                        className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                          selectedIndex === globalIndex
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-white/5'
                        }`}
                        onClick={() => {
                          console.log('Action:', action.id);
                          onClose();
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <span className="text-lg">{action.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{action.title}</div>
                          <div className="text-sm text-foreground-muted">{action.description}</div>
                        </div>
                        {action.shortcut && (
                          <Badge variant="outline" className="text-xs">
                            ⌘{action.shortcut}
                          </Badge>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Recent Searches */}
              {filteredSearches.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-foreground-muted uppercase tracking-wide">
                    Recent Searches
                  </div>
                  {filteredSearches.map((search, index) => {
                    const globalIndex = filteredActions.length + index;
                    return (
                      <motion.div
                        key={search}
                        className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                          selectedIndex === globalIndex
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-white/5'
                        }`}
                        onClick={() => {
                          onSearch(search);
                          onClose();
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <span className="text-lg">🔍</span>
                        <div className="flex-1">
                          <div className="font-medium">{search}</div>
                          <div className="text-sm text-foreground-muted">Recent search</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Empty State */}
              {allItems.length === 0 && (
                <div className="text-center py-12">
                  <HiOutlineMagnifyingGlass className="h-12 w-12 mx-auto text-foreground-muted mb-4" />
                  <div className="font-medium text-foreground-muted">No results found</div>
                  <div className="text-sm text-foreground-subtle">
                    Try searching for something else
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-white/10 px-6 py-3 bg-black/5">
            <div className="flex items-center justify-between text-xs text-foreground-muted">
              <div className="flex items-center gap-4">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>Esc Close</span>
              </div>
              <div>
                Press <Badge variant="outline" className="text-xs">⌘K</Badge> anytime
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}