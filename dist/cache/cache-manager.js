"use strict";
/**
 * Cache Manager
 *
 * Implements multi-level caching system for API documentation generation.
 * Integrates with parser, AI, and generation services for performance optimization.
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalCacheManager = exports.CacheManager = void 0;
exports.initializeCacheManager = initializeCacheManager;
exports.getCacheManager = getCacheManager;
exports.shutdownCacheManager = shutdownCacheManager;
const cache_1 = require("../core/models/cache");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
/**
 * Cache manager implementation
 */
class CacheManager {
    constructor(cacheDir = './cache', environment = 'development') {
        this.listeners = new Map();
        this.cacheDir = cacheDir;
        // Create cache based on environment
        this.cache = environment === 'production'
            ? cache_1.CacheFactory.fromData({
                id: 'cache_production',
                name: 'Production Cache',
                configuration: cache_1.CachePresets.production()
            })
            : cache_1.CacheFactory.fromData({
                id: 'cache_development',
                name: 'Development Cache',
                configuration: cache_1.CachePresets.development()
            });
        this.stats = this.initializeStats();
    }
    /**
     * Initialize the cache manager
     */
    async initialize() {
        try {
            // Ensure cache directory exists
            await fs.mkdir(this.cacheDir, { recursive: true });
            // Initialize cache layers
            await this.initializeCacheLayers();
            // Load existing cache data
            await this.loadExistingCache();
            // Start background maintenance
            this.startMaintenanceTasks();
            console.log(`Cache manager initialized with ${this.cache.layers.length} layers`);
        }
        catch (error) {
            throw new Error(`Failed to initialize cache manager: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get cached parser result
     */
    async getParserResult(key) {
        const startTime = Date.now();
        try {
            const cacheKey = this.generateCacheKey('parser', key);
            const result = await this.get(cacheKey);
            this.updateStats('get', Date.now() - startTime, result.fromCache);
            return result;
        }
        catch (error) {
            this.updateStats('get', Date.now() - startTime, false);
            return {
                success: false,
                fromCache: false,
                responseTime: Date.now() - startTime,
                error: error.message,
                warnings: []
            };
        }
    }
    /**
     * Cache parser result
     */
    async setParserResult(key, data, ttl) {
        const startTime = Date.now();
        try {
            const cacheKey = this.generateCacheKey('parser', key);
            await this.set(cacheKey, data, ttl);
            this.updateStats('set', Date.now() - startTime, true);
        }
        catch (error) {
            this.updateStats('set', Date.now() - startTime, false);
            throw new Error(`Failed to cache parser result: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get cached AI response
     */
    async getAIResponse(key) {
        const startTime = Date.now();
        try {
            const cacheKey = this.generateCacheKey('ai', key);
            const result = await this.get(cacheKey);
            this.updateStats('get', Date.now() - startTime, result.fromCache);
            return result;
        }
        catch (error) {
            this.updateStats('get', Date.now() - startTime, false);
            return {
                success: false,
                fromCache: false,
                responseTime: Date.now() - startTime,
                error: error.message,
                warnings: []
            };
        }
    }
    /**
     * Cache AI response
     */
    async setAIResponse(key, data, ttl) {
        const startTime = Date.now();
        try {
            const cacheKey = this.generateCacheKey('ai', key);
            await this.set(cacheKey, data, ttl || 3600000); // Default 1 hour for AI responses
            this.updateStats('set', Date.now() - startTime, true);
        }
        catch (error) {
            this.updateStats('set', Date.now() - startTime, false);
            throw new Error(`Failed to cache AI response: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get cached generation result
     */
    async getGenerationResult(key) {
        const startTime = Date.now();
        try {
            const cacheKey = this.generateCacheKey('generation', key);
            const result = await this.get(cacheKey);
            this.updateStats('get', Date.now() - startTime, result.fromCache);
            return result;
        }
        catch (error) {
            this.updateStats('get', Date.now() - startTime, false);
            return {
                success: false,
                fromCache: false,
                responseTime: Date.now() - startTime,
                error: error.message,
                warnings: []
            };
        }
    }
    /**
     * Cache generation result
     */
    async setGenerationResult(key, data, ttl) {
        const startTime = Date.now();
        try {
            const cacheKey = this.generateCacheKey('generation', key);
            await this.set(cacheKey, data, ttl);
            this.updateStats('set', Date.now() - startTime, true);
        }
        catch (error) {
            this.updateStats('set', Date.now() - startTime, false);
            throw new Error(`Failed to cache generation result: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get cached CLI session data
     */
    async getSessionData(key) {
        const startTime = Date.now();
        try {
            const cacheKey = this.generateCacheKey('session', key);
            const result = await this.get(cacheKey);
            this.updateStats('get', Date.now() - startTime, result.fromCache);
            return result;
        }
        catch (error) {
            this.updateStats('get', Date.now() - startTime, false);
            return {
                success: false,
                fromCache: false,
                responseTime: Date.now() - startTime,
                error: error.message,
                warnings: []
            };
        }
    }
    /**
     * Cache CLI session data
     */
    async setSessionData(key, data, ttl) {
        const startTime = Date.now();
        try {
            const cacheKey = this.generateCacheKey('session', key);
            await this.set(cacheKey, data, ttl || 1800000); // Default 30 minutes for sessions
            this.updateStats('set', Date.now() - startTime, true);
        }
        catch (error) {
            this.updateStats('set', Date.now() - startTime, false);
            throw new Error(`Failed to cache session data: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Invalidate cache by pattern
     */
    async invalidateByPattern(pattern, reason = 'Manual invalidation') {
        const startTime = Date.now();
        try {
            const keys = await this.findKeysByPattern(pattern);
            await this.invalidateKeys(keys);
            this.updateStats('invalidation', Date.now() - startTime, true);
            this.emitInvalidationEvent({
                type: cache_1.InvalidationTrigger.MANUAL,
                keys,
                reason,
                timestamp: new Date()
            });
        }
        catch (error) {
            this.updateStats('invalidation', Date.now() - startTime, false);
            throw new Error(`Failed to invalidate cache by pattern: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Invalidate cache when source files change
     */
    async invalidateOnSourceChange(filePath) {
        const fileHash = await this.calculateFileHash(filePath);
        const pattern = `*:${fileHash}*`;
        await this.invalidateByPattern(pattern, `Source file changed: ${filePath}`);
    }
    /**
     * Get cache statistics
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Get cache health status
     */
    async getHealthStatus() {
        const efficiency = cache_1.CacheUtils.calculateEfficiency(this.cache);
        const capacity = cache_1.CacheUtils.calculateTotalCapacity(this.cache);
        const issues = [];
        // Check for issues
        if (efficiency.hitRate < 0.6) {
            issues.push(`Low cache hit rate: ${(efficiency.hitRate * 100).toFixed(1)}%`);
        }
        if (capacity.utilizationRate > 0.9) {
            issues.push(`High cache utilization: ${(capacity.utilizationRate * 100).toFixed(1)}%`);
        }
        if (this.stats.performance.avgGetTime > 100) {
            issues.push(`Slow cache access: ${this.stats.performance.avgGetTime.toFixed(1)}ms average`);
        }
        const status = issues.length === 0 ? 'healthy' :
            issues.length <= 2 ? 'degraded' : 'unhealthy';
        const health = {
            status,
            issues,
            lastHealthCheck: new Date()
        };
        this.stats = { ...this.stats, health };
        return health;
    }
    /**
     * Cleanup expired entries
     */
    async cleanup() {
        try {
            const cleaned = await this.cleanupExpiredEntries();
            console.log(`Cache cleanup completed: ${cleaned} entries removed`);
        }
        catch (error) {
            console.error('Cache cleanup failed:', error instanceof Error ? error.message : String(error));
        }
    }
    /**
     * Shutdown cache manager
     */
    async shutdown() {
        try {
            // Stop maintenance tasks
            this.stopMaintenanceTasks();
            // Persist cache data
            await this.persistCacheData();
            console.log('Cache manager shutdown completed');
        }
        catch (error) {
            console.error('Cache shutdown failed:', error instanceof Error ? error.message : String(error));
        }
    }
    // Private methods
    async get(key) {
        // Simulate cache lookup - in real implementation would check memory/disk/redis
        const filePath = path.join(this.cacheDir, `${this.hashKey(key)}.json`);
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            const entry = JSON.parse(data);
            // Check if expired
            if (entry.expiresAt && new Date() > new Date(entry.expiresAt)) {
                await fs.unlink(filePath).catch(() => { }); // Clean up expired entry
                return {
                    success: false,
                    fromCache: false,
                    responseTime: 0,
                    warnings: ['Cache entry expired']
                };
            }
            return {
                success: true,
                value: entry.value,
                fromCache: true,
                responseTime: 0,
                warnings: []
            };
        }
        catch (error) {
            return {
                success: false,
                fromCache: false,
                responseTime: 0,
                warnings: ['Cache miss']
            };
        }
    }
    async set(key, value, ttl) {
        const filePath = path.join(this.cacheDir, `${this.hashKey(key)}.json`);
        const expiresAt = ttl ? new Date(Date.now() + ttl) : undefined;
        const entry = {
            key,
            value,
            createdAt: new Date(),
            expiresAt,
            status: 'fresh',
            contentHash: this.hashValue(value)
        };
        await fs.writeFile(filePath, JSON.stringify(entry, null, 2));
    }
    generateCacheKey(category, key) {
        return `${category}:${key}`;
    }
    hashKey(key) {
        return crypto.createHash('sha256').update(key).digest('hex').substring(0, 32);
    }
    hashValue(value) {
        return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
    }
    async calculateFileHash(filePath) {
        try {
            const content = await fs.readFile(filePath);
            return crypto.createHash('sha256').update(content).digest('hex');
        }
        catch (error) {
            return crypto.createHash('sha256').update(filePath).digest('hex');
        }
    }
    async findKeysByPattern(pattern) {
        try {
            const files = await fs.readdir(this.cacheDir);
            const matchingKeys = [];
            for (const file of files.filter(f => f.endsWith('.json'))) {
                try {
                    const filePath = path.join(this.cacheDir, file);
                    const data = await fs.readFile(filePath, 'utf-8');
                    const entry = JSON.parse(data);
                    if (this.matchesPattern(entry.key, pattern)) {
                        matchingKeys.push(entry.key);
                    }
                }
                catch (error) {
                    // Skip invalid cache files
                }
            }
            return matchingKeys;
        }
        catch (error) {
            return [];
        }
    }
    matchesPattern(key, pattern) {
        // Simple pattern matching - * wildcard support
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(key);
    }
    async invalidateKeys(keys) {
        for (const key of keys) {
            const filePath = path.join(this.cacheDir, `${this.hashKey(key)}.json`);
            await fs.unlink(filePath).catch(() => { }); // Ignore errors for missing files
        }
    }
    async initializeCacheLayers() {
        // In a real implementation, this would initialize Redis, memory pools, etc.
        console.log('Cache layers initialized');
    }
    async loadExistingCache() {
        try {
            const files = await fs.readdir(this.cacheDir);
            console.log(`Loaded ${files.length} cache entries`);
        }
        catch (error) {
            console.log('No existing cache data found');
        }
    }
    startMaintenanceTasks() {
        // Start periodic cleanup
        setInterval(() => {
            this.cleanup().catch(console.error);
        }, 300000); // Every 5 minutes
        // Start health checks
        setInterval(() => {
            this.getHealthStatus().catch(console.error);
        }, 60000); // Every minute
    }
    stopMaintenanceTasks() {
        // In a real implementation, would clear intervals
    }
    async persistCacheData() {
        // In a real implementation, would persist in-memory data to disk
    }
    async cleanupExpiredEntries() {
        try {
            const files = await fs.readdir(this.cacheDir);
            let cleaned = 0;
            for (const file of files.filter(f => f.endsWith('.json'))) {
                try {
                    const filePath = path.join(this.cacheDir, file);
                    const data = await fs.readFile(filePath, 'utf-8');
                    const entry = JSON.parse(data);
                    if (entry.expiresAt && new Date() > new Date(entry.expiresAt)) {
                        await fs.unlink(filePath);
                        cleaned++;
                    }
                }
                catch (error) {
                    // Remove invalid cache files
                    await fs.unlink(path.join(this.cacheDir, file)).catch(() => { });
                    cleaned++;
                }
            }
            return cleaned;
        }
        catch (error) {
            return 0;
        }
    }
    initializeStats() {
        return {
            operations: {
                gets: 0,
                sets: 0,
                deletes: 0,
                invalidations: 0
            },
            performance: {
                avgGetTime: 0,
                avgSetTime: 0,
                avgInvalidationTime: 0,
                totalTime: 0
            },
            efficiency: {
                hitRate: 0,
                memoryUtilization: 0,
                storageUtilization: 0,
                compressionRatio: 0
            },
            health: {
                status: 'healthy',
                issues: [],
                lastHealthCheck: new Date()
            }
        };
    }
    updateStats(operation, time, success) {
        this.stats.operations[operation === 'get' ? 'gets' :
            operation === 'set' ? 'sets' :
                operation === 'delete' ? 'deletes' : 'invalidations']++;
        this.stats.performance.totalTime += time;
        if (operation === 'get') {
            this.stats.performance.avgGetTime =
                (this.stats.performance.avgGetTime * (this.stats.operations.gets - 1) + time) / this.stats.operations.gets;
            if (success) {
                this.stats.efficiency.hitRate =
                    this.stats.operations.gets > 0 ?
                        (this.stats.efficiency.hitRate * (this.stats.operations.gets - 1) + 1) / this.stats.operations.gets :
                        1;
            }
            else {
                this.stats.efficiency.hitRate =
                    this.stats.operations.gets > 0 ?
                        (this.stats.efficiency.hitRate * (this.stats.operations.gets - 1)) / this.stats.operations.gets :
                        0;
            }
        }
        else if (operation === 'set') {
            this.stats.performance.avgSetTime =
                (this.stats.performance.avgSetTime * (this.stats.operations.sets - 1) + time) / this.stats.operations.sets;
        }
        else if (operation === 'invalidation') {
            this.stats.performance.avgInvalidationTime =
                (this.stats.performance.avgInvalidationTime * (this.stats.operations.invalidations - 1) + time) / this.stats.operations.invalidations;
        }
    }
    emitInvalidationEvent(event) {
        const listeners = this.listeners.get('invalidation') || [];
        listeners.forEach(listener => {
            try {
                listener(event);
            }
            catch (error) {
                console.error('Cache invalidation listener error:', error);
            }
        });
    }
    /**
     * Add event listener
     */
    on(event, listener) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(listener);
    }
    /**
     * Remove event listener
     */
    off(event, listener) {
        const listeners = this.listeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }
}
exports.CacheManager = CacheManager;
/**
 * Global cache manager instance
 */
exports.globalCacheManager = null;
/**
 * Initialize global cache manager
 */
async function initializeCacheManager(cacheDir, environment) {
    exports.globalCacheManager = new CacheManager(cacheDir, environment);
    await exports.globalCacheManager.initialize();
    return exports.globalCacheManager;
}
/**
 * Get global cache manager instance
 */
function getCacheManager() {
    if (!exports.globalCacheManager) {
        throw new Error('Cache manager not initialized. Call initializeCacheManager() first.');
    }
    return exports.globalCacheManager;
}
/**
 * Shutdown global cache manager
 */
async function shutdownCacheManager() {
    if (exports.globalCacheManager) {
        await exports.globalCacheManager.shutdown();
        exports.globalCacheManager = null;
    }
}
//# sourceMappingURL=cache-manager.js.map