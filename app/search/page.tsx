'use client';

// app/search/page.tsx - matches search-main/client/src/pages/Search.tsx
import React, { useEffect, useState } from 'react';
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

// Import our new service abstractions
import { getConversationStateManager, ConversationState } from '@/lib/services/conversation-service';
import { getSearchClient, SearchResult, FollowUpResult } from '@/lib/services/search-client';
import { getSettingsService } from '@/lib/services/settings-service';

// Create a client
const queryClient = new QueryClient();

// Wrap the actual search page with the QueryClientProvider
export default function SearchPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <React.Suspense fallback={<div className="p-4">Loading...</div>}>
        <SearchPageContent />
      </React.Suspense>
    </QueryClientProvider>
  );
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize our services
  const conversationManager = getConversationStateManager();
  const searchClient = getSearchClient();
  const settingsService = getSettingsService();

  // Extract query from URL, handling both initial load and subsequent navigation
  const getQueryFromUrl = () => {
    return searchParams.get('q') || '';
  };
  
  // Get current query
  const currentQuery = getQueryFromUrl();
  
  // Initialize state for search page
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentResults, setCurrentResults] = useState<any>(null);
  const [originalQuery, setOriginalQuery] = useState<string | null>(null);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [followUpQuery, setFollowUpQuery] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ChatHistoryEntry[]>([]);
  
  // Load state from conversation manager on initial render
  useEffect(() => {
    if (currentQuery) {
      const savedState = conversationManager.loadConversationState(currentQuery);
      if (savedState) {
        setSessionId(savedState.sessionId);
        setCurrentResults(savedState.currentResults);
        setOriginalQuery(savedState.originalQuery);
        setIsFollowUp(savedState.isFollowUp);
        setConversationHistory(savedState.conversationHistory);
        console.log('Loaded conversation state:', savedState);
      }
    }
  }, [currentQuery]);
  
  const [searchQuery, setSearchQuery] = useState(getQueryFromUrl);
  const [refetchCounter, setRefetchCounter] = useState(0);
  
  // Use React Query to handle search API calls
  const { data, isLoading, error } = useQuery({
    queryKey: ['search', searchQuery, refetchCounter],
    queryFn: async () => {
      // If searchQuery is empty, return early
      if (!searchQuery) return null;
      
      // Get the user's API key from settings service
      const userApiKey = settingsService.getApiKey();
      
      try {
        // Use search client service instead of direct fetch
        const result = await searchClient.search(searchQuery, userApiKey || undefined);
        console.log('Search API Response:', JSON.stringify(result, null, 2));
        
        // Store necessary state from search result
        if (result.sessionId) {
          setSessionId(result.sessionId);
          setOriginalQuery(searchQuery);
          
          // Store conversation history
          if (result.history && Array.isArray(result.history)) {
            console.log('Storing initial conversation history:', result.history);
            setConversationHistory(result.history);
          }
        }
        return result;
      } catch (error) {
        console.error('Search error:', error);
        throw error;
      }
    },
    enabled: !!searchQuery,
  });

  // Follow-up mutation using our search client service
  const followUpMutation = useMutation({
    mutationFn: async (followUpQuery: string) => {
      // Get the user's API key from settings service
      const userApiKey = settingsService.getApiKey();
      
      try {
        let result;
        
        // If no session exists, perform a new search
        if (!sessionId) {
          result = await searchClient.search(followUpQuery, userApiKey || undefined);
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
        } else {
          // Perform follow-up query with existing session
          result = await searchClient.followUp(
            sessionId, 
            followUpQuery, 
            conversationHistory,
            userApiKey || undefined
          );
          console.log('Follow-up API Response:', JSON.stringify(result, null, 2));
        }
        
        return result;
      } catch (error) {
        console.error('Follow-up error:', error);
        throw error;
      }
    },
    onSuccess: (result) => {
      setCurrentResults(result);
      setIsFollowUp(true);
      
      // Update conversation history with new entries
      if (result.newHistoryEntries && Array.isArray(result.newHistoryEntries)) {
        console.log('Adding new history entries:', result.newHistoryEntries);
        const entries: ChatHistoryEntry[] = result.newHistoryEntries;
        setConversationHistory(prev => [...prev, ...entries]);
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
      // Check if we have saved state for this query using conversation manager
      const savedState = conversationManager.loadConversationState(query);
      
      if (savedState) {
        // Load saved state
        setSessionId(savedState.sessionId);
        setCurrentResults(savedState.currentResults);
        setOriginalQuery(savedState.originalQuery);
        setIsFollowUp(savedState.isFollowUp);
        setConversationHistory(savedState.conversationHistory);
        setSearchQuery(query);
        console.log('Loaded conversation state for new query:', savedState);
      } else {
        // If no saved state, clear state
        setSessionId(null);
        setOriginalQuery(null);
        setIsFollowUp(false);
        setConversationHistory([]);
        setSearchQuery(query);
      }
    }
  }, [searchParams]);

  // Save state using conversation manager whenever it changes
  useEffect(() => {
    if (currentQuery && sessionId) {
      const conversationState: ConversationState = {
        sessionId,
        currentResults,
        originalQuery,
        isFollowUp,
        conversationHistory
      };
      
      conversationManager.saveConversationState(currentQuery, conversationState);
      console.log('Saved conversation state:', conversationState);
    }
  }, [sessionId, currentResults, originalQuery, isFollowUp, conversationHistory, currentQuery]);
  
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
