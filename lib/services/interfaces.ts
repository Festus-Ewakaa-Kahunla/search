// lib/services/interfaces.ts
// Defining interfaces for service abstractions following Interface Segregation and Dependency Inversion principles

import { GroundingMetadata, Source, ChatHistoryEntry } from '../types';

/**
 * Represents a search response from any AI service
 */
export interface AISearchResponse {
  text: string;
  formattedText: string;
  sources: Source[];
  metadata?: GroundingMetadata;
  rawResponse?: any;
}

/**
 * Interface for any AI service that can perform searches
 */
export interface AISearchService {
  search(query: string, apiKey: string): Promise<AISearchResponse>;
  followUp(
    query: string, 
    history: ChatHistoryEntry[], 
    apiKey: string
  ): Promise<AISearchResponse>;
}

/**
 * Interface for extracting sources from AI responses
 */
export interface SourceExtractor {
  extractSources(metadata: any): Source[];
}

/**
 * Interface for formatting AI responses
 */
export interface ResponseFormatter {
  formatToMarkdown(text: string): Promise<string>;
}
