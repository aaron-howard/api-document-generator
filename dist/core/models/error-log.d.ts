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
export declare enum ErrorSeverity {
    FATAL = "fatal",
    CRITICAL = "critical",
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
    DEBUG = "debug",
    TRACE = "trace"
}
/**
 * Error categories for classification
 */
export declare enum ErrorCategory {
    SYSTEM = "system",
    NETWORK = "network",
    PARSING = "parsing",
    VALIDATION = "validation",
    GENERATION = "generation",
    TEMPLATE = "template",
    CACHE = "cache",
    CONFIGURATION = "configuration",
    AUTHENTICATION = "authentication",
    AUTHORIZATION = "authorization",
    RATE_LIMIT = "rate-limit",
    QUOTA_EXCEEDED = "quota-exceeded",
    TIMEOUT = "timeout",
    FILE_SYSTEM = "file-system",
    EXTERNAL_SERVICE = "external-service",
    USER_INPUT = "user-input",
    BUSINESS_LOGIC = "business-logic",
    DEPENDENCY = "dependency",
    PERFORMANCE = "performance",
    MEMORY = "memory",
    CUSTOM = "custom"
}
/**
 * Error subsystems for more specific categorization
 */
export declare enum ErrorSubsystem {
    CLI = "cli",
    API = "api",
    PARSER = "parser",
    GENERATOR = "generator",
    VALIDATOR = "validator",
    CACHE_MANAGER = "cache-manager",
    TEMPLATE_ENGINE = "template-engine",
    AI_SERVICE = "ai-service",
    FILE_MANAGER = "file-manager",
    CONFIG_MANAGER = "config-manager",
    SESSION_MANAGER = "session-manager",
    REPORT_GENERATOR = "report-generator",
    SCHEMA_PROCESSOR = "schema-processor",
    ENDPOINT_PROCESSOR = "endpoint-processor",
    OUTPUT_WRITER = "output-writer"
}
/**
 * Recovery action types
 */
export declare enum RecoveryAction {
    RETRY = "retry",
    SKIP = "skip",
    FALLBACK = "fallback",
    MANUAL_INTERVENTION = "manual-intervention",
    CONFIGURATION_CHANGE = "configuration-change",
    RESTART = "restart",
    CLEAR_CACHE = "clear-cache",
    UPDATE_DEPENDENCY = "update-dependency",
    INCREASE_RESOURCES = "increase-resources",
    CONTACT_SUPPORT = "contact-support",
    NONE = "none"
}
/**
 * Error status tracking
 */
export declare enum ErrorStatus {
    NEW = "new",
    ACKNOWLEDGED = "acknowledged",
    INVESTIGATING = "investigating",
    RESOLVED = "resolved",
    IGNORED = "ignored",
    RECURRING = "recurring",
    ESCALATED = "escalated"
}
/**
 * Error impact levels
 */
export declare enum ErrorImpact {
    BLOCKING = "blocking",
    DEGRADED = "degraded",
    MINOR = "minor",
    NEGLIGIBLE = "negligible"
}
/**
 * Analytics aggregation periods
 */
export declare enum AggregationPeriod {
    MINUTE = "minute",
    HOUR = "hour",
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year"
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
        readonly duration: number | undefined;
        readonly memoryUsage: number | undefined;
        readonly cpuUsage: number | undefined;
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
    readonly confidence: number;
    readonly automated: boolean;
    readonly estimatedTime?: number;
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
    readonly timeToResolve: number;
    readonly preventionMeasures: readonly string[];
    readonly followUpRequired: boolean;
    readonly effectivenesRating?: number;
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
        readonly downtime: number;
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
    readonly message: string;
    readonly code: string | undefined;
    readonly type: string;
    readonly source: string;
    readonly hash: string;
    readonly context: ErrorContext;
    readonly stackTrace: StackTrace | undefined;
    readonly originalError?: Error;
    readonly additionalData: Record<string, any>;
    readonly suggestions: readonly RecoverySuggestion[];
    readonly resolution?: ErrorResolution;
    readonly relatedErrors: readonly string[];
    readonly analytics: ErrorAnalytics;
    readonly tags: readonly string[];
    readonly metadata: Record<string, any>;
}
/**
 * Error log configuration
 */
export interface ErrorLogConfiguration {
    readonly retention: {
        readonly maxAge: number;
        readonly maxEntries: number;
        readonly compressionAge: number;
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
        readonly deduplicationWindow: number;
        readonly enableAggregation: boolean;
        readonly aggregationInterval: number;
        readonly enableAnalytics: boolean;
    };
    readonly notifications: {
        readonly enableAlerts: boolean;
        readonly alertThresholds: {
            readonly errorRate: number;
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
        readonly averageResolutionTime: number;
        readonly resolutionRate: number;
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
export declare class ErrorLogEntryFactory {
    /**
     * Creates a new error log entry
     */
    static create(params: CreateErrorLogEntryParams, config: ErrorLogConfiguration): ErrorLogEntry;
    /**
     * Creates an error log entry from existing data
     */
    static fromData(data: Partial<ErrorLogEntry> & {
        id: string;
        timestamp: Date;
        message: string;
        context: ErrorContext;
    }): ErrorLogEntry;
    /**
     * Updates an existing error log entry
     */
    static update(entry: ErrorLogEntry, updates: UpdateErrorLogEntryParams): ErrorLogEntry;
    /**
     * Marks an error as resolved
     */
    static resolve(entry: ErrorLogEntry, resolution: ErrorResolution): ErrorLogEntry;
    /**
     * Updates analytics for an error occurrence
     */
    static updateAnalytics(entry: ErrorLogEntry, newOccurrence: {
        timestamp: Date;
        context: Partial<ErrorContext>;
    }): ErrorLogEntry;
    private static generateEntryId;
    private static generateErrorHash;
    private static simpleHash;
    private static inferSeverity;
    private static inferCategory;
    private static calculateImpact;
    private static buildContext;
    private static parseStackTrace;
    private static parseStackFrame;
    private static generateSuggestions;
    private static extractErrorCode;
    private static sanitizeData;
    private static calculateFrequency;
}
/**
 * Utility functions for working with error logs
 */
export declare class ErrorLogUtils {
    /**
     * Searches error log entries based on criteria
     */
    static searchEntries(entries: readonly ErrorLogEntry[], criteria: ErrorSearchCriteria): ErrorLogEntry[];
    /**
     * Groups error entries by specified field
     */
    static groupEntries(entries: readonly ErrorLogEntry[], groupBy: 'severity' | 'category' | 'subsystem' | 'status' | 'hash'): Record<string, ErrorLogEntry[]>;
    /**
     * Calculates statistics for error entries
     */
    static calculateStatistics(entries: readonly ErrorLogEntry[]): ErrorLogStatistics;
    /**
     * Finds related errors based on similarity
     */
    static findRelatedErrors(targetEntry: ErrorLogEntry, allEntries: readonly ErrorLogEntry[], threshold?: number): ErrorLogEntry[];
    /**
     * Detects error patterns and anomalies
     */
    static detectPatterns(entries: readonly ErrorLogEntry[]): {
        spikes: Array<{
            timestamp: Date;
            count: number;
            severity: ErrorSeverity;
        }>;
        recurring: Array<{
            hash: string;
            pattern: string;
            confidence: number;
        }>;
        anomalies: Array<{
            entry: ErrorLogEntry;
            reason: string;
            score: number;
        }>;
    };
    private static severityToNumber;
    private static impactToNumber;
    private static calculateSimilarity;
    private static stringSimilarity;
    private static levenshteinDistance;
    private static detectErrorSpikes;
    private static detectRecurringPatterns;
    private static detectAnomalies;
    private static calculateAverageInterval;
}
/**
 * Error log aggregation and reporting utilities
 */
export declare class ErrorLogReportGenerator {
    /**
     * Generates an error summary report
     */
    static generateSummaryReport(entries: readonly ErrorLogEntry[], period?: AggregationPeriod): {
        summary: string;
        statistics: ErrorLogStatistics;
        patterns: ReturnType<typeof ErrorLogUtils.detectPatterns>;
        recommendations: string[];
    };
    /**
     * Exports error data in various formats
     */
    static exportData(entries: readonly ErrorLogEntry[], format: 'json' | 'csv' | 'xml'): string;
    private static generateTextSummary;
    private static generateRecommendations;
    private static generateCsvReport;
    private static generateXmlReport;
}
//# sourceMappingURL=error-log.d.ts.map