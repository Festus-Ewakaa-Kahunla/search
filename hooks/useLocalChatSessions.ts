// hooks/useLocalChatSessions.ts
import { useState, useEffect } from 'react';

// Define the types for our chat data
interface ChatSession {
  sessionId: string;
  query: string;
  summary: string;
  sources: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  createdAt: number;
}

const STORAGE_KEY = 'fsearch_chat_sessions';

export function useLocalChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  
  // Load sessions from localStorage on component mount
  useEffect(() => {
    const storedSessions = localStorage.getItem(STORAGE_KEY);
    if (storedSessions) {
      try {
        setSessions(JSON.parse(storedSessions));
      } catch (error) {
        console.error('Failed to parse stored sessions:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  // Create a new session
  const createSession = (
    sessionId: string,
    query: string,
    summary: string,
    sources: Array<{ title: string; url: string; snippet: string }>
  ): ChatSession => {
    const newSession: ChatSession = {
      sessionId,
      query,
      summary,
      sources,
      history: [
        { role: 'user', content: query },
        { role: 'assistant', content: summary },
      ],
      createdAt: Date.now(),
    };
    
    setSessions((prevSessions) => [newSession, ...prevSessions]);
    return newSession;
  };

  // Add a follow-up message to an existing session
  const addMessageToSession = (
    sessionId: string,
    query: string,
    summary: string,
    sources: Array<{ title: string; url: string; snippet: string }>
  ): ChatSession | null => {
    let updatedSession: ChatSession | null = null;
    
    setSessions((prevSessions) => {
      const updatedSessions = prevSessions.map((session) => {
        if (session.sessionId === sessionId) {
          updatedSession = {
            ...session,
            summary,
            sources,
            history: [
              ...session.history,
              { role: 'user', content: query },
              { role: 'assistant', content: summary },
            ],
          };
          return updatedSession;
        }
        return session;
      });
      
      return updatedSessions;
    });
    
    return updatedSession;
  };

  // Get a specific session by ID
  const getSession = (sessionId: string): ChatSession | undefined => {
    return sessions.find((session) => session.sessionId === sessionId);
  };

  // Delete a session
  const deleteSession = (sessionId: string): void => {
    setSessions((prevSessions) => 
      prevSessions.filter((session) => session.sessionId !== sessionId)
    );
  };

  // Clear all sessions
  const clearAllSessions = (): void => {
    setSessions([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    sessions,
    createSession,
    addMessageToSession,
    getSession,
    deleteSession,
    clearAllSessions,
  };
}
