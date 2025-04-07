import { Card } from '@/components/ui/card';
import { ExternalLink, Link2, ChevronDown, ChevronUp, Globe, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from 'react';

interface Source {
  title: string;
  url: string;
  snippet: string;
}

interface SourceListProps {
  sources: Source[];
}

export function SourceList({ sources }: SourceListProps) {
  const [activeTab, setActiveTab] = useState<'default' | 'sources'>('default');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Only show 3 sources initially in vertical list unless expanded
  const visibleSources = isExpanded ? sources : sources.slice(0, Math.min(3, sources.length));
  const hasMoreSources = sources.length > 3;

  // Helper function to get domain favicon
  const getFaviconUrl = (url: string) => {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };

  // Format hostname for display
  const formatHostname = (url: string) => {
    return new URL(url).hostname.replace('www.', '');
  };

  return (
    <div className="animate-in fade-in-50">
      {/* Tab navigation */}
      <div className="border-b border-gray-800 mb-6 flex">
        <button
          onClick={() => setActiveTab('default')}
          className={`py-2 px-4 flex items-center gap-2 text-sm transition-colors ${activeTab === 'default' ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
          aria-current={activeTab === 'default' ? 'page' : undefined}
        >
          <Search className="h-4 w-4" />
          Search
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`py-2 px-4 flex items-center gap-2 text-sm transition-colors relative ${activeTab === 'sources' ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
          aria-current={activeTab === 'sources' ? 'page' : undefined}
        >
          <Link2 className="h-4 w-4" />
          Sources
          <div className="flex items-center justify-center rounded-full h-5 w-5 bg-gray-800 ml-1">
            <span className="text-xs text-primary font-medium">{sources.length}</span>
          </div>
        </button>
      </div>

      {/* Horizontal scrolling cards (always visible) */}
      {activeTab === 'default' && (
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <motion.div 
            className="flex space-x-3 pb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, staggerChildren: 0.1 }}
          >
            {sources.map((source, index) => (
              <motion.div
                key={`card-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="shrink-0"
              >
                <div 
                  className="w-[280px] group overflow-hidden transition-all cursor-pointer rounded-md border border-gray-800 hover:border-primary/50 relative"
                  onClick={() => window.open(source.url, '_blank')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
                  
                  <div className="p-4 relative z-10">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-inter font-medium text-sm text-white line-clamp-1 mb-1 tracking-tight">
                          {source.title.replace(/\*\*/g, '')}
                        </h3>

                        {source.snippet && (
                          <p className="font-inter text-sm text-gray-400 line-clamp-2 mb-2">
                            {source.snippet.replace(/\*\*/g, '')}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="truncate max-w-[200px]">
                            {formatHostname(source.url)}
                          </span>
                        </div>
                      </div>

                      <ExternalLink className="h-4 w-4 flex-shrink-0 text-primary 
                        opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
      
      {/* Vertical numbered list (only visible when Sources tab is active) */}
      {activeTab === 'sources' && (
        <div className="space-y-2">
          {visibleSources.map((source, index) => (
            <motion.div
              key={`list-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group"
            >
              <div 
                onClick={() => window.open(source.url, '_blank')}
                className="flex items-start gap-3 p-3 rounded-md cursor-pointer hover:bg-card/50 transition-colors"
              >
                {/* Number indicator */}
                <div className="text-base font-medium text-gray-500 mt-0.5 min-w-[20px]">
                  {index + 1}
                </div>
                
                {/* Source icon/logo */}
                <div className="flex-shrink-0 w-7 h-7 rounded-md overflow-hidden bg-gray-800 flex items-center justify-center">
                  <img 
                    src={getFaviconUrl(source.url)} 
                    alt="" 
                    className="w-4 h-4"
                    onError={(e) => {
                      // Fallback to Globe icon if favicon fails to load
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallbackIcon = document.createElement('span');
                        parent.appendChild(fallbackIcon);
                        // This would be cleaner with actual React components, but this is a quick solution
                        fallbackIcon.outerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
                      }
                    }}
                  />
                </div>
                
                {/* Source content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    {/* Domain name */}
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      {formatHostname(source.url)}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-inter font-medium text-sm text-white leading-tight tracking-tight">
                    {source.title.replace(/\*\*/g, '')}
                  </h3>
                  
                  {/* Snippet */}
                  {source.snippet && (
                    <p className="font-inter text-sm text-gray-400 mt-1 leading-snug line-clamp-2">
                      {source.snippet.replace(/\*\*/g, '')}
                    </p>
                  )}
                </div>
                
                {/* External link icon */}
                <ExternalLink className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-1 ml-2" />
              </div>
            </motion.div>
          ))}
          
          {/* Show more/less button for when there are more than 3 sources */}
          {hasMoreSources && (
            <div 
              className="text-center mt-2 py-2 cursor-pointer border-t border-gray-800"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span className="text-sm text-primary hover:text-primary/80 font-medium flex items-center justify-center">
                {isExpanded ? "Show less" : `Show ${sources.length - 3} more sources`}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 ml-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-1" />
                )}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}