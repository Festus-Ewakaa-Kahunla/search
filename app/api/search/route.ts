// app/api/search/route.ts
import { NextResponse } from "next/server";
import { ChatHistoryEntry } from "@/lib/types";
import { getAISearchService } from "@/lib/services/service-factory";
import { validateSearchParams } from "@/lib/api/validators";

export async function GET(request: Request) {
  // Extract query parameters
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const apiKey = searchParams.get("apiKey");

  // Validate required parameters (SRP: moved validation to separate module)
  const validation = validateSearchParams(query, apiKey);
  if (!validation.valid) {
    return validation.response;
  }

  try {
    // Get AI search service (DIP: using abstraction instead of direct implementation)
    const searchService = getAISearchService();
    
    // Perform search (simplified with our service layer)
    const searchResponse = await searchService.search(query!, apiKey!);
    
    // Generate a unique session ID
    const sessionId = Math.random().toString(36).substring(7);
    
    // Create a history array for this conversation
    const history: ChatHistoryEntry[] = [
      { role: 'user', content: query! },
      { role: 'assistant', content: searchResponse.text },
    ];

    // Return all necessary data for client-side storage (OCP: standardized response structure)
    return NextResponse.json({
      sessionId,
      query,
      summary: searchResponse.formattedText,
      sources: searchResponse.sources,
      history,
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
    console.error("Search error:", error);
    
    // Error handling with specific status codes based on error type
    if (error.message?.includes("API key")) {
      return NextResponse.json({ 
        message: "Invalid API key. Please check your settings and try again." 
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      message: error.message || "An error occurred while processing your search" 
    }, { status: 500 });
  }
}
