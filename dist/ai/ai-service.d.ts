/**
 * AI Service Implementation
 *
 * AI-powered documentation enhancement service that provides intelligent
 * summarization, content enhancement, validation, and batch processing capabilities.
 * Integrates with OpenAI GPT-4 and other AI providers for optimal results.
 */
/**
 * AI Service API request/response interfaces based on ai-service.yaml contract
 */
export interface SummarizeRequest {
    endpoint: EndpointData;
    context?: ProjectContext;
    options?: SummarizationOptions;
}
export interface EndpointData {
    path: string;
    method: string;
    summary?: string;
    description?: string;
    operationId?: string;
    tags?: string[];
    parameters?: ParameterData[];
    requestBody?: RequestBodyData;
    responses?: ResponseData[];
    security?: any[];
    deprecated?: boolean;
}
export interface ParameterData {
    name: string;
    in: 'query' | 'header' | 'path' | 'cookie';
    required?: boolean;
    description?: string;
    schema?: any;
    example?: any;
}
export interface RequestBodyData {
    description?: string;
    required?: boolean;
    content?: Record<string, any>;
}
export interface ResponseData {
    status: string;
    description: string;
    content?: Record<string, any>;
    headers?: Record<string, any>;
}
export interface ProjectContext {
    projectName?: string;
    version?: string;
    description?: string;
    domain?: string;
    relatedEndpoints?: string[];
    businessRules?: string[];
}
export interface SummarizationOptions {
    includeExamples?: boolean;
    generateCodeSamples?: boolean;
    targetAudience?: 'developers' | 'business-users' | 'technical-writers';
    style?: 'concise' | 'detailed' | 'tutorial';
    languages?: string[];
    maxTokens?: number;
    temperature?: number;
}
export interface SummarizeResponse {
    summaryId: string;
    enhancedSummary?: string;
    enhancedDescription?: string;
    useCases?: string[];
    examples?: Array<{
        description: string;
        request: any;
        response: any;
        scenario?: string;
    }>;
    codeSamples?: Array<{
        language: string;
        code: string;
        description?: string;
        framework?: string;
    }>;
    bestPractices?: string[];
    warnings?: string[];
    confidence: number;
    processingTime: number;
    tokenUsage?: TokenUsage;
}
export interface TokenUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost: number;
}
export interface EnhanceRequest {
    content: string;
    type: 'summary' | 'description' | 'example' | 'guide';
    context?: ProjectContext;
    options?: {
        focusAreas?: string[];
        preserveOriginal?: boolean;
        maxEnhancements?: number;
    };
}
export interface EnhanceResponse {
    enhancementId: string;
    enhancements: Array<{
        type: 'addition' | 'modification' | 'clarification' | 'example' | 'warning';
        suggestion: string;
        rationale: string;
        priority: 'high' | 'medium' | 'low';
        position?: {
            line?: number;
            section?: string;
        };
    }>;
    originalContent: string;
    confidence: number;
    tokenUsage?: TokenUsage;
}
export interface ValidateRequest {
    content: string;
    type: 'summary' | 'description' | 'example' | 'documentation';
    criteria?: string[];
    context?: ProjectContext;
}
export interface ValidateResponse {
    validationId: string;
    valid: boolean;
    score: number;
    feedback: Array<{
        type: 'error' | 'warning' | 'suggestion' | 'improvement';
        message: string;
        section?: string;
        severity: 'high' | 'medium' | 'low';
    }>;
    metrics: {
        clarity: number;
        completeness: number;
        accuracy: number;
        consistency: number;
    };
    suggestions?: string[];
}
export interface BatchRequest {
    items: Array<{
        id: string;
        type: 'summarize' | 'enhance' | 'validate';
        request: SummarizeRequest | EnhanceRequest | ValidateRequest;
    }>;
    options?: {
        maxConcurrency?: number;
        priorityOrder?: 'fifo' | 'shortest-first' | 'custom';
        failureStrategy?: 'continue' | 'stop-on-error';
    };
}
export interface BatchResponse {
    batchId: string;
    status: 'completed' | 'partial' | 'failed';
    totalItems: number;
    successCount: number;
    failureCount: number;
    results: Array<{
        id: string;
        status: 'success' | 'failed';
        result?: SummarizeResponse | EnhanceResponse | ValidateResponse;
        error?: AIError;
    }>;
    processingTime: number;
    totalTokenUsage?: TokenUsage;
}
export interface AIError {
    status: 'error';
    code: string;
    message: string;
    details?: Record<string, any>;
    retryable?: boolean;
}
/**
 * AI Provider interface for pluggable AI backends
 */
export interface IAIProvider {
    readonly name: string;
    readonly capabilities: AICapability[];
    /**
     * Generate text completion
     */
    complete(prompt: string, options?: AICompletionOptions): Promise<AICompletionResult>;
    /**
     * Generate chat completion
     */
    chat(messages: ChatMessage[], options?: AICompletionOptions): Promise<AICompletionResult>;
    /**
     * Check if provider is available
     */
    isAvailable(): Promise<boolean>;
    /**
     * Get usage statistics
     */
    getUsageStats(): Promise<AIUsageStats>;
}
export declare enum AICapability {
    TEXT_COMPLETION = "text-completion",
    CHAT_COMPLETION = "chat-completion",
    CODE_GENERATION = "code-generation",
    SUMMARIZATION = "summarization",
    TRANSLATION = "translation",
    ANALYSIS = "analysis"
}
export interface AICompletionOptions {
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    stop?: string[];
    stream?: boolean;
}
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
    name?: string;
}
export interface AICompletionResult {
    text: string;
    finishReason: 'stop' | 'length' | 'content_filter' | 'null';
    usage: TokenUsage;
    model: string;
    id: string;
    created: number;
}
export interface AIUsageStats {
    totalRequests: number;
    totalTokens: number;
    totalCost: number;
    averageLatency: number;
    errorRate: number;
    lastUsed: Date;
}
/**
 * AI Service class implementing the complete AI service contract
 */
export declare class AIService {
    private providers;
    private defaultProvider?;
    private rateLimiter;
    private cache;
    private promptLibrary;
    constructor(options?: AIServiceOptions);
    /**
     * Register an AI provider
     */
    registerProvider(name: string, provider: IAIProvider): void;
    /**
     * Set the default AI provider
     */
    setDefaultProvider(name: string): void;
    /**
     * Generate AI summary for API endpoint
     * Implementation of POST /summarize endpoint from ai-service.yaml
     */
    summarize(request: SummarizeRequest): Promise<SummarizeResponse>;
    /**
     * Enhance documentation with AI insights
     * Implementation of POST /enhance endpoint from ai-service.yaml
     */
    enhance(request: EnhanceRequest): Promise<EnhanceResponse>;
    /**
     * Validate AI-generated content
     * Implementation of POST /validate endpoint from ai-service.yaml
     */
    validate(request: ValidateRequest): Promise<ValidateResponse>;
    /**
     * Process multiple endpoints in batch
     * Implementation of POST /batch endpoint from ai-service.yaml
     */
    batchProcess(request: BatchRequest): Promise<BatchResponse>;
    private getProvider;
    private generateSummaryId;
    private generateEnhancementId;
    private generateValidationId;
    private generateBatchId;
    private generateCacheKey;
    private hashObject;
    private chunkArray;
    private calculateConfidence;
    private parseSummarizationResponse;
    private parseEnhancementResponse;
    private parseValidationResponse;
    private extractSection;
    private extractList;
    private handleAIError;
    private isRetryableError;
}
/**
 * AI Service configuration options
 */
export interface AIServiceOptions {
    rateLimitConfig?: {
        maxRequestsPerMinute?: number;
        maxTokensPerMinute?: number;
    };
    cacheConfig?: {
        ttl?: number;
        maxSize?: number;
    };
    promptConfig?: {
        customPrompts?: Record<string, string>;
        systemPrompt?: string;
    };
}
export default AIService;
//# sourceMappingURL=ai-service.d.ts.map