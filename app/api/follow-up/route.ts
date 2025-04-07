// app/api/follow-up/route.ts
import { NextResponse } from "next/server";
import { ChatHistoryEntry } from "@/lib/types";
import { getAISearchService } from "@/lib/services/service-factory";
import { validateFollowUpBody } from "@/lib/api/validators";

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { sessionId, query, apiKey, history } = body;

    // Validate required parameters (SRP: moved validation to separate module)
    const validation = validateFollowUpBody(sessionId, query, apiKey, history);
    if (!validation.valid) {
      return validation.response;
    }

    // Get AI search service (DIP: using abstraction instead of direct implementation)
    const searchService = getAISearchService();
    
    // Perform follow-up query with our service layer
    const searchResponse = await searchService.followUp(query, history, apiKey);

    // Create new history entries for this exchange
    // Note: We don't need to include the full previous history here since
    // the client already has it - we just return the new entries to append
    const newHistoryEntries: ChatHistoryEntry[] = [
      { role: 'user', content: query },
      { role: 'assistant', content: searchResponse.text },
    ];

    // Return all necessary data for client-side storage update (OCP: standardized response structure)
    return NextResponse.json({
      sessionId,
      summary: searchResponse.formattedText,
      sources: searchResponse.sources,
      newHistoryEntries,
      raw: {
        // Include the raw AI responses for debugging or advanced use cases
        modelResponse: searchResponse.text,
      },
      metadata: {
        model: "gemini-2.0-flash-exp",
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error: any) {
    console.error("Follow-up error:", error);
    
    // Error handling with specific status codes based on error type
    if (error.message?.includes("API key")) {
      return NextResponse.json({ 
        message: "Invalid API key. Please check your settings and try again." 
      }, { status: 401 });
    }
    
    // For session-related errors
    if (error.message?.includes("session")) {
      return NextResponse.json({
        message: error.message || "Chat session not found or expired",
      }, { status: 404 });
    }
    
    return NextResponse.json({
      message: error.message || "An error occurred while processing your follow-up question",
    }, { status: 500 });
  }
}
