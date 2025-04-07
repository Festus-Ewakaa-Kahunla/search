// lib/services/search-client.ts
import { ChatHistoryEntry, Source } from "@/lib/types";

/**
 * Search result interface
 * Following Interface Segregation Principle by defining clear domain models
 */
export interface SearchResult {
  sessionId: string;
  summary: string;
  sources: Source[];
  history?: ChatHistoryEntry[];
  newHistoryEntries?: ChatHistoryEntry[];
  raw?: any;
  metadata?: {
    model: string;
    timestamp: string;
  };
}

/**
 * Follow-up result interface
 */
export interface FollowUpResult extends SearchResult {
  newHistoryEntries: ChatHistoryEntry[];
}

/**
 * Search client interface
 * Following Dependency Inversion Principle by defining abstractions
 */
export interface SearchClient {
  search(query: string, apiKey?: string): Promise<SearchResult>;
  followUp(
    sessionId: string, 
    query: string, 
    history: ChatHistoryEntry[], 
    apiKey?: string
  ): Promise<FollowUpResult>;
}

/**
 * Fetch-based implementation of search client
 * Following Single Responsibility Principle by focusing only on API communication
 */
export class FetchSearchClient implements SearchClient {
  /**
   * Perform a search query against the API
   */
  async search(query: string, apiKey?: string): Promise<SearchResult> {
    // Build API URL with query and optional API key
    const apiKeyParam = apiKey ? `&apiKey=${encodeURIComponent(apiKey)}` : '';
    const url = `/api/search?q=${encodeURIComponent(query)}${apiKeyParam}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Search failed');
    }
    
    const result = await response.json();
    return result;
  }
  
  /**
   * Perform a follow-up query against the API
   */
  async followUp(
    sessionId: string, 
    query: string, 
    history: ChatHistoryEntry[], 
    apiKey?: string
  ): Promise<FollowUpResult> {
    const response = await fetch('/api/follow-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        query,
        apiKey,
        history,
      }),
    });
    
    if (!response.ok) {
      // If session not found, fallback to a new search
      if (response.status === 404) {
        const result = await this.search(query, apiKey);
        // Convert SearchResult to FollowUpResult format
        return {
          ...result,
          newHistoryEntries: result.history || [],
        };
      }
      
      const errorText = await response.text();
      throw new Error(errorText || 'Follow-up failed');
    }
    
    const result = await response.json();
    return result;
  }
}

/**
 * Get the default search client
 * Following the Factory pattern for Service Location
 */
export function getSearchClient(): SearchClient {
  return new FetchSearchClient();
}
