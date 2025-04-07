import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  initialValue?: string;
  autoFocus?: boolean;
  large?: boolean;
}

export function SearchInput({ 
  onSearch, 
  isLoading = false,
  initialValue = '',
  autoFocus = false,
  large = false,
}: SearchInputProps) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = () => {
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full">
      <div className="group relative flex items-center justify-between" data-search-container>
        <h1 className={cn(
          "text-lg font-medium text-white font-inter tracking-tight",
          large && "text-3xl font-semibold",
          isLoading && "text-white/50"
        )}>
          {query || "Search"}
        </h1>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            onClick={() => {
              // If we're not loading, enter edit mode
              if (!isLoading) {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = query;
                input.className = 'bg-background text-white p-2 rounded-md outline-none border border-primary/50 w-full';
                input.onkeydown = (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (input.value.trim()) {
                      setQuery(input.value.trim());
                      onSearch(input.value.trim());
                    }
                    (document.activeElement as HTMLElement)?.blur();
                  } else if (e.key === 'Escape') {
                    (document.activeElement as HTMLElement)?.blur();
                  }
                };
                
                // Replace the current element with input
                const container = document.querySelector('[data-search-container]');
                if (container) {
                  container.innerHTML = '';
                  container.appendChild(input);
                  input.focus();
                }
              }
            }}
            disabled={isLoading}
            className="p-1 rounded-md hover:bg-primary/20 transition-all duration-200"
            aria-label="Edit search"
            title="Edit search"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Edit2 className="h-4 w-4 text-primary" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}