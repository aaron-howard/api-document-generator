"use strict";
/**
 * OpenAI Provider Implementation
 *
 * Implementation of the IAIProvider interface for OpenAI's GPT models.
 * Provides text completion, chat completion, and usage tracking capabilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIError = exports.OpenAIProvider = void 0;
exports.createOpenAIProvider = createOpenAIProvider;
exports.validateOpenAIConfig = validateOpenAIConfig;
const ai_service_1 = require("../ai-service");
/**
 * OpenAI Provider class implementing IAIProvider
 */
class OpenAIProvider {
    constructor(config, httpClient) {
        this.config = config;
        this.name = 'openai';
        this.capabilities = [
            ai_service_1.AICapability.TEXT_COMPLETION,
            ai_service_1.AICapability.CHAT_COMPLETION,
            ai_service_1.AICapability.CODE_GENERATION,
            ai_service_1.AICapability.SUMMARIZATION,
            ai_service_1.AICapability.ANALYSIS
        ];
        this.stats = {
            totalRequests: 0,
            totalTokens: 0,
            totalCost: 0,
            averageLatency: 0,
            errorRate: 0,
            lastUsed: new Date()
        };
        this.latencies = [];
        this.errors = 0;
        if (!config.apiKey) {
            throw new Error('OpenAI API key is required');
        }
        if (httpClient) {
            this.httpClient = httpClient;
        }
    }
    /**
     * Set HTTP client for making requests
     */
    setHTTPClient(client) {
        this.httpClient = client;
    }
    /**
     * Generate text completion using OpenAI GPT models
     */
    async complete(prompt, options) {
        const startTime = Date.now();
        try {
            const requestBody = {
                model: this.config.defaultModel || 'gpt-3.5-turbo-instruct',
                prompt,
                max_tokens: options?.maxTokens || 1000,
                temperature: options?.temperature || 0.7,
                top_p: options?.topP || 1,
                frequency_penalty: options?.frequencyPenalty || 0,
                presence_penalty: options?.presencePenalty || 0,
                stop: options?.stop || null,
                stream: options?.stream || false
            };
            const response = await this.makeRequest('/v1/completions', requestBody);
            const data = response;
            const result = {
                text: data.choices[0]?.text || '',
                finishReason: this.mapFinishReason(data.choices[0]?.finish_reason),
                usage: this.mapUsage(data.usage),
                model: data.model,
                id: data.id,
                created: data.created
            };
            // Update statistics
            this.updateStats(startTime, result.usage, false);
            return result;
        }
        catch (error) {
            this.updateStats(startTime, { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCost: 0 }, true);
            throw this.handleError(error);
        }
    }
    /**
     * Generate chat completion using OpenAI GPT models
     */
    async chat(messages, options) {
        const startTime = Date.now();
        try {
            const requestBody = {
                model: this.config.defaultModel || 'gpt-4',
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content,
                    ...(msg.name && { name: msg.name })
                })),
                max_tokens: options?.maxTokens || 1000,
                temperature: options?.temperature || 0.7,
                top_p: options?.topP || 1,
                frequency_penalty: options?.frequencyPenalty || 0,
                presence_penalty: options?.presencePenalty || 0,
                stop: options?.stop || null,
                stream: options?.stream || false
            };
            const response = await this.makeRequest('/v1/chat/completions', requestBody);
            const data = response;
            const result = {
                text: data.choices[0]?.message?.content || '',
                finishReason: this.mapFinishReason(data.choices[0]?.finish_reason),
                usage: this.mapUsage(data.usage),
                model: data.model,
                id: data.id,
                created: data.created
            };
            // Update statistics
            this.updateStats(startTime, result.usage, false);
            return result;
        }
        catch (error) {
            this.updateStats(startTime, { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCost: 0 }, true);
            throw this.handleError(error);
        }
    }
    /**
     * Check if the OpenAI provider is available
     */
    async isAvailable() {
        try {
            await this.makeRequest('/v1/models', null, 'GET');
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Get usage statistics
     */
    async getUsageStats() {
        return { ...this.stats };
    }
    // Private helper methods
    async makeRequest(endpoint, body, method = 'POST') {
        if (!this.httpClient) {
            throw new Error('HTTP client not configured. Call setHTTPClient() first.');
        }
        const url = `${this.config.baseURL || 'https://api.openai.com'}${endpoint}`;
        const headers = {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'API-Documentation-Generator/1.0.0'
        };
        if (this.config.organization) {
            headers['OpenAI-Organization'] = this.config.organization;
        }
        if (this.config.project) {
            headers['OpenAI-Project'] = this.config.project;
        }
        let retries = 0;
        const maxRetries = this.config.maxRetries || 3;
        while (retries <= maxRetries) {
            try {
                const requestOptions = {
                    url,
                    method,
                    headers,
                    timeout: this.config.timeout || 30000
                };
                if (body) {
                    requestOptions.body = JSON.stringify(body);
                }
                const response = await this.httpClient.request(requestOptions);
                if (response.status >= 400) {
                    const errorData = response.data || {};
                    throw new OpenAIError(response.status, errorData.error?.message || `HTTP ${response.status}`, errorData.error?.type || 'api_error', errorData.error?.code || null);
                }
                return response.data;
            }
            catch (error) {
                retries++;
                if (retries > maxRetries) {
                    throw error;
                }
                // Exponential backoff
                const delay = Math.min(1000 * Math.pow(2, retries - 1), 10000);
                await this.sleep(delay);
            }
        }
    }
    mapFinishReason(reason) {
        switch (reason) {
            case 'stop':
                return 'stop';
            case 'length':
                return 'length';
            case 'content_filter':
                return 'content_filter';
            default:
                return 'null';
        }
    }
    mapUsage(usage) {
        // Estimate cost based on model and tokens
        const cost = this.estimateCost(usage.prompt_tokens, usage.completion_tokens);
        return {
            promptTokens: usage.prompt_tokens,
            completionTokens: usage.completion_tokens,
            totalTokens: usage.total_tokens,
            estimatedCost: cost
        };
    }
    estimateCost(promptTokens, completionTokens) {
        // GPT-4 pricing (as of 2024)
        const model = this.config.defaultModel || 'gpt-4';
        let promptCostPer1k = 0.03; // Default GPT-4 input cost
        let completionCostPer1k = 0.06; // Default GPT-4 output cost
        if (model.includes('gpt-3.5')) {
            promptCostPer1k = 0.0015;
            completionCostPer1k = 0.002;
        }
        else if (model.includes('gpt-4-turbo')) {
            promptCostPer1k = 0.01;
            completionCostPer1k = 0.03;
        }
        const promptCost = (promptTokens / 1000) * promptCostPer1k;
        const completionCost = (completionTokens / 1000) * completionCostPer1k;
        return promptCost + completionCost;
    }
    updateStats(startTime, usage, isError) {
        const latency = Date.now() - startTime;
        this.stats.totalRequests++;
        this.stats.totalTokens += usage.totalTokens;
        this.stats.totalCost += usage.estimatedCost;
        this.stats.lastUsed = new Date();
        // Track latencies for average calculation
        this.latencies.push(latency);
        if (this.latencies.length > 100) {
            this.latencies = this.latencies.slice(-100); // Keep last 100 samples
        }
        // Calculate average latency
        this.stats.averageLatency = this.latencies.reduce((sum, lat) => sum + lat, 0) / this.latencies.length;
        // Track errors
        if (isError) {
            this.errors++;
        }
        // Calculate error rate
        this.stats.errorRate = this.errors / this.stats.totalRequests;
    }
    handleError(error) {
        if (error instanceof OpenAIError) {
            return error;
        }
        if (error.message?.includes('timeout')) {
            return new OpenAIError(408, 'Request timeout', 'timeout_error', 'TIMEOUT');
        }
        return new OpenAIError(500, error.message || 'Unknown error', 'api_error', 'UNKNOWN');
    }
    sleep(ms) {
        return new Promise(resolve => {
            // Simple promise-based delay using recursive checks
            const startTime = Date.now();
            const checkTime = () => {
                if (Date.now() - startTime >= ms) {
                    resolve();
                }
                else {
                    Promise.resolve().then(checkTime);
                }
            };
            checkTime();
        });
    }
}
exports.OpenAIProvider = OpenAIProvider;
/**
 * OpenAI specific error class
 */
class OpenAIError extends Error {
    constructor(statusCode, message, type, code) {
        super(message);
        this.statusCode = statusCode;
        this.type = type;
        this.code = code;
        this.name = 'OpenAIError';
    }
    get isRetryable() {
        // Retry on rate limits, timeouts, and server errors
        return this.statusCode === 429 ||
            this.statusCode === 408 ||
            this.statusCode >= 500 ||
            this.type === 'timeout_error';
    }
}
exports.OpenAIError = OpenAIError;
/**
 * Factory function to create OpenAI provider
 */
function createOpenAIProvider(config, httpClient) {
    return new OpenAIProvider(config, httpClient);
}
/**
 * Helper function to validate OpenAI configuration
 */
function validateOpenAIConfig(config) {
    return !!(config.apiKey && typeof config.apiKey === 'string' && config.apiKey.trim().length > 0);
}
exports.default = OpenAIProvider;
//# sourceMappingURL=openai-provider.js.map