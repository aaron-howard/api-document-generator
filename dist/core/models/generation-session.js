"use strict";
/**
 * GenerationSession Model
 *
 * Represents a documentation generation session with state management,
 * progress tracking, error handling, and performance metrics.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSessionConfigurationFactory = exports.GenerationSessionUtils = exports.GenerationSessionFactory = exports.WarningCategory = exports.ErrorSeverity = exports.OutputFormat = exports.GenerationStatus = void 0;
/**
 * Generation session status enumeration
 */
var GenerationStatus;
(function (GenerationStatus) {
    GenerationStatus["PENDING"] = "pending";
    GenerationStatus["RUNNING"] = "running";
    GenerationStatus["COMPLETED"] = "completed";
    GenerationStatus["FAILED"] = "failed";
    GenerationStatus["CANCELLED"] = "cancelled";
    GenerationStatus["PAUSED"] = "paused";
})(GenerationStatus || (exports.GenerationStatus = GenerationStatus = {}));
/**
 * Output format enumeration for generated documentation
 */
var OutputFormat;
(function (OutputFormat) {
    OutputFormat["HTML"] = "html";
    OutputFormat["MARKDOWN"] = "markdown";
    OutputFormat["PDF"] = "pdf";
    OutputFormat["JSON"] = "json";
    OutputFormat["OPENAPI"] = "openapi";
    OutputFormat["POSTMAN"] = "postman";
    OutputFormat["CONFLUENCE"] = "confluence";
    OutputFormat["GITBOOK"] = "gitbook";
})(OutputFormat || (exports.OutputFormat = OutputFormat = {}));
/**
 * Generation error severity levels
 */
var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["LOW"] = "low";
    ErrorSeverity["MEDIUM"] = "medium";
    ErrorSeverity["HIGH"] = "high";
    ErrorSeverity["CRITICAL"] = "critical";
})(ErrorSeverity || (exports.ErrorSeverity = ErrorSeverity = {}));
/**
 * Warning category enumeration
 */
var WarningCategory;
(function (WarningCategory) {
    WarningCategory["PERFORMANCE"] = "performance";
    WarningCategory["VALIDATION"] = "validation";
    WarningCategory["DEPRECATION"] = "deprecation";
    WarningCategory["COMPATIBILITY"] = "compatibility";
    WarningCategory["SECURITY"] = "security";
    WarningCategory["FORMATTING"] = "formatting";
})(WarningCategory || (exports.WarningCategory = WarningCategory = {}));
/**
 * Factory for creating GenerationSession instances
 */
class GenerationSessionFactory {
    /**
     * Creates a new generation session
     */
    static create(params) {
        const now = new Date();
        return {
            id: this.generateSessionId(),
            startTime: now,
            status: GenerationStatus.PENDING,
            inputHash: params.inputHash,
            outputPath: params.outputPath,
            format: params.format,
            errors: [],
            warnings: [],
            metrics: this.createInitialMetrics(),
            projectId: params.projectId,
            userId: params.userId,
            configuration: params.configuration,
            version: this.getVersion(),
            environment: this.getEnvironment(),
            tags: params.tags ?? [],
            metadata: params.metadata ?? {}
        };
    }
    /**
     * Creates a session from existing data
     */
    static fromData(data) {
        return {
            startTime: new Date(),
            status: GenerationStatus.PENDING,
            errors: [],
            warnings: [],
            metrics: this.createInitialMetrics(),
            version: this.getVersion(),
            environment: this.getEnvironment(),
            tags: [],
            metadata: {},
            ...data
        };
    }
    /**
     * Updates an existing session
     */
    static update(session, updates) {
        return {
            ...session,
            ...updates,
            // Merge arrays instead of replacing
            errors: updates.errors ?? session.errors,
            warnings: updates.warnings ?? session.warnings,
            metrics: updates.metrics ? { ...session.metrics, ...updates.metrics } : session.metrics,
            metadata: updates.metadata ? { ...session.metadata, ...updates.metadata } : session.metadata
        };
    }
    /**
     * Adds an error to the session
     */
    static addError(session, error) {
        return {
            ...session,
            errors: [...session.errors, error],
            status: error.severity === ErrorSeverity.CRITICAL ? GenerationStatus.FAILED : session.status
        };
    }
    /**
     * Adds a warning to the session
     */
    static addWarning(session, warning) {
        return {
            ...session,
            warnings: [...session.warnings, warning]
        };
    }
    /**
     * Marks session as completed
     */
    static complete(session, metrics) {
        const endTime = new Date();
        const finalMetrics = metrics ? { ...session.metrics, ...metrics } : session.metrics;
        // Calculate total duration if not provided
        if (!finalMetrics.totalDuration) {
            finalMetrics.totalDuration = endTime.getTime() - session.startTime.getTime();
        }
        return {
            ...session,
            status: GenerationStatus.COMPLETED,
            endTime,
            metrics: finalMetrics
        };
    }
    /**
     * Marks session as failed
     */
    static fail(session, error) {
        const updates = {
            status: GenerationStatus.FAILED,
            endTime: new Date()
        };
        if (error) {
            const newErrors = [...session.errors, error];
            updates.errors = newErrors;
        }
        return this.update(session, updates);
    }
    /**
     * Cancels a session
     */
    static cancel(session, reason) {
        const warning = {
            id: this.generateId(),
            category: WarningCategory.PERFORMANCE,
            message: reason ?? 'Session was cancelled',
            component: 'session-manager',
            timestamp: new Date()
        };
        return {
            ...session,
            status: GenerationStatus.CANCELLED,
            endTime: new Date(),
            warnings: [...session.warnings, warning]
        };
    }
    static generateSessionId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `session_${timestamp}_${random}`;
    }
    static generateId() {
        return `${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
    }
    static createInitialMetrics() {
        return {
            parseTime: 0,
            analysisTime: 0,
            generationTime: 0,
            validationTime: 0,
            memoryUsage: {
                peak: 0,
                average: 0,
                final: 0
            },
            cpuUsage: {
                peak: 0,
                average: 0
            },
            diskIO: {
                bytesRead: 0,
                bytesWritten: 0,
                fileCount: 0
            },
            cacheHits: 0,
            cacheMisses: 0
        };
    }
    static getVersion() {
        // In a real implementation, this would come from package.json or environment
        return '1.0.0';
    }
    static getEnvironment() {
        // Use 'development' as default since we don't have Node.js types
        return 'development';
    }
}
exports.GenerationSessionFactory = GenerationSessionFactory;
/**
 * Utility functions for working with generation sessions
 */
class GenerationSessionUtils {
    /**
     * Calculates the overall progress percentage
     */
    static calculateProgress(session) {
        if (!session.progress) {
            return session.status === GenerationStatus.COMPLETED ? 100 : 0;
        }
        const stepProgress = (session.progress.completedSteps / session.progress.totalSteps) * 100;
        const currentStepProgress = session.progress.stepProgress / session.progress.totalSteps;
        return Math.min(100, stepProgress + currentStepProgress);
    }
    /**
     * Gets the duration of the session in milliseconds
     */
    static getDuration(session) {
        const endTime = session.endTime ?? new Date();
        return endTime.getTime() - session.startTime.getTime();
    }
    /**
     * Checks if the session has critical errors
     */
    static hasCriticalErrors(session) {
        return session.errors.some(error => error.severity === ErrorSeverity.CRITICAL);
    }
    /**
     * Gets errors by severity level
     */
    static getErrorsBySeverity(session, severity) {
        return session.errors.filter(error => error.severity === severity);
    }
    /**
     * Gets warnings by category
     */
    static getWarningsByCategory(session, category) {
        return session.warnings.filter(warning => warning.category === category);
    }
    /**
     * Calculates efficiency metrics
     */
    static calculateEfficiency(session) {
        const duration = this.getDuration(session) / 1000; // seconds
        return {
            throughput: session.progress?.throughput,
            errorRate: session.errors.length / Math.max(1, duration),
            warningRate: session.warnings.length / Math.max(1, duration),
            cacheEfficiency: session.metrics.cacheHits / Math.max(1, session.metrics.cacheHits + session.metrics.cacheMisses) * 100
        };
    }
    /**
     * Checks if the session is currently active
     */
    static isActive(session) {
        return [GenerationStatus.PENDING, GenerationStatus.RUNNING, GenerationStatus.PAUSED].includes(session.status);
    }
    /**
     * Checks if the session is completed (successfully or not)
     */
    static isCompleted(session) {
        return [GenerationStatus.COMPLETED, GenerationStatus.FAILED, GenerationStatus.CANCELLED].includes(session.status);
    }
    /**
     * Validates session configuration
     */
    static validateConfiguration(config) {
        const errors = [];
        if (config.maxWorkers !== undefined && config.maxWorkers < 1) {
            errors.push('maxWorkers must be at least 1');
        }
        if (config.timeout !== undefined && config.timeout < 1000) {
            errors.push('timeout must be at least 1000ms');
        }
        if (config.retryCount < 0) {
            errors.push('retryCount cannot be negative');
        }
        if (config.aiSettings) {
            if (config.aiSettings.maxTokens < 1) {
                errors.push('AI maxTokens must be at least 1');
            }
            if (config.aiSettings.temperature < 0 || config.aiSettings.temperature > 2) {
                errors.push('AI temperature must be between 0 and 2');
            }
        }
        return errors;
    }
    /**
     * Creates a summary of the session
     */
    static createSummary(session) {
        return {
            id: session.id,
            status: session.status,
            duration: this.getDuration(session),
            progress: this.calculateProgress(session),
            errorCount: session.errors.length,
            warningCount: session.warnings.length,
            format: session.format,
            success: session.status === GenerationStatus.COMPLETED && !this.hasCriticalErrors(session)
        };
    }
}
exports.GenerationSessionUtils = GenerationSessionUtils;
/**
 * Default configuration factory
 */
class DefaultSessionConfigurationFactory {
    /**
     * Creates a default session configuration
     */
    static create(overrides) {
        return {
            enableAI: true,
            enableValidation: true,
            enableCaching: true,
            enableParallel: true,
            maxWorkers: 4,
            timeout: 300000, // 5 minutes
            retryCount: 3,
            logLevel: 'info',
            outputSettings: {
                includePrivate: false,
                includeDeprecated: true,
                includeExamples: true,
                minifyOutput: false
            },
            aiSettings: {
                model: 'gpt-4',
                maxTokens: 4000,
                temperature: 0.3,
                enableReview: true
            },
            ...overrides
        };
    }
    /**
     * Creates a lightweight configuration for testing
     */
    static createTestConfig(overrides) {
        return this.create({
            enableAI: false,
            enableValidation: false,
            enableCaching: false,
            enableParallel: false,
            maxWorkers: 1,
            timeout: 30000,
            retryCount: 1,
            logLevel: 'debug',
            ...overrides
        });
    }
    /**
     * Creates a production-optimized configuration
     */
    static createProductionConfig(overrides) {
        return this.create({
            enableAI: true,
            enableValidation: true,
            enableCaching: true,
            enableParallel: true,
            maxWorkers: 8,
            timeout: 600000, // 10 minutes
            retryCount: 5,
            logLevel: 'warn',
            outputSettings: {
                includePrivate: false,
                includeDeprecated: false,
                includeExamples: true,
                minifyOutput: true
            },
            ...overrides
        });
    }
}
exports.DefaultSessionConfigurationFactory = DefaultSessionConfigurationFactory;
//# sourceMappingURL=generation-session.js.map