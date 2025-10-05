"use strict";
/**
 * Cache Model
 *
 * Represents a multi-level caching system with invalidation strategies,
 * performance optimization, and storage management for API documentation generation.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachePresets = exports.CacheUtils = exports.CacheFactory = exports.StorageType = exports.CacheEntryStatus = exports.InvalidationTrigger = exports.CacheStrategy = exports.CacheLevel = void 0;
/**
 * Cache level enumeration
 */
var CacheLevel;
(function (CacheLevel) {
    CacheLevel["MEMORY"] = "memory";
    CacheLevel["DISK"] = "disk";
    CacheLevel["DISTRIBUTED"] = "distributed";
    CacheLevel["BROWSER"] = "browser";
})(CacheLevel || (exports.CacheLevel = CacheLevel = {}));
/**
 * Cache strategy enumeration
 */
var CacheStrategy;
(function (CacheStrategy) {
    CacheStrategy["LRU"] = "lru";
    CacheStrategy["LFU"] = "lfu";
    CacheStrategy["FIFO"] = "fifo";
    CacheStrategy["TTL"] = "ttl";
    CacheStrategy["ADAPTIVE"] = "adaptive"; // Adaptive replacement
})(CacheStrategy || (exports.CacheStrategy = CacheStrategy = {}));
/**
 * Cache invalidation trigger enumeration
 */
var InvalidationTrigger;
(function (InvalidationTrigger) {
    InvalidationTrigger["TIME_BASED"] = "time-based";
    InvalidationTrigger["SIZE_BASED"] = "size-based";
    InvalidationTrigger["DEPENDENCY_CHANGED"] = "dependency-changed";
    InvalidationTrigger["MANUAL"] = "manual";
    InvalidationTrigger["SOURCE_MODIFIED"] = "source-modified";
    InvalidationTrigger["SCHEMA_CHANGED"] = "schema-changed";
})(InvalidationTrigger || (exports.InvalidationTrigger = InvalidationTrigger = {}));
/**
 * Cache entry status enumeration
 */
var CacheEntryStatus;
(function (CacheEntryStatus) {
    CacheEntryStatus["FRESH"] = "fresh";
    CacheEntryStatus["STALE"] = "stale";
    CacheEntryStatus["EXPIRED"] = "expired";
    CacheEntryStatus["INVALID"] = "invalid";
    CacheEntryStatus["LOADING"] = "loading";
})(CacheEntryStatus || (exports.CacheEntryStatus = CacheEntryStatus = {}));
/**
 * Cache storage type enumeration
 */
var StorageType;
(function (StorageType) {
    StorageType["IN_MEMORY"] = "in-memory";
    StorageType["FILE_SYSTEM"] = "file-system";
    StorageType["REDIS"] = "redis";
    StorageType["MEMCACHED"] = "memcached";
    StorageType["DATABASE"] = "database";
    StorageType["INDEXEDDB"] = "indexeddb";
    StorageType["LOCALSTORAGE"] = "localstorage";
})(StorageType || (exports.StorageType = StorageType = {}));
/**
 * Factory for creating Cache instances
 */
class CacheFactory {
    /**
     * Creates a new cache instance
     */
    static create(params) {
        const now = new Date();
        return {
            id: this.generateCacheId(),
            name: params.name,
            description: params.description,
            version: '1.0.0',
            layers: params.layers.map(layer => this.createCacheLayer(layer)),
            configuration: params.configuration,
            invalidationRules: params.invalidationRules?.map(rule => this.createInvalidationRule(rule)) ?? [],
            metrics: this.createInitialMetrics(),
            status: 'active',
            createdAt: now,
            updatedAt: now,
            metadata: params.metadata ?? {}
        };
    }
    /**
     * Creates a cache from existing data
     */
    static fromData(data) {
        const now = new Date();
        return {
            description: '',
            version: '1.0.0',
            layers: [],
            invalidationRules: [],
            metrics: this.createInitialMetrics(),
            status: 'active',
            createdAt: now,
            updatedAt: now,
            metadata: {},
            ...data
        };
    }
    /**
     * Updates an existing cache
     */
    static update(cache, updates) {
        return {
            ...cache,
            ...updates,
            updatedAt: new Date(),
            configuration: updates.configuration ?
                { ...cache.configuration, ...updates.configuration } :
                cache.configuration,
            metadata: updates.metadata ?
                { ...cache.metadata, ...updates.metadata } :
                cache.metadata
        };
    }
    /**
     * Creates a memory-only cache
     */
    static createMemoryCache(name, maxSize = 50 * 1024 * 1024) {
        return this.create({
            name,
            description: 'In-memory cache for fast access',
            layers: [{
                    level: CacheLevel.MEMORY,
                    storageType: StorageType.IN_MEMORY,
                    configuration: this.createDefaultConfiguration({ maxSize }),
                    status: 'active',
                    priority: 1,
                    capacity: {
                        maxSize,
                        maxEntries: 10000,
                        currentSize: 0,
                        currentEntries: 0
                    }
                }],
            configuration: this.createDefaultConfiguration({ maxSize })
        });
    }
    /**
     * Creates a multi-level cache
     */
    static createMultiLevelCache(name) {
        const memorySize = 50 * 1024 * 1024; // 50MB
        const diskSize = 500 * 1024 * 1024; // 500MB
        return this.create({
            name,
            description: 'Multi-level cache with memory and disk storage',
            layers: [
                {
                    level: CacheLevel.MEMORY,
                    storageType: StorageType.IN_MEMORY,
                    configuration: this.createDefaultConfiguration({ maxSize: memorySize }),
                    status: 'active',
                    priority: 1,
                    capacity: {
                        maxSize: memorySize,
                        maxEntries: 5000,
                        currentSize: 0,
                        currentEntries: 0
                    }
                },
                {
                    level: CacheLevel.DISK,
                    storageType: StorageType.FILE_SYSTEM,
                    configuration: this.createDefaultConfiguration({
                        maxSize: diskSize,
                        persistence: {
                            enabled: true,
                            storageType: StorageType.FILE_SYSTEM,
                            location: './cache',
                            encryption: false
                        }
                    }),
                    status: 'active',
                    priority: 2,
                    capacity: {
                        maxSize: diskSize,
                        maxEntries: 50000,
                        currentSize: 0,
                        currentEntries: 0
                    }
                }
            ],
            configuration: this.createDefaultConfiguration({ maxSize: diskSize })
        });
    }
    /**
     * Creates a distributed cache
     */
    static createDistributedCache(name, redisUrl) {
        return this.create({
            name,
            description: 'Distributed cache using Redis',
            layers: [{
                    level: CacheLevel.DISTRIBUTED,
                    storageType: StorageType.REDIS,
                    configuration: this.createDefaultConfiguration({
                        persistence: {
                            enabled: true,
                            storageType: StorageType.REDIS,
                            location: redisUrl,
                            encryption: true
                        }
                    }),
                    status: 'active',
                    priority: 1,
                    capacity: {
                        maxSize: 1024 * 1024 * 1024, // 1GB
                        maxEntries: 100000,
                        currentSize: 0,
                        currentEntries: 0
                    }
                }],
            configuration: this.createDefaultConfiguration()
        });
    }
    static createCacheLayer(layerData) {
        return {
            ...layerData,
            id: this.generateLayerId(),
            metrics: this.createInitialMetrics(),
            lastHealthCheck: new Date(),
            healthStatus: 'healthy'
        };
    }
    static createInvalidationRule(ruleData) {
        return {
            ...ruleData,
            id: this.generateRuleId()
        };
    }
    static generateCacheId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `cache_${timestamp}_${random}`;
    }
    static generateLayerId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `layer_${timestamp}_${random}`;
    }
    static generateRuleId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `rule_${timestamp}_${random}`;
    }
    static createInitialMetrics() {
        return {
            hits: 0,
            misses: 0,
            hitRate: 0,
            totalRequests: 0,
            totalEntries: 0,
            totalSize: 0,
            averageResponseTime: 0,
            memoryUsage: {
                used: 0,
                available: 0,
                percentage: 0
            },
            storage: {
                used: 0,
                available: 0,
                percentage: 0
            },
            invalidations: {
                total: 0,
                byTrigger: {
                    [InvalidationTrigger.TIME_BASED]: 0,
                    [InvalidationTrigger.SIZE_BASED]: 0,
                    [InvalidationTrigger.DEPENDENCY_CHANGED]: 0,
                    [InvalidationTrigger.MANUAL]: 0,
                    [InvalidationTrigger.SOURCE_MODIFIED]: 0,
                    [InvalidationTrigger.SCHEMA_CHANGED]: 0
                }
            },
            performance: {
                avgSetTime: 0,
                avgGetTime: 0,
                avgDeleteTime: 0,
                throughput: 0
            }
        };
    }
    static createDefaultConfiguration(overrides) {
        return {
            enabled: true,
            defaultTTL: 3600000, // 1 hour
            maxSize: 100 * 1024 * 1024, // 100MB
            maxEntries: 10000,
            strategy: CacheStrategy.LRU,
            compression: {
                enabled: true,
                algorithm: 'gzip',
                level: 6,
                threshold: 1024 // 1KB
            },
            persistence: {
                enabled: false,
                storageType: StorageType.IN_MEMORY,
                location: '',
                encryption: false
            },
            invalidation: {
                triggers: [
                    InvalidationTrigger.TIME_BASED,
                    InvalidationTrigger.SIZE_BASED,
                    InvalidationTrigger.SOURCE_MODIFIED
                ],
                batchSize: 100,
                maxRetries: 3,
                checkInterval: 60000 // 1 minute
            },
            monitoring: {
                metricsEnabled: true,
                loggingEnabled: true,
                alertThresholds: {
                    hitRateMin: 0.8,
                    memoryUsageMax: 0.9,
                    responseTimeMax: 1000
                }
            },
            ...overrides
        };
    }
}
exports.CacheFactory = CacheFactory;
/**
 * Utility functions for working with caches
 */
class CacheUtils {
    /**
     * Calculates cache efficiency
     */
    static calculateEfficiency(cache) {
        const metrics = cache.metrics;
        const hitRate = metrics.totalRequests > 0 ? metrics.hits / metrics.totalRequests : 0;
        const memoryEfficiency = 1 - metrics.memoryUsage.percentage;
        const storageEfficiency = 1 - metrics.storage.percentage;
        const overallScore = (hitRate + memoryEfficiency + storageEfficiency) / 3;
        return {
            hitRate,
            memoryEfficiency,
            storageEfficiency,
            overallScore
        };
    }
    /**
     * Checks if cache needs optimization
     */
    static needsOptimization(cache) {
        const reasons = [];
        const suggestions = [];
        const efficiency = this.calculateEfficiency(cache);
        const thresholds = cache.configuration.monitoring.alertThresholds;
        if (efficiency.hitRate < thresholds.hitRateMin) {
            reasons.push(`Low hit rate: ${(efficiency.hitRate * 100).toFixed(1)}%`);
            suggestions.push('Consider increasing cache size or adjusting TTL settings');
        }
        if (cache.metrics.memoryUsage.percentage > thresholds.memoryUsageMax) {
            reasons.push(`High memory usage: ${(cache.metrics.memoryUsage.percentage * 100).toFixed(1)}%`);
            suggestions.push('Consider implementing more aggressive eviction policies');
        }
        if (cache.metrics.averageResponseTime > thresholds.responseTimeMax) {
            reasons.push(`Slow response time: ${cache.metrics.averageResponseTime}ms`);
            suggestions.push('Consider optimizing cache layer configuration or storage type');
        }
        return {
            needed: reasons.length > 0,
            reasons,
            suggestions
        };
    }
    /**
     * Gets cache layers by level
     */
    static getLayersByLevel(cache, level) {
        return cache.layers.filter(layer => layer.level === level);
    }
    /**
     * Gets healthy cache layers
     */
    static getHealthyLayers(cache) {
        return cache.layers.filter(layer => layer.healthStatus === 'healthy' && layer.status === 'active');
    }
    /**
     * Finds cache layer by storage type
     */
    static findLayerByStorageType(cache, storageType) {
        return cache.layers.find(layer => layer.storageType === storageType);
    }
    /**
     * Calculates total cache capacity
     */
    static calculateTotalCapacity(cache) {
        const totalMaxSize = cache.layers.reduce((sum, layer) => sum + layer.capacity.maxSize, 0);
        const totalMaxEntries = cache.layers.reduce((sum, layer) => sum + layer.capacity.maxEntries, 0);
        const totalCurrentSize = cache.layers.reduce((sum, layer) => sum + layer.capacity.currentSize, 0);
        const totalCurrentEntries = cache.layers.reduce((sum, layer) => sum + layer.capacity.currentEntries, 0);
        const utilizationRate = totalMaxSize > 0 ? totalCurrentSize / totalMaxSize : 0;
        return {
            totalMaxSize,
            totalMaxEntries,
            totalCurrentSize,
            totalCurrentEntries,
            utilizationRate
        };
    }
    /**
     * Validates cache configuration
     */
    static validateConfiguration(config) {
        const errors = [];
        if (config.defaultTTL <= 0) {
            errors.push('Default TTL must be positive');
        }
        if (config.maxSize <= 0) {
            errors.push('Max size must be positive');
        }
        if (config.maxEntries <= 0) {
            errors.push('Max entries must be positive');
        }
        if (config.compression.level < 1 || config.compression.level > 9) {
            errors.push('Compression level must be between 1 and 9');
        }
        if (config.compression.threshold < 0) {
            errors.push('Compression threshold cannot be negative');
        }
        if (config.invalidation.batchSize <= 0) {
            errors.push('Invalidation batch size must be positive');
        }
        if (config.invalidation.checkInterval <= 0) {
            errors.push('Invalidation check interval must be positive');
        }
        if (config.monitoring.alertThresholds.hitRateMin < 0 || config.monitoring.alertThresholds.hitRateMin > 1) {
            errors.push('Hit rate minimum threshold must be between 0 and 1');
        }
        return errors;
    }
    /**
     * Creates a cache summary
     */
    static createSummary(cache) {
        const efficiency = this.calculateEfficiency(cache);
        const optimization = this.needsOptimization(cache);
        const capacity = this.calculateTotalCapacity(cache);
        const healthyLayers = this.getHealthyLayers(cache);
        const healthStatus = healthyLayers.length === cache.layers.length ? 'healthy' :
            healthyLayers.length > 0 ? 'degraded' : 'unhealthy';
        return {
            id: cache.id,
            name: cache.name,
            status: cache.status,
            layerCount: cache.layers.length,
            totalSize: capacity.totalCurrentSize,
            hitRate: efficiency.hitRate,
            efficiency: efficiency.overallScore,
            healthStatus,
            needsOptimization: optimization.needed
        };
    }
}
exports.CacheUtils = CacheUtils;
/**
 * Predefined cache configurations
 */
class CachePresets {
    /**
     * Configuration for development environment
     */
    static development() {
        return CacheFactory['createDefaultConfiguration']({
            defaultTTL: 300000, // 5 minutes
            maxSize: 10 * 1024 * 1024, // 10MB
            maxEntries: 1000,
            strategy: CacheStrategy.LRU,
            compression: {
                enabled: false,
                algorithm: 'gzip',
                level: 1,
                threshold: 8192
            },
            monitoring: {
                metricsEnabled: true,
                loggingEnabled: true,
                alertThresholds: {
                    hitRateMin: 0.6,
                    memoryUsageMax: 0.95,
                    responseTimeMax: 2000
                }
            }
        });
    }
    /**
     * Configuration for production environment
     */
    static production() {
        return CacheFactory['createDefaultConfiguration']({
            defaultTTL: 3600000, // 1 hour
            maxSize: 200 * 1024 * 1024, // 200MB
            maxEntries: 50000,
            strategy: CacheStrategy.ADAPTIVE,
            compression: {
                enabled: true,
                algorithm: 'brotli',
                level: 6,
                threshold: 1024
            },
            persistence: {
                enabled: true,
                storageType: StorageType.FILE_SYSTEM,
                location: './cache/production',
                encryption: true
            },
            monitoring: {
                metricsEnabled: true,
                loggingEnabled: false,
                alertThresholds: {
                    hitRateMin: 0.85,
                    memoryUsageMax: 0.8,
                    responseTimeMax: 500
                }
            }
        });
    }
    /**
     * Configuration for testing environment
     */
    static testing() {
        return CacheFactory['createDefaultConfiguration']({
            defaultTTL: 60000, // 1 minute
            maxSize: 5 * 1024 * 1024, // 5MB
            maxEntries: 500,
            strategy: CacheStrategy.FIFO,
            compression: {
                enabled: false,
                algorithm: 'gzip',
                level: 1,
                threshold: 16384
            },
            monitoring: {
                metricsEnabled: false,
                loggingEnabled: false,
                alertThresholds: {
                    hitRateMin: 0.5,
                    memoryUsageMax: 1.0,
                    responseTimeMax: 5000
                }
            }
        });
    }
}
exports.CachePresets = CachePresets;
//# sourceMappingURL=cache.js.map