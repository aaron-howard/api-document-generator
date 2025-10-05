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
export enum GenerationStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  PAUSED = 'paused'
}

/**
 * Output format enumeration for generated documentation
 */
export enum OutputFormat {
  HTML = 'html',
  MARKDOWN = 'markdown',
  PDF = 'pdf',
  JSON = 'json',
  OPENAPI = 'openapi',
  POSTMAN = 'postman',
  CONFLUENCE = 'confluence',
  GITBOOK = 'gitbook'
}

/**
 * Generation error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Warning category enumeration
 */
export enum WarningCategory {
  PERFORMANCE = 'performance',
  VALIDATION = 'validation',
  DEPRECATION = 'deprecation',
  COMPATIBILITY = 'compatibility',
  SECURITY = 'security',
  FORMATTING = 'formatting'
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
  totalDuration?: number; // milliseconds
  readonly parseTime: number;
  readonly analysisTime: number;
  readonly generationTime: number;
  readonly validationTime: number;
  readonly memoryUsage: {
    readonly peak: number; // bytes
    readonly average: number;
    readonly final: number;
  };
  readonly cpuUsage: {
    readonly peak: number; // percentage
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
  readonly stepProgress: number; // 0-100
  readonly estimatedTimeRemaining?: number; // milliseconds
  readonly throughput?: number; // items/second
}

/**
 * Represents a documentation generation session
 */
export interface GenerationSession {
  readonly id: string;
  readonly startTime: Date;
  readonly endTime?: Date;
  readonly status: GenerationStatus;
  readonly inputHash: string; // Hash of input sources for change detection
  readonly outputPath: string;
  readonly format: OutputFormat;
  readonly errors: readonly GenerationError[];
  readonly warnings: readonly GenerationWarning[];
  readonly metrics: PerformanceMetrics;
  readonly progress?: ProgressInfo;
  
  // Configuration
  readonly projectId: string;
  readonly userId: string | undefined;
  readonly configuration: SessionConfiguration;
  
  // Metadata
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
  readonly timeout?: number; // milliseconds
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
export class GenerationSessionFactory {
  /**
   * Creates a new generation session
   */
  static create(params: CreateSessionParams): GenerationSession {
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
  static fromData(data: Partial<GenerationSession> & { 
    id: string; 
    projectId: string; 
    inputHash: string; 
    outputPath: string; 
    format: OutputFormat; 
    configuration: SessionConfiguration;
    userId: string | undefined;
  }): GenerationSession {
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
  static update(session: GenerationSession, updates: UpdateSessionParams): GenerationSession {
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
  static addError(session: GenerationSession, error: GenerationError): GenerationSession {
    return {
      ...session,
      errors: [...session.errors, error],
      status: error.severity === ErrorSeverity.CRITICAL ? GenerationStatus.FAILED : session.status
    };
  }

  /**
   * Adds a warning to the session
   */
  static addWarning(session: GenerationSession, warning: GenerationWarning): GenerationSession {
    return {
      ...session,
      warnings: [...session.warnings, warning]
    };
  }

  /**
   * Marks session as completed
   */
  static complete(session: GenerationSession, metrics?: Partial<PerformanceMetrics>): GenerationSession {
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
      metrics: finalMetrics as PerformanceMetrics
    };
  }

  /**
   * Marks session as failed
   */
  static fail(session: GenerationSession, error?: GenerationError): GenerationSession {
    const updates: UpdateSessionParams = {
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
  static cancel(session: GenerationSession, reason?: string): GenerationSession {
    const warning: GenerationWarning = {
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

  private static generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `session_${timestamp}_${random}`;
  }

  private static generateId(): string {
    return `${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private static createInitialMetrics(): PerformanceMetrics {
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

  private static getVersion(): string {
    // In a real implementation, this would come from package.json or environment
    return '1.0.0';
  }

  private static getEnvironment(): string {
    // Use 'development' as default since we don't have Node.js types
    return 'development';
  }
}

/**
 * Utility functions for working with generation sessions
 */
export class GenerationSessionUtils {
  /**
   * Calculates the overall progress percentage
   */
  static calculateProgress(session: GenerationSession): number {
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
  static getDuration(session: GenerationSession): number {
    const endTime = session.endTime ?? new Date();
    return endTime.getTime() - session.startTime.getTime();
  }

  /**
   * Checks if the session has critical errors
   */
  static hasCriticalErrors(session: GenerationSession): boolean {
    return session.errors.some(error => error.severity === ErrorSeverity.CRITICAL);
  }

  /**
   * Gets errors by severity level
   */
  static getErrorsBySeverity(session: GenerationSession, severity: ErrorSeverity): GenerationError[] {
    return session.errors.filter(error => error.severity === severity);
  }

  /**
   * Gets warnings by category
   */
  static getWarningsByCategory(session: GenerationSession, category: WarningCategory): GenerationWarning[] {
    return session.warnings.filter(warning => warning.category === category);
  }

  /**
   * Calculates efficiency metrics
   */
  static calculateEfficiency(session: GenerationSession): {
    throughput: number | undefined;
    errorRate: number;
    warningRate: number;
    cacheEfficiency: number;
  } {
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
  static isActive(session: GenerationSession): boolean {
    return [GenerationStatus.PENDING, GenerationStatus.RUNNING, GenerationStatus.PAUSED].includes(session.status);
  }

  /**
   * Checks if the session is completed (successfully or not)
   */
  static isCompleted(session: GenerationSession): boolean {
    return [GenerationStatus.COMPLETED, GenerationStatus.FAILED, GenerationStatus.CANCELLED].includes(session.status);
  }

  /**
   * Validates session configuration
   */
  static validateConfiguration(config: SessionConfiguration): string[] {
    const errors: string[] = [];

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
  static createSummary(session: GenerationSession): {
    id: string;
    status: GenerationStatus;
    duration: number;
    progress: number;
    errorCount: number;
    warningCount: number;
    format: OutputFormat;
    success: boolean;
  } {
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

/**
 * Default configuration factory
 */
export class DefaultSessionConfigurationFactory {
  /**
   * Creates a default session configuration
   */
  static create(overrides?: Partial<SessionConfiguration>): SessionConfiguration {
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
  static createTestConfig(overrides?: Partial<SessionConfiguration>): SessionConfiguration {
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
  static createProductionConfig(overrides?: Partial<SessionConfiguration>): SessionConfiguration {
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