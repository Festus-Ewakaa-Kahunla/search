import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, Loader2, Search, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FollowUpInputProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
}

export function FollowUpInput({ 
  onSubmit,
  isLoading = false,
}: FollowUpInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
      setQuery('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full fixed bottom-0 left-0 right-0 py-4 px-4 border-t border-accent/20 bg-background z-10">
      <div className="max-w-3xl mx-auto relative">
        <div className="relative group">
          <div className="absolute left-0 top-0 w-1 h-full bg-primary rounded-l-md"></div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question..."
            className={cn(
              "w-full pl-6 pr-14 py-5 text-lg rounded-md border-0",
              "bg-gradient-to-r from-card to-card/80",
              "focus:outline-none focus:ring-2 focus:ring-primary/40",
              "shadow-[0_0_15px_rgba(20,184,80,0.15)]",
              "group-hover:shadow-[0_0_20px_rgba(20,184,80,0.25)]",
              "text-white transition-all duration-300", 
              "backdrop-blur-sm"
            )}
            disabled={isLoading}
          />
          <div className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center
                          bg-gradient-to-l from-primary/20 to-transparent rounded-r-md">
            <button 
              onClick={handleSubmit}
              disabled={!query.trim() || isLoading}
              className="p-3 rounded-full hover:bg-primary/30 transition-all duration-300 
                          hover:scale-110 active:scale-95 disabled:opacity-40 disabled:hover:scale-100
                          disabled:hover:bg-transparent"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              ) : (
                <Search className="h-5 w-5 text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 