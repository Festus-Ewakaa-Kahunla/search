// app/api/search/route.ts
import { NextResponse } from "next/server";
import { getGeminiModel, formatResponseToMarkdown } from "@/lib/gemini";
import { GroundingMetadata, ChatHistoryEntry, Source } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const apiKey = searchParams.get("apiKey");

  if (!query) {
    return NextResponse.json({ message: "Query parameter 'q' is required" }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ message: "API key is required to use this search function. Please provide your Gemini API key in settings." }, { status: 400 });
  }

  try {
    // Validate API key was provided
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json({ message: "API key is required to use this search function. Please provide your Gemini API key in settings." }, { status: 400 });
    }
    
    // Initialize Gemini model with provided API key
    const model = getGeminiModel(apiKey);
    
    // Create a new chat session with search capabilities
    const chat = model.startChat({
      tools: [
        {
          // @ts-ignore - google_search is a valid tool but not typed in the SDK yet
          google_search: {},
        },
      ],
    });

    // Send the search query
    const result = await chat.sendMessage(query);
    const response = await result.response;
    const text = response.text();

    // Format the response into markdown/HTML
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

    // Generate a unique session ID that will be used client-side
    const sessionId = Math.random().toString(36).substring(7);
    
    // Create a history array for this conversation
    const history: ChatHistoryEntry[] = [
      { role: 'user', content: query },
      { role: 'assistant', content: text },
    ];

    // Return all necessary data for client-side storage
    return NextResponse.json({
      sessionId,
      query,
      summary: formattedText,
      sources,
      history,
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
    console.error("Search error:", error);
    if (error.message?.includes("API key")) {
      return NextResponse.json({ message: "Invalid API key. Please check your settings and try again." }, { status: 401 });
    }
    return NextResponse.json({ message: error.message || "An error occurred while processing your search" }, { status: 500 });
  }
}
