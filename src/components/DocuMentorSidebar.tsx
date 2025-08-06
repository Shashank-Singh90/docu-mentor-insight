import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineDocumentText,
  HiOutlineStar,
  HiOutlineClock,
  HiOutlineCloudArrowUp,
  HiOutlineFunnel,
  HiOutlineChevronDown,
  HiOutlineChevronRight
} from 'react-icons/hi2';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Message } from './DocuMentorLayout';

interface DocuMentorSidebarProps {
  selectedSource: string;
  onSourceChange: (source: string) => void;
  messages: Message[];
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const documentationSources = [
  { id: 'all', name: 'All Sources', icon: HiOutlineFunnel, count: 0 },
  { id: 'langchain', name: 'LangChain', icon: HiOutlineDocumentText, count: 1250 },
  { id: 'fastapi', name: 'FastAPI', icon: HiOutlineDocumentText, count: 890 },
  { id: 'react', name: 'React', icon: HiOutlineDocumentText, count: 2100 },
  { id: 'django', name: 'Django', icon: HiOutlineDocumentText, count: 1500 },
  { id: 'nodejs', name: 'Node.js', icon: HiOutlineDocumentText, count: 980 },
  { id: 'python', name: 'Python', icon: HiOutlineDocumentText, count: 3200 },
  { id: 'uploaded', name: 'Uploaded Docs', icon: HiOutlineCloudArrowUp, count: 15 },
];

const recentConversations = [
  { id: '1', title: 'LangChain Chain Setup', timestamp: '2 hours ago', preview: 'How to create a basic LangChain...' },
  { id: '2', title: 'FastAPI Authentication', timestamp: 'Yesterday', preview: 'Setting up JWT authentication...' },
  { id: '3', title: 'React Hooks Best Practices', timestamp: '2 days ago', preview: 'When to use useCallback vs...' },
  { id: '4', title: 'Django Model Relationships', timestamp: '1 week ago', preview: 'ForeignKey vs ManyToMany...' },
];

export function DocuMentorSidebar({
  selectedSource,
  onSourceChange,
  messages,
  collapsed,
}: DocuMentorSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    sources: true,
    history: true,
    starred: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Sidebar className={cn(
      "border-r border-sidebar-border bg-sidebar transition-all duration-300",
      collapsed ? "w-16" : "w-80"
    )}>
      <SidebarContent className="flex flex-col">
        {/* Documentation Sources */}
        <SidebarGroup>
          <SidebarGroupLabel 
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => toggleSection('sources')}
          >
            <span className="flex items-center gap-2">
              <HiOutlineDocumentText className="h-4 w-4" />
              {!collapsed && "Documentation Sources"}
            </span>
            {!collapsed && (
              <motion.div
                animate={{ rotate: expandedSections.sources ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <HiOutlineChevronDown className="h-4 w-4" />
              </motion.div>
            )}
          </SidebarGroupLabel>
          
          <AnimatePresence>
            {(expandedSections.sources || collapsed) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SidebarGroupContent>
                  <SidebarMenu>
                    {documentationSources.map((source) => (
                      <SidebarMenuItem key={source.id}>
                        <SidebarMenuButton
                          onClick={() => onSourceChange(source.id)}
                          className={cn(
                            "sidebar-item justify-between",
                            selectedSource === source.id && "active"
                          )}
                          tooltip={collapsed ? source.name : undefined}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <source.icon className="h-4 w-4 flex-shrink-0" />
                            {!collapsed && (
                              <span className="truncate">{source.name}</span>
                            )}
                          </div>
                          {!collapsed && source.count > 0 && (
                            <Badge variant="secondary" className="ml-2 flex-shrink-0">
                              {source.count}
                            </Badge>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </motion.div>
            )}
          </AnimatePresence>
        </SidebarGroup>

        {!collapsed && (
          <>
            <Separator className="my-2" />

            {/* Recent Conversations */}
            <SidebarGroup>
              <SidebarGroupLabel 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('history')}
              >
              <span className="flex items-center gap-2">
                <HiOutlineClock className="h-4 w-4" />
                Recent Conversations
              </span>
                <motion.div
                  animate={{ rotate: expandedSections.history ? 0 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <HiOutlineChevronDown className="h-4 w-4" />
                </motion.div>
              </SidebarGroupLabel>
              
              <AnimatePresence>
                {expandedSections.history && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SidebarGroupContent>
                      <ScrollArea className="h-48">
                        <div className="space-y-1">
                          {recentConversations.map((conversation) => (
                            <motion.div
                              key={conversation.id}
                              whileHover={{ scale: 1.01 }}
                              className="p-3 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors"
                            >
                              <h4 className="text-sm font-medium truncate">
                                {conversation.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {conversation.timestamp}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                {conversation.preview}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </SidebarGroupContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </SidebarGroup>

            <Separator className="my-2" />

            {/* Starred Responses */}
            <SidebarGroup>
              <SidebarGroupLabel 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('starred')}
              >
                <span className="flex items-center gap-2">
                  <HiOutlineStar className="h-4 w-4" />
                  Starred Responses
                </span>
                <motion.div
                  animate={{ rotate: expandedSections.starred ? 0 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <HiOutlineChevronDown className="h-4 w-4" />
                </motion.div>
              </SidebarGroupLabel>
              
              <AnimatePresence>
                {expandedSections.starred && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SidebarGroupContent>
                      <div className="p-4 text-center text-muted-foreground">
                        <HiOutlineStar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No starred responses yet</p>
                        <p className="text-xs mt-1">Star helpful responses to save them here</p>
                      </div>
                    </SidebarGroupContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </SidebarGroup>

            {/* Upload Document Button */}
            <div className="mt-auto p-4">
              <Button className="w-full" variant="outline">
                <HiOutlineCloudArrowUp className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </div>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}