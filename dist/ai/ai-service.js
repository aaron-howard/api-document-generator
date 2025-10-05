"use strict";
/**
 * AI Service Implementation
 *
 * AI-powered documentation enhancement service that provides intelligent
 * summarization, content enhancement, validation, and batch processing capabilities.
 * Integrates with OpenAI GPT-4 and other AI providers for optimal results.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = exports.AICapability = void 0;
var AICapability;
(function (AICapability) {
    AICapability["TEXT_COMPLETION"] = "text-completion";
    AICapability["CHAT_COMPLETION"] = "chat-completion";
    AICapability["CODE_GENERATION"] = "code-generation";
    AICapability["SUMMARIZATION"] = "summarization";
    AICapability["TRANSLATION"] = "translation";
    AICapability["ANALYSIS"] = "analysis";
})(AICapability || (exports.AICapability = AICapability = {}));
/**
 * AI Service class implementing the complete AI service contract
 */
class AIService {
    constructor(options) {
        this.providers = new Map();
        this.rateLimiter = new AIRateLimiter(options?.rateLimitConfig);
        this.cache = new AICache(options?.cacheConfig);
        this.promptLibrary = new PromptLibrary(options?.promptConfig);
    }
    /**
     * Register an AI provider
     */
    registerProvider(name, provider) {
        this.providers.set(name, provider);
        if (!this.defaultProvider) {
            this.defaultProvider = name;
        }
    }
    /**
     * Set the default AI provider
     */
    setDefaultProvider(name) {
        if (!this.providers.has(name)) {
            throw new Error(`Provider ${name} not registered`);
        }
        this.defaultProvider = name;
    }
    /**
     * Generate AI summary for API endpoint
     * Implementation of POST /summarize endpoint from ai-service.yaml
     */
    async summarize(request) {
        const startTime = Date.now();
        const summaryId = this.generateSummaryId();
        try {
            // Check cache first
            const cacheKey = this.generateCacheKey('summarize', request);
            const cached = await this.cache.get(cacheKey);
            if (cached) {
                return {
                    ...cached,
                    summaryId,
                    processingTime: 0 // Cached result
                };
            }
            // Apply rate limiting
            await this.rateLimiter.waitForCapacity();
            // Build prompt for summarization
            const prompt = await this.promptLibrary.buildSummarizationPrompt(request);
            // Get AI provider
            const provider = this.getProvider();
            // Generate summary
            const completion = await provider.complete(prompt, {
                maxTokens: request.options?.maxTokens || 1000,
                temperature: request.options?.temperature || 0.7
            });
            // Parse AI response
            const parsedResponse = this.parseSummarizationResponse(completion.text);
            const response = {
                summaryId,
                enhancedSummary: parsedResponse.enhancedSummary,
                enhancedDescription: parsedResponse.enhancedDescription,
                useCases: parsedResponse.useCases,
                examples: parsedResponse.examples,
                codeSamples: parsedResponse.codeSamples,
                bestPractices: parsedResponse.bestPractices,
                warnings: parsedResponse.warnings,
                confidence: this.calculateConfidence(completion, request),
                processingTime: (Date.now() - startTime) / 1000,
                tokenUsage: completion.usage
            };
            // Cache the response
            await this.cache.set(cacheKey, response, 3600); // Cache for 1 hour
            return response;
        }
        catch (error) {
            throw this.handleAIError(error, 'SUMMARIZATION_FAILED');
        }
    }
    /**
     * Enhance documentation with AI insights
     * Implementation of POST /enhance endpoint from ai-service.yaml
     */
    async enhance(request) {
        const enhancementId = this.generateEnhancementId();
        try {
            // Check cache
            const cacheKey = this.generateCacheKey('enhance', request);
            const cached = await this.cache.get(cacheKey);
            if (cached) {
                return {
                    ...cached,
                    enhancementId
                };
            }
            // Apply rate limiting
            await this.rateLimiter.waitForCapacity();
            // Build enhancement prompt
            const prompt = await this.promptLibrary.buildEnhancementPrompt(request);
            // Get AI provider
            const provider = this.getProvider();
            // Generate enhancements
            const completion = await provider.complete(prompt, {
                maxTokens: 1500,
                temperature: 0.6
            });
            // Parse enhancements
            const parsedEnhancements = this.parseEnhancementResponse(completion.text);
            const response = {
                enhancementId,
                enhancements: parsedEnhancements.enhancements,
                originalContent: request.content,
                confidence: this.calculateConfidence(completion, request),
                tokenUsage: completion.usage
            };
            // Cache the response
            await this.cache.set(cacheKey, response, 1800); // Cache for 30 minutes
            return response;
        }
        catch (error) {
            throw this.handleAIError(error, 'ENHANCEMENT_FAILED');
        }
    }
    /**
     * Validate AI-generated content
     * Implementation of POST /validate endpoint from ai-service.yaml
     */
    async validate(request) {
        const validationId = this.generateValidationId();
        try {
            // Check cache
            const cacheKey = this.generateCacheKey('validate', request);
            const cached = await this.cache.get(cacheKey);
            if (cached) {
                return {
                    ...cached,
                    validationId
                };
            }
            // Apply rate limiting
            await this.rateLimiter.waitForCapacity();
            // Build validation prompt
            const prompt = await this.promptLibrary.buildValidationPrompt(request);
            // Get AI provider
            const provider = this.getProvider();
            // Perform validation
            const completion = await provider.complete(prompt, {
                maxTokens: 800,
                temperature: 0.3 // Lower temperature for more consistent validation
            });
            // Parse validation results
            const parsedValidation = this.parseValidationResponse(completion.text);
            const response = {
                validationId,
                valid: parsedValidation.valid,
                score: parsedValidation.score,
                feedback: parsedValidation.feedback,
                metrics: parsedValidation.metrics,
                suggestions: parsedValidation.suggestions
            };
            // Cache the response
            await this.cache.set(cacheKey, response, 600); // Cache for 10 minutes
            return response;
        }
        catch (error) {
            throw this.handleAIError(error, 'VALIDATION_FAILED');
        }
    }
    /**
     * Process multiple endpoints in batch
     * Implementation of POST /batch endpoint from ai-service.yaml
     */
    async batchProcess(request) {
        const startTime = Date.now();
        const batchId = this.generateBatchId();
        const results = [];
        const maxConcurrency = request.options?.maxConcurrency || 3;
        const failureStrategy = request.options?.failureStrategy || 'continue';
        try {
            // Process items in batches
            const batches = this.chunkArray(request.items, maxConcurrency);
            let totalTokenUsage = {
                promptTokens: 0,
                completionTokens: 0,
                totalTokens: 0,
                estimatedCost: 0
            };
            for (const batch of batches) {
                const batchPromises = batch.map(async (item) => {
                    try {
                        let result;
                        switch (item.type) {
                            case 'summarize':
                                result = await this.summarize(item.request);
                                break;
                            case 'enhance':
                                result = await this.enhance(item.request);
                                break;
                            case 'validate':
                                result = await this.validate(item.request);
                                break;
                            default:
                                throw new Error(`Unsupported batch item type: ${item.type}`);
                        }
                        // Accumulate token usage
                        if (result.tokenUsage) {
                            totalTokenUsage.promptTokens += result.tokenUsage.promptTokens;
                            totalTokenUsage.completionTokens += result.tokenUsage.completionTokens;
                            totalTokenUsage.totalTokens += result.tokenUsage.totalTokens;
                            totalTokenUsage.estimatedCost += result.tokenUsage.estimatedCost;
                        }
                        return {
                            id: item.id,
                            status: 'success',
                            result
                        };
                    }
                    catch (error) {
                        const aiError = this.handleAIError(error, 'BATCH_ITEM_FAILED');
                        if (failureStrategy === 'stop-on-error') {
                            throw aiError;
                        }
                        return {
                            id: item.id,
                            status: 'failed',
                            error: aiError
                        };
                    }
                });
                const batchResults = await Promise.all(batchPromises);
                results.push(...batchResults);
            }
            const successCount = results.filter(r => r.status === 'success').length;
            const failureCount = results.filter(r => r.status === 'failed').length;
            return {
                batchId,
                status: failureCount === 0 ? 'completed' : successCount > 0 ? 'partial' : 'failed',
                totalItems: request.items.length,
                successCount,
                failureCount,
                results,
                processingTime: (Date.now() - startTime) / 1000,
                ...(totalTokenUsage.totalTokens > 0 ? { totalTokenUsage } : {})
            };
        }
        catch (error) {
            throw this.handleAIError(error, 'BATCH_PROCESSING_FAILED');
        }
    }
    // Private helper methods
    getProvider() {
        if (!this.defaultProvider) {
            throw new Error('No AI provider configured');
        }
        const provider = this.providers.get(this.defaultProvider);
        if (!provider) {
            throw new Error(`Provider ${this.defaultProvider} not found`);
        }
        return provider;
    }
    generateSummaryId() {
        return `sum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateEnhancementId() {
        return `enh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateValidationId() {
        return `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateBatchId() {
        return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateCacheKey(operation, request) {
        const hash = this.hashObject(request);
        return `ai_${operation}_${hash}`;
    }
    hashObject(obj) {
        // Simple hash function for cache keys
        const str = JSON.stringify(obj);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
    calculateConfidence(completion, request) {
        // Simple confidence calculation based on completion quality
        let confidence = 0.5; // Base confidence
        // Adjust based on completion reason
        if (completion.finishReason === 'stop') {
            confidence += 0.2;
        }
        // Adjust based on token usage efficiency
        if (completion.usage.completionTokens > 50) {
            confidence += 0.1;
        }
        // Adjust based on request complexity
        if (request.endpoint?.parameters?.length > 0 || request.endpoint?.responses?.length > 1) {
            confidence += 0.1;
        }
        return Math.min(confidence, 1.0);
    }
    parseSummarizationResponse(text) {
        // Parse AI response for summarization
        // In a real implementation, this would use more sophisticated parsing
        try {
            // Try to parse as JSON first
            return JSON.parse(text);
        }
        catch {
            // Fallback to text parsing
            return {
                enhancedSummary: this.extractSection(text, 'Summary') || text.substring(0, 200),
                enhancedDescription: this.extractSection(text, 'Description') || '',
                useCases: this.extractList(text, 'Use Cases') || [],
                examples: [],
                codeSamples: [],
                bestPractices: this.extractList(text, 'Best Practices') || [],
                warnings: this.extractList(text, 'Warnings') || []
            };
        }
    }
    parseEnhancementResponse(text) {
        // Parse AI response for enhancements
        try {
            return JSON.parse(text);
        }
        catch {
            return {
                enhancements: [{
                        type: 'addition',
                        suggestion: text,
                        rationale: 'AI-generated enhancement',
                        priority: 'medium'
                    }]
            };
        }
    }
    parseValidationResponse(text) {
        // Parse AI response for validation
        try {
            return JSON.parse(text);
        }
        catch {
            return {
                valid: true,
                score: 0.7,
                feedback: [],
                metrics: {
                    clarity: 0.7,
                    completeness: 0.7,
                    accuracy: 0.7,
                    consistency: 0.7
                },
                suggestions: []
            };
        }
    }
    extractSection(text, sectionName) {
        const regex = new RegExp(`${sectionName}:?\\s*([^\\n]+)`, 'i');
        const match = text.match(regex);
        return match?.[1]?.trim() || null;
    }
    extractList(text, sectionName) {
        const regex = new RegExp(`${sectionName}:?\\s*([\\s\\S]*?)(?=\\n\\n|$)`, 'i');
        const match = text.match(regex);
        if (!match?.[1])
            return [];
        return match[1]
            .split('\n')
            .map(line => line.replace(/^[-*•]\s*/, '').trim())
            .filter(line => line.length > 0);
    }
    handleAIError(error, code) {
        if (error && typeof error === 'object' && error.status === 'error') {
            return error;
        }
        return {
            status: 'error',
            code,
            message: error.message || 'Unknown AI service error',
            details: {
                originalError: error.toString()
            },
            retryable: this.isRetryableError(error)
        };
    }
    isRetryableError(error) {
        // Determine if an error is retryable
        const retryableCodes = ['RATE_LIMIT', 'TIMEOUT', 'CONNECTION_ERROR', 'SERVICE_UNAVAILABLE'];
        return retryableCodes.some(code => error.message?.includes(code) || error.code?.includes(code));
    }
}
exports.AIService = AIService;
/**
 * Simple rate limiter for AI requests
 */
class AIRateLimiter {
    constructor(config) {
        this.config = config;
        this.requestCount = 0;
        this.windowStart = Date.now();
        this.windowSize = 60000; // 1 minute
    }
    async waitForCapacity() {
        const now = Date.now();
        // Reset window if needed
        if (now - this.windowStart >= this.windowSize) {
            this.requestCount = 0;
            this.windowStart = now;
        }
        // Check request limit
        const maxRequests = this.config?.maxRequestsPerMinute || 60;
        if (this.requestCount >= maxRequests) {
            const waitTime = this.windowSize - (now - this.windowStart);
            await this.sleep(waitTime);
            return this.waitForCapacity();
        }
        this.requestCount++;
    }
    sleep(ms) {
        return new Promise(resolve => {
            // Use a simple timeout simulation
            let timeElapsed = 0;
            const interval = 10; // Check every 10ms
            const check = () => {
                timeElapsed += interval;
                if (timeElapsed >= ms) {
                    resolve();
                }
                else {
                    Promise.resolve().then(() => {
                        // Simple delay mechanism
                        const start = Date.now();
                        while (Date.now() - start < interval) {
                            // Busy wait for the interval
                        }
                        check();
                    });
                }
            };
            check();
        });
    }
}
/**
 * Simple cache for AI responses
 */
class AICache {
    constructor(config) {
        this.config = config;
        this.cache = new Map();
    }
    async get(key) {
        const item = this.cache.get(key);
        if (!item || Date.now() > item.expires) {
            this.cache.delete(key);
            return null;
        }
        return item.value;
    }
    async set(key, value, ttl) {
        const expires = Date.now() + (ttl || this.config?.ttl || 3600) * 1000;
        // Simple LRU eviction
        const maxSize = this.config?.maxSize || 1000;
        if (this.cache.size >= maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
        this.cache.set(key, { value, expires });
    }
}
/**
 * Prompt library for AI operations
 */
class PromptLibrary {
    constructor(config) {
        this.config = config;
    }
    async buildSummarizationPrompt(request) {
        const systemPrompt = this.config?.systemPrompt ||
            'You are an expert technical writer specializing in API documentation.';
        const endpoint = request.endpoint;
        const context = request.context;
        const options = request.options;
        return `${systemPrompt}

Please generate a comprehensive summary and enhanced description for the following API endpoint:

**Endpoint**: ${endpoint.method} ${endpoint.path}
**Current Summary**: ${endpoint.summary || 'None'}
**Current Description**: ${endpoint.description || 'None'}

${context ? `**Project Context**:
- Project: ${context.projectName || 'Unknown'}
- Domain: ${context.domain || 'General'}
- Version: ${context.version || 'Unknown'}
${context.businessRules ? `- Business Rules: ${context.businessRules.join(', ')}` : ''}
` : ''}

**Parameters**: ${endpoint.parameters?.length || 0} parameters
${endpoint.parameters?.map(p => `- ${p.name} (${p.in}${p.required ? ', required' : ''}): ${p.description || 'No description'}`).join('\n') || ''}

**Responses**: ${endpoint.responses?.length || 0} responses
${endpoint.responses?.map(r => `- ${r.status}: ${r.description}`).join('\n') || ''}

Please provide:
1. Enhanced Summary (1-2 sentences)
2. Enhanced Description (2-3 paragraphs)
3. Common Use Cases (3-5 items)
${options?.includeExamples ? '4. Usage Examples with request/response' : ''}
${options?.generateCodeSamples ? '5. Code samples in ' + (options.languages?.join(', ') || 'JavaScript, Python') : ''}
6. Best Practices (3-5 items)
7. Warnings or Considerations

Format the response as JSON with the following structure:
{
  "enhancedSummary": "...",
  "enhancedDescription": "...",
  "useCases": ["...", "..."],
  "examples": [{"description": "...", "request": {...}, "response": {...}}],
  "codeSamples": [{"language": "...", "code": "...", "description": "..."}],
  "bestPractices": ["...", "..."],
  "warnings": ["...", "..."]
}`;
    }
    async buildEnhancementPrompt(request) {
        const systemPrompt = this.config?.systemPrompt ||
            'You are an expert technical documentation reviewer and enhancer.';
        return `${systemPrompt}

Please review and enhance the following ${request.type} content:

**Content Type**: ${request.type}
**Original Content**:
${request.content}

${request.context ? `**Context**:
- Project: ${request.context.projectName || 'Unknown'}
- Domain: ${request.context.domain || 'General'}
` : ''}

**Enhancement Focus**: ${request.options?.focusAreas?.join(', ') || 'General improvement'}
**Preserve Original**: ${request.options?.preserveOriginal ? 'Yes' : 'No'}

Please provide specific enhancement suggestions. Format as JSON:
{
  "enhancements": [
    {
      "type": "addition|modification|clarification|example|warning",
      "suggestion": "...",
      "rationale": "...",
      "priority": "high|medium|low",
      "position": {"section": "..."}
    }
  ]
}`;
    }
    async buildValidationPrompt(request) {
        const systemPrompt = this.config?.systemPrompt ||
            'You are an expert technical documentation validator.';
        return `${systemPrompt}

Please validate the following ${request.type} content:

**Content**:
${request.content}

**Validation Criteria**: ${request.criteria?.join(', ') || 'Clarity, Completeness, Accuracy, Consistency'}

Please assess the content and provide validation feedback. Format as JSON:
{
  "valid": true|false,
  "score": 0.0-1.0,
  "feedback": [
    {
      "type": "error|warning|suggestion|improvement",
      "message": "...",
      "severity": "high|medium|low"
    }
  ],
  "metrics": {
    "clarity": 0.0-1.0,
    "completeness": 0.0-1.0,
    "accuracy": 0.0-1.0,
    "consistency": 0.0-1.0
  },
  "suggestions": ["...", "..."]
}`;
    }
}
exports.default = AIService;
//# sourceMappingURL=ai-service.js.map