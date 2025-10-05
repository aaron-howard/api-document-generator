/**
 * ErrorLog Model
 * 
 * Comprehensive error logging system with categorization, debugging information,
 * recovery suggestions, and analytics tracking.
 * 
 * @packageDocumentation
 */

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  FATAL = 'fatal',
  CRITICAL = 'critical',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace'
}

/**
 * Error categories for classification
 */
export enum ErrorCategory {
  SYSTEM = 'system',
  NETWORK = 'network',
  PARSING = 'parsing',
  VALIDATION = 'validation',
  GENERATION = 'generation',
  TEMPLATE = 'template',
  CACHE = 'cache',
  CONFIGURATION = 'configuration',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  RATE_LIMIT = 'rate-limit',
  QUOTA_EXCEEDED = 'quota-exceeded',
  TIMEOUT = 'timeout',
  FILE_SYSTEM = 'file-system',
  EXTERNAL_SERVICE = 'external-service',
  USER_INPUT = 'user-input',
  BUSINESS_LOGIC = 'business-logic',
  DEPENDENCY = 'dependency',
  PERFORMANCE = 'performance',
  MEMORY = 'memory',
  CUSTOM = 'custom'
}

/**
 * Error subsystems for more specific categorization
 */
export enum ErrorSubsystem {
  CLI = 'cli',
  API = 'api',
  PARSER = 'parser',
  GENERATOR = 'generator',
  VALIDATOR = 'validator',
  CACHE_MANAGER = 'cache-manager',
  TEMPLATE_ENGINE = 'template-engine',
  AI_SERVICE = 'ai-service',
  FILE_MANAGER = 'file-manager',
  CONFIG_MANAGER = 'config-manager',
  SESSION_MANAGER = 'session-manager',
  REPORT_GENERATOR = 'report-generator',
  SCHEMA_PROCESSOR = 'schema-processor',
  ENDPOINT_PROCESSOR = 'endpoint-processor',
  OUTPUT_WRITER = 'output-writer'
}

/**
 * Recovery action types
 */
export enum RecoveryAction {
  RETRY = 'retry',
  SKIP = 'skip',
  FALLBACK = 'fallback',
  MANUAL_INTERVENTION = 'manual-intervention',
  CONFIGURATION_CHANGE = 'configuration-change',
  RESTART = 'restart',
  CLEAR_CACHE = 'clear-cache',
  UPDATE_DEPENDENCY = 'update-dependency',
  INCREASE_RESOURCES = 'increase-resources',
  CONTACT_SUPPORT = 'contact-support',
  NONE = 'none'
}

/**
 * Error status tracking
 */
export enum ErrorStatus {
  NEW = 'new',
  ACKNOWLEDGED = 'acknowledged',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
  IGNORED = 'ignored',
  RECURRING = 'recurring',
  ESCALATED = 'escalated'
}

/**
 * Error impact levels
 */
export enum ErrorImpact {
  BLOCKING = 'blocking',
  DEGRADED = 'degraded',
  MINOR = 'minor',
  NEGLIGIBLE = 'negligible'
}

/**
 * Analytics aggregation periods
 */
export enum AggregationPeriod {
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year'
}

/**
 * Represents the execution context when an error occurred
 */
export interface ErrorContext {
  readonly sessionId?: string;
  readonly userId?: string;
  readonly requestId?: string;
  readonly operationId: string;
  readonly component: string;
  readonly subsystem: ErrorSubsystem;
  readonly version: string;
  readonly environment: string;
  readonly correlationId?: string;
  readonly parentOperationId?: string;
  readonly executionPath: readonly string[];
  readonly variables: Record<string, any>;
  readonly configuration: Record<string, any>;
  readonly performance: {
    readonly startTime: Date;
    readonly duration: number | undefined; // milliseconds
    readonly memoryUsage: number | undefined; // bytes
    readonly cpuUsage: number | undefined; // percentage
  };
}

/**
 * Stack trace information
 */
export interface StackTrace {
  readonly raw: string;
  readonly frames: readonly StackFrame[];
  readonly truncated: boolean;
  readonly source: 'javascript' | 'typescript' | 'system' | 'external';
}

/**
 * Individual stack frame
 */
export interface StackFrame {
  readonly function: string | undefined;
  readonly file: string | undefined;
  readonly line: number | undefined;
  readonly column: number | undefined;
  readonly source?: string;
  readonly isUserCode: boolean;
  readonly isAsyncFrame: boolean;
}

/**
 * Recovery suggestion
 */
export interface RecoverySuggestion {
  readonly action: RecoveryAction;
  readonly description: string;
  readonly confidence: number; // 0-1
  readonly automated: boolean;
  readonly estimatedTime?: number; // minutes
  readonly prerequisites: readonly string[];
  readonly risks: readonly string[];
  readonly steps: readonly {
    readonly order: number;
    readonly description: string;
    readonly automated: boolean;
    readonly command?: string;
  }[];
  readonly successCriteria: readonly string[];
}

/**
 * Error resolution information
 */
export interface ErrorResolution {
  readonly resolvedAt: Date;
  readonly resolvedBy?: string;
  readonly method: RecoveryAction;
  readonly description: string;
  readonly timeToResolve: number; // minutes
  readonly preventionMeasures: readonly string[];
  readonly followUpRequired: boolean;
  readonly effectivenesRating?: number; // 1-5
}

/**
 * Error analytics data
 */
export interface ErrorAnalytics {
  readonly firstOccurrence: Date;
  readonly lastOccurrence: Date;
  readonly occurrenceCount: number;
  readonly frequency: {
    readonly perMinute: number;
    readonly perHour: number;
    readonly perDay: number;
  };
  readonly patterns: {
    readonly timeOfDay: Record<string, number>;
    readonly dayOfWeek: Record<string, number>;
    readonly userAgent: Record<string, number>;
    readonly environment: Record<string, number>;
  };
  readonly affectedUsers: number;
  readonly affectedSessions: number;
  readonly impactMetrics: {
    readonly downtime: number; // minutes
    readonly requestsAffected: number;
    readonly revenueImpact?: number;
    readonly slaBreaches: number;
  };
  readonly correlatedErrors: readonly string[];
}

/**
 * Main error log entry interface
 */
export interface ErrorLogEntry {
  readonly id: string;
  readonly timestamp: Date;
  readonly severity: ErrorSeverity;
  readonly category: ErrorCategory;
  readonly status: ErrorStatus;
  readonly impact: ErrorImpact;
  
  // Core error information
  readonly message: string;
  readonly code: string | undefined;
  readonly type: string;
  readonly source: string;
  readonly hash: string; // for deduplication
  
  // Context and debugging
  readonly context: ErrorContext;
  readonly stackTrace: StackTrace | undefined;
  readonly originalError?: Error;
  readonly additionalData: Record<string, any>;
  
  // Recovery and resolution
  readonly suggestions: readonly RecoverySuggestion[];
  readonly resolution?: ErrorResolution;
  readonly relatedErrors: readonly string[];
  
  // Analytics and tracking
  readonly analytics: ErrorAnalytics;
  readonly tags: readonly string[];
  readonly metadata: Record<string, any>;
}

/**
 * Error log configuration
 */
export interface ErrorLogConfiguration {
  readonly retention: {
    readonly maxAge: number; // days
    readonly maxEntries: number;
    readonly compressionAge: number; // days
  };
  readonly collection: {
    readonly enabledSeverities: readonly ErrorSeverity[];
    readonly enabledCategories: readonly ErrorCategory[];
    readonly enabledSubsystems: readonly ErrorSubsystem[];
    readonly collectStackTraces: boolean;
    readonly collectPerformanceMetrics: boolean;
    readonly collectUserContext: boolean;
  };
  readonly processing: {
    readonly enableDeduplication: boolean;
    readonly deduplicationWindow: number; // minutes
    readonly enableAggregation: boolean;
    readonly aggregationInterval: number; // minutes
    readonly enableAnalytics: boolean;
  };
  readonly notifications: {
    readonly enableAlerts: boolean;
    readonly alertThresholds: {
      readonly errorRate: number; // errors per minute
      readonly criticalErrors: number;
      readonly sameErrorCount: number;
    };
    readonly channels: readonly string[];
  };
  readonly privacy: {
    readonly sanitizeUserData: boolean;
    readonly excludeFields: readonly string[];
    readonly hashSensitiveData: boolean;
  };
}

/**
 * Error log statistics
 */
export interface ErrorLogStatistics {
  readonly totalErrors: number;
  readonly errorsBySeverity: Record<ErrorSeverity, number>;
  readonly errorsByCategory: Record<ErrorCategory, number>;
  readonly errorsBySubsystem: Record<ErrorSubsystem, number>;
  readonly errorsByStatus: Record<ErrorStatus, number>;
  readonly topErrors: readonly {
    readonly hash: string;
    readonly message: string;
    readonly count: number;
    readonly lastOccurrence: Date;
  }[];
  readonly trends: {
    readonly period: AggregationPeriod;
    readonly data: readonly {
      readonly timestamp: Date;
      readonly count: number;
      readonly severityBreakdown: Record<ErrorSeverity, number>;
    }[];
  };
  readonly resolutionMetrics: {
    readonly averageResolutionTime: number; // minutes
    readonly resolutionRate: number; // percentage
    readonly mostEffectiveActions: readonly {
      readonly action: RecoveryAction;
      readonly successRate: number;
      readonly averageTime: number;
    }[];
  };
}

/**
 * Error search and filter criteria
 */
export interface ErrorSearchCriteria {
  readonly severities?: readonly ErrorSeverity[];
  readonly categories?: readonly ErrorCategory[];
  readonly subsystems?: readonly ErrorSubsystem[];
  readonly statuses?: readonly ErrorStatus[];
  readonly timeRange?: {
    readonly start: Date;
    readonly end: Date;
  };
  readonly searchText?: string;
  readonly tags?: readonly string[];
  readonly sessionId?: string;
  readonly userId?: string;
  readonly correlationId?: string;
  readonly hasResolution?: boolean;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: 'timestamp' | 'severity' | 'count' | 'impact';
  readonly sortOrder?: 'asc' | 'desc';
}

/**
 * Error log query result
 */
export interface ErrorLogQueryResult {
  readonly entries: readonly ErrorLogEntry[];
  readonly totalCount: number;
  readonly hasMore: boolean;
  readonly statistics: ErrorLogStatistics;
  readonly aggregations?: Record<string, Record<string, number>>;
}

/**
 * Error log creation parameters
 */
export interface CreateErrorLogEntryParams {
  readonly error: Error | string;
  readonly severity?: ErrorSeverity;
  readonly category?: ErrorCategory;
  readonly context: Partial<ErrorContext> & {
    readonly operationId: string;
    readonly component: string;
    readonly subsystem: ErrorSubsystem;
  };
  readonly additionalData?: Record<string, any>;
  readonly tags?: readonly string[];
  readonly metadata?: Record<string, any>;
}

/**
 * Error log update parameters
 */
export interface UpdateErrorLogEntryParams {
  readonly status?: ErrorStatus;
  readonly resolution?: ErrorResolution;
  readonly tags?: readonly string[];
  readonly metadata?: Record<string, any>;
  readonly additionalData?: Record<string, any>;
}

/**
 * Factory for creating ErrorLogEntry instances
 */
export class ErrorLogEntryFactory {
  /**
   * Creates a new error log entry
   */
  static create(params: CreateErrorLogEntryParams, config: ErrorLogConfiguration): ErrorLogEntry {
    const now = new Date();
    const errorObj = typeof params.error === 'string' 
      ? new Error(params.error) 
      : params.error;
    
    const hash = this.generateErrorHash(errorObj, params.context);
    
    return {
      id: this.generateEntryId(),
      timestamp: now,
      severity: params.severity ?? this.inferSeverity(errorObj),
      category: params.category ?? this.inferCategory(errorObj, params.context),
      status: ErrorStatus.NEW,
      impact: this.calculateImpact(params.severity ?? ErrorSeverity.ERROR, params.category),
      
      message: errorObj.message,
      code: this.extractErrorCode(errorObj) ?? undefined,
      type: errorObj.constructor.name,
      source: params.context.component,
      hash,
      
      context: this.buildContext(params.context, config),
      stackTrace: config.collection.collectStackTraces 
        ? this.parseStackTrace(errorObj.stack) ?? undefined
        : undefined,
      originalError: errorObj,
      additionalData: params.additionalData ?? {},
      
      suggestions: this.generateSuggestions(errorObj, params.category),
      relatedErrors: [],
      
      analytics: {
        firstOccurrence: now,
        lastOccurrence: now,
        occurrenceCount: 1,
        frequency: {
          perMinute: 0,
          perHour: 0,
          perDay: 0
        },
        patterns: {
          timeOfDay: {},
          dayOfWeek: {},
          userAgent: {},
          environment: {}
        },
        affectedUsers: params.context.userId ? 1 : 0,
        affectedSessions: params.context.sessionId ? 1 : 0,
        impactMetrics: {
          downtime: 0,
          requestsAffected: 1,
          slaBreaches: 0
        },
        correlatedErrors: []
      },
      
      tags: params.tags ?? [],
      metadata: params.metadata ?? {}
    };
  }

  /**
   * Creates an error log entry from existing data
   */
  static fromData(data: Partial<ErrorLogEntry> & {
    id: string;
    timestamp: Date;
    message: string;
    context: ErrorContext;
  }): ErrorLogEntry {
    return {
      severity: ErrorSeverity.ERROR,
      category: ErrorCategory.SYSTEM,
      status: ErrorStatus.NEW,
      impact: ErrorImpact.MINOR,
      code: undefined,
      type: 'Error',
      source: data.context.component,
      hash: this.generateErrorHash(new Error(data.message), data.context),
      stackTrace: undefined,
      additionalData: {},
      suggestions: [],
      relatedErrors: [],
      analytics: {
        firstOccurrence: data.timestamp,
        lastOccurrence: data.timestamp,
        occurrenceCount: 1,
        frequency: { perMinute: 0, perHour: 0, perDay: 0 },
        patterns: { timeOfDay: {}, dayOfWeek: {}, userAgent: {}, environment: {} },
        affectedUsers: 0,
        affectedSessions: 0,
        impactMetrics: { downtime: 0, requestsAffected: 1, slaBreaches: 0 },
        correlatedErrors: []
      },
      tags: [],
      metadata: {},
      ...data
    };
  }

  /**
   * Updates an existing error log entry
   */
  static update(entry: ErrorLogEntry, updates: UpdateErrorLogEntryParams): ErrorLogEntry {
    return {
      ...entry,
      ...updates,
      tags: updates.tags ?? entry.tags,
      metadata: updates.metadata ? { ...entry.metadata, ...updates.metadata } : entry.metadata,
      additionalData: updates.additionalData 
        ? { ...entry.additionalData, ...updates.additionalData } 
        : entry.additionalData
    };
  }

  /**
   * Marks an error as resolved
   */
  static resolve(
    entry: ErrorLogEntry, 
    resolution: ErrorResolution
  ): ErrorLogEntry {
    const resolutionTime = (resolution.resolvedAt.getTime() - entry.timestamp.getTime()) / (1000 * 60);
    
    return this.update(entry, {
      status: ErrorStatus.RESOLVED,
      resolution: {
        ...resolution,
        timeToResolve: resolutionTime
      }
    });
  }

  /**
   * Updates analytics for an error occurrence
   */
  static updateAnalytics(
    entry: ErrorLogEntry,
    newOccurrence: {
      timestamp: Date;
      context: Partial<ErrorContext>;
    }
  ): ErrorLogEntry {
    const now = newOccurrence.timestamp;
    const timeDiff = now.getTime() - entry.analytics.lastOccurrence.getTime();
    const hourKey = now.getHours().toString();
    const dayKey = now.getDay().toString();
    const envKey = newOccurrence.context.environment || 'unknown';

    return {
      ...entry,
      analytics: {
        ...entry.analytics,
        lastOccurrence: now,
        occurrenceCount: entry.analytics.occurrenceCount + 1,
        frequency: {
          perMinute: this.calculateFrequency(entry.analytics.occurrenceCount + 1, timeDiff, 60000),
          perHour: this.calculateFrequency(entry.analytics.occurrenceCount + 1, timeDiff, 3600000),
          perDay: this.calculateFrequency(entry.analytics.occurrenceCount + 1, timeDiff, 86400000)
        },
        patterns: {
          timeOfDay: {
            ...entry.analytics.patterns.timeOfDay,
            [hourKey]: (entry.analytics.patterns.timeOfDay[hourKey] || 0) + 1
          },
          dayOfWeek: {
            ...entry.analytics.patterns.dayOfWeek,
            [dayKey]: (entry.analytics.patterns.dayOfWeek[dayKey] || 0) + 1
          },
          userAgent: entry.analytics.patterns.userAgent,
          environment: {
            ...entry.analytics.patterns.environment,
            [envKey]: (entry.analytics.patterns.environment[envKey] || 0) + 1
          }
        },
        affectedUsers: newOccurrence.context.userId && 
          newOccurrence.context.userId !== entry.context.userId
          ? entry.analytics.affectedUsers + 1
          : entry.analytics.affectedUsers,
        affectedSessions: newOccurrence.context.sessionId &&
          newOccurrence.context.sessionId !== entry.context.sessionId
          ? entry.analytics.affectedSessions + 1
          : entry.analytics.affectedSessions,
        impactMetrics: {
          ...entry.analytics.impactMetrics,
          requestsAffected: entry.analytics.impactMetrics.requestsAffected + 1
        }
      }
    };
  }

  private static generateEntryId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `error_${timestamp}_${random}`;
  }

  private static generateErrorHash(error: Error, context: Partial<ErrorContext>): string {
    const hashInput = `${error.message}_${error.constructor.name}_${context.component}_${context.operationId}`;
    return this.simpleHash(hashInput);
  }

  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  private static inferSeverity(error: Error): ErrorSeverity {
    const message = error.message.toLowerCase();
    
    if (message.includes('fatal') || message.includes('critical')) {
      return ErrorSeverity.FATAL;
    }
    if (message.includes('warning') || message.includes('warn')) {
      return ErrorSeverity.WARNING;
    }
    if (message.includes('timeout') || message.includes('network')) {
      return ErrorSeverity.ERROR;
    }
    
    return ErrorSeverity.ERROR;
  }

  private static inferCategory(error: Error, context: Partial<ErrorContext>): ErrorCategory {
    const message = error.message.toLowerCase();
    const subsystem = context.subsystem;
    
    if (subsystem === ErrorSubsystem.PARSER) return ErrorCategory.PARSING;
    if (subsystem === ErrorSubsystem.VALIDATOR) return ErrorCategory.VALIDATION;
    if (subsystem === ErrorSubsystem.GENERATOR) return ErrorCategory.GENERATION;
    if (subsystem === ErrorSubsystem.TEMPLATE_ENGINE) return ErrorCategory.TEMPLATE;
    if (subsystem === ErrorSubsystem.CACHE_MANAGER) return ErrorCategory.CACHE;
    if (subsystem === ErrorSubsystem.CONFIG_MANAGER) return ErrorCategory.CONFIGURATION;
    
    if (message.includes('network') || message.includes('connection')) {
      return ErrorCategory.NETWORK;
    }
    if (message.includes('timeout')) {
      return ErrorCategory.TIMEOUT;
    }
    if (message.includes('permission') || message.includes('unauthorized')) {
      return ErrorCategory.AUTHORIZATION;
    }
    if (message.includes('file') || message.includes('directory')) {
      return ErrorCategory.FILE_SYSTEM;
    }
    
    return ErrorCategory.SYSTEM;
  }

  private static calculateImpact(severity: ErrorSeverity, category?: ErrorCategory): ErrorImpact {
    if (severity === ErrorSeverity.FATAL || severity === ErrorSeverity.CRITICAL) {
      return ErrorImpact.BLOCKING;
    }
    if (severity === ErrorSeverity.ERROR) {
      if (category === ErrorCategory.SYSTEM || category === ErrorCategory.NETWORK) {
        return ErrorImpact.DEGRADED;
      }
      return ErrorImpact.MINOR;
    }
    return ErrorImpact.NEGLIGIBLE;
  }

  private static buildContext(
    context: Partial<ErrorContext> & {
      operationId: string;
      component: string;
      subsystem: ErrorSubsystem;
    }, 
    config: ErrorLogConfiguration
  ): ErrorContext {
    const now = new Date();
    
    const baseContext = {
      operationId: context.operationId,
      component: context.component,
      subsystem: context.subsystem,
      version: context.version ?? '1.0.0',
      environment: context.environment ?? 'unknown',
      executionPath: context.executionPath ?? [],
      variables: config.privacy.sanitizeUserData 
        ? this.sanitizeData(context.variables ?? {}, config.privacy.excludeFields)
        : context.variables ?? {},
      configuration: context.configuration ?? {},
      performance: {
        startTime: context.performance?.startTime ?? now,
        duration: context.performance?.duration ?? undefined,
        memoryUsage: config.collection.collectPerformanceMetrics 
          ? context.performance?.memoryUsage ?? undefined
          : undefined,
        cpuUsage: config.collection.collectPerformanceMetrics 
          ? context.performance?.cpuUsage ?? undefined
          : undefined
      }
    };
    
    return {
      ...baseContext,
      ...context,
      // Ensure required fields are not overwritten
      operationId: baseContext.operationId,
      component: baseContext.component,
      subsystem: baseContext.subsystem,
      performance: baseContext.performance
    };
  }

  private static parseStackTrace(stackTrace?: string): StackTrace | undefined {
    if (!stackTrace) return undefined;
    
    const frames = stackTrace
      .split('\n')
      .slice(1) // Remove the error message line
      .map(line => this.parseStackFrame(line))
      .filter(frame => frame !== null) as StackFrame[];
    
    return {
      raw: stackTrace,
      frames,
      truncated: false,
      source: 'javascript'
    };
  }

  private static parseStackFrame(line: string): StackFrame | null {
    // Simple regex for basic stack frame parsing
    const match = line.match(/\s*at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
    if (!match) return null;
    
    const [, functionName, file, lineStr, columnStr] = match;
    
    return {
      function: functionName ?? undefined,
      file: file ?? undefined,
      line: lineStr ? parseInt(lineStr, 10) : undefined,
      column: columnStr ? parseInt(columnStr, 10) : undefined,
      isUserCode: file ? !file.includes('node_modules') : false,
      isAsyncFrame: line.includes('async')
    };
  }

  private static generateSuggestions(
    error: Error, 
    category?: ErrorCategory
  ): RecoverySuggestion[] {
    const suggestions: RecoverySuggestion[] = [];
    const message = error.message.toLowerCase();
    
    // Network-related suggestions
    if (category === ErrorCategory.NETWORK || message.includes('network')) {
      suggestions.push({
        action: RecoveryAction.RETRY,
        description: 'Retry the operation after a short delay',
        confidence: 0.8,
        automated: true,
        estimatedTime: 1,
        prerequisites: [],
        risks: ['May fail again if network issue persists'],
        steps: [
          {
            order: 1,
            description: 'Wait 1-2 seconds',
            automated: true
          },
          {
            order: 2,
            description: 'Retry the network operation',
            automated: true
          }
        ],
        successCriteria: ['Operation completes without network error']
      });
    }
    
    // Configuration-related suggestions
    if (category === ErrorCategory.CONFIGURATION) {
      suggestions.push({
        action: RecoveryAction.CONFIGURATION_CHANGE,
        description: 'Review and update configuration settings',
        confidence: 0.7,
        automated: false,
        estimatedTime: 10,
        prerequisites: ['Access to configuration files'],
        risks: ['Incorrect configuration may cause other issues'],
        steps: [
          {
            order: 1,
            description: 'Review configuration documentation',
            automated: false
          },
          {
            order: 2,
            description: 'Validate configuration against schema',
            automated: true
          },
          {
            order: 3,
            description: 'Update configuration file',
            automated: false
          }
        ],
        successCriteria: ['Configuration validates successfully', 'Operation completes without error']
      });
    }
    
    // Cache-related suggestions
    if (category === ErrorCategory.CACHE) {
      suggestions.push({
        action: RecoveryAction.CLEAR_CACHE,
        description: 'Clear the cache and retry',
        confidence: 0.9,
        automated: true,
        estimatedTime: 2,
        prerequisites: [],
        risks: ['Temporary performance impact'],
        steps: [
          {
            order: 1,
            description: 'Clear relevant cache entries',
            automated: true,
            command: 'clearCache()'
          },
          {
            order: 2,
            description: 'Retry the operation',
            automated: true
          }
        ],
        successCriteria: ['Cache cleared successfully', 'Operation completes without error']
      });
    }
    
    return suggestions;
  }

  private static extractErrorCode(error: Error): string | undefined {
    // Try to extract error code from various error properties
    const errorAny = error as any;
    return errorAny.code || errorAny.errorCode || errorAny.statusCode?.toString();
  }

  private static sanitizeData(data: Record<string, any>, excludeFields: readonly string[]): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (excludeFields.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeData(value, excludeFields);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  private static calculateFrequency(count: number, timeDiff: number, periodMs: number): number {
    if (timeDiff === 0) return 0;
    return (count * periodMs) / timeDiff;
  }
}

/**
 * Utility functions for working with error logs
 */
export class ErrorLogUtils {
  /**
   * Searches error log entries based on criteria
   */
  static searchEntries(
    entries: readonly ErrorLogEntry[], 
    criteria: ErrorSearchCriteria
  ): ErrorLogEntry[] {
    let filtered = [...entries];
    
    if (criteria.severities) {
      filtered = filtered.filter(entry => criteria.severities!.includes(entry.severity));
    }
    
    if (criteria.categories) {
      filtered = filtered.filter(entry => criteria.categories!.includes(entry.category));
    }
    
    if (criteria.subsystems) {
      filtered = filtered.filter(entry => criteria.subsystems!.includes(entry.context.subsystem));
    }
    
    if (criteria.statuses) {
      filtered = filtered.filter(entry => criteria.statuses!.includes(entry.status));
    }
    
    if (criteria.timeRange) {
      filtered = filtered.filter(entry => 
        entry.timestamp >= criteria.timeRange!.start &&
        entry.timestamp <= criteria.timeRange!.end
      );
    }
    
    if (criteria.searchText) {
      const searchLower = criteria.searchText.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.message.toLowerCase().includes(searchLower) ||
        entry.source.toLowerCase().includes(searchLower) ||
        entry.context.component.toLowerCase().includes(searchLower)
      );
    }
    
    if (criteria.tags && criteria.tags.length > 0) {
      filtered = filtered.filter(entry => 
        criteria.tags!.some(tag => entry.tags.includes(tag))
      );
    }
    
    if (criteria.sessionId) {
      filtered = filtered.filter(entry => entry.context.sessionId === criteria.sessionId);
    }
    
    if (criteria.userId) {
      filtered = filtered.filter(entry => entry.context.userId === criteria.userId);
    }
    
    if (criteria.correlationId) {
      filtered = filtered.filter(entry => entry.context.correlationId === criteria.correlationId);
    }
    
    if (criteria.hasResolution !== undefined) {
      filtered = filtered.filter(entry => !!entry.resolution === criteria.hasResolution);
    }
    
    // Sort results
    if (criteria.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;
        
        switch (criteria.sortBy) {
          case 'timestamp':
            comparison = a.timestamp.getTime() - b.timestamp.getTime();
            break;
          case 'severity':
            comparison = this.severityToNumber(a.severity) - this.severityToNumber(b.severity);
            break;
          case 'count':
            comparison = a.analytics.occurrenceCount - b.analytics.occurrenceCount;
            break;
          case 'impact':
            comparison = this.impactToNumber(a.impact) - this.impactToNumber(b.impact);
            break;
        }
        
        return criteria.sortOrder === 'desc' ? -comparison : comparison;
      });
    }
    
    // Apply pagination
    if (criteria.offset) {
      filtered = filtered.slice(criteria.offset);
    }
    
    if (criteria.limit) {
      filtered = filtered.slice(0, criteria.limit);
    }
    
    return filtered;
  }

  /**
   * Groups error entries by specified field
   */
  static groupEntries(
    entries: readonly ErrorLogEntry[], 
    groupBy: 'severity' | 'category' | 'subsystem' | 'status' | 'hash'
  ): Record<string, ErrorLogEntry[]> {
    const groups: Record<string, ErrorLogEntry[]> = {};
    
    entries.forEach(entry => {
      let key: string;
      switch (groupBy) {
        case 'severity':
          key = entry.severity;
          break;
        case 'category':
          key = entry.category;
          break;
        case 'subsystem':
          key = entry.context.subsystem;
          break;
        case 'status':
          key = entry.status;
          break;
        case 'hash':
          key = entry.hash;
          break;
        default:
          key = 'unknown';
      }
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key]!.push(entry);
    });
    
    return groups;
  }

  /**
   * Calculates statistics for error entries
   */
  static calculateStatistics(entries: readonly ErrorLogEntry[]): ErrorLogStatistics {
    const errorsBySeverity: Record<ErrorSeverity, number> = {} as Record<ErrorSeverity, number>;
    const errorsByCategory: Record<ErrorCategory, number> = {} as Record<ErrorCategory, number>;
    const errorsBySubsystem: Record<ErrorSubsystem, number> = {} as Record<ErrorSubsystem, number>;
    const errorsByStatus: Record<ErrorStatus, number> = {} as Record<ErrorStatus, number>;

    // Initialize counters
    Object.values(ErrorSeverity).forEach(severity => {
      errorsBySeverity[severity] = 0;
    });
    Object.values(ErrorCategory).forEach(category => {
      errorsByCategory[category] = 0;
    });
    Object.values(ErrorSubsystem).forEach(subsystem => {
      errorsBySubsystem[subsystem] = 0;
    });
    Object.values(ErrorStatus).forEach(status => {
      errorsByStatus[status] = 0;
    });

    // Count occurrences
    const hashCounts: Record<string, { count: number; entry: ErrorLogEntry }> = {};
    let totalResolutionTime = 0;
    let resolvedCount = 0;
    const actionCounts: Partial<Record<RecoveryAction, { count: number; totalTime: number }>> = {};

    entries.forEach(entry => {
      errorsBySeverity[entry.severity]++;
      errorsByCategory[entry.category]++;
      errorsBySubsystem[entry.context.subsystem]++;
      errorsByStatus[entry.status]++;

      // Track by hash for top errors
      if (!hashCounts[entry.hash]) {
        hashCounts[entry.hash] = { count: 0, entry };
      }
      hashCounts[entry.hash]!.count += entry.analytics.occurrenceCount;

      // Resolution metrics
      if (entry.resolution) {
        totalResolutionTime += entry.resolution.timeToResolve;
        resolvedCount++;

        const action = entry.resolution.method;
        if (!actionCounts[action]) {
          actionCounts[action] = { count: 0, totalTime: 0 };
        }
        actionCounts[action]!.count++;
        actionCounts[action]!.totalTime += entry.resolution.timeToResolve;
      }
    });

    // Top errors
    const topErrors = Object.entries(hashCounts)
      .map(([hash, data]) => ({
        hash,
        message: data.entry.message,
        count: data.count,
        lastOccurrence: data.entry.analytics.lastOccurrence
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Resolution metrics
    const averageResolutionTime = resolvedCount > 0 
      ? totalResolutionTime / resolvedCount 
      : 0;
    const resolutionRate = entries.length > 0 
      ? (resolvedCount / entries.length) * 100 
      : 0;
    const mostEffectiveActions = Object.entries(actionCounts)
      .map(([action, data]) => ({
        action: action as RecoveryAction,
        successRate: 100, // Simplified - in real implementation, track success/failure
        averageTime: data!.totalTime / data!.count
      }))
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 5);

    return {
      totalErrors: entries.length,
      errorsBySeverity,
      errorsByCategory,
      errorsBySubsystem,
      errorsByStatus,
      topErrors,
      trends: {
        period: AggregationPeriod.DAY,
        data: []
      },
      resolutionMetrics: {
        averageResolutionTime,
        resolutionRate,
        mostEffectiveActions
      }
    };
  }

  /**
   * Finds related errors based on similarity
   */
  static findRelatedErrors(
    targetEntry: ErrorLogEntry, 
    allEntries: readonly ErrorLogEntry[],
    threshold: number = 0.7
  ): ErrorLogEntry[] {
    return allEntries.filter(entry => {
      if (entry.id === targetEntry.id) return false;
      
      const similarity = this.calculateSimilarity(targetEntry, entry);
      return similarity >= threshold;
    });
  }

  /**
   * Detects error patterns and anomalies
   */
  static detectPatterns(entries: readonly ErrorLogEntry[]): {
    spikes: Array<{ timestamp: Date; count: number; severity: ErrorSeverity }>;
    recurring: Array<{ hash: string; pattern: string; confidence: number }>;
    anomalies: Array<{ entry: ErrorLogEntry; reason: string; score: number }>;
  } {
    // Simplified pattern detection - in real implementation, use more sophisticated algorithms
    const spikes = this.detectErrorSpikes(entries);
    const recurring = this.detectRecurringPatterns(entries);
    const anomalies = this.detectAnomalies(entries);
    
    return { spikes, recurring, anomalies };
  }

  private static severityToNumber(severity: ErrorSeverity): number {
    const order = {
      [ErrorSeverity.TRACE]: 0,
      [ErrorSeverity.DEBUG]: 1,
      [ErrorSeverity.INFO]: 2,
      [ErrorSeverity.WARNING]: 3,
      [ErrorSeverity.ERROR]: 4,
      [ErrorSeverity.CRITICAL]: 5,
      [ErrorSeverity.FATAL]: 6
    };
    return order[severity] || 0;
  }

  private static impactToNumber(impact: ErrorImpact): number {
    const order = {
      [ErrorImpact.NEGLIGIBLE]: 0,
      [ErrorImpact.MINOR]: 1,
      [ErrorImpact.DEGRADED]: 2,
      [ErrorImpact.BLOCKING]: 3
    };
    return order[impact] || 0;
  }

  private static calculateSimilarity(entry1: ErrorLogEntry, entry2: ErrorLogEntry): number {
    let score = 0;
    
    // Same error hash
    if (entry1.hash === entry2.hash) score += 0.5;
    
    // Same category
    if (entry1.category === entry2.category) score += 0.2;
    
    // Same subsystem
    if (entry1.context.subsystem === entry2.context.subsystem) score += 0.2;
    
    // Similar message (simple string similarity)
    const messageSimilarity = this.stringSimilarity(entry1.message, entry2.message);
    score += messageSimilarity * 0.1;
    
    return Math.min(score, 1.0);
  }

  private static stringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0]![i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j]![0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j]![i] = Math.min(
          matrix[j - 1]![i] + 1,
          matrix[j]![i - 1] + 1,
          matrix[j - 1]![i - 1] + cost
        );
      }
    }
    
    return matrix[str2.length]![str1.length]!;
  }

  private static detectErrorSpikes(entries: readonly ErrorLogEntry[]): Array<{ timestamp: Date; count: number; severity: ErrorSeverity }> {
    // Simplified spike detection
    const hourlyBuckets: Record<string, { count: number; severity: ErrorSeverity }> = {};
    
    entries.forEach(entry => {
      const hour = new Date(entry.timestamp);
      hour.setMinutes(0, 0, 0);
      const key = hour.toISOString();
      
      if (!hourlyBuckets[key]) {
        hourlyBuckets[key] = { count: 0, severity: ErrorSeverity.INFO };
      }
      
      hourlyBuckets[key]!.count++;
      if (this.severityToNumber(entry.severity) > this.severityToNumber(hourlyBuckets[key]!.severity)) {
        hourlyBuckets[key]!.severity = entry.severity;
      }
    });
    
    const average = Object.values(hourlyBuckets).reduce((sum, bucket) => sum + bucket.count, 0) / Object.keys(hourlyBuckets).length;
    const threshold = average * 2; // Simple threshold
    
    return Object.entries(hourlyBuckets)
      .filter(([, bucket]) => bucket.count > threshold)
      .map(([timestamp, bucket]) => ({
        timestamp: new Date(timestamp),
        count: bucket.count,
        severity: bucket.severity
      }));
  }

  private static detectRecurringPatterns(entries: readonly ErrorLogEntry[]): Array<{ hash: string; pattern: string; confidence: number }> {
    const hashGroups = this.groupEntries(entries, 'hash');
    
    return Object.entries(hashGroups)
      .filter(([, group]) => group.length >= 3) // At least 3 occurrences
      .map(([hash, group]) => ({
        hash,
        pattern: `Recurring every ${this.calculateAverageInterval(group)} minutes`,
        confidence: Math.min(group.length / 10, 1.0) // Simple confidence based on frequency
      }));
  }

  private static detectAnomalies(entries: readonly ErrorLogEntry[]): Array<{ entry: ErrorLogEntry; reason: string; score: number }> {
    // Simplified anomaly detection
    const anomalies: Array<{ entry: ErrorLogEntry; reason: string; score: number }> = [];
    
    entries.forEach(entry => {
      let anomalyScore = 0;
      const reasons: string[] = [];
      
      // Check for unusual severity in subsystem
      const subsystemEntries = entries.filter(e => e.context.subsystem === entry.context.subsystem);
      const averageSeverity = subsystemEntries.reduce((sum, e) => sum + this.severityToNumber(e.severity), 0) / subsystemEntries.length;
      
      if (this.severityToNumber(entry.severity) > averageSeverity + 2) {
        anomalyScore += 0.5;
        reasons.push('Unusually high severity for subsystem');
      }
      
      // Check for unique error patterns
      if (entry.analytics.occurrenceCount === 1) {
        const similarErrors = entries.filter(e => e.hash === entry.hash);
        if (similarErrors.length === 1) {
          anomalyScore += 0.3;
          reasons.push('Unique error pattern');
        }
      }
      
      if (anomalyScore > 0.5) {
        anomalies.push({
          entry,
          reason: reasons.join(', '),
          score: anomalyScore
        });
      }
    });
    
    return anomalies.sort((a, b) => b.score - a.score);
  }

  private static calculateAverageInterval(entries: ErrorLogEntry[]): number {
    if (entries.length < 2) return 0;
    
    const sortedEntries = entries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    let totalInterval = 0;
    
    for (let i = 1; i < sortedEntries.length; i++) {
      const interval = sortedEntries[i]!.timestamp.getTime() - sortedEntries[i - 1]!.timestamp.getTime();
      totalInterval += interval;
    }
    
    return Math.round(totalInterval / (sortedEntries.length - 1) / (1000 * 60)); // Convert to minutes
  }
}

/**
 * Error log aggregation and reporting utilities
 */
export class ErrorLogReportGenerator {
  /**
   * Generates an error summary report
   */
  static generateSummaryReport(
    entries: readonly ErrorLogEntry[],
    period: AggregationPeriod = AggregationPeriod.DAY
  ): {
    summary: string;
    statistics: ErrorLogStatistics;
    patterns: ReturnType<typeof ErrorLogUtils.detectPatterns>;
    recommendations: string[];
  } {
    const statistics = ErrorLogUtils.calculateStatistics(entries);
    const patterns = ErrorLogUtils.detectPatterns(entries);
    
    const summary = this.generateTextSummary(statistics, period);
    const recommendations = this.generateRecommendations(statistics, patterns);
    
    return {
      summary,
      statistics,
      patterns,
      recommendations
    };
  }

  /**
   * Exports error data in various formats
   */
  static exportData(
    entries: readonly ErrorLogEntry[],
    format: 'json' | 'csv' | 'xml'
  ): string {
    switch (format) {
      case 'json':
        return JSON.stringify(entries, null, 2);
      case 'csv':
        return this.generateCsvReport(entries);
      case 'xml':
        return this.generateXmlReport(entries);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private static generateTextSummary(statistics: ErrorLogStatistics, period: AggregationPeriod): string {
    const criticalCount = statistics.errorsBySeverity[ErrorSeverity.CRITICAL] || 0;
    const errorCount = statistics.errorsBySeverity[ErrorSeverity.ERROR] || 0;
    const warningCount = statistics.errorsBySeverity[ErrorSeverity.WARNING] || 0;
    
    return `
Error Log Summary (${period.toUpperCase()})
=====================================

Total Errors: ${statistics.totalErrors}
Critical: ${criticalCount}
Errors: ${errorCount}
Warnings: ${warningCount}

Resolution Rate: ${statistics.resolutionMetrics.resolutionRate.toFixed(1)}%
Average Resolution Time: ${statistics.resolutionMetrics.averageResolutionTime.toFixed(1)} minutes

Top Error Categories:
${Object.entries(statistics.errorsByCategory)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5)
  .map(([category, count]) => `- ${category}: ${count}`)
  .join('\n')}
`.trim();
  }

  private static generateRecommendations(
    statistics: ErrorLogStatistics,
    patterns: ReturnType<typeof ErrorLogUtils.detectPatterns>
  ): string[] {
    const recommendations: string[] = [];
    
    // High error rate recommendations
    const criticalCount = statistics.errorsBySeverity[ErrorSeverity.CRITICAL] || 0;
    if (criticalCount > 0) {
      recommendations.push(`Address ${criticalCount} critical errors immediately`);
    }
    
    // Low resolution rate
    if (statistics.resolutionMetrics.resolutionRate < 50) {
      recommendations.push('Improve error resolution processes - current rate is below 50%');
    }
    
    // Recurring patterns
    if (patterns.recurring.length > 0) {
      recommendations.push(`Investigate ${patterns.recurring.length} recurring error patterns`);
    }
    
    // Error spikes
    if (patterns.spikes.length > 0) {
      recommendations.push(`Analyze ${patterns.spikes.length} error spikes for root causes`);
    }
    
    // Top error categories
    const topCategory = Object.entries(statistics.errorsByCategory)
      .sort(([, a], [, b]) => b - a)[0];
    
    if (topCategory && topCategory[1] > statistics.totalErrors * 0.3) {
      recommendations.push(`Focus on ${topCategory[0]} errors (${topCategory[1]} occurrences)`);
    }
    
    return recommendations;
  }

  private static generateCsvReport(entries: readonly ErrorLogEntry[]): string {
    const headers = [
      'ID', 'Timestamp', 'Severity', 'Category', 'Status', 'Message',
      'Component', 'Subsystem', 'Environment', 'Occurrence Count'
    ];
    
    const rows = entries.map(entry => [
      entry.id,
      entry.timestamp.toISOString(),
      entry.severity,
      entry.category,
      entry.status,
      `"${entry.message.replace(/"/g, '""')}"`,
      entry.context.component,
      entry.context.subsystem,
      entry.context.environment,
      entry.analytics.occurrenceCount.toString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private static generateXmlReport(entries: readonly ErrorLogEntry[]): string {
    const xmlEntries = entries.map(entry => `
    <error>
      <id>${entry.id}</id>
      <timestamp>${entry.timestamp.toISOString()}</timestamp>
      <severity>${entry.severity}</severity>
      <category>${entry.category}</category>
      <status>${entry.status}</status>
      <message><![CDATA[${entry.message}]]></message>
      <context>
        <component>${entry.context.component}</component>
        <subsystem>${entry.context.subsystem}</subsystem>
        <environment>${entry.context.environment}</environment>
      </context>
      <analytics>
        <occurrenceCount>${entry.analytics.occurrenceCount}</occurrenceCount>
      </analytics>
    </error>`).join('\n');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<errorLog>
  <entries>${xmlEntries}
  </entries>
</errorLog>`;
  }
}