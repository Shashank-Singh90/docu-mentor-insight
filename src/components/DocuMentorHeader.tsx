import { motion } from 'framer-motion';
import { 
  HiOutlineMoon, 
  HiOutlineSun, 
  HiOutlineCog6Tooth,
  HiOutlineUser,
  HiOutlineBars3
} from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocuMentorHeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleSidebar: () => void;
  onOpenCommandPalette: () => void;
}

export function DocuMentorHeader({ 
  isDarkMode, 
  onToggleDarkMode,
  onToggleSidebar,
  onOpenCommandPalette
}: DocuMentorHeaderProps) {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 border-b border-white/10 glass-panel backdrop-blur-md sticky top-0 z-40"
    >
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left side - Logo and nav trigger */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-center w-10 h-10 gradient-primary rounded-xl shadow-glow">
              <span className="text-xl">🧠</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">DocuMentor</h1>
              <p className="text-xs text-foreground-muted">AI Documentation Assistant</p>
            </div>
          </motion.div>

          {/* Search shortcut hint */}
          <motion.button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-2 px-4 py-2 glass-button rounded-xl text-sm text-foreground-muted hover:text-foreground transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Search or ask anything...</span>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs">⌘</kbd>
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs">K</kbd>
            </div>
          </motion.button>
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            className="w-9 h-9"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDarkMode ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isDarkMode ? (
                <HiOutlineSun className="h-4 w-4" />
              ) : (
                <HiOutlineMoon className="h-4 w-4" />
              )}
            </motion.div>
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="w-9 h-9">
            <HiOutlineCog6Tooth className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-9 h-9">
                <HiOutlineUser className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <HiOutlineUser className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HiOutlineCog6Tooth className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}