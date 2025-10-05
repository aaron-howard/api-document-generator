"use strict";
/**
 * AI Service Factory
 *
 * Factory module for creating and configuring AI services with providers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIServiceFactory = void 0;
const ai_service_1 = require("./ai-service");
const openai_provider_1 = require("./providers/openai-provider");
/**
 * AI Service Factory class
 */
class AIServiceFactory {
    /**
     * Create AI service with configured providers
     */
    static createService(config) {
        const service = new ai_service_1.AIService(config.serviceOptions);
        // Configure OpenAI provider if config provided
        if (config.openai) {
            const provider = (0, openai_provider_1.createOpenAIProvider)(config.openai);
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
    static createMinimalService(apiKey) {
        return AIServiceFactory.createService({
            openai: { apiKey },
            defaultProvider: 'openai'
        });
    }
    /**
     * Create service for development/testing
     */
    static createDevelopmentService() {
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
exports.AIServiceFactory = AIServiceFactory;
exports.default = AIServiceFactory;
//# sourceMappingURL=ai-service-factory.js.map