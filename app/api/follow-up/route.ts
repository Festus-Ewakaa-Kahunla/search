// app/api/follow-up/route.ts
import { NextResponse } from "next/server";
import { getGeminiModel, formatResponseToMarkdown } from "@/lib/gemini";
import { GroundingMetadata, ChatHistoryEntry, Source } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, query, apiKey, history } = body;

    if (!sessionId || !query || !apiKey) {
      return NextResponse.json({ 
        message: "SessionId, query, and apiKey are all required" 
      }, { status: 400 });
    }

    // Validate API key was provided
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json({ 
        message: "API key is required to use this search function. Please provide your Gemini API key in settings." 
      }, { status: 400 });
    }
    
    // Re-initialize the model with the same API key
    const model = getGeminiModel(apiKey);
    
    // Validate that we have conversation history
    if (!history || !Array.isArray(history) || history.length === 0) {
      return NextResponse.json({ 
        message: "Conversation history is required for follow-up questions" 
      }, { status: 400 });
    }

    console.log('Using history for context:', JSON.stringify(history, null, 2));
    
    // Create a new chat session with the previous conversation history
    const chat = model.startChat({
      tools: [
        {
          // @ts-ignore - google_search is a valid tool but not typed in the SDK yet
          google_search: {},
        },
      ],
      // Format history entries to match Gemini API expectations
      // Gemini API expects "model" for assistant messages
      history: history.map((entry: ChatHistoryEntry) => ({
        role: entry.role === 'assistant' ? 'model' : entry.role,
        parts: [{ text: entry.content }]
      })),
    });
    
    // Send the follow-up message
    const result = await chat.sendMessage(query);
    const response = await result.response;
    const text = response.text();
    const formattedText = await formatResponseToMarkdown(text);

    // Extract sources from grounding metadata
    const sourceMap = new Map<string, Source>();
    const metadata = response.candidates?.[0]?.groundingMetadata as unknown as GroundingMetadata;
    if (metadata) {
      const chunks = metadata.groundingChunks || [];
      const supports = metadata.groundingSupports || [];
      chunks.forEach((chunk: any, index: number) => {
        if (chunk.web?.uri && chunk.web?.title) {
          const url = chunk.web.uri;
          if (!sourceMap.has(url)) {
            const snippets = supports
              .filter((support: any) =>
                support.groundingChunkIndices.includes(index)
              )
              .map((support: any) => support.segment.text)
              .join(" ");
            sourceMap.set(url, {
              title: chunk.web.title,
              url,
              snippet: snippets || "",
            });
          }
        }
      });
    }
    const sources = Array.from(sourceMap.values());

    // Create new history entries for this exchange
    // Note: We don't need to include the full previous history here since
    // the client already has it - we just return the new entries to append
    const newHistoryEntries: ChatHistoryEntry[] = [
      { role: 'user', content: query },
      { role: 'assistant', content: text },
    ];

    // Return all necessary data for client-side storage update
    return NextResponse.json({
      sessionId,
      summary: formattedText,
      sources,
      newHistoryEntries,
      raw: {
        // Include the raw AI responses for debugging or advanced use cases
        modelResponse: text,
      },
      metadata: {
        model: "gemini-2.0-flash-exp",
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error: any) {
    console.error("Follow-up error:", error);
    if (error.message?.includes("API key")) {
      return NextResponse.json({ message: "Invalid API key. Please check your settings and try again." }, { status: 401 });
    }
    return NextResponse.json({
      message: error.message || "An error occurred while processing your follow-up question",
    }, { status: 500 });
  }
}
