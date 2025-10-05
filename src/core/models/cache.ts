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
export enum CacheLevel {
  MEMORY = 'memory',
  DISK = 'disk',
  DISTRIBUTED = 'distributed',
  BROWSER = 'browser'
}

/**
 * Cache strategy enumeration
 */
export enum CacheStrategy {
  LRU = 'lru',           // Least Recently Used
  LFU = 'lfu',           // Least Frequently Used
  FIFO = 'fifo',         // First In, First Out
  TTL = 'ttl',           // Time To Live
  ADAPTIVE = 'adaptive'   // Adaptive replacement
}

/**
 * Cache invalidation trigger enumeration
 */
export enum InvalidationTrigger {
  TIME_BASED = 'time-based',
  SIZE_BASED = 'size-based',
  DEPENDENCY_CHANGED = 'dependency-changed',
  MANUAL = 'manual',
  SOURCE_MODIFIED = 'source-modified',
  SCHEMA_CHANGED = 'schema-changed'
}

/**
 * Cache entry status enumeration
 */
export enum CacheEntryStatus {
  FRESH = 'fresh',
  STALE = 'stale',
  EXPIRED = 'expired',
  INVALID = 'invalid',
  LOADING = 'loading'
}

/**
 * Cache storage type enumeration
 */
export enum StorageType {
  IN_MEMORY = 'in-memory',
  FILE_SYSTEM = 'file-system',
  REDIS = 'redis',
  MEMCACHED = 'memcached',
  DATABASE = 'database',
  INDEXEDDB = 'indexeddb',
  LOCALSTORAGE = 'localstorage'
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
  readonly defaultTTL: number; // milliseconds
  readonly maxSize: number; // bytes
  readonly maxEntries: number;
  readonly strategy: CacheStrategy;
  readonly compression: {
    readonly enabled: boolean;
    readonly algorithm: 'gzip' | 'deflate' | 'brotli';
    readonly level: number;
    readonly threshold: number; // minimum size to compress
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
    readonly checkInterval: number; // milliseconds
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
    readonly throughput: number; // operations per second
  };
}

/**
 * Cache invalidation rule
 */
export interface InvalidationRule {
  readonly id: string;
  readonly name: string;
  readonly trigger: InvalidationTrigger;
  readonly condition: string; // expression or pattern
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
export class CacheFactory {
  /**
   * Creates a new cache instance
   */
  static create(params: CreateCacheParams): Cache {
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
  static fromData(data: Partial<Cache> & { 
    id: string; 
    name: string; 
    configuration: CacheConfiguration; 
  }): Cache {
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
  static update(cache: Cache, updates: UpdateCacheParams): Cache {
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
  static createMemoryCache(name: string, maxSize = 50 * 1024 * 1024): Cache {
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
  static createMultiLevelCache(name: string): Cache {
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
  static createDistributedCache(name: string, redisUrl: string): Cache {
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

  private static createCacheLayer(
    layerData: Omit<CacheLayer, 'id' | 'metrics' | 'lastHealthCheck' | 'healthStatus'>
  ): CacheLayer {
    return {
      ...layerData,
      id: this.generateLayerId(),
      metrics: this.createInitialMetrics(),
      lastHealthCheck: new Date(),
      healthStatus: 'healthy'
    };
  }

  private static createInvalidationRule(
    ruleData: Omit<InvalidationRule, 'id'>
  ): InvalidationRule {
    return {
      ...ruleData,
      id: this.generateRuleId()
    };
  }

  private static generateCacheId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `cache_${timestamp}_${random}`;
  }

  private static generateLayerId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `layer_${timestamp}_${random}`;
  }

  private static generateRuleId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `rule_${timestamp}_${random}`;
  }

  private static createInitialMetrics(): CacheMetrics {
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

  private static createDefaultConfiguration(overrides?: Partial<CacheConfiguration>): CacheConfiguration {
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

/**
 * Utility functions for working with caches
 */
export class CacheUtils {
  /**
   * Calculates cache efficiency
   */
  static calculateEfficiency(cache: Cache): {
    hitRate: number;
    memoryEfficiency: number;
    storageEfficiency: number;
    overallScore: number;
  } {
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
  static needsOptimization(cache: Cache): {
    needed: boolean;
    reasons: string[];
    suggestions: string[];
  } {
    const reasons: string[] = [];
    const suggestions: string[] = [];
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
  static getLayersByLevel(cache: Cache, level: CacheLevel): CacheLayer[] {
    return cache.layers.filter(layer => layer.level === level);
  }

  /**
   * Gets healthy cache layers
   */
  static getHealthyLayers(cache: Cache): CacheLayer[] {
    return cache.layers.filter(layer => layer.healthStatus === 'healthy' && layer.status === 'active');
  }

  /**
   * Finds cache layer by storage type
   */
  static findLayerByStorageType(cache: Cache, storageType: StorageType): CacheLayer | undefined {
    return cache.layers.find(layer => layer.storageType === storageType);
  }

  /**
   * Calculates total cache capacity
   */
  static calculateTotalCapacity(cache: Cache): {
    totalMaxSize: number;
    totalMaxEntries: number;
    totalCurrentSize: number;
    totalCurrentEntries: number;
    utilizationRate: number;
  } {
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
  static validateConfiguration(config: CacheConfiguration): string[] {
    const errors: string[] = [];

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
  } {
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

/**
 * Predefined cache configurations
 */
export class CachePresets {
  /**
   * Configuration for development environment
   */
  static development(): CacheConfiguration {
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
  static production(): CacheConfiguration {
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
  static testing(): CacheConfiguration {
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