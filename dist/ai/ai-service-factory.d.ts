/**
 * AI Service Factory
 *
 * Factory module for creating and configuring AI services with providers
 */
import { AIService, AIServiceOptions } from './ai-service';
import { OpenAIConfig } from './providers/openai-provider';
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
export declare class AIServiceFactory {
    /**
     * Create AI service with configured providers
     */
    static createService(config: AIServiceFactoryConfig): AIService;
    /**
     * Create service with minimal configuration
     */
    static createMinimalService(apiKey: string): AIService;
    /**
     * Create service for development/testing
     */
    static createDevelopmentService(): AIService;
}
export default AIServiceFactory;
//# sourceMappingURL=ai-service-factory.d.ts.map