'use client';

// app/search/page.tsx - matches search-main/client/src/pages/Search.tsx
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchInput } from '@/components/SearchInput';
import { SearchResults } from '@/components/SearchResults';
import { FollowUpInput } from '@/components/FollowUpInput';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SourceList } from '@/components/SourceList';
import { ChatHistoryEntry } from '@/lib/types';

// Create a client
const queryClient = new QueryClient();

// Wrap the actual search page with the QueryClientProvider
export default function SearchPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchPageContent />
    </QueryClientProvider>
  );
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentResults, setCurrentResults] = useState<any>(null);
  const [originalQuery, setOriginalQuery] = useState<string | null>(null);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [followUpQuery, setFollowUpQuery] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ChatHistoryEntry[]>([]);
  
  // Extract query from URL, handling both initial load and subsequent navigation
  const getQueryFromUrl = () => {
    return searchParams.get('q') || '';
  };
  
  const [searchQuery, setSearchQuery] = useState(getQueryFromUrl);
  const [refetchCounter, setRefetchCounter] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', searchQuery, refetchCounter],
    queryFn: async () => {
      if (!searchQuery) return null;
      
      // Get the user's API key from localStorage if available
      const userApiKey = localStorage.getItem('geminiApiKey');
      
      // If no API key is found, show an error that prompts the user to set their API key
      if (!userApiKey) {
        throw new Error('API key is required to use this search function. Please provide your Gemini API key in settings.');
      }
      
      const apiKeyParam = userApiKey ? `&apiKey=${encodeURIComponent(userApiKey)}` : '';
      
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}${apiKeyParam}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Search failed');
      }
      const result = await response.json();
      console.log('Search API Response:', JSON.stringify(result, null, 2));
      if (result.sessionId) {
        setSessionId(result.sessionId);
        setCurrentResults(result);
        if (!originalQuery) {
          setOriginalQuery(searchQuery);
        }
        setIsFollowUp(false);
        
        // Store conversation history
        if (result.history && Array.isArray(result.history)) {
          console.log('Storing initial conversation history:', result.history);
          setConversationHistory(result.history);
        }
      }
      return result;
    },
    enabled: !!searchQuery,
  });

  // Follow-up mutation
  const followUpMutation = useMutation({
    mutationFn: async (followUpQuery: string) => {
      // Get the user's API key from localStorage if available
      const userApiKey = localStorage.getItem('geminiApiKey');
      
      if (!sessionId) {
        const apiKeyParam = userApiKey ? `&apiKey=${encodeURIComponent(userApiKey)}` : '';
        const response = await fetch(`/api/search?q=${encodeURIComponent(followUpQuery)}${apiKeyParam}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Search failed');
        }
        const result = await response.json();
        console.log('New Search API Response:', JSON.stringify(result, null, 2));
        if (result.sessionId) {
          setSessionId(result.sessionId);
          setOriginalQuery(searchQuery);
          setIsFollowUp(false);
          
          // Store conversation history for new search
          if (result.history && Array.isArray(result.history)) {
            console.log('Storing new conversation history:', result.history);
            setConversationHistory(result.history);
          }
        }
        return result;
      }

      const response = await fetch('/api/follow-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          query: followUpQuery,
          apiKey: userApiKey || undefined,
          history: conversationHistory, // Pass the full conversation history
        }),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          // Get the user's API key from localStorage if available for fallback
          const apiKeyParam = userApiKey ? `&apiKey=${encodeURIComponent(userApiKey)}` : '';
          
          const newResponse = await fetch(`/api/search?q=${encodeURIComponent(followUpQuery)}${apiKeyParam}`);
          if (!newResponse.ok) {
            const errorText = await newResponse.text();
            throw new Error(errorText || 'Search failed');
          }
          const result = await newResponse.json();
          console.log('Fallback Search API Response:', JSON.stringify(result, null, 2));
          if (result.sessionId) {
            setSessionId(result.sessionId);
            setOriginalQuery(searchQuery);
            setIsFollowUp(false);
          }
          return result;
        }
        throw new Error('Follow-up failed');
      }
      
      const result = await response.json();
      console.log('Follow-up API Response:', JSON.stringify(result, null, 2));
      return result;
    },
    onSuccess: (result) => {
      setCurrentResults(result);
      setIsFollowUp(true);
      
      // Update conversation history with new entries
      if (result.newHistoryEntries && Array.isArray(result.newHistoryEntries)) {
        console.log('Adding new history entries:', result.newHistoryEntries);
        setConversationHistory(prev => [...prev, ...result.newHistoryEntries]);
      }
    },
  });

  const handleSearch = async (newQuery: string) => {
    if (newQuery === searchQuery) {
      // If it's the same query, increment the refetch counter to trigger a new search
      setRefetchCounter(c => c + 1);
    } else {
      setSessionId(null); // Clear session on new search
      setOriginalQuery(null); // Clear original query
      setIsFollowUp(false); // Reset follow-up state
      setConversationHistory([]); // Clear conversation history for new search
      setSearchQuery(newQuery);
    }
    // Update URL without triggering a page reload
    const newUrl = `/search?q=${encodeURIComponent(newQuery)}`;
    window.history.pushState({}, '', newUrl);
  };

  const handleFollowUp = async (newFollowUpQuery: string) => {
    setFollowUpQuery(newFollowUpQuery);
    await followUpMutation.mutateAsync(newFollowUpQuery);
  };

  // Automatically start search when component mounts or URL changes
  useEffect(() => {
    const query = getQueryFromUrl();
    if (query && query !== searchQuery) {
      setSessionId(null); // Clear session on URL change
      setOriginalQuery(null); // Clear original query
      setIsFollowUp(false); // Reset follow-up state
      setConversationHistory([]); // Clear conversation history on URL change
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Use currentResults if available, otherwise fall back to data from useQuery
  const displayResults = currentResults || data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto p-4"
      >
        <motion.div 
          className="flex items-center gap-4 mb-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/')}
            className="hidden sm:flex"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="w-full max-w-6xl">
            <SearchInput
              onSearch={handleSearch}
              initialValue={searchQuery}
              isLoading={isLoading}
              autoFocus={false}
              large={true}
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={searchQuery}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-stretch pb-24"
          >
            <SearchResults
              query={isFollowUp ? (followUpQuery || '') : searchQuery}
              results={displayResults}
              isLoading={isLoading || followUpMutation.isPending}
              error={error || followUpMutation.error || undefined}
              isFollowUp={isFollowUp}
              originalQuery={originalQuery || ''}
            />

            {displayResults && !isLoading && !followUpMutation.isPending && (
              <FollowUpInput
                onSubmit={handleFollowUp}
                isLoading={followUpMutation.isPending}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
