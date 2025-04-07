'use client';
// components/ChatContainer.tsx
import { useState, useRef, FormEvent } from 'react';
import { useLocalChatSessions } from '@/hooks/useLocalChatSessions';

interface ChatSource {
  title: string;
  url: string;
  snippet: string;
}

const ChatContainer = () => {
  const {
    sessions,
    createSession,
    addMessageToSession,
  } = useLocalChatSessions();
  
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Find active session from stored sessions
  const activeSession = sessions.find(session => session.sessionId === activeSessionId);
  
  // Scroll to bottom of chat when new messages arrive
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle initial search
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !apiKey.trim()) {
      setError('Please enter both a search query and API key');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&apiKey=${encodeURIComponent(apiKey)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to search');
      }
      
      // Store session in localStorage via our hook
      createSession(data.sessionId, query, data.summary, data.sources);
      setActiveSessionId(data.sessionId);
      setQuery('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100); // Scroll after content renders
    }
  };

  // Handle follow-up queries
  const handleFollowUp = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !activeSessionId) {
      setError('Please enter a follow-up question');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the active session's history to send to the API
      const session = sessions.find(s => s.sessionId === activeSessionId);
      if (!session) {
        throw new Error('Session not found');
      }
      
      const response = await fetch('/api/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSessionId,
          query,
          apiKey,
          history: session.history
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get a response');
      }
      
      // Update session in localStorage via our hook
      addMessageToSession(activeSessionId, query, data.summary, data.sources);
      setQuery('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100); // Scroll after content renders
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* API Key Input */}
      <div className="p-4 border-b">
        <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
          Gemini API Key
        </label>
        <input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeSession ? (
          <div className="space-y-4">
            {activeSession.history.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-blue-100 ml-auto max-w-[80%]' 
                    : 'bg-gray-100 mr-auto max-w-[80%]'
                }`}
              >
                {msg.role === 'user' ? (
                  <p>{msg.content}</p>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="p-3 bg-gray-100 rounded-lg max-w-[80%] animate-pulse">
                Thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <h2 className="text-xl mb-2">Welcome to FSearch</h2>
              <p>Enter a search query and your Gemini API key to get started</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Sources Section */}
      {activeSession?.sources && activeSession.sources.length > 0 && (
        <div className="p-4 border-t max-h-[200px] overflow-y-auto">
          <h3 className="font-bold mb-2">Sources</h3>
          <div className="space-y-2">
            {activeSession.sources.map((source: ChatSource, i) => (
              <div key={i} className="p-2 border rounded">
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {source.title}
                </a>
                {source.snippet && (
                  <p className="text-sm text-gray-600 mt-1">{source.snippet}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Input Area */}
      <form 
        onSubmit={activeSessionId ? handleFollowUp : handleSearch}
        className="p-4 border-t"
      >
        {error && (
          <div className="p-2 mb-2 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={activeSessionId ? "Ask a follow-up question..." : "Search with Gemini..."}
            className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : activeSessionId ? 'Send' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatContainer;
