// lib/services/gemini-service.ts
// Gemini implementation of the AI service interfaces

import {
  GoogleGenerativeAI,
  type GenerativeModel,
} from "@google/generative-ai";
import { AISearchService, AISearchResponse, SourceExtractor, ResponseFormatter } from "./interfaces";
import { ChatHistoryEntry, Source } from "../types";

/**
 * Gemini-specific configuration
 */
export const defaultGenerationConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 2048,
};

/**
 * Gemini source extractor implementation
 */
export class GeminiSourceExtractor implements SourceExtractor {
  extractSources(metadata: any): Source[] {
    if (!metadata) return [];
    
    const sourceMap = new Map<string, Source>();
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
    
    return Array.from(sourceMap.values());
  }
}

/**
 * Gemini response formatter implementation
 */
export class GeminiResponseFormatter implements ResponseFormatter {
  async formatToMarkdown(text: string): Promise<string> {
    // Ensure we have a string to work with
    const resolvedText = await Promise.resolve(text);
    let processedText = resolvedText.replace(/\r\n/g, "\n");

    // Process main sections (lines that start with word(s) followed by colon)
    processedText = processedText.replace(
      /^([A-Za-z][A-Za-z\s]+):(\s*)/gm,
      "## $1$2"
    );

    // Process sub-sections (any remaining word(s) followed by colon within text)
    processedText = processedText.replace(
      /(?<=\n|^)([A-Za-z][A-Za-z\s]+):(?!\d)/gm,
      "**$1:**"
    );

    // Enhance links - ensure they're properly formatted as markdown links
    processedText = processedText.replace(
      /(?<!\()(https?:\/\/[^\s]+)(?!\))/g,
      "[$1]($1)"
    );

    // Enhance list formatting
    processedText = processedText.replace(/^(\d+)\.\s/gm, "$1. ");
    processedText = processedText.replace(/^[-*]\s/gm, "- ");

    // Enhance code formatting
    processedText = processedText.replace(
      /`{3}(\w+)?\n([\s\S]+?)\n`{3}/gm,
      (_, lang, code) => `\`\`\`${lang || ""}\n${code.trim()}\n\`\`\``
    );

    return processedText;
  }
}

/**
 * Gemini AI search service implementation
 */
export class GeminiSearchService implements AISearchService {
  private sourceExtractor: SourceExtractor;
  private responseFormatter: ResponseFormatter;
  
  constructor(
    sourceExtractor: SourceExtractor = new GeminiSourceExtractor(),
    responseFormatter: ResponseFormatter = new GeminiResponseFormatter()
  ) {
    this.sourceExtractor = sourceExtractor;
    this.responseFormatter = responseFormatter;
  }
  
  /**
   * Gets a Gemini model instance with the specified API key
   */
  private getGeminiModel(apiKey: string): GenerativeModel {
    if (!apiKey) {
      throw new Error(
        "API key is required to use this search function. Please provide your Gemini API key in settings."
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: defaultGenerationConfig,
    });
  }

  /**
   * Performs a search with Gemini AI
   */
  async search(query: string, apiKey: string): Promise<AISearchResponse> {
    if (!query) throw new Error("Query is required");
    if (!apiKey) throw new Error("API key is required");
    
    const model = this.getGeminiModel(apiKey);
    
    // Create a new chat session with search capability
    const chat = model.startChat({
      tools: [
        {
          // @ts-ignore - google_search is a valid tool but not typed in the SDK yet
          google_search: {},
        },
      ],
    });
    
    // Generate content with search tool
    const result = await chat.sendMessage(query);
    const response = await result.response;
    const text = response.text();
    
    // Format response and extract sources
    const formattedText = await this.responseFormatter.formatToMarkdown(text);
    const metadata = response.candidates?.[0]?.groundingMetadata;
    const sources = this.sourceExtractor.extractSources(metadata);

    return {
      text,
      formattedText,
      sources,
      metadata: metadata as any,
      rawResponse: response,
    };
  }

  /**
   * Sends a follow-up query to Gemini AI based on conversation history
   */
  async followUp(
    query: string, 
    history: ChatHistoryEntry[], 
    apiKey: string
  ): Promise<AISearchResponse> {
    if (!query) throw new Error("Query is required");
    if (!apiKey) throw new Error("API key is required");
    if (!history || !Array.isArray(history) || history.length === 0) {
      throw new Error("Conversation history is required for follow-up questions");
    }
    
    const model = this.getGeminiModel(apiKey);
    
    // Create a chat with the existing history
    const chat = model.startChat({
      tools: [
        {
          // @ts-ignore - google_search is a valid tool but not typed in the SDK yet
          google_search: {},
        },
      ],
      // Format history entries to match Gemini API expectations
      history: history.map((entry: ChatHistoryEntry) => ({
        role: entry.role === 'assistant' ? 'model' : entry.role,
        parts: [{ text: entry.content }]
      })),
    });
    
    // Send the follow-up message
    const result = await chat.sendMessage(query);
    const response = await result.response;
    const text = response.text();
    
    // Format response and extract sources
    const formattedText = await this.responseFormatter.formatToMarkdown(text);
    const metadata = response.candidates?.[0]?.groundingMetadata;
    const sources = this.sourceExtractor.extractSources(metadata);

    return {
      text,
      formattedText,
      sources,
      metadata: metadata as any,
      rawResponse: response,
    };
  }
}
