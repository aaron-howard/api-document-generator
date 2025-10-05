/**
 * AI Service Factory
 * 
 * Factory module for creating and configuring AI services with providers
 */

import { AIService, AIServiceOptions } from './ai-service';
import { OpenAIConfig, createOpenAIProvider } from './providers/openai-provider';

/**
 * Factory configuration
 */
export interface AIServiceFactoryConfig {
  openai?: OpenAIConfig;
  serviceOptions?: AIServiceOptions;
  defaultProvider?: string;
}

/**
 * AI Service Factory class
 */
export class AIServiceFactory {
  /**
   * Create AI service with configured providers
   */
  static createService(config: AIServiceFactoryConfig): AIService {
    const service = new AIService(config.serviceOptions);
    
    // Configure OpenAI provider if config provided
    if (config.openai) {
      const provider = createOpenAIProvider(config.openai);
      
      // Set a simple HTTP client for demonstration
      // In a real implementation, this would use a proper HTTP client
      provider.setHTTPClient({
        async request(options) {
          // Mock implementation for demonstration
          // In real usage, replace with actual HTTP client
          // console.warn('Mock HTTP client - replace with real implementation');
          return {
            status: 200,
            data: {
              id: 'mock_response',
              object: 'text_completion',
              created: Date.now(),
              model: options.url.includes('chat') ? 'gpt-4' : 'gpt-3.5-turbo-instruct',
              choices: [{
                text: 'Mock AI response',
                message: { content: 'Mock AI response' },
                finish_reason: 'stop',
                index: 0
              }],
              usage: {
                prompt_tokens: 10,
                completion_tokens: 20,
                total_tokens: 30
              }
            }
          };
        }
      });
      
      service.registerProvider('openai', provider);
      
      if (config.defaultProvider === 'openai' || !config.defaultProvider) {
        service.setDefaultProvider('openai');
      }
    }
    
    return service;
  }

  /**
   * Create service with minimal configuration
   */
  static createMinimalService(apiKey: string): AIService {
    return AIServiceFactory.createService({
      openai: { apiKey },
      defaultProvider: 'openai'
    });
  }

  /**
   * Create service for development/testing
   */
  static createDevelopmentService(): AIService {
    return AIServiceFactory.createService({
      openai: { apiKey: 'dev-key' },
      serviceOptions: {
        rateLimitConfig: {
          maxRequestsPerMinute: 10
        },
        cacheConfig: {
          ttl: 300, // 5 minutes
          maxSize: 100
        }
      },
      defaultProvider: 'openai'
    });
  }
}

export default AIServiceFactory;