/**
 * T031 API Gateway Integration - Main Integration Orchestrator
 *
 * Provides a unified interface for all T031 API Gateway Integration capabilities,
 * including REST APIs, GraphQL endpoints, WebSocket real-time features,
 * authentication, rate limiting, webhook management, and comprehensive
 * service orchestration for the entire T023-T031 ecosystem.
 *
 * @author T031 Implementation Team
 * @version 1.0.0
 */
import { APIGateway, APIGatewayConfig } from '../gateway/api-gateway';
import { ConfigurationManager } from '../config/config-manager';
import { CLIService } from '../cli/cli-service';
import { ParserService } from '../parsers/parser-service';
import { AIService } from '../ai/ai-service';
import { GenerationService } from '../generators/generation-service';
import { CacheManager } from '../cache/cache-manager';
import { ErrorHandler } from '../error/error-handler';
import { PerformanceMonitor } from '../performance/performance-monitor';
/**
 * T031 Integration Configuration
 */
export interface T031IntegrationConfig {
    readonly gateway: APIGatewayConfig;
    readonly services: {
        readonly configManager: any;
        readonly cliService: any;
        readonly parserService: any;
        readonly aiService: any;
        readonly generationService: any;
        readonly cacheManager: any;
        readonly errorHandler: any;
        readonly performanceMonitor: any;
    };
    readonly features: {
        readonly enableRESTAPI: boolean;
        readonly enableGraphQL: boolean;
        readonly enableWebSocket: boolean;
        readonly enableAuthentication: boolean;
        readonly enableRateLimiting: boolean;
        readonly enableMonitoring: boolean;
        readonly enableWebhooks: boolean;
        readonly enableFileUpload: boolean;
    };
}
/**
 * API Gateway Statistics
 */
export interface APIGatewayStats {
    readonly status: 'running' | 'stopped' | 'error';
    readonly uptime: number;
    readonly requests: {
        readonly total: number;
        readonly successful: number;
        readonly failed: number;
        readonly averageResponseTime: number;
    };
    readonly connections: {
        readonly active: number;
        readonly total: number;
        readonly websocketClients: number;
    };
    readonly jobs: {
        readonly active: number;
        readonly completed: number;
        readonly failed: number;
        readonly pending: number;
    };
    readonly webhooks: {
        readonly configured: number;
        readonly delivered: number;
        readonly failed: number;
    };
    readonly performance: {
        readonly memoryUsage: NodeJS.MemoryUsage;
        readonly cpuUsage: NodeJS.CpuUsage;
        readonly systemLoad: number[];
    };
}
/**
 * T031 API Gateway Integration Main Class
 */
export declare class T031ApiGatewayIntegration {
    private gateway?;
    private config;
    private services;
    private isInitialized;
    private isRunning;
    private statistics;
    constructor(config?: Partial<T031IntegrationConfig>);
    /**
     * Initialize T031 API Gateway Integration
     */
    initialize(): Promise<void>;
    /**
     * Start the API Gateway
     */
    start(): Promise<void>;
    /**
     * Stop the API Gateway
     */
    stop(): Promise<void>;
    /**
     * Get API Gateway status
     */
    getStatus(): {
        initialized: boolean;
        running: boolean;
        config: T031IntegrationConfig;
        statistics: Partial<APIGatewayStats>;
    };
    /**
     * Get comprehensive statistics
     */
    getStatistics(): Promise<APIGatewayStats>;
    /**
     * Update configuration
     */
    updateConfiguration(updates: Partial<T031IntegrationConfig>): Promise<void>;
    /**
     * Initialize all required services
     */
    private initializeServices;
    /**
     * Get service instances for external access
     */
    getServices(): {
        configManager?: ConfigurationManager;
        cliService?: CLIService;
        parserService?: ParserService;
        aiService?: AIService;
        generationService?: GenerationService;
        cacheManager?: CacheManager;
        errorHandler?: ErrorHandler;
        performanceMonitor?: PerformanceMonitor;
    };
    /**
     * Get gateway instance for external access
     */
    getGateway(): APIGateway | undefined;
    /**
     * Health check for the entire integration
     */
    healthCheck(): Promise<{
        status: 'healthy' | 'unhealthy';
        components: Record<string, 'healthy' | 'unhealthy' | 'unknown'>;
        timestamp: Date;
    }>;
}
/**
 * Convenience functions for quick integration setup
 */
/**
 * Create and initialize T031 Integration with default configuration
 */
export declare function createT031Integration(config?: Partial<T031IntegrationConfig>): Promise<T031ApiGatewayIntegration>;
/**
 * Create and start T031 Integration with default configuration
 */
export declare function startT031Integration(config?: Partial<T031IntegrationConfig>): Promise<T031ApiGatewayIntegration>;
/**
 * Quick demo function for T031 Integration
 */
export declare function demonstrateT031Integration(): Promise<void>;
/**
 * Showcase all T031 capabilities
 */
export declare function showcaseT031Capabilities(): void;
export { T031IntegrationConfig, APIGatewayStats, T031ApiGatewayIntegration };
//# sourceMappingURL=t031-api-gateway-integration.d.ts.map