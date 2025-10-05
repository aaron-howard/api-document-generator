"use strict";
/**
 * ErrorLog Model
 *
 * Comprehensive error logging system with categorization, debugging information,
 * recovery suggestions, and analytics tracking.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorLogReportGenerator = exports.ErrorLogUtils = exports.ErrorLogEntryFactory = exports.AggregationPeriod = exports.ErrorImpact = exports.ErrorStatus = exports.RecoveryAction = exports.ErrorSubsystem = exports.ErrorCategory = exports.ErrorSeverity = void 0;
/**
 * Error severity levels
 */
var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["FATAL"] = "fatal";
    ErrorSeverity["CRITICAL"] = "critical";
    ErrorSeverity["ERROR"] = "error";
    ErrorSeverity["WARNING"] = "warning";
    ErrorSeverity["INFO"] = "info";
    ErrorSeverity["DEBUG"] = "debug";
    ErrorSeverity["TRACE"] = "trace";
})(ErrorSeverity || (exports.ErrorSeverity = ErrorSeverity = {}));
/**
 * Error categories for classification
 */
var ErrorCategory;
(function (ErrorCategory) {
    ErrorCategory["SYSTEM"] = "system";
    ErrorCategory["NETWORK"] = "network";
    ErrorCategory["PARSING"] = "parsing";
    ErrorCategory["VALIDATION"] = "validation";
    ErrorCategory["GENERATION"] = "generation";
    ErrorCategory["TEMPLATE"] = "template";
    ErrorCategory["CACHE"] = "cache";
    ErrorCategory["CONFIGURATION"] = "configuration";
    ErrorCategory["AUTHENTICATION"] = "authentication";
    ErrorCategory["AUTHORIZATION"] = "authorization";
    ErrorCategory["RATE_LIMIT"] = "rate-limit";
    ErrorCategory["QUOTA_EXCEEDED"] = "quota-exceeded";
    ErrorCategory["TIMEOUT"] = "timeout";
    ErrorCategory["FILE_SYSTEM"] = "file-system";
    ErrorCategory["EXTERNAL_SERVICE"] = "external-service";
    ErrorCategory["USER_INPUT"] = "user-input";
    ErrorCategory["BUSINESS_LOGIC"] = "business-logic";
    ErrorCategory["DEPENDENCY"] = "dependency";
    ErrorCategory["PERFORMANCE"] = "performance";
    ErrorCategory["MEMORY"] = "memory";
    ErrorCategory["CUSTOM"] = "custom";
})(ErrorCategory || (exports.ErrorCategory = ErrorCategory = {}));
/**
 * Error subsystems for more specific categorization
 */
var ErrorSubsystem;
(function (ErrorSubsystem) {
    ErrorSubsystem["CLI"] = "cli";
    ErrorSubsystem["API"] = "api";
    ErrorSubsystem["PARSER"] = "parser";
    ErrorSubsystem["GENERATOR"] = "generator";
    ErrorSubsystem["VALIDATOR"] = "validator";
    ErrorSubsystem["CACHE_MANAGER"] = "cache-manager";
    ErrorSubsystem["TEMPLATE_ENGINE"] = "template-engine";
    ErrorSubsystem["AI_SERVICE"] = "ai-service";
    ErrorSubsystem["FILE_MANAGER"] = "file-manager";
    ErrorSubsystem["CONFIG_MANAGER"] = "config-manager";
    ErrorSubsystem["SESSION_MANAGER"] = "session-manager";
    ErrorSubsystem["REPORT_GENERATOR"] = "report-generator";
    ErrorSubsystem["SCHEMA_PROCESSOR"] = "schema-processor";
    ErrorSubsystem["ENDPOINT_PROCESSOR"] = "endpoint-processor";
    ErrorSubsystem["OUTPUT_WRITER"] = "output-writer";
})(ErrorSubsystem || (exports.ErrorSubsystem = ErrorSubsystem = {}));
/**
 * Recovery action types
 */
var RecoveryAction;
(function (RecoveryAction) {
    RecoveryAction["RETRY"] = "retry";
    RecoveryAction["SKIP"] = "skip";
    RecoveryAction["FALLBACK"] = "fallback";
    RecoveryAction["MANUAL_INTERVENTION"] = "manual-intervention";
    RecoveryAction["CONFIGURATION_CHANGE"] = "configuration-change";
    RecoveryAction["RESTART"] = "restart";
    RecoveryAction["CLEAR_CACHE"] = "clear-cache";
    RecoveryAction["UPDATE_DEPENDENCY"] = "update-dependency";
    RecoveryAction["INCREASE_RESOURCES"] = "increase-resources";
    RecoveryAction["CONTACT_SUPPORT"] = "contact-support";
    RecoveryAction["NONE"] = "none";
})(RecoveryAction || (exports.RecoveryAction = RecoveryAction = {}));
/**
 * Error status tracking
 */
var ErrorStatus;
(function (ErrorStatus) {
    ErrorStatus["NEW"] = "new";
    ErrorStatus["ACKNOWLEDGED"] = "acknowledged";
    ErrorStatus["INVESTIGATING"] = "investigating";
    ErrorStatus["RESOLVED"] = "resolved";
    ErrorStatus["IGNORED"] = "ignored";
    ErrorStatus["RECURRING"] = "recurring";
    ErrorStatus["ESCALATED"] = "escalated";
})(ErrorStatus || (exports.ErrorStatus = ErrorStatus = {}));
/**
 * Error impact levels
 */
var ErrorImpact;
(function (ErrorImpact) {
    ErrorImpact["BLOCKING"] = "blocking";
    ErrorImpact["DEGRADED"] = "degraded";
    ErrorImpact["MINOR"] = "minor";
    ErrorImpact["NEGLIGIBLE"] = "negligible";
})(ErrorImpact || (exports.ErrorImpact = ErrorImpact = {}));
/**
 * Analytics aggregation periods
 */
var AggregationPeriod;
(function (AggregationPeriod) {
    AggregationPeriod["MINUTE"] = "minute";
    AggregationPeriod["HOUR"] = "hour";
    AggregationPeriod["DAY"] = "day";
    AggregationPeriod["WEEK"] = "week";
    AggregationPeriod["MONTH"] = "month";
    AggregationPeriod["YEAR"] = "year";
})(AggregationPeriod || (exports.AggregationPeriod = AggregationPeriod = {}));
/**
 * Factory for creating ErrorLogEntry instances
 */
class ErrorLogEntryFactory {
    /**
     * Creates a new error log entry
     */
    static create(params, config) {
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
    static fromData(data) {
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
    static update(entry, updates) {
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
    static resolve(entry, resolution) {
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
    static updateAnalytics(entry, newOccurrence) {
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
    static generateEntryId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `error_${timestamp}_${random}`;
    }
    static generateErrorHash(error, context) {
        const hashInput = `${error.message}_${error.constructor.name}_${context.component}_${context.operationId}`;
        return this.simpleHash(hashInput);
    }
    static simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(36);
    }
    static inferSeverity(error) {
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
    static inferCategory(error, context) {
        const message = error.message.toLowerCase();
        const subsystem = context.subsystem;
        if (subsystem === ErrorSubsystem.PARSER)
            return ErrorCategory.PARSING;
        if (subsystem === ErrorSubsystem.VALIDATOR)
            return ErrorCategory.VALIDATION;
        if (subsystem === ErrorSubsystem.GENERATOR)
            return ErrorCategory.GENERATION;
        if (subsystem === ErrorSubsystem.TEMPLATE_ENGINE)
            return ErrorCategory.TEMPLATE;
        if (subsystem === ErrorSubsystem.CACHE_MANAGER)
            return ErrorCategory.CACHE;
        if (subsystem === ErrorSubsystem.CONFIG_MANAGER)
            return ErrorCategory.CONFIGURATION;
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
    static calculateImpact(severity, category) {
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
    static buildContext(context, config) {
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
    static parseStackTrace(stackTrace) {
        if (!stackTrace)
            return undefined;
        const frames = stackTrace
            .split('\n')
            .slice(1) // Remove the error message line
            .map(line => this.parseStackFrame(line))
            .filter(frame => frame !== null);
        return {
            raw: stackTrace,
            frames,
            truncated: false,
            source: 'javascript'
        };
    }
    static parseStackFrame(line) {
        // Simple regex for basic stack frame parsing
        const match = line.match(/\s*at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
        if (!match)
            return null;
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
    static generateSuggestions(error, category) {
        const suggestions = [];
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
    static extractErrorCode(error) {
        // Try to extract error code from various error properties
        const errorAny = error;
        return errorAny.code || errorAny.errorCode || errorAny.statusCode?.toString();
    }
    static sanitizeData(data, excludeFields) {
        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            if (excludeFields.includes(key.toLowerCase())) {
                sanitized[key] = '[REDACTED]';
            }
            else if (typeof value === 'object' && value !== null) {
                sanitized[key] = this.sanitizeData(value, excludeFields);
            }
            else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }
    static calculateFrequency(count, timeDiff, periodMs) {
        if (timeDiff === 0)
            return 0;
        return (count * periodMs) / timeDiff;
    }
}
exports.ErrorLogEntryFactory = ErrorLogEntryFactory;
/**
 * Utility functions for working with error logs
 */
class ErrorLogUtils {
    /**
     * Searches error log entries based on criteria
     */
    static searchEntries(entries, criteria) {
        let filtered = [...entries];
        if (criteria.severities) {
            filtered = filtered.filter(entry => criteria.severities.includes(entry.severity));
        }
        if (criteria.categories) {
            filtered = filtered.filter(entry => criteria.categories.includes(entry.category));
        }
        if (criteria.subsystems) {
            filtered = filtered.filter(entry => criteria.subsystems.includes(entry.context.subsystem));
        }
        if (criteria.statuses) {
            filtered = filtered.filter(entry => criteria.statuses.includes(entry.status));
        }
        if (criteria.timeRange) {
            filtered = filtered.filter(entry => entry.timestamp >= criteria.timeRange.start &&
                entry.timestamp <= criteria.timeRange.end);
        }
        if (criteria.searchText) {
            const searchLower = criteria.searchText.toLowerCase();
            filtered = filtered.filter(entry => entry.message.toLowerCase().includes(searchLower) ||
                entry.source.toLowerCase().includes(searchLower) ||
                entry.context.component.toLowerCase().includes(searchLower));
        }
        if (criteria.tags && criteria.tags.length > 0) {
            filtered = filtered.filter(entry => criteria.tags.some(tag => entry.tags.includes(tag)));
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
    static groupEntries(entries, groupBy) {
        const groups = {};
        entries.forEach(entry => {
            let key;
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
            groups[key].push(entry);
        });
        return groups;
    }
    /**
     * Calculates statistics for error entries
     */
    static calculateStatistics(entries) {
        const errorsBySeverity = {};
        const errorsByCategory = {};
        const errorsBySubsystem = {};
        const errorsByStatus = {};
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
        const hashCounts = {};
        let totalResolutionTime = 0;
        let resolvedCount = 0;
        const actionCounts = {};
        entries.forEach(entry => {
            errorsBySeverity[entry.severity]++;
            errorsByCategory[entry.category]++;
            errorsBySubsystem[entry.context.subsystem]++;
            errorsByStatus[entry.status]++;
            // Track by hash for top errors
            if (!hashCounts[entry.hash]) {
                hashCounts[entry.hash] = { count: 0, entry };
            }
            hashCounts[entry.hash].count += entry.analytics.occurrenceCount;
            // Resolution metrics
            if (entry.resolution) {
                totalResolutionTime += entry.resolution.timeToResolve;
                resolvedCount++;
                const action = entry.resolution.method;
                if (!actionCounts[action]) {
                    actionCounts[action] = { count: 0, totalTime: 0 };
                }
                actionCounts[action].count++;
                actionCounts[action].totalTime += entry.resolution.timeToResolve;
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
            action: action,
            successRate: 100, // Simplified - in real implementation, track success/failure
            averageTime: data.totalTime / data.count
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
    static findRelatedErrors(targetEntry, allEntries, threshold = 0.7) {
        return allEntries.filter(entry => {
            if (entry.id === targetEntry.id)
                return false;
            const similarity = this.calculateSimilarity(targetEntry, entry);
            return similarity >= threshold;
        });
    }
    /**
     * Detects error patterns and anomalies
     */
    static detectPatterns(entries) {
        // Simplified pattern detection - in real implementation, use more sophisticated algorithms
        const spikes = this.detectErrorSpikes(entries);
        const recurring = this.detectRecurringPatterns(entries);
        const anomalies = this.detectAnomalies(entries);
        return { spikes, recurring, anomalies };
    }
    static severityToNumber(severity) {
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
    static impactToNumber(impact) {
        const order = {
            [ErrorImpact.NEGLIGIBLE]: 0,
            [ErrorImpact.MINOR]: 1,
            [ErrorImpact.DEGRADED]: 2,
            [ErrorImpact.BLOCKING]: 3
        };
        return order[impact] || 0;
    }
    static calculateSimilarity(entry1, entry2) {
        let score = 0;
        // Same error hash
        if (entry1.hash === entry2.hash)
            score += 0.5;
        // Same category
        if (entry1.category === entry2.category)
            score += 0.2;
        // Same subsystem
        if (entry1.context.subsystem === entry2.context.subsystem)
            score += 0.2;
        // Similar message (simple string similarity)
        const messageSimilarity = this.stringSimilarity(entry1.message, entry2.message);
        score += messageSimilarity * 0.1;
        return Math.min(score, 1.0);
    }
    static stringSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        if (longer.length === 0)
            return 1.0;
        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }
    static levenshteinDistance(str1, str2) {
        const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
        for (let i = 0; i <= str1.length; i++)
            matrix[0][i] = i;
        for (let j = 0; j <= str2.length; j++)
            matrix[j][0] = j;
        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(matrix[j - 1][i] + 1, matrix[j][i - 1] + 1, matrix[j - 1][i - 1] + cost);
            }
        }
        return matrix[str2.length][str1.length];
    }
    static detectErrorSpikes(entries) {
        // Simplified spike detection
        const hourlyBuckets = {};
        entries.forEach(entry => {
            const hour = new Date(entry.timestamp);
            hour.setMinutes(0, 0, 0);
            const key = hour.toISOString();
            if (!hourlyBuckets[key]) {
                hourlyBuckets[key] = { count: 0, severity: ErrorSeverity.INFO };
            }
            hourlyBuckets[key].count++;
            if (this.severityToNumber(entry.severity) > this.severityToNumber(hourlyBuckets[key].severity)) {
                hourlyBuckets[key].severity = entry.severity;
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
    static detectRecurringPatterns(entries) {
        const hashGroups = this.groupEntries(entries, 'hash');
        return Object.entries(hashGroups)
            .filter(([, group]) => group.length >= 3) // At least 3 occurrences
            .map(([hash, group]) => ({
            hash,
            pattern: `Recurring every ${this.calculateAverageInterval(group)} minutes`,
            confidence: Math.min(group.length / 10, 1.0) // Simple confidence based on frequency
        }));
    }
    static detectAnomalies(entries) {
        // Simplified anomaly detection
        const anomalies = [];
        entries.forEach(entry => {
            let anomalyScore = 0;
            const reasons = [];
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
    static calculateAverageInterval(entries) {
        if (entries.length < 2)
            return 0;
        const sortedEntries = entries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        let totalInterval = 0;
        for (let i = 1; i < sortedEntries.length; i++) {
            const interval = sortedEntries[i].timestamp.getTime() - sortedEntries[i - 1].timestamp.getTime();
            totalInterval += interval;
        }
        return Math.round(totalInterval / (sortedEntries.length - 1) / (1000 * 60)); // Convert to minutes
    }
}
exports.ErrorLogUtils = ErrorLogUtils;
/**
 * Error log aggregation and reporting utilities
 */
class ErrorLogReportGenerator {
    /**
     * Generates an error summary report
     */
    static generateSummaryReport(entries, period = AggregationPeriod.DAY) {
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
    static exportData(entries, format) {
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
    static generateTextSummary(statistics, period) {
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
    static generateRecommendations(statistics, patterns) {
        const recommendations = [];
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
    static generateCsvReport(entries) {
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
    static generateXmlReport(entries) {
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
exports.ErrorLogReportGenerator = ErrorLogReportGenerator;
//# sourceMappingURL=error-log.js.map