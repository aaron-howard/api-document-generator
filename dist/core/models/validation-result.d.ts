/**
 * ValidationResult Model
 *
 * Represents comprehensive validation results with status tracking,
 * error and warning management, quality scoring, and report generation.
 *
 * @packageDocumentation
 */
/**
 * Validation status enumeration
 */
export declare enum ValidationStatus {
    PENDING = "pending",
    RUNNING = "running",
    PASSED = "passed",
    FAILED = "failed",
    WARNING = "warning",
    SKIPPED = "skipped",
    CANCELLED = "cancelled"
}
/**
 * Validation level enumeration
 */
export declare enum ValidationLevel {
    STRICT = "strict",
    STANDARD = "standard",
    LENIENT = "lenient",
    CUSTOM = "custom"
}
/**
 * Validation category enumeration
 */
export declare enum ValidationCategory {
    SYNTAX = "syntax",
    SCHEMA = "schema",
    SEMANTIC = "semantic",
    STYLE = "style",
    SECURITY = "security",
    PERFORMANCE = "performance",
    ACCESSIBILITY = "accessibility",
    COMPATIBILITY = "compatibility",
    DOCUMENTATION = "documentation",
    CUSTOM = "custom"
}
/**
 * Issue severity enumeration
 */
export declare enum IssueSeverity {
    BLOCKER = "blocker",
    CRITICAL = "critical",
    MAJOR = "major",
    MINOR = "minor",
    INFO = "info",
    SUGGESTION = "suggestion"
}
/**
 * Validation rule type enumeration
 */
export declare enum ValidationRuleType {
    REQUIRED_FIELD = "required-field",
    DATA_TYPE = "data-type",
    FORMAT = "format",
    RANGE = "range",
    PATTERN = "pattern",
    ENUM = "enum",
    REFERENCE = "reference",
    DEPENDENCY = "dependency",
    UNIQUENESS = "uniqueness",
    CONSISTENCY = "consistency",
    CUSTOM = "custom"
}
/**
 * Quality dimension enumeration
 */
export declare enum QualityDimension {
    COMPLETENESS = "completeness",
    ACCURACY = "accuracy",
    CONSISTENCY = "consistency",
    CLARITY = "clarity",
    RELEVANCE = "relevance",
    MAINTAINABILITY = "maintainability",
    USABILITY = "usability",
    PERFORMANCE = "performance"
}
/**
 * Report format enumeration
 */
export declare enum ReportFormat {
    JSON = "json",
    HTML = "html",
    MARKDOWN = "markdown",
    XML = "xml",
    CSV = "csv",
    PDF = "pdf",
    JUNIT = "junit",
    CHECKSTYLE = "checkstyle"
}
/**
 * Represents a validation issue (error, warning, or info)
 */
export interface ValidationIssue {
    readonly id: string;
    readonly severity: IssueSeverity;
    readonly category: ValidationCategory;
    readonly ruleType: ValidationRuleType;
    readonly ruleId: string;
    readonly message: string;
    readonly description?: string;
    readonly location: IssueLocation;
    readonly context: IssueContext;
    readonly suggestion?: string;
    readonly fix?: IssueFix;
    readonly metadata: Record<string, any>;
    readonly timestamp: Date;
}
/**
 * Issue location information
 */
export interface IssueLocation {
    readonly file?: string;
    readonly line?: number;
    readonly column?: number;
    readonly path?: string;
    readonly element?: string;
    readonly range?: {
        readonly start: {
            readonly line: number;
            readonly column: number;
        };
        readonly end: {
            readonly line: number;
            readonly column: number;
        };
    };
}
/**
 * Issue context information
 */
export interface IssueContext {
    readonly sourceType: string;
    readonly entityType?: string;
    readonly entityId?: string;
    readonly parentEntity?: string;
    readonly relatedEntities: readonly string[];
    readonly additionalData: Record<string, any>;
}
/**
 * Suggested fix for an issue
 */
export interface IssueFix {
    readonly description: string;
    readonly automated: boolean;
    readonly confidence: number;
    readonly action: 'replace' | 'insert' | 'delete' | 'modify';
    readonly target: string;
    readonly replacement?: string;
    readonly reasoning?: string;
}
/**
 * Quality score for a specific dimension
 */
export interface QualityScore {
    readonly dimension: QualityDimension;
    readonly score: number;
    readonly weight: number;
    readonly details: {
        readonly passed: number;
        readonly total: number;
        readonly criticalIssues: number;
        readonly majorIssues: number;
        readonly minorIssues: number;
    };
    readonly factors: readonly {
        readonly name: string;
        readonly impact: number;
        readonly reasoning: string;
    }[];
}
/**
 * Overall quality assessment
 */
export interface QualityAssessment {
    readonly overallScore: number;
    readonly grade: 'A' | 'B' | 'C' | 'D' | 'F';
    readonly dimensions: readonly QualityScore[];
    readonly summary: {
        readonly totalIssues: number;
        readonly blockerCount: number;
        readonly criticalCount: number;
        readonly majorCount: number;
        readonly minorCount: number;
        readonly suggestionCount: number;
    };
    readonly recommendations: readonly string[];
    readonly trends: {
        readonly scoreChange: number;
        readonly issueChange: number;
        readonly timeframe: string;
    };
}
/**
 * Validation rule definition
 */
export interface ValidationRule {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly category: ValidationCategory;
    readonly type: ValidationRuleType;
    readonly severity: IssueSeverity;
    readonly enabled: boolean;
    readonly configuration: Record<string, any>;
    readonly applicableTypes: readonly string[];
    readonly dependencies: readonly string[];
    readonly customCode?: string;
}
/**
 * Validation configuration
 */
export interface ValidationConfiguration {
    readonly level: ValidationLevel;
    readonly enabledCategories: readonly ValidationCategory[];
    readonly rules: readonly ValidationRule[];
    readonly qualityWeights: Record<QualityDimension, number>;
    readonly thresholds: {
        readonly minimumScore: number;
        readonly blockerLimit: number;
        readonly criticalLimit: number;
        readonly warningAsError: boolean;
    };
    readonly reporting: {
        readonly includeContext: boolean;
        readonly includeFixes: boolean;
        readonly includeMetrics: boolean;
        readonly groupByCategory: boolean;
    };
}
/**
 * Validation metrics
 */
export interface ValidationMetrics {
    readonly executionTime: number;
    readonly rulesExecuted: number;
    readonly entitiesValidated: number;
    readonly filesProcessed: number;
    readonly cacheHitRate: number;
    readonly memoryUsage: number;
    readonly performance: {
        readonly fastestRule: string;
        readonly slowestRule: string;
        readonly averageRuleTime: number;
        readonly totalRuleTime: number;
    };
}
/**
 * Main validation result interface
 */
export interface ValidationResult {
    readonly id: string;
    readonly sessionId: string | undefined;
    readonly status: ValidationStatus;
    readonly startTime: Date;
    readonly endTime?: Date;
    readonly configuration: ValidationConfiguration;
    readonly issues: readonly ValidationIssue[];
    readonly issuesByCategory: Record<ValidationCategory, readonly ValidationIssue[]>;
    readonly issueBySeverity: Record<IssueSeverity, readonly ValidationIssue[]>;
    readonly qualityAssessment: QualityAssessment;
    readonly passedRules: readonly string[];
    readonly failedRules: readonly string[];
    readonly skippedRules: readonly string[];
    readonly metrics: ValidationMetrics;
    readonly summary: {
        readonly totalEntities: number;
        readonly validEntities: number;
        readonly invalidEntities: number;
        readonly coverage: number;
    };
    readonly target: {
        readonly type: string;
        readonly identifier: string;
        readonly version?: string;
        readonly path?: string;
    };
    readonly environment: string;
    readonly metadata: Record<string, any>;
}
/**
 * Validation result creation parameters
 */
export interface CreateValidationResultParams {
    readonly sessionId?: string;
    readonly configuration: ValidationConfiguration;
    readonly target: {
        readonly type: string;
        readonly identifier: string;
        readonly version?: string;
        readonly path?: string;
    };
    readonly environment?: string;
    readonly metadata?: Record<string, any>;
}
/**
 * Validation result update parameters
 */
export interface UpdateValidationResultParams {
    readonly status?: ValidationStatus;
    readonly endTime?: Date;
    readonly issues?: readonly ValidationIssue[];
    readonly qualityAssessment?: QualityAssessment;
    readonly passedRules?: readonly string[];
    readonly failedRules?: readonly string[];
    readonly skippedRules?: readonly string[];
    readonly metrics?: ValidationMetrics;
    readonly summary?: Partial<ValidationResult['summary']>;
    readonly metadata?: Record<string, any>;
}
/**
 * Report generation options
 */
export interface ReportOptions {
    readonly format: ReportFormat;
    readonly includeSummary: boolean;
    readonly includeDetails: boolean;
    readonly includeMetrics: boolean;
    readonly includeQuality: boolean;
    readonly includeFixes: boolean;
    readonly filterBySeverity?: readonly IssueSeverity[];
    readonly filterByCategory?: readonly ValidationCategory[];
    readonly groupBy?: 'category' | 'severity' | 'file' | 'rule';
    readonly template?: string;
    readonly outputPath?: string;
}
/**
 * Generated validation report
 */
export interface ValidationReport {
    readonly id: string;
    readonly format: ReportFormat;
    readonly content: string;
    readonly metadata: {
        readonly generatedAt: Date;
        readonly resultId: string;
        readonly options: ReportOptions;
        readonly statistics: {
            readonly totalIssues: number;
            readonly totalPages?: number;
            readonly fileSize: number;
        };
    };
}
/**
 * Factory for creating ValidationResult instances
 */
export declare class ValidationResultFactory {
    /**
     * Creates a new validation result
     */
    static create(params: CreateValidationResultParams): ValidationResult;
    /**
     * Creates a validation result from existing data
     */
    static fromData(data: Partial<ValidationResult> & {
        id: string;
        configuration: ValidationConfiguration;
        target: ValidationResult['target'];
    }): ValidationResult;
    /**
     * Updates an existing validation result
     */
    static update(result: ValidationResult, updates: UpdateValidationResultParams): ValidationResult;
    /**
     * Adds an issue to the validation result
     */
    static addIssue(result: ValidationResult, issue: ValidationIssue): ValidationResult;
    /**
     * Completes validation with final assessment
     */
    static complete(result: ValidationResult, qualityAssessment: QualityAssessment, metrics: ValidationMetrics): ValidationResult;
    /**
     * Marks validation as failed
     */
    static fail(result: ValidationResult, error: string): ValidationResult;
    private static generateResultId;
    private static generateIssueId;
    private static createEmptyIssueCategoryMap;
    private static createEmptyIssueSeverityMap;
    private static createInitialQualityAssessment;
    private static createInitialMetrics;
    private static categorizeIssues;
    private static groupBySeverity;
    private static determineStatusFromIssues;
    private static determineFinalStatus;
    private static calculateCoverage;
}
/**
 * Utility functions for working with validation results
 */
export declare class ValidationResultUtils {
    /**
     * Calculates overall quality score
     */
    static calculateQualityScore(issues: readonly ValidationIssue[], config: ValidationConfiguration): QualityAssessment;
    /**
     * Filters issues by criteria
     */
    static filterIssues(issues: readonly ValidationIssue[], criteria: {
        severities?: readonly IssueSeverity[];
        categories?: readonly ValidationCategory[];
        ruleIds?: readonly string[];
    }): ValidationIssue[];
    /**
     * Groups issues by specified field
     */
    static groupIssues(issues: readonly ValidationIssue[], groupBy: 'category' | 'severity' | 'file' | 'rule'): Record<string, ValidationIssue[]>;
    /**
     * Gets issues with automated fixes
     */
    static getFixableIssues(issues: readonly ValidationIssue[]): ValidationIssue[];
    /**
     * Checks if result meets quality thresholds
     */
    static meetsQualityThresholds(result: ValidationResult): boolean;
    /**
     * Creates a validation result summary
     */
    static createSummary(result: ValidationResult): {
        id: string;
        status: ValidationStatus;
        score: number;
        grade: string;
        totalIssues: number;
        criticalIssues: number;
        executionTime: number;
        coverage: number;
        passed: boolean;
    };
    private static summarizeIssues;
    private static calculateDimensionScores;
    private static getIssuesForDimension;
    private static getTotalChecksForDimension;
    private static isRuleRelevantToDimension;
    private static calculateQualityFactors;
    private static calculateOverallScore;
    private static assignGrade;
    private static generateRecommendations;
}
/**
 * Report generation utilities
 */
export declare class ValidationReportGenerator {
    /**
     * Generates a validation report
     */
    static generateReport(result: ValidationResult, options: ReportOptions): ValidationReport;
    private static generateReportId;
    private static generateContent;
    private static generateJsonReport;
    private static generateHtmlReport;
    private static generateMarkdownReport;
    private static generateHtmlIssues;
    private static filterAndGroupIssues;
}
//# sourceMappingURL=validation-result.d.ts.map