// lib/services/conversation-service.ts
import { ChatHistoryEntry } from "@/lib/types";

/**
 * Conversation state interface
 * Following Interface Segregation Principle by defining clear domain models
 */
export interface ConversationState {
  sessionId: string | null;
  currentResults: any | null;
  originalQuery: string | null;
  isFollowUp: boolean;
  conversationHistory: ChatHistoryEntry[];
}

/**
 * Conversation service interface
 * Following Dependency Inversion Principle by defining abstractions
 */
export interface ConversationStateManager {
  saveConversationState(query: string, state: ConversationState): void;
  loadConversationState(query: string): ConversationState | null;
  clearConversationState(query: string): void;
  getAllConversations(): Record<string, ConversationState>;
}

/**
 * LocalStorage implementation of conversation state manager
 * Following Single Responsibility Principle by focusing only on conversation state management
 */
export class LocalStorageConversationManager implements ConversationStateManager {
  private readonly STORAGE_PREFIX = 'fsearch-conversation-';
  
  /**
   * Save conversation state to localStorage
   */
  saveConversationState(query: string, state: ConversationState): void {
    if (typeof window === 'undefined' || !query) return;
    
    try {
      const key = this.getStorageKey(query);
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving conversation state:', error);
    }
  }
  
  /**
   * Load conversation state from localStorage
   */
  loadConversationState(query: string): ConversationState | null {
    if (typeof window === 'undefined' || !query) return null;
    
    try {
      const key = this.getStorageKey(query);
      const savedState = localStorage.getItem(key);
      
      if (!savedState) return null;
      
      const parsedState = JSON.parse(savedState) as ConversationState;
      return parsedState;
    } catch (error) {
      console.error('Error loading conversation state:', error);
      return null;
    }
  }
  
  /**
   * Clear conversation state from localStorage
   */
  clearConversationState(query: string): void {
    if (typeof window === 'undefined' || !query) return;
    
    const key = this.getStorageKey(query);
    localStorage.removeItem(key);
  }
  
  /**
   * Get all saved conversations
   */
  getAllConversations(): Record<string, ConversationState> {
    if (typeof window === 'undefined') return {};
    
    const conversations: Record<string, ConversationState> = {};
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.STORAGE_PREFIX)) {
          const query = key.substring(this.STORAGE_PREFIX.length);
          const stateJson = localStorage.getItem(key);
          if (stateJson) {
            conversations[query] = JSON.parse(stateJson);
          }
        }
      }
    } catch (error) {
      console.error('Error retrieving all conversations:', error);
    }
    
    return conversations;
  }
  
  /**
   * Helper method to get the storage key for a query
   */
  private getStorageKey(query: string): string {
    return `${this.STORAGE_PREFIX}${query}`;
  }
}

/**
 * Get the default conversation state manager
 * Following the Factory pattern for Service Location
 */
export function getConversationStateManager(): ConversationStateManager {
  return new LocalStorageConversationManager();
}
