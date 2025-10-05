/**
 * Cache Model
 *
 * Represents a multi-level caching system with invalidation strategies,
 * performance optimization, and storage management for API documentation generation.
 *
 * @packageDocumentation
 */
/**
 * Cache level enumeration
 */
export declare enum CacheLevel {
    MEMORY = "memory",
    DISK = "disk",
    DISTRIBUTED = "distributed",
    BROWSER = "browser"
}
/**
 * Cache strategy enumeration
 */
export declare enum CacheStrategy {
    LRU = "lru",// Least Recently Used
    LFU = "lfu",// Least Frequently Used
    FIFO = "fifo",// First In, First Out
    TTL = "ttl",// Time To Live
    ADAPTIVE = "adaptive"
}
/**
 * Cache invalidation trigger enumeration
 */
export declare enum InvalidationTrigger {
    TIME_BASED = "time-based",
    SIZE_BASED = "size-based",
    DEPENDENCY_CHANGED = "dependency-changed",
    MANUAL = "manual",
    SOURCE_MODIFIED = "source-modified",
    SCHEMA_CHANGED = "schema-changed"
}
/**
 * Cache entry status enumeration
 */
export declare enum CacheEntryStatus {
    FRESH = "fresh",
    STALE = "stale",
    EXPIRED = "expired",
    INVALID = "invalid",
    LOADING = "loading"
}
/**
 * Cache storage type enumeration
 */
export declare enum StorageType {
    IN_MEMORY = "in-memory",
    FILE_SYSTEM = "file-system",
    REDIS = "redis",
    MEMCACHED = "memcached",
    DATABASE = "database",
    INDEXEDDB = "indexeddb",
    LOCALSTORAGE = "localstorage"
}
/**
 * Represents a cache entry
 */
export interface CacheEntry<T = any> {
    readonly key: string;
    readonly value: T;
    readonly metadata: CacheEntryMetadata;
    readonly createdAt: Date;
    readonly accessedAt: Date;
    readonly expiresAt?: Date;
    readonly size: number;
    readonly tags: readonly string[];
    readonly dependencies: readonly string[];
    readonly checksum: string;
}
/**
 * Cache entry metadata
 */
export interface CacheEntryMetadata {
    readonly version: string;
    readonly contentType: string;
    readonly encoding?: string;
    readonly compressed: boolean;
    readonly accessCount: number;
    readonly hitCount: number;
    readonly source: string;
    readonly priority: number;
    readonly customData: Record<string, any>;
}
/**
 * Cache configuration
 */
export interface CacheConfiguration {
    readonly enabled: boolean;
    readonly defaultTTL: number;
    readonly maxSize: number;
    readonly maxEntries: number;
    readonly strategy: CacheStrategy;
    readonly compression: {
        readonly enabled: boolean;
        readonly algorithm: 'gzip' | 'deflate' | 'brotli';
        readonly level: number;
        readonly threshold: number;
    };
    readonly persistence: {
        readonly enabled: boolean;
        readonly storageType: StorageType;
        readonly location: string;
        readonly encryption: boolean;
    };
    readonly invalidation: {
        readonly triggers: readonly InvalidationTrigger[];
        readonly batchSize: number;
        readonly maxRetries: number;
        readonly checkInterval: number;
    };
    readonly monitoring: {
        readonly metricsEnabled: boolean;
        readonly loggingEnabled: boolean;
        readonly alertThresholds: {
            readonly hitRateMin: number;
            readonly memoryUsageMax: number;
            readonly responseTimeMax: number;
        };
    };
}
/**
 * Cache statistics and metrics
 */
export interface CacheMetrics {
    readonly hits: number;
    readonly misses: number;
    readonly hitRate: number;
    readonly totalRequests: number;
    readonly totalEntries: number;
    readonly totalSize: number;
    readonly averageResponseTime: number;
    readonly memoryUsage: {
        readonly used: number;
        readonly available: number;
        readonly percentage: number;
    };
    readonly storage: {
        readonly used: number;
        readonly available: number;
        readonly percentage: number;
    };
    readonly invalidations: {
        readonly total: number;
        readonly byTrigger: Record<InvalidationTrigger, number>;
        readonly lastInvalidation?: Date;
    };
    readonly performance: {
        readonly avgSetTime: number;
        readonly avgGetTime: number;
        readonly avgDeleteTime: number;
        readonly throughput: number;
    };
}
/**
 * Cache invalidation rule
 */
export interface InvalidationRule {
    readonly id: string;
    readonly name: string;
    readonly trigger: InvalidationTrigger;
    readonly condition: string;
    readonly scope: 'entry' | 'tag' | 'pattern' | 'all';
    readonly target: string;
    readonly priority: number;
    readonly enabled: boolean;
    readonly metadata: Record<string, any>;
}
/**
 * Cache operation result
 */
export interface CacheOperationResult<T = any> {
    readonly success: boolean;
    readonly value?: T;
    readonly metadata?: CacheEntryMetadata;
    readonly fromCache: boolean;
    readonly responseTime: number;
    readonly error?: string;
    readonly warnings: readonly string[];
}
/**
 * Represents a cache layer in multi-level caching
 */
export interface CacheLayer {
    readonly id: string;
    readonly level: CacheLevel;
    readonly storageType: StorageType;
    readonly configuration: CacheConfiguration;
    readonly metrics: CacheMetrics;
    readonly status: 'active' | 'inactive' | 'error' | 'maintenance';
    readonly priority: number;
    readonly capacity: {
        readonly maxSize: number;
        readonly maxEntries: number;
        readonly currentSize: number;
        readonly currentEntries: number;
    };
    readonly lastHealthCheck: Date;
    readonly healthStatus: 'healthy' | 'degraded' | 'unhealthy';
}
/**
 * Main cache interface
 */
export interface Cache {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly version: string;
    readonly layers: readonly CacheLayer[];
    readonly configuration: CacheConfiguration;
    readonly invalidationRules: readonly InvalidationRule[];
    readonly metrics: CacheMetrics;
    readonly status: 'active' | 'inactive' | 'error';
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly metadata: Record<string, any>;
}
/**
 * Cache creation parameters
 */
export interface CreateCacheParams {
    readonly name: string;
    readonly description: string;
    readonly layers: readonly Omit<CacheLayer, 'id' | 'metrics' | 'lastHealthCheck' | 'healthStatus'>[];
    readonly configuration: CacheConfiguration;
    readonly invalidationRules?: readonly Omit<InvalidationRule, 'id'>[];
    readonly metadata?: Record<string, any>;
}
/**
 * Cache update parameters
 */
export interface UpdateCacheParams {
    readonly name?: string;
    readonly description?: string;
    readonly configuration?: Partial<CacheConfiguration>;
    readonly invalidationRules?: readonly InvalidationRule[];
    readonly status?: 'active' | 'inactive' | 'error';
    readonly metadata?: Record<string, any>;
}
/**
 * Factory for creating Cache instances
 */
export declare class CacheFactory {
    /**
     * Creates a new cache instance
     */
    static create(params: CreateCacheParams): Cache;
    /**
     * Creates a cache from existing data
     */
    static fromData(data: Partial<Cache> & {
        id: string;
        name: string;
        configuration: CacheConfiguration;
    }): Cache;
    /**
     * Updates an existing cache
     */
    static update(cache: Cache, updates: UpdateCacheParams): Cache;
    /**
     * Creates a memory-only cache
     */
    static createMemoryCache(name: string, maxSize?: number): Cache;
    /**
     * Creates a multi-level cache
     */
    static createMultiLevelCache(name: string): Cache;
    /**
     * Creates a distributed cache
     */
    static createDistributedCache(name: string, redisUrl: string): Cache;
    private static createCacheLayer;
    private static createInvalidationRule;
    private static generateCacheId;
    private static generateLayerId;
    private static generateRuleId;
    private static createInitialMetrics;
    private static createDefaultConfiguration;
}
/**
 * Utility functions for working with caches
 */
export declare class CacheUtils {
    /**
     * Calculates cache efficiency
     */
    static calculateEfficiency(cache: Cache): {
        hitRate: number;
        memoryEfficiency: number;
        storageEfficiency: number;
        overallScore: number;
    };
    /**
     * Checks if cache needs optimization
     */
    static needsOptimization(cache: Cache): {
        needed: boolean;
        reasons: string[];
        suggestions: string[];
    };
    /**
     * Gets cache layers by level
     */
    static getLayersByLevel(cache: Cache, level: CacheLevel): CacheLayer[];
    /**
     * Gets healthy cache layers
     */
    static getHealthyLayers(cache: Cache): CacheLayer[];
    /**
     * Finds cache layer by storage type
     */
    static findLayerByStorageType(cache: Cache, storageType: StorageType): CacheLayer | undefined;
    /**
     * Calculates total cache capacity
     */
    static calculateTotalCapacity(cache: Cache): {
        totalMaxSize: number;
        totalMaxEntries: number;
        totalCurrentSize: number;
        totalCurrentEntries: number;
        utilizationRate: number;
    };
    /**
     * Validates cache configuration
     */
    static validateConfiguration(config: CacheConfiguration): string[];
    /**
     * Creates a cache summary
     */
    static createSummary(cache: Cache): {
        id: string;
        name: string;
        status: string;
        layerCount: number;
        totalSize: number;
        hitRate: number;
        efficiency: number;
        healthStatus: string;
        needsOptimization: boolean;
    };
}
/**
 * Predefined cache configurations
 */
export declare class CachePresets {
    /**
     * Configuration for development environment
     */
    static development(): CacheConfiguration;
    /**
     * Configuration for production environment
     */
    static production(): CacheConfiguration;
    /**
     * Configuration for testing environment
     */
    static testing(): CacheConfiguration;
}
//# sourceMappingURL=cache.d.ts.map