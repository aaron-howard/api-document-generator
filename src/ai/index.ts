/**
 * AI Module Index
 * 
 * Main entry point for the AI service module providing
 * AI-powered documentation enhancement capabilities.
 */

// Core AI Service
export { 
  AIService,
  type SummarizeRequest,
  type SummarizeResponse,
  type EnhanceRequest,
  type EnhanceResponse,
  type ValidateRequest,
  type ValidateResponse,
  type BatchRequest,
  type BatchResponse,
  type AIError,
  type IAIProvider,
  type AICapability,
  type AICompletionOptions,
  type AICompletionResult,
  type AIUsageStats,
  type ChatMessage,
  type TokenUsage,
  type AIServiceOptions
} from './ai-service';

// AI Service Factory
export { 
  AIServiceFactory,
  type AIServiceFactoryConfig
} from './ai-service-factory';

// OpenAI Provider
export { 
  OpenAIProvider,
  OpenAIError,
  createOpenAIProvider,
  validateOpenAIConfig,
  type OpenAIConfig
} from './providers/openai-provider';

// HTTP Client
export { 
  type HTTPClient
} from './providers/http-client';

// Default export
export { AIService as default } from './ai-service';