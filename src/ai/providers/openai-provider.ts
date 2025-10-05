/**
 * OpenAI Provider Implementation
 * 
 * Implementation of the IAIProvider interface for OpenAI's GPT models.
 * Provides text completion, chat completion, and usage tracking capabilities.
 */

import { 
  IAIProvider, 
  AICapability, 
  AICompletionOptions, 
  AICompletionResult, 
  AIUsageStats, 
  ChatMessage, 
  TokenUsage 
} from '../ai-service';

/**
 * OpenAI API configuration
 */
export interface OpenAIConfig {
  apiKey: string;
  baseURL?: string;
  organization?: string;
  project?: string;
  defaultModel?: string;
  timeout?: number;
  maxRetries?: number;
}

/**
 * OpenAI API response interfaces
 */
interface OpenAICompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    text: string;
    index: number;
    logprobs?: any;
    finish_reason: 'stop' | 'length' | 'content_filter' | null;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface OpenAIChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: 'stop' | 'length' | 'content_filter' | 'function_call' | null;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * HTTP client interface for making requests
 */
interface HTTPClient {
  request(options: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: string;
    timeout?: number;
  }): Promise<{ status: number; data: any; }>;
}

/**
 * OpenAI Provider class implementing IAIProvider
 */
export class OpenAIProvider implements IAIProvider {
  readonly name = 'openai';
  readonly capabilities: AICapability[] = [
    AICapability.TEXT_COMPLETION,
    AICapability.CHAT_COMPLETION,
    AICapability.CODE_GENERATION,
    AICapability.SUMMARIZATION,
    AICapability.ANALYSIS
  ];

  private stats: AIUsageStats = {
    totalRequests: 0,
    totalTokens: 0,
    totalCost: 0,
    averageLatency: 0,
    errorRate: 0,
    lastUsed: new Date()
  };

  private latencies: number[] = [];
  private errors = 0;
  private httpClient?: HTTPClient;

  constructor(private config: OpenAIConfig, httpClient?: HTTPClient) {
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
  setHTTPClient(client: HTTPClient): void {
    this.httpClient = client;
  }

  /**
   * Generate text completion using OpenAI GPT models
   */
  async complete(prompt: string, options?: AICompletionOptions): Promise<AICompletionResult> {
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
      const data = response as OpenAICompletionResponse;

      const result: AICompletionResult = {
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

    } catch (error) {
      this.updateStats(startTime, { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCost: 0 }, true);
      throw this.handleError(error);
    }
  }

  /**
   * Generate chat completion using OpenAI GPT models
   */
  async chat(messages: ChatMessage[], options?: AICompletionOptions): Promise<AICompletionResult> {
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
      const data = response as OpenAIChatResponse;

      const result: AICompletionResult = {
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

    } catch (error) {
      this.updateStats(startTime, { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCost: 0 }, true);
      throw this.handleError(error);
    }
  }

  /**
   * Check if the OpenAI provider is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await this.makeRequest('/v1/models', null, 'GET');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(): Promise<AIUsageStats> {
    return { ...this.stats };
  }

  // Private helper methods

  private async makeRequest(endpoint: string, body: any, method = 'POST'): Promise<any> {
    if (!this.httpClient) {
      throw new Error('HTTP client not configured. Call setHTTPClient() first.');
    }

    const url = `${this.config.baseURL || 'https://api.openai.com'}${endpoint}`;
    
    const headers: Record<string, string> = {
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
        const requestOptions: { url: string; method: string; headers: Record<string, string>; body?: string; timeout: number } = {
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
          throw new OpenAIError(
            response.status,
            errorData.error?.message || `HTTP ${response.status}`,
            errorData.error?.type || 'api_error',
            errorData.error?.code || null
          );
        }

        return response.data;

      } catch (error) {
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

  private mapFinishReason(reason: string | null | undefined): AICompletionResult['finishReason'] {
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

  private mapUsage(usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number }): TokenUsage {
    // Estimate cost based on model and tokens
    const cost = this.estimateCost(usage.prompt_tokens, usage.completion_tokens);
    
    return {
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens,
      estimatedCost: cost
    };
  }

  private estimateCost(promptTokens: number, completionTokens: number): number {
    // GPT-4 pricing (as of 2024)
    const model = this.config.defaultModel || 'gpt-4';
    
    let promptCostPer1k = 0.03;  // Default GPT-4 input cost
    let completionCostPer1k = 0.06;  // Default GPT-4 output cost
    
    if (model.includes('gpt-3.5')) {
      promptCostPer1k = 0.0015;
      completionCostPer1k = 0.002;
    } else if (model.includes('gpt-4-turbo')) {
      promptCostPer1k = 0.01;
      completionCostPer1k = 0.03;
    }
    
    const promptCost = (promptTokens / 1000) * promptCostPer1k;
    const completionCost = (completionTokens / 1000) * completionCostPer1k;
    
    return promptCost + completionCost;
  }

  private updateStats(startTime: number, usage: TokenUsage, isError: boolean): void {
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

  private handleError(error: any): Error {
    if (error instanceof OpenAIError) {
      return error;
    }
    
    if (error.message?.includes('timeout')) {
      return new OpenAIError(408, 'Request timeout', 'timeout_error', 'TIMEOUT');
    }
    
    return new OpenAIError(500, error.message || 'Unknown error', 'api_error', 'UNKNOWN');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
      // Simple promise-based delay using recursive checks
      const startTime = Date.now();
      const checkTime = () => {
        if (Date.now() - startTime >= ms) {
          resolve();
        } else {
          Promise.resolve().then(checkTime);
        }
      };
      checkTime();
    });
  }
}

/**
 * OpenAI specific error class
 */
export class OpenAIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public type: string,
    public code: string | null
  ) {
    super(message);
    this.name = 'OpenAIError';
  }

  get isRetryable(): boolean {
    // Retry on rate limits, timeouts, and server errors
    return this.statusCode === 429 || 
           this.statusCode === 408 || 
           this.statusCode >= 500 ||
           this.type === 'timeout_error';
  }
}

/**
 * Factory function to create OpenAI provider
 */
export function createOpenAIProvider(config: OpenAIConfig, httpClient?: HTTPClient): OpenAIProvider {
  return new OpenAIProvider(config, httpClient);
}

/**
 * Helper function to validate OpenAI configuration
 */
export function validateOpenAIConfig(config: Partial<OpenAIConfig>): config is OpenAIConfig {
  return !!(config.apiKey && typeof config.apiKey === 'string' && config.apiKey.trim().length > 0);
}

export default OpenAIProvider;