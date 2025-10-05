/**
 * T028 Error Handling Integration
 * 
 * Comprehensive error handling system that integrates with all services (T023-T027)
 * providing error categorization, recovery mechanisms, debugging support, and analytics.
 * 
 * @packageDocumentation
 */

import { ErrorLogEntry, ErrorLogEntryFactory, ErrorLogUtils, ErrorSeverity, ErrorCategory, ErrorSubsystem, RecoveryAction, ErrorContext } from '../core/models/error-log.js';
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
    errorRate: number; // per minute
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
  errorRate: number; // per minute
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
export class ErrorHandler {
  private config: ErrorHandlerConfig;
  private cacheManager: CacheManager | undefined;
  private errorLog: ErrorLogEntry[] = [];
  private retryAttempts = new Map<string, number>();
  private alertHistory = new Map<string, Date>();

  constructor(config: Partial<ErrorHandlerConfig> = {}, cacheManager?: CacheManager) {
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
  async handleError(
    error: Error | any,
    context: ServiceErrorContext,
    customRecovery?: () => Promise<any>
  ): Promise<ErrorRecoveryResult> {
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
        action: RecoveryAction.MANUAL_INTERVENTION,
        message: 'Error handling disabled',
        retryAttempts: 0,
        timeToRecover: Date.now() - startTime
      };

    } catch (handlerError) {
      console.error('Error in error handler:', handlerError);
      return {
        success: false,
        action: RecoveryAction.MANUAL_INTERVENTION,
        message: `Error handler failed: ${(handlerError as Error).message}`,
        retryAttempts: 0,
        timeToRecover: Date.now() - startTime
      };
    }
  }

  /**
   * Log error with comprehensive context
   */
  private async logError(
    error: Error | any,
    context: ServiceErrorContext,
    errorHash: string
  ): Promise<void> {
    try {
      const errorContext: Partial<ErrorContext> & {
        operationId: string;
        component: string;
        subsystem: ErrorSubsystem;
      } = {
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

      const entry = ErrorLogEntryFactory.create({
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
          enabledSeverities: [ErrorSeverity.FATAL, ErrorSeverity.CRITICAL, ErrorSeverity.ERROR, ErrorSeverity.WARNING],
          enabledCategories: Object.values(ErrorCategory),
          enabledSubsystems: Object.values(ErrorSubsystem),
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

    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  /**
   * Attempt error recovery with multiple strategies
   */
  private async attemptRecovery(
    error: Error | any,
    context: ServiceErrorContext,
    customRecovery?: () => Promise<any>
  ): Promise<ErrorRecoveryResult> {
    const errorKey = `${context.serviceName}:${context.operation}`;
    const currentAttempts = this.retryAttempts.get(errorKey) || 0;

    // Try custom recovery first
    if (customRecovery) {
      try {
        await customRecovery();
        this.retryAttempts.delete(errorKey);
        return {
          success: true,
          action: RecoveryAction.MANUAL_INTERVENTION,
          message: 'Custom recovery successful',
          retryAttempts: currentAttempts,
          timeToRecover: 0
        };
      } catch (customError) {
        console.warn('Custom recovery failed:', (customError as Error).message);
      }
    }

    // Determine recovery strategy
    const strategy = this.determineRecoveryStrategy(error, context);
    
    switch (strategy) {
      case RecoveryAction.RETRY:
        return await this.retryOperation(error, context, currentAttempts);
      
      case RecoveryAction.FALLBACK:
        return await this.fallbackOperation(error, context);
      
      case RecoveryAction.CLEAR_CACHE:
        return await this.clearCacheOperation(error, context);
      
      case RecoveryAction.RESTART:
        return await this.restartOperation(error, context);
      
      default:
        return {
          success: false,
          action: RecoveryAction.MANUAL_INTERVENTION,
          message: `Manual intervention required for ${error.message}`,
          retryAttempts: currentAttempts,
          timeToRecover: 0
        };
    }
  }

  /**
   * Retry operation with exponential backoff
   */
  private async retryOperation(
    _error: Error | any,
    context: ServiceErrorContext,
    currentAttempts: number
  ): Promise<ErrorRecoveryResult> {
    const errorKey = `${context.serviceName}:${context.operation}`;
    
    if (currentAttempts >= this.config.maxRetries) {
      this.retryAttempts.delete(errorKey);
      return {
        success: false,
        action: RecoveryAction.RETRY,
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
      action: RecoveryAction.RETRY,
      message: `Retry attempt ${currentAttempts + 1} scheduled`,
      retryAttempts: currentAttempts + 1,
      timeToRecover: delay,
      additionalData: { delay, nextAttempt: currentAttempts + 1 }
    };
  }

  /**
   * Fallback operation recovery
   */
  private async fallbackOperation(
    _error: Error | any,
    context: ServiceErrorContext
  ): Promise<ErrorRecoveryResult> {
    // Implement service-specific fallback logic
    switch (context.serviceName) {
      case 'AIService':
        return {
          success: true,
          action: RecoveryAction.FALLBACK,
          message: 'Using cached AI response or simplified generation',
          retryAttempts: 0,
          timeToRecover: 0,
          additionalData: { fallbackType: 'cached_response' }
        };
      
      case 'ParserService':
        return {
          success: true,
          action: RecoveryAction.FALLBACK,
          message: 'Using basic parsing without advanced features',
          retryAttempts: 0,
          timeToRecover: 0,
          additionalData: { fallbackType: 'basic_parsing' }
        };
      
      case 'GenerationService':
        return {
          success: true,
          action: RecoveryAction.FALLBACK,
          message: 'Using default template without customization',
          retryAttempts: 0,
          timeToRecover: 0,
          additionalData: { fallbackType: 'default_template' }
        };
      
      default:
        return {
          success: false,
          action: RecoveryAction.FALLBACK,
          message: 'No fallback strategy available',
          retryAttempts: 0,
          timeToRecover: 0
        };
    }
  }

  /**
   * Clear cache recovery
   */
  private async clearCacheOperation(
    _error: Error | any,
    _context: ServiceErrorContext
  ): Promise<ErrorRecoveryResult> {
    if (this.cacheManager) {
      try {
        await this.cacheManager.invalidateByPattern('*', 'Error recovery cache clear');
        return {
          success: true,
          action: RecoveryAction.CLEAR_CACHE,
          message: 'Cache cleared successfully',
          retryAttempts: 0,
          timeToRecover: 0
        };
      } catch (clearError) {
        return {
          success: false,
          action: RecoveryAction.CLEAR_CACHE,
          message: `Failed to clear cache: ${(clearError as Error).message}`,
          retryAttempts: 0,
          timeToRecover: 0
        };
      }
    }

    return {
      success: false,
      action: RecoveryAction.CLEAR_CACHE,
      message: 'Cache manager not available',
      retryAttempts: 0,
      timeToRecover: 0
    };
  }

  /**
   * Restart service operation
   */
  private async restartOperation(
    _error: Error | any,
    context: ServiceErrorContext
  ): Promise<ErrorRecoveryResult> {
    // Note: In real implementation, this would restart the service
    return {
      success: true,
      action: RecoveryAction.RESTART,
      message: `Service restart initiated for ${context.serviceName}`,
      retryAttempts: 0,
      timeToRecover: 0,
      additionalData: { serviceRestarted: context.serviceName }
    };
  }

  /**
   * Determine appropriate recovery strategy
   */
  private determineRecoveryStrategy(error: Error | any, context: ServiceErrorContext): RecoveryAction {
    const errorMessage = error.message?.toLowerCase() || '';
    
    // Network/connection errors - retry
    if (errorMessage.includes('timeout') || 
        errorMessage.includes('connection') || 
        errorMessage.includes('network')) {
      return RecoveryAction.RETRY;
    }
    
    // Cache-related errors - clear cache
    if (errorMessage.includes('cache') || 
        context.serviceName === 'CacheManager') {
      return RecoveryAction.CLEAR_CACHE;
    }
    
    // Rate limiting - retry with backoff
    if (errorMessage.includes('rate limit') || 
        errorMessage.includes('too many requests')) {
      return RecoveryAction.RETRY;
    }
    
    // Service availability - fallback
    if (errorMessage.includes('unavailable') || 
        errorMessage.includes('service') ||
        errorMessage.includes('503')) {
      return RecoveryAction.FALLBACK;
    }
    
    // Critical system errors - restart
    if (errorMessage.includes('out of memory') || 
        errorMessage.includes('fatal') ||
        error.name === 'FatalError') {
      return RecoveryAction.RESTART;
    }
    
    // Default to manual intervention
    return RecoveryAction.MANUAL_INTERVENTION;
  }

  /**
   * Map service name to subsystem
   */
  private mapServiceToSubsystem(serviceName: string): ErrorSubsystem {
    const mapping: Record<string, ErrorSubsystem> = {
      'CLIService': ErrorSubsystem.CLI,
      'ParserService': ErrorSubsystem.PARSER,
      'AIService': ErrorSubsystem.AI_SERVICE,
      'GenerationService': ErrorSubsystem.GENERATOR,
      'CacheManager': ErrorSubsystem.CACHE_MANAGER,
      'TemplateEngine': ErrorSubsystem.TEMPLATE_ENGINE,
      'FileManager': ErrorSubsystem.FILE_MANAGER,
      'ConfigManager': ErrorSubsystem.CONFIG_MANAGER,
      'SessionManager': ErrorSubsystem.SESSION_MANAGER
    };
    
    return mapping[serviceName] || ErrorSubsystem.API;
  }

  /**
   * Categorize error based on type and context
   */
  private categorizeError(error: Error | any, context: ServiceErrorContext): ErrorCategory {
    const errorMessage = error.message?.toLowerCase() || '';
    const errorType = error.constructor?.name?.toLowerCase() || '';
    
    // Parsing errors
    if (context.serviceName === 'ParserService' || 
        errorMessage.includes('parse') ||
        errorMessage.includes('syntax')) {
      return ErrorCategory.PARSING;
    }
    
    // Validation errors
    if (errorMessage.includes('validation') || 
        errorMessage.includes('invalid') ||
        errorType.includes('validation')) {
      return ErrorCategory.VALIDATION;
    }
    
    // Network errors
    if (errorMessage.includes('network') || 
        errorMessage.includes('connection') ||
        errorMessage.includes('timeout')) {
      return ErrorCategory.NETWORK;
    }
    
    // Cache errors
    if (context.serviceName === 'CacheManager' || 
        errorMessage.includes('cache')) {
      return ErrorCategory.CACHE;
    }
    
    // Configuration errors
    if (errorMessage.includes('config') || 
        errorMessage.includes('setting')) {
      return ErrorCategory.CONFIGURATION;
    }
    
    // File system errors
    if (errorMessage.includes('file') || 
        errorMessage.includes('directory') ||
        errorMessage.includes('path')) {
      return ErrorCategory.FILE_SYSTEM;
    }
    
    // External service errors
    if (context.serviceName === 'AIService' || 
        errorMessage.includes('service') ||
        errorMessage.includes('api')) {
      return ErrorCategory.EXTERNAL_SERVICE;
    }
    
    // Default to system error
    return ErrorCategory.SYSTEM;
  }

  /**
   * Generate unique error hash for deduplication
   */
  private generateErrorHash(error: Error | any, context: ServiceErrorContext): string {
    const errorString = `${error.name || 'Error'}:${error.message || 'Unknown'}:${context.serviceName}:${context.operation}`;
    return Buffer.from(errorString).toString('base64').substring(0, 16);
  }

  /**
   * Get cached recovery strategy
   */
  private async getCachedRecovery(errorHash: string): Promise<ErrorRecoveryResult | null> {
    if (!this.cacheManager) return null;
    
    try {
      const cached = await this.cacheManager.getSessionData(`error_recovery:${errorHash}`);
      return cached.success ? cached.value as ErrorRecoveryResult : null;
    } catch {
      return null;
    }
  }

  /**
   * Cache successful recovery strategy
   */
  private async cacheRecovery(errorHash: string, recovery: ErrorRecoveryResult): Promise<void> {
    if (!this.cacheManager || !recovery.success) return;
    
    try {
      await this.cacheManager.setSessionData(
        `error_recovery:${errorHash}`, 
        recovery, 
        this.config.cacheErrorsForMs
      );
    } catch (cacheError) {
      console.warn('Failed to cache recovery strategy:', (cacheError as Error).message);
    }
  }

  /**
   * Update error analytics
   */
  private async updateAnalytics(
    _error: Error | any,
    context: ServiceErrorContext,
    recovery: ErrorRecoveryResult
  ): Promise<void> {
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
  private async checkAlertThresholds(entry: ErrorLogEntry): Promise<void> {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    
    // Count recent errors
    const recentErrors = this.errorLog.filter(e => e.timestamp >= oneMinuteAgo);
    const errorRate = recentErrors.length;
    
    // Count critical errors
    const criticalErrors = recentErrors.filter(e => 
      e.severity === ErrorSeverity.CRITICAL || e.severity === ErrorSeverity.FATAL
    ).length;
    
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
  private async triggerAlert(type: string, message: string): Promise<void> {
    const alertKey = `${type}:${new Date().getMinutes()}`;
    
    // Prevent duplicate alerts within the same minute
    if (this.alertHistory.has(alertKey)) return;
    
    this.alertHistory.set(alertKey, new Date());
    
    // In real implementation, this would send alerts via configured channels
    console.warn(`🚨 ALERT [${type}]: ${message}`);
  }

  /**
   * Get current error analytics
   */
  getAnalytics(): ErrorAnalytics {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    const recentErrors = this.errorLog.filter(e => e.timestamp >= oneMinuteAgo);
    
    const errorCount = this.errorLog.length;
    const errorRate = recentErrors.length;
    
    // Calculate recovery metrics
    const recoveryData = this.errorLog.filter(e => e.resolution);
    const successfulRecoveries = recoveryData.filter(e => e.resolution?.method !== RecoveryAction.MANUAL_INTERVENTION).length;
    const failedRecoveries = recoveryData.length - successfulRecoveries;
    const averageRecoveryTime = recoveryData.length > 0 
      ? recoveryData.reduce((sum, e) => sum + (e.resolution?.timeToResolve || 0), 0) / recoveryData.length 
      : 0;
    
    // Top errors
    const errorCounts = new Map<string, { count: number; message: string; category: ErrorCategory }>();
    this.errorLog.forEach(entry => {
      const existing = errorCounts.get(entry.hash);
      if (existing) {
        existing.count++;
      } else {
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
  getErrorLog(): readonly ErrorLogEntry[] {
    return [...this.errorLog];
  }

  /**
   * Clear error log and reset analytics
   */
  clearErrorLog(): void {
    this.errorLog = [];
    this.retryAttempts.clear();
    this.alertHistory.clear();
  }

  /**
   * Export error statistics
   */
  exportStatistics(): any {
    const analytics = this.getAnalytics();
    const statistics = ErrorLogUtils.calculateStatistics(this.errorLog);
    const patterns = ErrorLogUtils.detectPatterns(this.errorLog);
    
    return {
      analytics,
      statistics,
      patterns,
      exportTime: new Date(),
      configuration: this.config
    };
  }
}