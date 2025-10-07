/**
 * T031 API Gateway Integration
 *
 * Comprehensive API Gateway that exposes all T023-T030 services as REST and GraphQL APIs,
 * providing web-based access, CI/CD integration, webhook support, authentication,
 * and real-time documentation generation capabilities.
 *
 * @packageDocumentation
 */
import { ConfigurationManager } from '../config/config-manager';
import { CLIService } from '../cli/cli-service';
import { ParserService } from '../parsers/parser-service';
import { AIService } from '../ai/ai-service';
import { GenerationService } from '../generators/generation-service';
import { CacheManager } from '../cache/cache-manager';
import { ErrorHandler } from '../error/error-handler';
import { PerformanceMonitor } from '../performance/performance-monitor';
import { Environment } from '../core/models/configuration';
import WebSocket from 'ws';
/**
 * API Gateway configuration options
 */
export interface APIGatewayConfig {
    readonly port: number;
    readonly host: string;
    readonly environment: Environment;
    readonly enableCORS: boolean;
    readonly enableCompression: boolean;
    readonly enableRateLimit: boolean;
    readonly enableWebSocket: boolean;
    readonly enableGraphQL: boolean;
    readonly enableSwagger: boolean;
    readonly rateLimitWindow: number;
    readonly rateLimitMax: number;
    readonly maxFileSize: string;
    readonly apiPrefix: string;
    readonly auth?: {
        readonly enabled: boolean;
        readonly type: 'jwt' | 'api-key' | 'basic';
        readonly secret?: string;
        readonly apiKeys?: readonly string[];
    };
    readonly ssl?: {
        readonly enabled: boolean;
        readonly keyPath?: string;
        readonly certPath?: string;
    };
}
/**
 * API request context
 */
export interface APIRequestContext {
    readonly requestId: string;
    readonly userId?: string;
    readonly sessionId?: string;
    readonly clientInfo: {
        readonly userAgent: string;
        readonly ip: string;
        readonly origin?: string;
    };
    readonly timestamp: Date;
    readonly metadata: Record<string, any>;
}
/**
 * API response format
 */
export interface APIResponse<T = any> {
    readonly success: boolean;
    readonly data?: T;
    readonly error?: {
        readonly code: string;
        readonly message: string;
        readonly details?: any;
        readonly timestamp: Date;
    };
    readonly metadata: {
        readonly requestId: string;
        readonly processingTime: number;
        readonly version: string;
        readonly endpoint: string;
    };
}
/**
 * WebSocket message types
 */
export declare enum WebSocketMessageType {
    GENERATION_PROGRESS = "generation_progress",
    GENERATION_COMPLETE = "generation_complete",
    PARSING_PROGRESS = "parsing_progress",
    PARSING_COMPLETE = "parsing_complete",
    ERROR_ALERT = "error_alert",
    PERFORMANCE_UPDATE = "performance_update",
    CACHE_INVALIDATION = "cache_invalidation",
    SYSTEM_STATUS = "system_status"
}
/**
 * WebSocket client connection
 */
export interface WebSocketClient {
    readonly id: string;
    readonly socket: WebSocket;
    readonly subscriptions: Set<string>;
    readonly metadata: Record<string, any>;
    readonly connectedAt: Date;
}
/**
 * Webhook configuration
 */
export interface WebhookConfig {
    readonly url: string;
    readonly events: readonly string[];
    readonly secret?: string;
    readonly headers?: Record<string, string>;
    readonly retries: number;
    readonly timeout: number;
}
/**
 * Documentation generation job
 */
export interface GenerationJob {
    readonly id: string;
    readonly type: 'parse' | 'generate' | 'validate' | 'enhance';
    readonly status: 'pending' | 'running' | 'completed' | 'failed';
    readonly input: any;
    readonly output?: any;
    readonly error?: string;
    readonly progress: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly estimatedCompletion?: Date;
    readonly metadata: Record<string, any>;
}
/**
 * T031 API Gateway Integration
 */
export declare class APIGateway {
    private app;
    private server?;
    private wsServer?;
    private config;
    private services;
    private clients;
    private jobs;
    private webhooks;
    private isRunning;
    constructor(config: APIGatewayConfig);
    /**
     * Initialize API Gateway with all services
     */
    initialize(configManager: ConfigurationManager, cliService: CLIService, parserService: ParserService, aiService: AIService, generationService: GenerationService, cacheManager: CacheManager, errorHandler: ErrorHandler, performanceMonitor: PerformanceMonitor): Promise<void>;
    /**
     * Start the API Gateway server
     */
    start(): Promise<void>;
    /**
     * Stop the API Gateway server
     */
    stop(): Promise<void>;
    /**
     * Setup Express middleware
     */
    private setupMiddleware;
    /**
     * Setup API routes
     */
    private setupRoutes;
    /**
     * Setup GraphQL schema and endpoint
     */
    private setupGraphQL;
    /**
     * Setup WebSocket server
     */
    private setupWebSocket;
    /**
     * Setup WebSocket event handlers
     */
    private setupWebSocketHandlers;
    /**
     * Setup service event listeners for real-time updates
     */
    private setupServiceEventListeners;
    /**
     * Create request context middleware
     */
    private createRequestContextMiddleware;
    /**
     * Create authentication middleware
     */
    private createAuthenticationMiddleware;
    /**
     * Create error handling middleware
     */
    private createErrorHandlingMiddleware;
    /**
     * Handle health check
     */
    private handleHealthCheck;
    /**
     * Handle system status
     */
    private handleSystemStatus;
    /**
     * Handle get configuration
     */
    private handleGetConfiguration;
    /**
     * Handle update configuration
     */
    private handleUpdateConfiguration;
    /**
     * Handle parse specification
     */
    private handleParseSpecification;
    /**
     * Handle validate specification
     */
    private handleValidateSpecification;
    /**
     * Handle enhance documentation
     */
    private handleEnhanceDocumentation;
    /**
     * Handle generate content
     */
    private handleGenerateContent;
    /**
     * Handle generate documentation
     */
    private handleGenerateDocumentation;
    /**
     * Handle get generation job
     */
    private handleGetGenerationJob;
    /**
     * Handle list jobs
     */
    private handleListJobs;
    /**
     * Handle get cache stats
     */
    private handleGetCacheStats;
    /**
     * Handle clear cache
     */
    private handleClearCache;
    /**
     * Handle get performance metrics
     */
    private handleGetPerformanceMetrics;
    /**
     * Handle get user preferences
     */
    private handleGetUserPreferences;
    /**
     * Handle update user preferences
     */
    private handleUpdateUserPreferences;
    /**
     * Handle create webhook
     */
    private handleCreateWebhook;
    /**
     * Handle list webhooks
     */
    private handleListWebhooks;
    /**
     * Handle delete webhook
     */
    private handleDeleteWebhook;
    /**
     * Handle file upload
     */
    private handleFileUpload;
    /**
     * Handle export configuration
     */
    private handleExportConfiguration;
    /**
     * Handle WebSocket message
     */
    private handleWebSocketMessage;
    /**
     * Process generation job
     */
    private processGenerationJob;
    /**
     * Broadcast message to subscribed clients
     */
    private broadcastToSubscribers;
    /**
     * Create standardized API response
     */
    private createResponse;
    /**
     * Get gateway statistics
     */
    getStats(): any;
}
//# sourceMappingURL=api-gateway.d.ts.map