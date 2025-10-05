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
export enum ValidationStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  PASSED = 'passed',
  FAILED = 'failed',
  WARNING = 'warning',
  SKIPPED = 'skipped',
  CANCELLED = 'cancelled'
}

/**
 * Validation level enumeration
 */
export enum ValidationLevel {
  STRICT = 'strict',
  STANDARD = 'standard',
  LENIENT = 'lenient',
  CUSTOM = 'custom'
}

/**
 * Validation category enumeration
 */
export enum ValidationCategory {
  SYNTAX = 'syntax',
  SCHEMA = 'schema',
  SEMANTIC = 'semantic',
  STYLE = 'style',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  ACCESSIBILITY = 'accessibility',
  COMPATIBILITY = 'compatibility',
  DOCUMENTATION = 'documentation',
  CUSTOM = 'custom'
}

/**
 * Issue severity enumeration
 */
export enum IssueSeverity {
  BLOCKER = 'blocker',
  CRITICAL = 'critical',
  MAJOR = 'major',
  MINOR = 'minor',
  INFO = 'info',
  SUGGESTION = 'suggestion'
}

/**
 * Validation rule type enumeration
 */
export enum ValidationRuleType {
  REQUIRED_FIELD = 'required-field',
  DATA_TYPE = 'data-type',
  FORMAT = 'format',
  RANGE = 'range',
  PATTERN = 'pattern',
  ENUM = 'enum',
  REFERENCE = 'reference',
  DEPENDENCY = 'dependency',
  UNIQUENESS = 'uniqueness',
  CONSISTENCY = 'consistency',
  CUSTOM = 'custom'
}

/**
 * Quality dimension enumeration
 */
export enum QualityDimension {
  COMPLETENESS = 'completeness',
  ACCURACY = 'accuracy',
  CONSISTENCY = 'consistency',
  CLARITY = 'clarity',
  RELEVANCE = 'relevance',
  MAINTAINABILITY = 'maintainability',
  USABILITY = 'usability',
  PERFORMANCE = 'performance'
}

/**
 * Report format enumeration
 */
export enum ReportFormat {
  JSON = 'json',
  HTML = 'html',
  MARKDOWN = 'markdown',
  XML = 'xml',
  CSV = 'csv',
  PDF = 'pdf',
  JUNIT = 'junit',
  CHECKSTYLE = 'checkstyle'
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
    readonly start: { readonly line: number; readonly column: number };
    readonly end: { readonly line: number; readonly column: number };
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
  readonly confidence: number; // 0-1
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
  readonly score: number; // 0-100
  readonly weight: number; // 0-1
  readonly details: {
    readonly passed: number;
    readonly total: number;
    readonly criticalIssues: number;
    readonly majorIssues: number;
    readonly minorIssues: number;
  };
  readonly factors: readonly {
    readonly name: string;
    readonly impact: number; // -100 to 100
    readonly reasoning: string;
  }[];
}

/**
 * Overall quality assessment
 */
export interface QualityAssessment {
  readonly overallScore: number; // 0-100
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
  readonly executionTime: number; // milliseconds
  readonly rulesExecuted: number;
  readonly entitiesValidated: number;
  readonly filesProcessed: number;
  readonly cacheHitRate: number;
  readonly memoryUsage: number; // bytes
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
  
  // Issues and findings
  readonly issues: readonly ValidationIssue[];
  readonly issuesByCategory: Record<ValidationCategory, readonly ValidationIssue[]>;
  readonly issueBySeverity: Record<IssueSeverity, readonly ValidationIssue[]>;
  
  // Quality assessment
  readonly qualityAssessment: QualityAssessment;
  readonly passedRules: readonly string[];
  readonly failedRules: readonly string[];
  readonly skippedRules: readonly string[];
  
  // Metrics and statistics
  readonly metrics: ValidationMetrics;
  readonly summary: {
    readonly totalEntities: number;
    readonly validEntities: number;
    readonly invalidEntities: number;
    readonly coverage: number; // percentage
  };
  
  // Context and metadata
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
export class ValidationResultFactory {
  /**
   * Creates a new validation result
   */
  static create(params: CreateValidationResultParams): ValidationResult {
    const now = new Date();
    
    return {
      id: this.generateResultId(),
      sessionId: params.sessionId ?? undefined,
      status: ValidationStatus.PENDING,
      startTime: now,
      configuration: params.configuration,
      issues: [],
      issuesByCategory: this.createEmptyIssueCategoryMap(),
      issueBySeverity: this.createEmptyIssueSeverityMap(),
      qualityAssessment: this.createInitialQualityAssessment(),
      passedRules: [],
      failedRules: [],
      skippedRules: [],
      metrics: this.createInitialMetrics(),
      summary: {
        totalEntities: 0,
        validEntities: 0,
        invalidEntities: 0,
        coverage: 0
      },
      target: params.target,
      environment: params.environment ?? 'unknown',
      metadata: params.metadata ?? {}
    };
  }

  /**
   * Creates a validation result from existing data
   */
  static fromData(data: Partial<ValidationResult> & {
    id: string;
    configuration: ValidationConfiguration;
    target: ValidationResult['target'];
  }): ValidationResult {
    const now = new Date();
    
    return {
      sessionId: undefined,
      status: ValidationStatus.PENDING,
      startTime: now,
      issues: [],
      issuesByCategory: this.createEmptyIssueCategoryMap(),
      issueBySeverity: this.createEmptyIssueSeverityMap(),
      qualityAssessment: this.createInitialQualityAssessment(),
      passedRules: [],
      failedRules: [],
      skippedRules: [],
      metrics: this.createInitialMetrics(),
      summary: {
        totalEntities: 0,
        validEntities: 0,
        invalidEntities: 0,
        coverage: 0
      },
      environment: 'unknown',
      metadata: {},
      ...data
    };
  }

  /**
   * Updates an existing validation result
   */
  static update(result: ValidationResult, updates: UpdateValidationResultParams): ValidationResult {
    const updatedResult = {
      ...result,
      ...updates,
      summary: updates.summary ? { ...result.summary, ...updates.summary } : result.summary,
      metadata: updates.metadata ? { ...result.metadata, ...updates.metadata } : result.metadata
    };

    // Recompute categorized issues if issues were updated
    if (updates.issues) {
      updatedResult.issuesByCategory = this.categorizeIssues(updates.issues);
      updatedResult.issueBySeverity = this.groupBySeverity(updates.issues);
    }

    return updatedResult;
  }

  /**
   * Adds an issue to the validation result
   */
  static addIssue(result: ValidationResult, issue: ValidationIssue): ValidationResult {
    const newIssues = [...result.issues, issue];
    
    return this.update(result, {
      issues: newIssues,
      status: this.determineStatusFromIssues(newIssues, result.status)
    });
  }

  /**
   * Completes validation with final assessment
   */
  static complete(
    result: ValidationResult, 
    qualityAssessment: QualityAssessment,
    metrics: ValidationMetrics
  ): ValidationResult {
    const finalStatus = this.determineFinalStatus(result.issues, qualityAssessment);
    
    return this.update(result, {
      status: finalStatus,
      endTime: new Date(),
      qualityAssessment,
      metrics,
      summary: {
        ...result.summary,
        coverage: this.calculateCoverage(result, metrics)
      }
    });
  }

  /**
   * Marks validation as failed
   */
  static fail(result: ValidationResult, error: string): ValidationResult {
    const errorIssue: ValidationIssue = {
      id: this.generateIssueId(),
      severity: IssueSeverity.BLOCKER,
      category: ValidationCategory.SYNTAX,
      ruleType: ValidationRuleType.CUSTOM,
      ruleId: 'validation-error',
      message: `Validation failed: ${error}`,
      location: {},
      context: {
        sourceType: 'system',
        relatedEntities: [],
        additionalData: {}
      },
      metadata: {},
      timestamp: new Date()
    };

    return this.update(result, {
      status: ValidationStatus.FAILED,
      endTime: new Date(),
      issues: [...result.issues, errorIssue]
    });
  }

  private static generateResultId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `validation_${timestamp}_${random}`;
  }

  private static generateIssueId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `issue_${timestamp}_${random}`;
  }

  private static createEmptyIssueCategoryMap(): Record<ValidationCategory, readonly ValidationIssue[]> {
    const map: Record<ValidationCategory, ValidationIssue[]> = {} as any;
    Object.values(ValidationCategory).forEach(category => {
      map[category] = [];
    });
    return map as Record<ValidationCategory, readonly ValidationIssue[]>;
  }

  private static createEmptyIssueSeverityMap(): Record<IssueSeverity, readonly ValidationIssue[]> {
    const map: Record<IssueSeverity, ValidationIssue[]> = {} as any;
    Object.values(IssueSeverity).forEach(severity => {
      map[severity] = [];
    });
    return map as Record<IssueSeverity, readonly ValidationIssue[]>;
  }

  private static createInitialQualityAssessment(): QualityAssessment {
    return {
      overallScore: 0,
      grade: 'F',
      dimensions: [],
      summary: {
        totalIssues: 0,
        blockerCount: 0,
        criticalCount: 0,
        majorCount: 0,
        minorCount: 0,
        suggestionCount: 0
      },
      recommendations: [],
      trends: {
        scoreChange: 0,
        issueChange: 0,
        timeframe: 'N/A'
      }
    };
  }

  private static createInitialMetrics(): ValidationMetrics {
    return {
      executionTime: 0,
      rulesExecuted: 0,
      entitiesValidated: 0,
      filesProcessed: 0,
      cacheHitRate: 0,
      memoryUsage: 0,
      performance: {
        fastestRule: '',
        slowestRule: '',
        averageRuleTime: 0,
        totalRuleTime: 0
      }
    };
  }

  private static categorizeIssues(issues: readonly ValidationIssue[]): Record<ValidationCategory, readonly ValidationIssue[]> {
    const categorized = this.createEmptyIssueCategoryMap() as Record<ValidationCategory, ValidationIssue[]>;
    
    issues.forEach(issue => {
      categorized[issue.category].push(issue);
    });

    return categorized as Record<ValidationCategory, readonly ValidationIssue[]>;
  }

  private static groupBySeverity(issues: readonly ValidationIssue[]): Record<IssueSeverity, readonly ValidationIssue[]> {
    const grouped = this.createEmptyIssueSeverityMap() as Record<IssueSeverity, ValidationIssue[]>;
    
    issues.forEach(issue => {
      grouped[issue.severity].push(issue);
    });

    return grouped as Record<IssueSeverity, readonly ValidationIssue[]>;
  }

  private static determineStatusFromIssues(issues: readonly ValidationIssue[], currentStatus: ValidationStatus): ValidationStatus {
    if (currentStatus === ValidationStatus.CANCELLED || currentStatus === ValidationStatus.FAILED) {
      return currentStatus;
    }

    const hasBlockers = issues.some(issue => issue.severity === IssueSeverity.BLOCKER);
    if (hasBlockers) {
      return ValidationStatus.FAILED;
    }

    const hasCritical = issues.some(issue => issue.severity === IssueSeverity.CRITICAL);
    if (hasCritical) {
      return ValidationStatus.WARNING;
    }

    return ValidationStatus.RUNNING;
  }

  private static determineFinalStatus(_issues: readonly ValidationIssue[], quality: QualityAssessment): ValidationStatus {
    if (quality.summary.blockerCount > 0) {
      return ValidationStatus.FAILED;
    }
    
    if (quality.summary.criticalCount > 0 || quality.grade === 'F') {
      return ValidationStatus.WARNING;
    }

    return ValidationStatus.PASSED;
  }

  private static calculateCoverage(result: ValidationResult, metrics: ValidationMetrics): number {
    if (metrics.entitiesValidated === 0) return 0;
    return (metrics.entitiesValidated / Math.max(result.summary.totalEntities, metrics.entitiesValidated)) * 100;
  }
}

/**
 * Utility functions for working with validation results
 */
export class ValidationResultUtils {
  /**
   * Calculates overall quality score
   */
  static calculateQualityScore(issues: readonly ValidationIssue[], config: ValidationConfiguration): QualityAssessment {
    const summary = this.summarizeIssues(issues);
    const dimensions = this.calculateDimensionScores(issues, config);
    const overallScore = this.calculateOverallScore(dimensions, config.qualityWeights);
    const grade = this.assignGrade(overallScore);
    
    return {
      overallScore,
      grade,
      dimensions,
      summary,
      recommendations: this.generateRecommendations(issues, overallScore),
      trends: {
        scoreChange: 0,
        issueChange: 0,
        timeframe: 'current'
      }
    };
  }

  /**
   * Filters issues by criteria
   */
  static filterIssues(
    issues: readonly ValidationIssue[], 
    criteria: {
      severities?: readonly IssueSeverity[];
      categories?: readonly ValidationCategory[];
      ruleIds?: readonly string[];
    }
  ): ValidationIssue[] {
    return issues.filter(issue => {
      if (criteria.severities && !criteria.severities.includes(issue.severity)) {
        return false;
      }
      if (criteria.categories && !criteria.categories.includes(issue.category)) {
        return false;
      }
      if (criteria.ruleIds && !criteria.ruleIds.includes(issue.ruleId)) {
        return false;
      }
      return true;
    });
  }

  /**
   * Groups issues by specified field
   */
  static groupIssues(
    issues: readonly ValidationIssue[], 
    groupBy: 'category' | 'severity' | 'file' | 'rule'
  ): Record<string, ValidationIssue[]> {
    const groups: Record<string, ValidationIssue[]> = {};
    
    issues.forEach(issue => {
      let key: string;
      switch (groupBy) {
        case 'category':
          key = issue.category;
          break;
        case 'severity':
          key = issue.severity;
          break;
        case 'file':
          key = issue.location.file || 'unknown';
          break;
        case 'rule':
          key = issue.ruleId;
          break;
        default:
          key = 'other';
      }
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key]!.push(issue);
    });
    
    return groups;
  }

  /**
   * Gets issues with automated fixes
   */
  static getFixableIssues(issues: readonly ValidationIssue[]): ValidationIssue[] {
    return issues.filter(issue => issue.fix?.automated === true);
  }

  /**
   * Checks if result meets quality thresholds
   */
  static meetsQualityThresholds(result: ValidationResult): boolean {
    const { thresholds } = result.configuration;
    const { qualityAssessment } = result;
    
    if (qualityAssessment.overallScore < thresholds.minimumScore) {
      return false;
    }
    
    if (qualityAssessment.summary.blockerCount > thresholds.blockerLimit) {
      return false;
    }
    
    if (qualityAssessment.summary.criticalCount > thresholds.criticalLimit) {
      return false;
    }
    
    return true;
  }

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
  } {
    return {
      id: result.id,
      status: result.status,
      score: result.qualityAssessment.overallScore,
      grade: result.qualityAssessment.grade,
      totalIssues: result.qualityAssessment.summary.totalIssues,
      criticalIssues: result.qualityAssessment.summary.criticalCount + result.qualityAssessment.summary.blockerCount,
      executionTime: result.metrics.executionTime,
      coverage: result.summary.coverage,
      passed: result.status === ValidationStatus.PASSED
    };
  }

  private static summarizeIssues(issues: readonly ValidationIssue[]): QualityAssessment['summary'] {
    return {
      totalIssues: issues.length,
      blockerCount: issues.filter(i => i.severity === IssueSeverity.BLOCKER).length,
      criticalCount: issues.filter(i => i.severity === IssueSeverity.CRITICAL).length,
      majorCount: issues.filter(i => i.severity === IssueSeverity.MAJOR).length,
      minorCount: issues.filter(i => i.severity === IssueSeverity.MINOR).length,
      suggestionCount: issues.filter(i => i.severity === IssueSeverity.SUGGESTION).length
    };
  }

  private static calculateDimensionScores(
    issues: readonly ValidationIssue[], 
    config: ValidationConfiguration
  ): QualityScore[] {
    return Object.values(QualityDimension).map(dimension => {
      const relevantIssues = this.getIssuesForDimension(issues, dimension);
      const totalChecks = this.getTotalChecksForDimension(dimension, config);
      const passed = totalChecks - relevantIssues.length;
      
      const score = totalChecks > 0 ? (passed / totalChecks) * 100 : 100;
      
      return {
        dimension,
        score: Math.max(0, Math.min(100, score)),
        weight: config.qualityWeights[dimension] || 1,
        details: {
          passed,
          total: totalChecks,
          criticalIssues: relevantIssues.filter(i => i.severity === IssueSeverity.CRITICAL).length,
          majorIssues: relevantIssues.filter(i => i.severity === IssueSeverity.MAJOR).length,
          minorIssues: relevantIssues.filter(i => i.severity === IssueSeverity.MINOR).length
        },
        factors: this.calculateQualityFactors(relevantIssues, dimension)
      };
    });
  }

  private static getIssuesForDimension(issues: readonly ValidationIssue[], dimension: QualityDimension): ValidationIssue[] {
    // Simple mapping of categories to dimensions
    const categoryMapping: Record<QualityDimension, ValidationCategory[]> = {
      [QualityDimension.COMPLETENESS]: [ValidationCategory.DOCUMENTATION, ValidationCategory.SCHEMA],
      [QualityDimension.ACCURACY]: [ValidationCategory.SYNTAX, ValidationCategory.SEMANTIC],
      [QualityDimension.CONSISTENCY]: [ValidationCategory.STYLE, ValidationCategory.SCHEMA],
      [QualityDimension.CLARITY]: [ValidationCategory.DOCUMENTATION, ValidationCategory.STYLE],
      [QualityDimension.RELEVANCE]: [ValidationCategory.DOCUMENTATION, ValidationCategory.SEMANTIC],
      [QualityDimension.MAINTAINABILITY]: [ValidationCategory.STYLE, ValidationCategory.PERFORMANCE],
      [QualityDimension.USABILITY]: [ValidationCategory.ACCESSIBILITY, ValidationCategory.DOCUMENTATION],
      [QualityDimension.PERFORMANCE]: [ValidationCategory.PERFORMANCE]
    };
    
    const relevantCategories = categoryMapping[dimension] || [];
    return issues.filter(issue => relevantCategories.includes(issue.category));
  }

  private static getTotalChecksForDimension(dimension: QualityDimension, config: ValidationConfiguration): number {
    // Simplified calculation - in real implementation, this would be based on actual rules
    return config.rules.filter(rule => this.isRuleRelevantToDimension(rule, dimension)).length || 10;
  }

  private static isRuleRelevantToDimension(_rule: ValidationRule, _dimension: QualityDimension): boolean {
    // Simplified mapping - in real implementation, rules would have dimension metadata
    return true;
  }

  private static calculateQualityFactors(issues: readonly ValidationIssue[], _dimension: QualityDimension): QualityScore['factors'] {
    return issues.slice(0, 3).map(issue => ({
      name: issue.ruleId,
      impact: -Math.min(50, issue.severity === IssueSeverity.CRITICAL ? 30 : 15),
      reasoning: `${issue.severity} issue: ${issue.message}`
    }));
  }

  private static calculateOverallScore(dimensions: QualityScore[], weights: Record<QualityDimension, number>): number {
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    dimensions.forEach(dimension => {
      const weight = weights[dimension.dimension] || 1;
      totalWeightedScore += dimension.score * weight;
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  }

  private static assignGrade(score: number): QualityAssessment['grade'] {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private static generateRecommendations(issues: readonly ValidationIssue[], score: number): string[] {
    const recommendations: string[] = [];
    
    if (score < 60) {
      recommendations.push('Focus on resolving critical and blocker issues first');
    }
    
    const criticalIssues = issues.filter(i => i.severity === IssueSeverity.CRITICAL);
    if (criticalIssues.length > 0) {
      recommendations.push(`Address ${criticalIssues.length} critical issues`);
    }
    
    const fixableIssues = issues.filter(i => i.fix?.automated);
    if (fixableIssues.length > 0) {
      recommendations.push(`${fixableIssues.length} issues can be automatically fixed`);
    }
    
    return recommendations;
  }
}

/**
 * Report generation utilities
 */
export class ValidationReportGenerator {
  /**
   * Generates a validation report
   */
  static generateReport(result: ValidationResult, options: ReportOptions): ValidationReport {
    const content = this.generateContent(result, options);
    
    return {
      id: this.generateReportId(),
      format: options.format,
      content,
      metadata: {
        generatedAt: new Date(),
        resultId: result.id,
        options,
        statistics: {
          totalIssues: result.issues.length,
          fileSize: content.length
        }
      }
    };
  }

  private static generateReportId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `report_${timestamp}_${random}`;
  }

  private static generateContent(result: ValidationResult, options: ReportOptions): string {
    switch (options.format) {
      case ReportFormat.JSON:
        return this.generateJsonReport(result, options);
      case ReportFormat.HTML:
        return this.generateHtmlReport(result, options);
      case ReportFormat.MARKDOWN:
        return this.generateMarkdownReport(result, options);
      default:
        return this.generateJsonReport(result, options);
    }
  }

  private static generateJsonReport(result: ValidationResult, options: ReportOptions): string {
    const report: any = {};
    
    if (options.includeSummary) {
      report.summary = ValidationResultUtils.createSummary(result);
    }
    
    if (options.includeDetails) {
      report.issues = this.filterAndGroupIssues(result.issues, options);
    }
    
    if (options.includeQuality) {
      report.quality = result.qualityAssessment;
    }
    
    if (options.includeMetrics) {
      report.metrics = result.metrics;
    }
    
    return JSON.stringify(report, null, 2);
  }

  private static generateHtmlReport(result: ValidationResult, options: ReportOptions): string {
    // Simplified HTML generation - in real implementation, would use templates
    const summary = ValidationResultUtils.createSummary(result);
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Validation Report - ${result.target.identifier}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; }
        .issue { margin: 10px 0; padding: 10px; border-left: 4px solid #ccc; }
        .critical { border-left-color: #d32f2f; }
        .major { border-left-color: #f57c00; }
        .minor { border-left-color: #fbc02d; }
    </style>
</head>
<body>
    <h1>Validation Report</h1>
    <div class="summary">
        <h2>Summary</h2>
        <p>Status: ${summary.status}</p>
        <p>Score: ${summary.score.toFixed(1)}/100 (${summary.grade})</p>
        <p>Total Issues: ${summary.totalIssues}</p>
        <p>Critical Issues: ${summary.criticalIssues}</p>
    </div>
    ${options.includeDetails ? this.generateHtmlIssues(result.issues) : ''}
</body>
</html>`;
  }

  private static generateMarkdownReport(result: ValidationResult, options: ReportOptions): string {
    const summary = ValidationResultUtils.createSummary(result);
    
    let content = `# Validation Report\n\n`;
    content += `**Target:** ${result.target.identifier}\n`;
    content += `**Status:** ${summary.status}\n`;
    content += `**Score:** ${summary.score.toFixed(1)}/100 (${summary.grade})\n`;
    content += `**Total Issues:** ${summary.totalIssues}\n`;
    content += `**Critical Issues:** ${summary.criticalIssues}\n\n`;
    
    if (options.includeDetails && result.issues.length > 0) {
      content += `## Issues\n\n`;
      result.issues.forEach(issue => {
        content += `### ${issue.severity.toUpperCase()}: ${issue.message}\n`;
        content += `**Rule:** ${issue.ruleId}\n`;
        content += `**Category:** ${issue.category}\n`;
        if (issue.location.file) {
          content += `**File:** ${issue.location.file}\n`;
        }
        if (issue.suggestion) {
          content += `**Suggestion:** ${issue.suggestion}\n`;
        }
        content += `\n`;
      });
    }
    
    return content;
  }

  private static generateHtmlIssues(issues: readonly ValidationIssue[]): string {
    if (issues.length === 0) return '<p>No issues found.</p>';
    
    return `
    <h2>Issues</h2>
    ${issues.map(issue => `
        <div class="issue ${issue.severity}">
            <strong>${issue.severity.toUpperCase()}:</strong> ${issue.message}<br>
            <small>Rule: ${issue.ruleId} | Category: ${issue.category}</small>
            ${issue.suggestion ? `<br><em>Suggestion: ${issue.suggestion}</em>` : ''}
        </div>
    `).join('')}`;
  }

  private static filterAndGroupIssues(issues: readonly ValidationIssue[], options: ReportOptions): any {
    let filteredIssues = [...issues];
    
    if (options.filterBySeverity) {
      filteredIssues = ValidationResultUtils.filterIssues(filteredIssues, {
        severities: options.filterBySeverity
      });
    }
    
    if (options.filterByCategory) {
      filteredIssues = ValidationResultUtils.filterIssues(filteredIssues, {
        categories: options.filterByCategory
      });
    }
    
    if (options.groupBy) {
      return ValidationResultUtils.groupIssues(filteredIssues, options.groupBy);
    }
    
    return filteredIssues;
  }
}