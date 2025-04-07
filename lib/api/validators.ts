// lib/api/validators.ts
// Validation helpers to separate validation logic from API routes

import { NextResponse } from "next/server";

/**
 * Validates the search query parameters
 */
export function validateSearchParams(query: string | null, apiKey: string | null) {
  if (!query) {
    return {
      valid: false, 
      response: NextResponse.json({ message: "Query parameter 'q' is required" }, { status: 400 })
    };
  }

  if (!apiKey || apiKey.trim() === '') {
    return { 
      valid: false, 
      response: NextResponse.json({ 
        message: "API key is required to use this search function. Please provide your Gemini API key in settings." 
      }, { status: 400 }) 
    };
  }

  return { valid: true };
}

/**
 * Validates the follow-up request body
 */
export function validateFollowUpBody(
  sessionId: string | undefined, 
  query: string | undefined, 
  apiKey: string | undefined,
  history: any[] | undefined
) {
  if (!sessionId || !query) {
    return { 
      valid: false, 
      response: NextResponse.json({ 
        message: "SessionId and query are required" 
      }, { status: 400 }) 
    };
  }
  
  if (!apiKey || apiKey.trim() === '') {
    return { 
      valid: false, 
      response: NextResponse.json({ 
        message: "API key is required to use this search function. Please provide your Gemini API key in settings." 
      }, { status: 400 }) 
    };
  }
  
  if (!history || !Array.isArray(history) || history.length === 0) {
    return { 
      valid: false, 
      response: NextResponse.json({ 
        message: "Conversation history is required for follow-up questions" 
      }, { status: 400 }) 
    };
  }
  
  return { valid: true };
}
