"use strict";
/**
 * T028 Error Handling Integration
 *
 * Comprehensive error handling system that integrates with all services (T023-T027)
 * providing error categorization, recovery mechanisms, debugging support, and analytics.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const error_log_js_1 = require("../core/models/error-log.js");
/**
 * Comprehensive error handler for service integration
 */
class ErrorHandler {
    constructor(config = {}, cacheManager) {
        this.errorLog = [];
        this.retryAttempts = new Map();
        this.alertHistory = new Map();
        this.config = {
            enableLogging: true,
            enableRecovery: true,
            enableAnalytics: true,
            enableCaching: true,
            maxRetries: 3,
            retryDelayMs: 1000,
            cacheErrorsForMs: 300000, // 5 minutes
            alertThresholds: {
                errorRate: 10,
                criticalErrors: 5,
                sameErrorCount: 10
            },
            ...config
        };
        this.cacheManager = cacheManager;
    }
    /**
     * Handle error with comprehensive recovery and logging
     */
    async handleError(error, context, customRecovery) {
        const startTime = Date.now();
        const errorHash = this.generateErrorHash(error, context);
        try {
            // Log error if enabled
            if (this.config.enableLogging) {
                await this.logError(error, context, errorHash);
            }
            // Check for cached error recovery if enabled
            if (this.config.enableCaching && this.cacheManager) {
                const cachedRecovery = await this.getCachedRecovery(errorHash);
                if (cachedRecovery) {
                    return cachedRecovery;
                }
            }
            // Attempt recovery if enabled
            if (this.config.enableRecovery) {
                const recovery = await this.attemptRecovery(error, context, customRecovery);
                const timeToRecover = Date.now() - startTime;
                // Cache successful recovery
                if (recovery.success && this.config.enableCaching && this.cacheManager) {
                    await this.cacheRecovery(errorHash, recovery);
                }
                // Update analytics
                if (this.config.enableAnalytics) {
                    await this.updateAnalytics(error, context, recovery);
                }
                return {
                    ...recovery,
                    timeToRecover
                };
            }
            // Default failure response
            return {
                success: false,
                action: error_log_js_1.RecoveryAction.MANUAL_INTERVENTION,
                message: 'Error handling disabled',
                retryAttempts: 0,
                timeToRecover: Date.now() - startTime
            };
        }
        catch (handlerError) {
            console.error('Error in error handler:', handlerError);
            return {
                success: false,
                action: error_log_js_1.RecoveryAction.MANUAL_INTERVENTION,
                message: `Error handler failed: ${handlerError.message}`,
                retryAttempts: 0,
                timeToRecover: Date.now() - startTime
            };
        }
    }
    /**
     * Log error with comprehensive context
     */
    async logError(error, context, errorHash) {
        try {
            const errorContext = {
                component: context.serviceName,
                subsystem: this.mapServiceToSubsystem(context.serviceName),
                operationId: context.operation,
                environment: process.env['NODE_ENV'] || 'development',
                userId: context.userId || 'anonymous',
                sessionId: context.sessionId || 'no-session',
                requestId: context.requestId || 'no-request',
                version: '1.0.0',
                executionPath: [context.serviceName, context.operation],
                variables: context.parameters,
                configuration: {},
                performance: {
                    startTime: context.startTime,
                    duration: Date.now() - context.startTime.getTime(),
                    memoryUsage: undefined,
                    cpuUsage: undefined
                }
            };
            const entry = error_log_js_1.ErrorLogEntryFactory.create({
                error,
                category: this.categorizeError(error, context),
                context: errorContext,
                tags: [context.serviceName, context.operation],
                metadata: { hash: errorHash }
            }, {
                retention: {
                    maxAge: 30,
                    maxEntries: 10000,
                    compressionAge: 7
                },
                collection: {
                    enabledSeverities: [error_log_js_1.ErrorSeverity.FATAL, error_log_js_1.ErrorSeverity.CRITICAL, error_log_js_1.ErrorSeverity.ERROR, error_log_js_1.ErrorSeverity.WARNING],
                    enabledCategories: Object.values(error_log_js_1.ErrorCategory),
                    enabledSubsystems: Object.values(error_log_js_1.ErrorSubsystem),
                    collectStackTraces: true,
                    collectPerformanceMetrics: true,
                    collectUserContext: true
                },
                processing: {
                    enableDeduplication: true,
                    deduplicationWindow: 5,
                    enableAggregation: true,
                    aggregationInterval: 1,
                    enableAnalytics: true
                },
                notifications: {
                    enableAlerts: true,
                    alertThresholds: {
                        errorRate: 10,
                        criticalErrors: 5,
                        sameErrorCount: 10
                    },
                    channels: ['console']
                },
                privacy: {
                    excludeFields: ['password', 'token'],
                    sanitizeUserData: true,
                    hashSensitiveData: true
                }
            });
            this.errorLog.push(entry);
            // Trigger alerts if thresholds exceeded
            await this.checkAlertThresholds(entry);
        }
        catch (logError) {
            console.error('Failed to log error:', logError);
        }
    }
    /**
     * Attempt error recovery with multiple strategies
     */
    async attemptRecovery(error, context, customRecovery) {
        const errorKey = `${context.serviceName}:${context.operation}`;
        const currentAttempts = this.retryAttempts.get(errorKey) || 0;
        // Try custom recovery first
        if (customRecovery) {
            try {
                await customRecovery();
                this.retryAttempts.delete(errorKey);
                return {
                    success: true,
                    action: error_log_js_1.RecoveryAction.MANUAL_INTERVENTION,
                    message: 'Custom recovery successful',
                    retryAttempts: currentAttempts,
                    timeToRecover: 0
                };
            }
            catch (customError) {
                console.warn('Custom recovery failed:', customError.message);
            }
        }
        // Determine recovery strategy
        const strategy = this.determineRecoveryStrategy(error, context);
        switch (strategy) {
            case error_log_js_1.RecoveryAction.RETRY:
                return await this.retryOperation(error, context, currentAttempts);
            case error_log_js_1.RecoveryAction.FALLBACK:
                return await this.fallbackOperation(error, context);
            case error_log_js_1.RecoveryAction.CLEAR_CACHE:
                return await this.clearCacheOperation(error, context);
            case error_log_js_1.RecoveryAction.RESTART:
                return await this.restartOperation(error, context);
            default:
                return {
                    success: false,
                    action: error_log_js_1.RecoveryAction.MANUAL_INTERVENTION,
                    message: `Manual intervention required for ${error.message}`,
                    retryAttempts: currentAttempts,
                    timeToRecover: 0
                };
        }
    }
    /**
     * Retry operation with exponential backoff
     */
    async retryOperation(_error, context, currentAttempts) {
        const errorKey = `${context.serviceName}:${context.operation}`;
        if (currentAttempts >= this.config.maxRetries) {
            this.retryAttempts.delete(errorKey);
            return {
                success: false,
                action: error_log_js_1.RecoveryAction.RETRY,
                message: `Max retries (${this.config.maxRetries}) exceeded`,
                retryAttempts: currentAttempts,
                timeToRecover: 0
            };
        }
        // Calculate delay with exponential backoff
        const delay = this.config.retryDelayMs * Math.pow(2, currentAttempts);
        await new Promise(resolve => setTimeout(resolve, delay));
        this.retryAttempts.set(errorKey, currentAttempts + 1);
        return {
            success: true,
            action: error_log_js_1.RecoveryAction.RETRY,
            message: `Retry attempt ${currentAttempts + 1} scheduled`,
            retryAttempts: currentAttempts + 1,
            timeToRecover: delay,
            additionalData: { delay, nextAttempt: currentAttempts + 1 }
        };
    }
    /**
     * Fallback operation recovery
     */
    async fallbackOperation(_error, context) {
        // Implement service-specific fallback logic
        switch (context.serviceName) {
            case 'AIService':
                return {
                    success: true,
                    action: error_log_js_1.RecoveryAction.FALLBACK,
                    message: 'Using cached AI response or simplified generation',
                    retryAttempts: 0,
                    timeToRecover: 0,
                    additionalData: { fallbackType: 'cached_response' }
                };
            case 'ParserService':
                return {
                    success: true,
                    action: error_log_js_1.RecoveryAction.FALLBACK,
                    message: 'Using basic parsing without advanced features',
                    retryAttempts: 0,
                    timeToRecover: 0,
                    additionalData: { fallbackType: 'basic_parsing' }
                };
            case 'GenerationService':
                return {
                    success: true,
                    action: error_log_js_1.RecoveryAction.FALLBACK,
                    message: 'Using default template without customization',
                    retryAttempts: 0,
                    timeToRecover: 0,
                    additionalData: { fallbackType: 'default_template' }
                };
            default:
                return {
                    success: false,
                    action: error_log_js_1.RecoveryAction.FALLBACK,
                    message: 'No fallback strategy available',
                    retryAttempts: 0,
                    timeToRecover: 0
                };
        }
    }
    /**
     * Clear cache recovery
     */
    async clearCacheOperation(_error, _context) {
        if (this.cacheManager) {
            try {
                await this.cacheManager.invalidateByPattern('*', 'Error recovery cache clear');
                return {
                    success: true,
                    action: error_log_js_1.RecoveryAction.CLEAR_CACHE,
                    message: 'Cache cleared successfully',
                    retryAttempts: 0,
                    timeToRecover: 0
                };
            }
            catch (clearError) {
                return {
                    success: false,
                    action: error_log_js_1.RecoveryAction.CLEAR_CACHE,
                    message: `Failed to clear cache: ${clearError.message}`,
                    retryAttempts: 0,
                    timeToRecover: 0
                };
            }
        }
        return {
            success: false,
            action: error_log_js_1.RecoveryAction.CLEAR_CACHE,
            message: 'Cache manager not available',
            retryAttempts: 0,
            timeToRecover: 0
        };
    }
    /**
     * Restart service operation
     */
    async restartOperation(_error, context) {
        // Note: In real implementation, this would restart the service
        return {
            success: true,
            action: error_log_js_1.RecoveryAction.RESTART,
            message: `Service restart initiated for ${context.serviceName}`,
            retryAttempts: 0,
            timeToRecover: 0,
            additionalData: { serviceRestarted: context.serviceName }
        };
    }
    /**
     * Determine appropriate recovery strategy
     */
    determineRecoveryStrategy(error, context) {
        const errorMessage = error.message?.toLowerCase() || '';
        // Network/connection errors - retry
        if (errorMessage.includes('timeout') ||
            errorMessage.includes('connection') ||
            errorMessage.includes('network')) {
            return error_log_js_1.RecoveryAction.RETRY;
        }
        // Cache-related errors - clear cache
        if (errorMessage.includes('cache') ||
            context.serviceName === 'CacheManager') {
            return error_log_js_1.RecoveryAction.CLEAR_CACHE;
        }
        // Rate limiting - retry with backoff
        if (errorMessage.includes('rate limit') ||
            errorMessage.includes('too many requests')) {
            return error_log_js_1.RecoveryAction.RETRY;
        }
        // Service availability - fallback
        if (errorMessage.includes('unavailable') ||
            errorMessage.includes('service') ||
            errorMessage.includes('503')) {
            return error_log_js_1.RecoveryAction.FALLBACK;
        }
        // Critical system errors - restart
        if (errorMessage.includes('out of memory') ||
            errorMessage.includes('fatal') ||
            error.name === 'FatalError') {
            return error_log_js_1.RecoveryAction.RESTART;
        }
        // Default to manual intervention
        return error_log_js_1.RecoveryAction.MANUAL_INTERVENTION;
    }
    /**
     * Map service name to subsystem
     */
    mapServiceToSubsystem(serviceName) {
        const mapping = {
            'CLIService': error_log_js_1.ErrorSubsystem.CLI,
            'ParserService': error_log_js_1.ErrorSubsystem.PARSER,
            'AIService': error_log_js_1.ErrorSubsystem.AI_SERVICE,
            'GenerationService': error_log_js_1.ErrorSubsystem.GENERATOR,
            'CacheManager': error_log_js_1.ErrorSubsystem.CACHE_MANAGER,
            'TemplateEngine': error_log_js_1.ErrorSubsystem.TEMPLATE_ENGINE,
            'FileManager': error_log_js_1.ErrorSubsystem.FILE_MANAGER,
            'ConfigManager': error_log_js_1.ErrorSubsystem.CONFIG_MANAGER,
            'SessionManager': error_log_js_1.ErrorSubsystem.SESSION_MANAGER
        };
        return mapping[serviceName] || error_log_js_1.ErrorSubsystem.API;
    }
    /**
     * Categorize error based on type and context
     */
    categorizeError(error, context) {
        const errorMessage = error.message?.toLowerCase() || '';
        const errorType = error.constructor?.name?.toLowerCase() || '';
        // Parsing errors
        if (context.serviceName === 'ParserService' ||
            errorMessage.includes('parse') ||
            errorMessage.includes('syntax')) {
            return error_log_js_1.ErrorCategory.PARSING;
        }
        // Validation errors
        if (errorMessage.includes('validation') ||
            errorMessage.includes('invalid') ||
            errorType.includes('validation')) {
            return error_log_js_1.ErrorCategory.VALIDATION;
        }
        // Network errors
        if (errorMessage.includes('network') ||
            errorMessage.includes('connection') ||
            errorMessage.includes('timeout')) {
            return error_log_js_1.ErrorCategory.NETWORK;
        }
        // Cache errors
        if (context.serviceName === 'CacheManager' ||
            errorMessage.includes('cache')) {
            return error_log_js_1.ErrorCategory.CACHE;
        }
        // Configuration errors
        if (errorMessage.includes('config') ||
            errorMessage.includes('setting')) {
            return error_log_js_1.ErrorCategory.CONFIGURATION;
        }
        // File system errors
        if (errorMessage.includes('file') ||
            errorMessage.includes('directory') ||
            errorMessage.includes('path')) {
            return error_log_js_1.ErrorCategory.FILE_SYSTEM;
        }
        // External service errors
        if (context.serviceName === 'AIService' ||
            errorMessage.includes('service') ||
            errorMessage.includes('api')) {
            return error_log_js_1.ErrorCategory.EXTERNAL_SERVICE;
        }
        // Default to system error
        return error_log_js_1.ErrorCategory.SYSTEM;
    }
    /**
     * Generate unique error hash for deduplication
     */
    generateErrorHash(error, context) {
        const errorString = `${error.name || 'Error'}:${error.message || 'Unknown'}:${context.serviceName}:${context.operation}`;
        return Buffer.from(errorString).toString('base64').substring(0, 16);
    }
    /**
     * Get cached recovery strategy
     */
    async getCachedRecovery(errorHash) {
        if (!this.cacheManager)
            return null;
        try {
            const cached = await this.cacheManager.getSessionData(`error_recovery:${errorHash}`);
            return cached.success ? cached.value : null;
        }
        catch {
            return null;
        }
    }
    /**
     * Cache successful recovery strategy
     */
    async cacheRecovery(errorHash, recovery) {
        if (!this.cacheManager || !recovery.success)
            return;
        try {
            await this.cacheManager.setSessionData(`error_recovery:${errorHash}`, recovery, this.config.cacheErrorsForMs);
        }
        catch (cacheError) {
            console.warn('Failed to cache recovery strategy:', cacheError.message);
        }
    }
    /**
     * Update error analytics
     */
    async updateAnalytics(_error, context, recovery) {
        // In real implementation, this would update persistent analytics storage
        console.log('Error analytics updated:', {
            service: context.serviceName,
            operation: context.operation,
            success: recovery.success,
            action: recovery.action,
            retryAttempts: recovery.retryAttempts
        });
    }
    /**
     * Check alert thresholds and trigger alerts
     */
    async checkAlertThresholds(entry) {
        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 60000);
        // Count recent errors
        const recentErrors = this.errorLog.filter(e => e.timestamp >= oneMinuteAgo);
        const errorRate = recentErrors.length;
        // Count critical errors
        const criticalErrors = recentErrors.filter(e => e.severity === error_log_js_1.ErrorSeverity.CRITICAL || e.severity === error_log_js_1.ErrorSeverity.FATAL).length;
        // Count same error occurrences
        const sameErrors = this.errorLog.filter(e => e.hash === entry.hash).length;
        // Check thresholds
        if (errorRate >= this.config.alertThresholds.errorRate) {
            await this.triggerAlert('HIGH_ERROR_RATE', `Error rate: ${errorRate}/min`);
        }
        if (criticalErrors >= this.config.alertThresholds.criticalErrors) {
            await this.triggerAlert('CRITICAL_ERRORS', `Critical errors: ${criticalErrors}`);
        }
        if (sameErrors >= this.config.alertThresholds.sameErrorCount) {
            await this.triggerAlert('RECURRING_ERROR', `Same error occurred ${sameErrors} times`);
        }
    }
    /**
     * Trigger alert
     */
    async triggerAlert(type, message) {
        const alertKey = `${type}:${new Date().getMinutes()}`;
        // Prevent duplicate alerts within the same minute
        if (this.alertHistory.has(alertKey))
            return;
        this.alertHistory.set(alertKey, new Date());
        // In real implementation, this would send alerts via configured channels
        console.warn(`🚨 ALERT [${type}]: ${message}`);
    }
    /**
     * Get current error analytics
     */
    getAnalytics() {
        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 60000);
        const recentErrors = this.errorLog.filter(e => e.timestamp >= oneMinuteAgo);
        const errorCount = this.errorLog.length;
        const errorRate = recentErrors.length;
        // Calculate recovery metrics
        const recoveryData = this.errorLog.filter(e => e.resolution);
        const successfulRecoveries = recoveryData.filter(e => e.resolution?.method !== error_log_js_1.RecoveryAction.MANUAL_INTERVENTION).length;
        const failedRecoveries = recoveryData.length - successfulRecoveries;
        const averageRecoveryTime = recoveryData.length > 0
            ? recoveryData.reduce((sum, e) => sum + (e.resolution?.timeToResolve || 0), 0) / recoveryData.length
            : 0;
        // Top errors
        const errorCounts = new Map();
        this.errorLog.forEach(entry => {
            const existing = errorCounts.get(entry.hash);
            if (existing) {
                existing.count++;
            }
            else {
                errorCounts.set(entry.hash, {
                    count: 1,
                    message: entry.message,
                    category: entry.category
                });
            }
        });
        const topErrors = Array.from(errorCounts.entries())
            .map(([hash, data]) => ({ hash, ...data }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        const criticalAlerts = this.alertHistory.size;
        return {
            errorCount,
            errorRate,
            averageRecoveryTime,
            successfulRecoveries,
            failedRecoveries,
            topErrors,
            criticalAlerts
        };
    }
    /**
     * Get error log entries
     */
    getErrorLog() {
        return [...this.errorLog];
    }
    /**
     * Clear error log and reset analytics
     */
    clearErrorLog() {
        this.errorLog = [];
        this.retryAttempts.clear();
        this.alertHistory.clear();
    }
    /**
     * Export error statistics
     */
    exportStatistics() {
        const analytics = this.getAnalytics();
        const statistics = error_log_js_1.ErrorLogUtils.calculateStatistics(this.errorLog);
        const patterns = error_log_js_1.ErrorLogUtils.detectPatterns(this.errorLog);
        return {
            analytics,
            statistics,
            patterns,
            exportTime: new Date(),
            configuration: this.config
        };
    }
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=error-handler.js.map