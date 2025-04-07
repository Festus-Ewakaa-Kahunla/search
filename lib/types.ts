// lib/types.ts
// Types for Gemini API responses

export interface WebSource {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: WebSource;
}

export interface TextSegment {
  startIndex: number;
  endIndex: number;
  text: string;
}

export interface GroundingSupport {
  segment: TextSegment;
  groundingChunkIndices: number[];
  confidenceScores: number[];
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
  groundingSupports: GroundingSupport[];
  searchEntryPoint?: any;
  webSearchQueries?: string[];
}

export interface ChatHistoryEntry {
  role: 'user' | 'assistant';
  content: string;
}

export interface SearchResult {
  sessionId: string;
  summary: string;
  sources: Source[];
  history?: ChatHistoryEntry[];
  newHistoryEntries?: ChatHistoryEntry[];
  raw?: {
    modelResponse: string;
  };
  metadata?: {
    model: string;
    timestamp: string;
  };
}

export interface Source {
  title: string;
  url: string;
  snippet: string;
}
