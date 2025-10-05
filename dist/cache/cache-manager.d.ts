/**
 * Cache Manager
 *
 * Implements multi-level caching system for API documentation generation.
 * Integrates with parser, AI, and generation services for performance optimization.
 *
 * @packageDocumentation
 */
import { InvalidationTrigger } from '../core/models/cache';
/**
 * Cache operation result
 */
interface CacheResult<T = any> {
    readonly success: boolean;
    readonly value?: T;
    readonly fromCache: boolean;
    readonly responseTime: number;
    readonly error?: string;
    readonly warnings: readonly string[];
}
/**
 * Cache operation statistics (mutable for internal use)
 */
interface MutableCacheStats {
    operations: {
        gets: number;
        sets: number;
        deletes: number;
        invalidations: number;
    };
    performance: {
        avgGetTime: number;
        avgSetTime: number;
        avgInvalidationTime: number;
        totalTime: number;
    };
    efficiency: {
        hitRate: number;
        memoryUtilization: number;
        storageUtilization: number;
        compressionRatio: number;
    };
    health: {
        status: 'healthy' | 'degraded' | 'unhealthy';
        issues: string[];
        lastHealthCheck: Date;
    };
}
/**
 * Cache key type definitions
 */
export interface CacheKeyTypes {
    parser: {
        spec: string;
        schema: string;
        endpoint: string;
    };
    ai: {
        enhancement: string;
        summary: string;
        recommendation: string;
    };
    generation: {
        template: string;
        output: string;
        format: string;
    };
    session: {
        cli: string;
        config: string;
        state: string;
    };
}
/**
 * Cache operation statistics
 */
export interface CacheStats {
    readonly operations: {
        readonly gets: number;
        readonly sets: number;
        readonly deletes: number;
        readonly invalidations: number;
    };
    readonly performance: {
        readonly avgGetTime: number;
        readonly avgSetTime: number;
        readonly avgInvalidationTime: number;
        readonly totalTime: number;
    };
    readonly efficiency: {
        readonly hitRate: number;
        readonly memoryUtilization: number;
        readonly storageUtilization: number;
        readonly compressionRatio: number;
    };
    readonly health: {
        readonly status: 'healthy' | 'degraded' | 'unhealthy';
        readonly issues: string[];
        readonly lastHealthCheck: Date;
    };
}
/**
 * Cache invalidation event
 */
export interface CacheInvalidationEvent {
    readonly type: InvalidationTrigger;
    readonly keys: string[];
    readonly reason: string;
    readonly timestamp: Date;
    readonly metadata?: Record<string, any>;
}
/**
 * Cache manager implementation
 */
export declare class CacheManager {
    private cache;
    private cacheDir;
    private stats;
    private listeners;
    constructor(cacheDir?: string, environment?: 'development' | 'production');
    /**
     * Initialize the cache manager
     */
    initialize(): Promise<void>;
    /**
     * Get cached parser result
     */
    getParserResult<T = any>(key: string): Promise<CacheResult<T>>;
    /**
     * Cache parser result
     */
    setParserResult<T = any>(key: string, data: T, ttl?: number): Promise<void>;
    /**
     * Get cached AI response
     */
    getAIResponse<T = any>(key: string): Promise<CacheResult<T>>;
    /**
     * Cache AI response
     */
    setAIResponse<T = any>(key: string, data: T, ttl?: number): Promise<void>;
    /**
     * Get cached generation result
     */
    getGenerationResult<T = any>(key: string): Promise<CacheResult<T>>;
    /**
     * Cache generation result
     */
    setGenerationResult<T = any>(key: string, data: T, ttl?: number): Promise<void>;
    /**
     * Get cached CLI session data
     */
    getSessionData<T = any>(key: string): Promise<CacheResult<T>>;
    /**
     * Cache CLI session data
     */
    setSessionData<T = any>(key: string, data: T, ttl?: number): Promise<void>;
    /**
     * Invalidate cache by pattern
     */
    invalidateByPattern(pattern: string, reason?: string): Promise<void>;
    /**
     * Invalidate cache when source files change
     */
    invalidateOnSourceChange(filePath: string): Promise<void>;
    /**
     * Get cache statistics
     */
    getStats(): Readonly<MutableCacheStats>;
    /**
     * Get cache health status
     */
    getHealthStatus(): Promise<CacheStats['health']>;
    /**
     * Cleanup expired entries
     */
    cleanup(): Promise<void>;
    /**
     * Shutdown cache manager
     */
    shutdown(): Promise<void>;
    private get;
    private set;
    private generateCacheKey;
    private hashKey;
    private hashValue;
    private calculateFileHash;
    private findKeysByPattern;
    private matchesPattern;
    private invalidateKeys;
    private initializeCacheLayers;
    private loadExistingCache;
    private startMaintenanceTasks;
    private stopMaintenanceTasks;
    private persistCacheData;
    private cleanupExpiredEntries;
    private initializeStats;
    private updateStats;
    private emitInvalidationEvent;
    /**
     * Add event listener
     */
    on(event: string, listener: Function): void;
    /**
     * Remove event listener
     */
    off(event: string, listener: Function): void;
}
/**
 * Global cache manager instance
 */
export declare let globalCacheManager: CacheManager | null;
/**
 * Initialize global cache manager
 */
export declare function initializeCacheManager(cacheDir?: string, environment?: 'development' | 'production'): Promise<CacheManager>;
/**
 * Get global cache manager instance
 */
export declare function getCacheManager(): CacheManager;
/**
 * Shutdown global cache manager
 */
export declare function shutdownCacheManager(): Promise<void>;
export {};
//# sourceMappingURL=cache-manager.d.ts.map