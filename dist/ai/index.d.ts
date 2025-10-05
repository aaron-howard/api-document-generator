/**
 * AI Module Index
 *
 * Main entry point for the AI service module providing
 * AI-powered documentation enhancement capabilities.
 */
export { AIService, type SummarizeRequest, type SummarizeResponse, type EnhanceRequest, type EnhanceResponse, type ValidateRequest, type ValidateResponse, type BatchRequest, type BatchResponse, type AIError, type IAIProvider, type AICapability, type AICompletionOptions, type AICompletionResult, type AIUsageStats, type ChatMessage, type TokenUsage, type AIServiceOptions } from './ai-service';
export { AIServiceFactory, type AIServiceFactoryConfig } from './ai-service-factory';
export { OpenAIProvider, OpenAIError, createOpenAIProvider, validateOpenAIConfig, type OpenAIConfig } from './providers/openai-provider';
export { type HTTPClient } from './providers/http-client';
export { AIService as default } from './ai-service';
//# sourceMappingURL=index.d.ts.map