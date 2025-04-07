// lib/services/settings-service.ts
/**
 * Settings service interface following Interface Segregation Principle
 * Abstracts storage operations for application settings
 */
export interface SettingsService {
  getApiKey(): string | null;
  saveApiKey(key: string): void;
  clearApiKey(): void;
  validateApiKey(key: string): boolean;
}

/**
 * LocalStorage implementation of settings service
 * Following Single Responsibility Principle by focusing only on settings management
 */
export class LocalStorageSettingsService implements SettingsService {
  private readonly API_KEY_STORAGE_KEY = 'geminiApiKey';
  
  /**
   * Get API key from localStorage
   */
  getApiKey(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }
  
  /**
   * Save API key to localStorage
   */
  saveApiKey(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.API_KEY_STORAGE_KEY, key);
  }
  
  /**
   * Clear API key from localStorage
   */
  clearApiKey(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.API_KEY_STORAGE_KEY);
  }
  
  /**
   * Validate API key format
   * Basic validation for Gemini API key format (starts with "AIza")
   */
  validateApiKey(key: string): boolean {
    if (!key) return false;
    return key.startsWith('AIza');
  }
}

/**
 * Get the default settings service instance
 * Following the Factory pattern for Service Location
 */
export function getSettingsService(): SettingsService {
  return new LocalStorageSettingsService();
}
