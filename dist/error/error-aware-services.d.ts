/**
 * T028 Error-Aware Service Wrappers
 *
 * Service integration layer that adds comprehensive error handling to all services.
 * Provides automatic error recovery, logging, and analytics for enhanced reliability.
 *
 * @packageDocumentation
 */
import { ErrorHandler } from './error-handler.js';
import { CacheManager } from '../cache/cache-manager.js';
/**
 * Base error-aware service wrapper
 */
export declare abstract class ErrorAwareServiceWrapper {
    protected errorHandler: ErrorHandler;
    protected serviceName: string;
    constructor(serviceName: string, cacheManager?: CacheManager);
    /**
     * Execute operation with error handling
     */
    protected executeWithErrorHandling<T>(operation: string, parameters: Record<string, any>, operationFunction: () => Promise<T>, customRecovery?: () => Promise<T>): Promise<T>;
    /**
     * Get error analytics for this service
     */
    getErrorAnalytics(): import("./error-handler.js").ErrorAnalytics;
    /**
     * Get error log entries for this service
     */
    getErrorLog(): readonly import("../core/models/error-log.js").ErrorLogEntry[];
    /**
     * Clear error log for this service
     */
    clearErrorLog(): void;
}
/**
 * Error-aware CLI Service wrapper
 */
export declare class ErrorAwareCLIService extends ErrorAwareServiceWrapper {
    private cliService;
    constructor(cliService: any, cacheManager?: CacheManager);
    executeCommand(command: string, options?: any): Promise<any>;
    getSessionInfo(sessionId: string): Promise<any>;
}
/**
 * Error-aware Parser Service wrapper
 */
export declare class ErrorAwareParserService extends ErrorAwareServiceWrapper {
    private parserService;
    constructor(parserService: any, cacheManager?: CacheManager);
    parseSpecification(filePath: string, options?: any): Promise<any>;
    validateSpecification(spec: any): Promise<any>;
}
/**
 * Error-aware AI Service wrapper
 */
export declare class ErrorAwareAIService extends ErrorAwareServiceWrapper {
    private aiService;
    constructor(aiService: any, cacheManager?: CacheManager);
    enhanceDocumentation(content: string, options?: any): Promise<any>;
    generateSummary(data: any): Promise<any>;
    generateRecommendations(analysis: any): Promise<any>;
}
/**
 * Error-aware Generation Service wrapper
 */
export declare class ErrorAwareGenerationService extends ErrorAwareServiceWrapper {
    private generationService;
    constructor(generationService: any, cacheManager?: CacheManager);
    generateDocumentation(spec: any, options?: any): Promise<any>;
    renderTemplate(template: string, data: any): Promise<any>;
    validateOutput(output: any, schema: any): Promise<any>;
}
/**
 * Error-aware service integration factory
 */
export declare class ErrorAwareServiceFactory {
    private cacheManager;
    constructor(cacheManager?: CacheManager);
    createCLIService(originalService: any): ErrorAwareCLIService;
    createParserService(originalService: any): ErrorAwareParserService;
    createAIService(originalService: any): ErrorAwareAIService;
    createGenerationService(originalService: any): ErrorAwareGenerationService;
    /**
     * Get combined error analytics from all services
     */
    getCombinedAnalytics(): any;
}
//# sourceMappingURL=error-aware-services.d.ts.map