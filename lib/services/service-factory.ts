// lib/services/service-factory.ts
// Factory for creating service instances, enabling easy dependency injection

import { AISearchService } from './interfaces';
import { GeminiSearchService } from './gemini-service';

/**
 * Factory to create service instances following the Factory pattern
 * This enables easy switching between different implementations
 */
export class ServiceFactory {
  private static aiSearchService: AISearchService | null = null;
  
  /**
   * Get an instance of AISearchService (singleton pattern)
   */
  static getAISearchService(): AISearchService {
    if (!ServiceFactory.aiSearchService) {
      ServiceFactory.aiSearchService = new GeminiSearchService();
    }
    return ServiceFactory.aiSearchService;
  }
  
  /**
   * For testing: allows setting a custom service implementation
   */
  static setAISearchService(service: AISearchService): void {
    ServiceFactory.aiSearchService = service;
  }
}

/**
 * Helper function to get the AI search service
 * Simplifies dependency injection in the API routes
 */
export function getAISearchService(): AISearchService {
  return ServiceFactory.getAISearchService();
}
