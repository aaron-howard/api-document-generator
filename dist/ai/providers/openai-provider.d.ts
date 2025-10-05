/**
 * OpenAI Provider Implementation
 *
 * Implementation of the IAIProvider interface for OpenAI's GPT models.
 * Provides text completion, chat completion, and usage tracking capabilities.
 */
import { IAIProvider, AICapability, AICompletionOptions, AICompletionResult, AIUsageStats, ChatMessage } from '../ai-service';
/**
 * OpenAI API configuration
 */
export interface OpenAIConfig {
    apiKey: string;
    baseURL?: string;
    organization?: string;
    project?: string;
    defaultModel?: string;
    timeout?: number;
    maxRetries?: number;
}
/**
 * HTTP client interface for making requests
 */
interface HTTPClient {
    request(options: {
        url: string;
        method: string;
        headers: Record<string, string>;
        body?: string;
        timeout?: number;
    }): Promise<{
        status: number;
        data: any;
    }>;
}
/**
 * OpenAI Provider class implementing IAIProvider
 */
export declare class OpenAIProvider implements IAIProvider {
    private config;
    readonly name = "openai";
    readonly capabilities: AICapability[];
    private stats;
    private latencies;
    private errors;
    private httpClient?;
    constructor(config: OpenAIConfig, httpClient?: HTTPClient);
    /**
     * Set HTTP client for making requests
     */
    setHTTPClient(client: HTTPClient): void;
    /**
     * Generate text completion using OpenAI GPT models
     */
    complete(prompt: string, options?: AICompletionOptions): Promise<AICompletionResult>;
    /**
     * Generate chat completion using OpenAI GPT models
     */
    chat(messages: ChatMessage[], options?: AICompletionOptions): Promise<AICompletionResult>;
    /**
     * Check if the OpenAI provider is available
     */
    isAvailable(): Promise<boolean>;
    /**
     * Get usage statistics
     */
    getUsageStats(): Promise<AIUsageStats>;
    private makeRequest;
    private mapFinishReason;
    private mapUsage;
    private estimateCost;
    private updateStats;
    private handleError;
    private sleep;
}
/**
 * OpenAI specific error class
 */
export declare class OpenAIError extends Error {
    statusCode: number;
    type: string;
    code: string | null;
    constructor(statusCode: number, message: string, type: string, code: string | null);
    get isRetryable(): boolean;
}
/**
 * Factory function to create OpenAI provider
 */
export declare function createOpenAIProvider(config: OpenAIConfig, httpClient?: HTTPClient): OpenAIProvider;
/**
 * Helper function to validate OpenAI configuration
 */
export declare function validateOpenAIConfig(config: Partial<OpenAIConfig>): config is OpenAIConfig;
export default OpenAIProvider;
//# sourceMappingURL=openai-provider.d.ts.map