"use strict";
/**
 * Cache Integration Service
 *
 * Provides cache integration layer for all services in the API documentation generator.
 * Handles cache warming, invalidation strategies, and performance optimization.
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
exports.globalCacheIntegration = exports.CachedCLIService = exports.CachedGenerationService = exports.CachedAIService = exports.CachedParserService = exports.CacheIntegrationService = void 0;
exports.initializeCacheIntegration = initializeCacheIntegration;
exports.getCacheIntegration = getCacheIntegration;
const cache_manager_1 = require("./cache-manager");
const crypto = __importStar(require("crypto"));
/**
 * Cache integration service that connects all services with the cache manager
 */
class CacheIntegrationService {
    constructor(config) {
        this.config = {
            enabled: true,
            warming: {
                enabled: true,
                patterns: ['**/*.json', '**/*.yaml', '**/*.yml'],
                priority: 'medium'
            },
            invalidation: {
                fileWatching: true,
                patterns: ['src/**/*', 'specs/**/*'],
                strategies: ['immediate', 'batch']
            },
            optimization: {
                precompute: true,
                compression: true,
                distribution: false
            },
            ...config
        };
        this.cacheManager = (0, cache_manager_1.getCacheManager)();
    }
    /**
     * Initialize cache integration
     */
    async initialize() {
        if (!this.config.enabled) {
            console.log('Cache integration disabled');
            return;
        }
        // Warm cache if enabled
        if (this.config.warming.enabled) {
            await this.warmCache();
        }
        // Setup file watching for invalidation
        if (this.config.invalidation.fileWatching) {
            await this.setupFileWatching();
        }
        console.log('Cache integration service initialized');
    }
    /**
     * Create cached parser service wrapper
     */
    createCachedParserService(parserService) {
        return new CachedParserService(parserService, this.cacheManager);
    }
    /**
     * Create cached AI service wrapper
     */
    createCachedAIService(aiService) {
        return new CachedAIService(aiService, this.cacheManager);
    }
    /**
     * Create cached generation service wrapper
     */
    createCachedGenerationService(generationService) {
        return new CachedGenerationService(generationService, this.cacheManager);
    }
    /**
     * Create cached CLI service wrapper
     */
    createCachedCLIService(cliService) {
        return new CachedCLIService(cliService, this.cacheManager);
    }
    /**
     * Warm cache with common operations
     */
    async warmCache() {
        console.log('Warming cache...');
        // Cache warming logic would go here
        // This is a placeholder implementation
        const warmingTasks = [
            this.warmCommonParsers(),
            this.warmAITemplates(),
            this.warmGenerationTemplates()
        ];
        await Promise.allSettled(warmingTasks);
        console.log('Cache warming completed');
    }
    async warmCommonParsers() {
        // Pre-cache common parser configurations
        console.log('Warming parser cache...');
    }
    async warmAITemplates() {
        // Pre-cache AI response templates
        console.log('Warming AI cache...');
    }
    async warmGenerationTemplates() {
        // Pre-cache generation templates
        console.log('Warming generation cache...');
    }
    async setupFileWatching() {
        // Setup file system watching for cache invalidation
        console.log('Setting up file watching for cache invalidation...');
    }
}
exports.CacheIntegrationService = CacheIntegrationService;
/**
 * Cached wrapper for ParserService
 */
class CachedParserService {
    constructor(parserService, cacheManager) {
        this.parserService = parserService;
        this.cacheManager = cacheManager;
    }
    async parse(request) {
        const cacheKey = this.generateParseKey(request);
        // Try to get from cache first
        const cached = await this.cacheManager.getParserResult(cacheKey);
        if (cached.success && cached.value) {
            console.log(`Parser cache hit for ${request.input?.path || 'unknown'}`);
            return cached.value;
        }
        // Parse and cache result
        console.log(`Parser cache miss for ${request.input?.path || 'unknown'}, parsing...`);
        const result = await this.parserService.parse(request);
        // Cache the result with 1 hour TTL
        await this.cacheManager.setParserResult(cacheKey, result, 3600000);
        return result;
    }
    async extract(request) {
        const cacheKey = this.generateExtractKey(request);
        const cached = await this.cacheManager.getParserResult(cacheKey);
        if (cached.success && cached.value) {
            console.log('Data extraction cache hit');
            return cached.value;
        }
        console.log('Data extraction cache miss, extracting...');
        const result = await this.parserService.extract(request);
        await this.cacheManager.setParserResult(cacheKey, result, 3600000);
        return result;
    }
    async validate(request) {
        const cacheKey = this.generateValidateKey(request);
        const cached = await this.cacheManager.getParserResult(cacheKey);
        if (cached.success && cached.value) {
            console.log('Validation cache hit');
            return cached.value;
        }
        console.log('Validation cache miss, validating...');
        const result = await this.parserService.validate(request);
        // Cache validation results for 30 minutes
        await this.cacheManager.setParserResult(cacheKey, result, 1800000);
        return result;
    }
    generateParseKey(request) {
        const hash = crypto.createHash('sha256').update(JSON.stringify(request)).digest('hex').substring(0, 16);
        return `parse:${hash}`;
    }
    generateExtractKey(request) {
        const hash = crypto.createHash('sha256').update(JSON.stringify(request)).digest('hex').substring(0, 16);
        return `extract:${hash}`;
    }
    generateValidateKey(request) {
        const hash = crypto.createHash('sha256').update(JSON.stringify(request)).digest('hex').substring(0, 16);
        return `validate:${hash}`;
    }
}
exports.CachedParserService = CachedParserService;
/**
 * Cached wrapper for AIService
 */
class CachedAIService {
    constructor(aiService, cacheManager) {
        this.aiService = aiService;
        this.cacheManager = cacheManager;
    }
    async enhance(request) {
        const cacheKey = this.generateEnhanceKey(request);
        const cached = await this.cacheManager.getAIResponse(cacheKey);
        if (cached.success && cached.value) {
            console.log('AI enhancement cache hit');
            return cached.value;
        }
        console.log('AI enhancement cache miss, enhancing...');
        const result = await this.aiService.enhance(request);
        // Cache AI responses for 2 hours
        await this.cacheManager.setAIResponse(cacheKey, result, 7200000);
        return result;
    }
    async summarize(request) {
        const cacheKey = this.generateSummaryKey(request);
        const cached = await this.cacheManager.getAIResponse(cacheKey);
        if (cached.success && cached.value) {
            console.log('AI summary cache hit');
            return cached.value;
        }
        console.log('AI summary cache miss, generating...');
        const result = await this.aiService.summarize(request);
        await this.cacheManager.setAIResponse(cacheKey, result, 7200000);
        return result;
    }
    async validate(request) {
        const cacheKey = this.generateValidationKey(request);
        const cached = await this.cacheManager.getAIResponse(cacheKey);
        if (cached.success && cached.value) {
            console.log('AI validation cache hit');
            return cached.value;
        }
        console.log('AI validation cache miss, analyzing...');
        const result = await this.aiService.validate(request);
        await this.cacheManager.setAIResponse(cacheKey, result, 7200000);
        return result;
    }
    generateEnhanceKey(request) {
        const hash = crypto.createHash('sha256').update(JSON.stringify(request)).digest('hex').substring(0, 16);
        return `enhance:${hash}`;
    }
    generateSummaryKey(request) {
        const hash = crypto.createHash('sha256').update(JSON.stringify(request)).digest('hex').substring(0, 16);
        return `summary:${hash}`;
    }
    generateValidationKey(request) {
        const hash = crypto.createHash('sha256').update(JSON.stringify(request)).digest('hex').substring(0, 16);
        return `validation:${hash}`;
    }
}
exports.CachedAIService = CachedAIService;
/**
 * Cached wrapper for GenerationService
 */
class CachedGenerationService {
    constructor(generationService, cacheManager) {
        this.generationService = generationService;
        this.cacheManager = cacheManager;
    }
    async generate(request) {
        const cacheKey = this.generateGenerateKey(request);
        const cached = await this.cacheManager.getGenerationResult(cacheKey);
        if (cached.success && cached.value) {
            console.log('Documentation generation cache hit');
            return cached.value;
        }
        console.log('Documentation generation cache miss, generating...');
        const result = await this.generationService.generate(request);
        // Cache generated documentation for 1 hour
        await this.cacheManager.setGenerationResult(cacheKey, result, 3600000);
        return result;
    }
    async render(request) {
        const cacheKey = this.generateRenderKey(request);
        const cached = await this.cacheManager.getGenerationResult(cacheKey);
        if (cached.success && cached.value) {
            console.log('Template rendering cache hit');
            return cached.value;
        }
        console.log('Template rendering cache miss, rendering...');
        const result = await this.generationService.render(request);
        await this.cacheManager.setGenerationResult(cacheKey, result, 3600000);
        return result;
    }
    async preview(request) {
        const cacheKey = this.generatePreviewKey(request);
        const cached = await this.cacheManager.getGenerationResult(cacheKey);
        if (cached.success && cached.value) {
            console.log('Preview cache hit');
            return cached.value;
        }
        console.log('Preview cache miss, generating...');
        const result = await this.generationService.preview(request);
        await this.cacheManager.setGenerationResult(cacheKey, result, 3600000);
        return result;
    }
    generateGenerateKey(request) {
        const hash = crypto.createHash('sha256').update(JSON.stringify(request)).digest('hex').substring(0, 16);
        return `generate:${hash}`;
    }
    generateRenderKey(request) {
        const hash = crypto.createHash('sha256').update(JSON.stringify(request)).digest('hex').substring(0, 16);
        return `render:${hash}`;
    }
    generatePreviewKey(request) {
        const hash = crypto.createHash('sha256').update(JSON.stringify(request)).digest('hex').substring(0, 16);
        return `preview:${hash}`;
    }
}
exports.CachedGenerationService = CachedGenerationService;
/**
 * Cached wrapper for CLIService
 */
class CachedCLIService {
    constructor(cliService, cacheManager) {
        this.cliService = cliService;
        this.cacheManager = cacheManager;
    }
    async generate(request) {
        // Don't cache generate commands as they have side effects
        return this.cliService.generate(request);
    }
    async validate(request) {
        const cacheKey = this.generateValidateKey(request);
        const cached = await this.cacheManager.getSessionData(cacheKey);
        if (cached.success && cached.value) {
            console.log('CLI validation cache hit');
            return cached.value;
        }
        console.log('CLI validation cache miss');
        const result = await this.cliService.validate(request);
        // Cache CLI results for 10 minutes
        await this.cacheManager.setSessionData(cacheKey, result, 600000);
        return result;
    }
    async diff(request) {
        const cacheKey = this.generateDiffKey(request);
        const cached = await this.cacheManager.getSessionData(cacheKey);
        if (cached.success && cached.value) {
            console.log('CLI diff cache hit');
            return cached.value;
        }
        console.log('CLI diff cache miss');
        const result = await this.cliService.diff(request);
        await this.cacheManager.setSessionData(cacheKey, result, 600000);
        return result;
    }
    generateValidateKey(request) {
        const hash = crypto.createHash('sha256').update(JSON.stringify(request)).digest('hex').substring(0, 16);
        return `cli-validate:${hash}`;
    }
    generateDiffKey(request) {
        const hash = crypto.createHash('sha256').update(JSON.stringify(request)).digest('hex').substring(0, 16);
        return `cli-diff:${hash}`;
    }
}
exports.CachedCLIService = CachedCLIService;
/**
 * Global cache integration service instance
 */
exports.globalCacheIntegration = null;
/**
 * Initialize global cache integration service
 */
async function initializeCacheIntegration(config) {
    exports.globalCacheIntegration = new CacheIntegrationService(config);
    await exports.globalCacheIntegration.initialize();
    return exports.globalCacheIntegration;
}
/**
 * Get global cache integration service
 */
function getCacheIntegration() {
    if (!exports.globalCacheIntegration) {
        throw new Error('Cache integration not initialized. Call initializeCacheIntegration() first.');
    }
    return exports.globalCacheIntegration;
}
//# sourceMappingURL=cache-integration.js.map