/**
 * GenerationSession Model
 *
 * Represents a documentation generation session with state management,
 * progress tracking, error handling, and performance metrics.
 *
 * @packageDocumentation
 */
/**
 * Generation session status enumeration
 */
export declare enum GenerationStatus {
    PENDING = "pending",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    PAUSED = "paused"
}
/**
 * Output format enumeration for generated documentation
 */
export declare enum OutputFormat {
    HTML = "html",
    MARKDOWN = "markdown",
    PDF = "pdf",
    JSON = "json",
    OPENAPI = "openapi",
    POSTMAN = "postman",
    CONFLUENCE = "confluence",
    GITBOOK = "gitbook"
}
/**
 * Generation error severity levels
 */
export declare enum ErrorSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
/**
 * Warning category enumeration
 */
export declare enum WarningCategory {
    PERFORMANCE = "performance",
    VALIDATION = "validation",
    DEPRECATION = "deprecation",
    COMPATIBILITY = "compatibility",
    SECURITY = "security",
    FORMATTING = "formatting"
}
/**
 * Represents an error that occurred during generation
 */
export interface GenerationError {
    readonly id: string;
    readonly severity: ErrorSeverity;
    readonly message: string;
    readonly code?: string;
    readonly component: string;
    readonly timestamp: Date;
    readonly context?: Record<string, any>;
    readonly stackTrace?: string;
    readonly suggestion?: string;
}
/**
 * Represents a warning issued during generation
 */
export interface GenerationWarning {
    readonly id: string;
    readonly category: WarningCategory;
    readonly message: string;
    readonly component: string;
    readonly timestamp: Date;
    readonly context?: Record<string, any>;
    readonly suggestion?: string;
}
/**
 * Performance metrics for generation session
 */
export interface PerformanceMetrics {
    totalDuration?: number;
    readonly parseTime: number;
    readonly analysisTime: number;
    readonly generationTime: number;
    readonly validationTime: number;
    readonly memoryUsage: {
        readonly peak: number;
        readonly average: number;
        readonly final: number;
    };
    readonly cpuUsage: {
        readonly peak: number;
        readonly average: number;
    };
    readonly diskIO: {
        readonly bytesRead: number;
        readonly bytesWritten: number;
        readonly fileCount: number;
    };
    readonly networkIO?: {
        readonly bytesDownloaded: number;
        readonly requests: number;
    };
    readonly cacheHits: number;
    readonly cacheMisses: number;
}
/**
 * Progress tracking information
 */
export interface ProgressInfo {
    readonly totalSteps: number;
    readonly completedSteps: number;
    readonly currentStep: string;
    readonly stepProgress: number;
    readonly estimatedTimeRemaining?: number;
    readonly throughput?: number;
}
/**
 * Represents a documentation generation session
 */
export interface GenerationSession {
    readonly id: string;
    readonly startTime: Date;
    readonly endTime?: Date;
    readonly status: GenerationStatus;
    readonly inputHash: string;
    readonly outputPath: string;
    readonly format: OutputFormat;
    readonly errors: readonly GenerationError[];
    readonly warnings: readonly GenerationWarning[];
    readonly metrics: PerformanceMetrics;
    readonly progress?: ProgressInfo;
    readonly projectId: string;
    readonly userId: string | undefined;
    readonly configuration: SessionConfiguration;
    readonly version: string;
    readonly environment: string;
    readonly tags: readonly string[];
    readonly metadata: Record<string, any>;
}
/**
 * Configuration for a generation session
 */
export interface SessionConfiguration {
    readonly enableAI: boolean;
    readonly enableValidation: boolean;
    readonly enableCaching: boolean;
    readonly enableParallel: boolean;
    readonly maxWorkers?: number;
    readonly timeout?: number;
    readonly retryCount: number;
    readonly logLevel: 'debug' | 'info' | 'warn' | 'error';
    readonly outputSettings: {
        readonly includePrivate: boolean;
        readonly includeDeprecated: boolean;
        readonly includeExamples: boolean;
        readonly minifyOutput: boolean;
    };
    readonly aiSettings?: {
        readonly model: string;
        readonly maxTokens: number;
        readonly temperature: number;
        readonly enableReview: boolean;
    };
}
/**
 * Session creation parameters
 */
export interface CreateSessionParams {
    readonly projectId: string;
    readonly inputHash: string;
    readonly outputPath: string;
    readonly format: OutputFormat;
    readonly configuration: SessionConfiguration;
    readonly userId: string | undefined;
    readonly tags?: readonly string[];
    readonly metadata?: Record<string, any>;
}
/**
 * Session update parameters (mutable for updates)
 */
export interface UpdateSessionParams {
    readonly status?: GenerationStatus;
    readonly endTime?: Date;
    readonly progress?: ProgressInfo;
    errors?: readonly GenerationError[];
    warnings?: readonly GenerationWarning[];
    readonly metrics?: Partial<PerformanceMetrics>;
    readonly metadata?: Record<string, any>;
}
/**
 * Factory for creating GenerationSession instances
 */
export declare class GenerationSessionFactory {
    /**
     * Creates a new generation session
     */
    static create(params: CreateSessionParams): GenerationSession;
    /**
     * Creates a session from existing data
     */
    static fromData(data: Partial<GenerationSession> & {
        id: string;
        projectId: string;
        inputHash: string;
        outputPath: string;
        format: OutputFormat;
        configuration: SessionConfiguration;
        userId: string | undefined;
    }): GenerationSession;
    /**
     * Updates an existing session
     */
    static update(session: GenerationSession, updates: UpdateSessionParams): GenerationSession;
    /**
     * Adds an error to the session
     */
    static addError(session: GenerationSession, error: GenerationError): GenerationSession;
    /**
     * Adds a warning to the session
     */
    static addWarning(session: GenerationSession, warning: GenerationWarning): GenerationSession;
    /**
     * Marks session as completed
     */
    static complete(session: GenerationSession, metrics?: Partial<PerformanceMetrics>): GenerationSession;
    /**
     * Marks session as failed
     */
    static fail(session: GenerationSession, error?: GenerationError): GenerationSession;
    /**
     * Cancels a session
     */
    static cancel(session: GenerationSession, reason?: string): GenerationSession;
    private static generateSessionId;
    private static generateId;
    private static createInitialMetrics;
    private static getVersion;
    private static getEnvironment;
}
/**
 * Utility functions for working with generation sessions
 */
export declare class GenerationSessionUtils {
    /**
     * Calculates the overall progress percentage
     */
    static calculateProgress(session: GenerationSession): number;
    /**
     * Gets the duration of the session in milliseconds
     */
    static getDuration(session: GenerationSession): number;
    /**
     * Checks if the session has critical errors
     */
    static hasCriticalErrors(session: GenerationSession): boolean;
    /**
     * Gets errors by severity level
     */
    static getErrorsBySeverity(session: GenerationSession, severity: ErrorSeverity): GenerationError[];
    /**
     * Gets warnings by category
     */
    static getWarningsByCategory(session: GenerationSession, category: WarningCategory): GenerationWarning[];
    /**
     * Calculates efficiency metrics
     */
    static calculateEfficiency(session: GenerationSession): {
        throughput: number | undefined;
        errorRate: number;
        warningRate: number;
        cacheEfficiency: number;
    };
    /**
     * Checks if the session is currently active
     */
    static isActive(session: GenerationSession): boolean;
    /**
     * Checks if the session is completed (successfully or not)
     */
    static isCompleted(session: GenerationSession): boolean;
    /**
     * Validates session configuration
     */
    static validateConfiguration(config: SessionConfiguration): string[];
    /**
     * Creates a summary of the session
     */
    static createSummary(session: GenerationSession): {
        id: string;
        status: GenerationStatus;
        duration: number;
        progress: number;
        errorCount: number;
        warningCount: number;
        format: OutputFormat;
        success: boolean;
    };
}
/**
 * Default configuration factory
 */
export declare class DefaultSessionConfigurationFactory {
    /**
     * Creates a default session configuration
     */
    static create(overrides?: Partial<SessionConfiguration>): SessionConfiguration;
    /**
     * Creates a lightweight configuration for testing
     */
    static createTestConfig(overrides?: Partial<SessionConfiguration>): SessionConfiguration;
    /**
     * Creates a production-optimized configuration
     */
    static createProductionConfig(overrides?: Partial<SessionConfiguration>): SessionConfiguration;
}
//# sourceMappingURL=generation-session.d.ts.map