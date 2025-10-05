/**
 * Cache Integration Service
 *
 * Provides cache integration layer for all services in the API documentation generator.
 * Handles cache warming, invalidation strategies, and performance optimization.
 *
 * @packageDocumentation
 */
import { CacheManager } from './cache-manager';
import { ParserService } from '../parsers/parser-service';
import { AIService } from '../ai/ai-service';
import { GenerationService } from '../generators/generation-service';
import { CLIService } from '../cli/cli-service';
/**
 * Cache integration configuration
 */
export interface CacheIntegrationConfig {
    readonly enabled: boolean;
    readonly warming: {
        readonly enabled: boolean;
        readonly patterns: string[];
        readonly priority: 'high' | 'medium' | 'low';
    };
    readonly invalidation: {
        readonly fileWatching: boolean;
        readonly patterns: string[];
        readonly strategies: ('immediate' | 'batch' | 'scheduled')[];
    };
    readonly optimization: {
        readonly precompute: boolean;
        readonly compression: boolean;
        readonly distribution: boolean;
    };
}
/**
 * Cache integration service that connects all services with the cache manager
 */
export declare class CacheIntegrationService {
    private cacheManager;
    private config;
    constructor(config?: Partial<CacheIntegrationConfig>);
    /**
     * Initialize cache integration
     */
    initialize(): Promise<void>;
    /**
     * Create cached parser service wrapper
     */
    createCachedParserService(parserService: ParserService): CachedParserService;
    /**
     * Create cached AI service wrapper
     */
    createCachedAIService(aiService: AIService): CachedAIService;
    /**
     * Create cached generation service wrapper
     */
    createCachedGenerationService(generationService: GenerationService): CachedGenerationService;
    /**
     * Create cached CLI service wrapper
     */
    createCachedCLIService(cliService: CLIService): CachedCLIService;
    /**
     * Warm cache with common operations
     */
    private warmCache;
    private warmCommonParsers;
    private warmAITemplates;
    private warmGenerationTemplates;
    private setupFileWatching;
}
/**
 * Cached wrapper for ParserService
 */
export declare class CachedParserService {
    private parserService;
    private cacheManager;
    constructor(parserService: ParserService, cacheManager: CacheManager);
    parse(request: any): Promise<any>;
    extract(request: any): Promise<any>;
    validate(request: any): Promise<any>;
    private generateParseKey;
    private generateExtractKey;
    private generateValidateKey;
}
/**
 * Cached wrapper for AIService
 */
export declare class CachedAIService {
    private aiService;
    private cacheManager;
    constructor(aiService: AIService, cacheManager: CacheManager);
    enhance(request: any): Promise<any>;
    summarize(request: any): Promise<any>;
    validate(request: any): Promise<any>;
    private generateEnhanceKey;
    private generateSummaryKey;
    private generateValidationKey;
}
/**
 * Cached wrapper for GenerationService
 */
export declare class CachedGenerationService {
    private generationService;
    private cacheManager;
    constructor(generationService: GenerationService, cacheManager: CacheManager);
    generate(request: any): Promise<any>;
    render(request: any): Promise<any>;
    preview(request: any): Promise<any>;
    private generateGenerateKey;
    private generateRenderKey;
    private generatePreviewKey;
}
/**
 * Cached wrapper for CLIService
 */
export declare class CachedCLIService {
    private cliService;
    private cacheManager;
    constructor(cliService: CLIService, cacheManager: CacheManager);
    generate(request: any): Promise<any>;
    validate(request: any): Promise<any>;
    diff(request: any): Promise<any>;
    private generateValidateKey;
    private generateDiffKey;
}
/**
 * Global cache integration service instance
 */
export declare let globalCacheIntegration: CacheIntegrationService | null;
/**
 * Initialize global cache integration service
 */
export declare function initializeCacheIntegration(config?: Partial<CacheIntegrationConfig>): Promise<CacheIntegrationService>;
/**
 * Get global cache integration service
 */
export declare function getCacheIntegration(): CacheIntegrationService;
//# sourceMappingURL=cache-integration.d.ts.map