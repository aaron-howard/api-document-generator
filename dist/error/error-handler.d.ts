/**
 * T028 Error Handling Integration
 *
 * Comprehensive error handling system that integrates with all services (T023-T027)
 * providing error categorization, recovery mechanisms, debugging support, and analytics.
 *
 * @packageDocumentation
 */
import { ErrorLogEntry, ErrorCategory, RecoveryAction } from '../core/models/error-log.js';
import { CacheManager } from '../cache/cache-manager.js';
/**
 * Error handler configuration
 */
export interface ErrorHandlerConfig {
    enableLogging: boolean;
    enableRecovery: boolean;
    enableAnalytics: boolean;
    enableCaching: boolean;
    maxRetries: number;
    retryDelayMs: number;
    cacheErrorsForMs: number;
    alertThresholds: {
        errorRate: number;
        criticalErrors: number;
        sameErrorCount: number;
    };
}
/**
 * Error recovery result
 */
export interface ErrorRecoveryResult {
    success: boolean;
    action: RecoveryAction;
    message: string;
    retryAttempts: number;
    timeToRecover: number;
    additionalData?: Record<string, any>;
}
/**
 * Error handling context for service integration
 */
export interface ServiceErrorContext {
    serviceName: string;
    operation: string;
    parameters: Record<string, any>;
    sessionId?: string;
    userId?: string;
    requestId?: string;
    startTime: Date;
}
/**
 * Error analytics data
 */
export interface ErrorAnalytics {
    errorCount: number;
    errorRate: number;
    averageRecoveryTime: number;
    successfulRecoveries: number;
    failedRecoveries: number;
    topErrors: Array<{
        hash: string;
        message: string;
        count: number;
        category: ErrorCategory;
    }>;
    criticalAlerts: number;
}
/**
 * Comprehensive error handler for service integration
 */
export declare class ErrorHandler {
    private config;
    private cacheManager;
    private errorLog;
    private retryAttempts;
    private alertHistory;
    constructor(config?: Partial<ErrorHandlerConfig>, cacheManager?: CacheManager);
    /**
     * Handle error with comprehensive recovery and logging
     */
    handleError(error: Error | any, context: ServiceErrorContext, customRecovery?: () => Promise<any>): Promise<ErrorRecoveryResult>;
    /**
     * Log error with comprehensive context
     */
    private logError;
    /**
     * Attempt error recovery with multiple strategies
     */
    private attemptRecovery;
    /**
     * Retry operation with exponential backoff
     */
    private retryOperation;
    /**
     * Fallback operation recovery
     */
    private fallbackOperation;
    /**
     * Clear cache recovery
     */
    private clearCacheOperation;
    /**
     * Restart service operation
     */
    private restartOperation;
    /**
     * Determine appropriate recovery strategy
     */
    private determineRecoveryStrategy;
    /**
     * Map service name to subsystem
     */
    private mapServiceToSubsystem;
    /**
     * Categorize error based on type and context
     */
    private categorizeError;
    /**
     * Generate unique error hash for deduplication
     */
    private generateErrorHash;
    /**
     * Get cached recovery strategy
     */
    private getCachedRecovery;
    /**
     * Cache successful recovery strategy
     */
    private cacheRecovery;
    /**
     * Update error analytics
     */
    private updateAnalytics;
    /**
     * Check alert thresholds and trigger alerts
     */
    private checkAlertThresholds;
    /**
     * Trigger alert
     */
    private triggerAlert;
    /**
     * Get current error analytics
     */
    getAnalytics(): ErrorAnalytics;
    /**
     * Get error log entries
     */
    getErrorLog(): readonly ErrorLogEntry[];
    /**
     * Clear error log and reset analytics
     */
    clearErrorLog(): void;
    /**
     * Export error statistics
     */
    exportStatistics(): any;
}
//# sourceMappingURL=error-handler.d.ts.map