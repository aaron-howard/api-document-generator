"use strict";
/**
 * ValidationResult Model
 *
 * Represents comprehensive validation results with status tracking,
 * error and warning management, quality scoring, and report generation.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationReportGenerator = exports.ValidationResultUtils = exports.ValidationResultFactory = exports.ReportFormat = exports.QualityDimension = exports.ValidationRuleType = exports.IssueSeverity = exports.ValidationCategory = exports.ValidationLevel = exports.ValidationStatus = void 0;
/**
 * Validation status enumeration
 */
var ValidationStatus;
(function (ValidationStatus) {
    ValidationStatus["PENDING"] = "pending";
    ValidationStatus["RUNNING"] = "running";
    ValidationStatus["PASSED"] = "passed";
    ValidationStatus["FAILED"] = "failed";
    ValidationStatus["WARNING"] = "warning";
    ValidationStatus["SKIPPED"] = "skipped";
    ValidationStatus["CANCELLED"] = "cancelled";
})(ValidationStatus || (exports.ValidationStatus = ValidationStatus = {}));
/**
 * Validation level enumeration
 */
var ValidationLevel;
(function (ValidationLevel) {
    ValidationLevel["STRICT"] = "strict";
    ValidationLevel["STANDARD"] = "standard";
    ValidationLevel["LENIENT"] = "lenient";
    ValidationLevel["CUSTOM"] = "custom";
})(ValidationLevel || (exports.ValidationLevel = ValidationLevel = {}));
/**
 * Validation category enumeration
 */
var ValidationCategory;
(function (ValidationCategory) {
    ValidationCategory["SYNTAX"] = "syntax";
    ValidationCategory["SCHEMA"] = "schema";
    ValidationCategory["SEMANTIC"] = "semantic";
    ValidationCategory["STYLE"] = "style";
    ValidationCategory["SECURITY"] = "security";
    ValidationCategory["PERFORMANCE"] = "performance";
    ValidationCategory["ACCESSIBILITY"] = "accessibility";
    ValidationCategory["COMPATIBILITY"] = "compatibility";
    ValidationCategory["DOCUMENTATION"] = "documentation";
    ValidationCategory["CUSTOM"] = "custom";
})(ValidationCategory || (exports.ValidationCategory = ValidationCategory = {}));
/**
 * Issue severity enumeration
 */
var IssueSeverity;
(function (IssueSeverity) {
    IssueSeverity["BLOCKER"] = "blocker";
    IssueSeverity["CRITICAL"] = "critical";
    IssueSeverity["MAJOR"] = "major";
    IssueSeverity["MINOR"] = "minor";
    IssueSeverity["INFO"] = "info";
    IssueSeverity["SUGGESTION"] = "suggestion";
})(IssueSeverity || (exports.IssueSeverity = IssueSeverity = {}));
/**
 * Validation rule type enumeration
 */
var ValidationRuleType;
(function (ValidationRuleType) {
    ValidationRuleType["REQUIRED_FIELD"] = "required-field";
    ValidationRuleType["DATA_TYPE"] = "data-type";
    ValidationRuleType["FORMAT"] = "format";
    ValidationRuleType["RANGE"] = "range";
    ValidationRuleType["PATTERN"] = "pattern";
    ValidationRuleType["ENUM"] = "enum";
    ValidationRuleType["REFERENCE"] = "reference";
    ValidationRuleType["DEPENDENCY"] = "dependency";
    ValidationRuleType["UNIQUENESS"] = "uniqueness";
    ValidationRuleType["CONSISTENCY"] = "consistency";
    ValidationRuleType["CUSTOM"] = "custom";
})(ValidationRuleType || (exports.ValidationRuleType = ValidationRuleType = {}));
/**
 * Quality dimension enumeration
 */
var QualityDimension;
(function (QualityDimension) {
    QualityDimension["COMPLETENESS"] = "completeness";
    QualityDimension["ACCURACY"] = "accuracy";
    QualityDimension["CONSISTENCY"] = "consistency";
    QualityDimension["CLARITY"] = "clarity";
    QualityDimension["RELEVANCE"] = "relevance";
    QualityDimension["MAINTAINABILITY"] = "maintainability";
    QualityDimension["USABILITY"] = "usability";
    QualityDimension["PERFORMANCE"] = "performance";
})(QualityDimension || (exports.QualityDimension = QualityDimension = {}));
/**
 * Report format enumeration
 */
var ReportFormat;
(function (ReportFormat) {
    ReportFormat["JSON"] = "json";
    ReportFormat["HTML"] = "html";
    ReportFormat["MARKDOWN"] = "markdown";
    ReportFormat["XML"] = "xml";
    ReportFormat["CSV"] = "csv";
    ReportFormat["PDF"] = "pdf";
    ReportFormat["JUNIT"] = "junit";
    ReportFormat["CHECKSTYLE"] = "checkstyle";
})(ReportFormat || (exports.ReportFormat = ReportFormat = {}));
/**
 * Factory for creating ValidationResult instances
 */
class ValidationResultFactory {
    /**
     * Creates a new validation result
     */
    static create(params) {
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
    static fromData(data) {
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
    static update(result, updates) {
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
    static addIssue(result, issue) {
        const newIssues = [...result.issues, issue];
        return this.update(result, {
            issues: newIssues,
            status: this.determineStatusFromIssues(newIssues, result.status)
        });
    }
    /**
     * Completes validation with final assessment
     */
    static complete(result, qualityAssessment, metrics) {
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
    static fail(result, error) {
        const errorIssue = {
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
    static generateResultId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `validation_${timestamp}_${random}`;
    }
    static generateIssueId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `issue_${timestamp}_${random}`;
    }
    static createEmptyIssueCategoryMap() {
        const map = {};
        Object.values(ValidationCategory).forEach(category => {
            map[category] = [];
        });
        return map;
    }
    static createEmptyIssueSeverityMap() {
        const map = {};
        Object.values(IssueSeverity).forEach(severity => {
            map[severity] = [];
        });
        return map;
    }
    static createInitialQualityAssessment() {
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
    static createInitialMetrics() {
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
    static categorizeIssues(issues) {
        const categorized = this.createEmptyIssueCategoryMap();
        issues.forEach(issue => {
            categorized[issue.category].push(issue);
        });
        return categorized;
    }
    static groupBySeverity(issues) {
        const grouped = this.createEmptyIssueSeverityMap();
        issues.forEach(issue => {
            grouped[issue.severity].push(issue);
        });
        return grouped;
    }
    static determineStatusFromIssues(issues, currentStatus) {
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
    static determineFinalStatus(_issues, quality) {
        if (quality.summary.blockerCount > 0) {
            return ValidationStatus.FAILED;
        }
        if (quality.summary.criticalCount > 0 || quality.grade === 'F') {
            return ValidationStatus.WARNING;
        }
        return ValidationStatus.PASSED;
    }
    static calculateCoverage(result, metrics) {
        if (metrics.entitiesValidated === 0)
            return 0;
        return (metrics.entitiesValidated / Math.max(result.summary.totalEntities, metrics.entitiesValidated)) * 100;
    }
}
exports.ValidationResultFactory = ValidationResultFactory;
/**
 * Utility functions for working with validation results
 */
class ValidationResultUtils {
    /**
     * Calculates overall quality score
     */
    static calculateQualityScore(issues, config) {
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
    static filterIssues(issues, criteria) {
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
    static groupIssues(issues, groupBy) {
        const groups = {};
        issues.forEach(issue => {
            let key;
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
            groups[key].push(issue);
        });
        return groups;
    }
    /**
     * Gets issues with automated fixes
     */
    static getFixableIssues(issues) {
        return issues.filter(issue => issue.fix?.automated === true);
    }
    /**
     * Checks if result meets quality thresholds
     */
    static meetsQualityThresholds(result) {
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
    static createSummary(result) {
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
    static summarizeIssues(issues) {
        return {
            totalIssues: issues.length,
            blockerCount: issues.filter(i => i.severity === IssueSeverity.BLOCKER).length,
            criticalCount: issues.filter(i => i.severity === IssueSeverity.CRITICAL).length,
            majorCount: issues.filter(i => i.severity === IssueSeverity.MAJOR).length,
            minorCount: issues.filter(i => i.severity === IssueSeverity.MINOR).length,
            suggestionCount: issues.filter(i => i.severity === IssueSeverity.SUGGESTION).length
        };
    }
    static calculateDimensionScores(issues, config) {
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
    static getIssuesForDimension(issues, dimension) {
        // Simple mapping of categories to dimensions
        const categoryMapping = {
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
    static getTotalChecksForDimension(dimension, config) {
        // Simplified calculation - in real implementation, this would be based on actual rules
        return config.rules.filter(rule => this.isRuleRelevantToDimension(rule, dimension)).length || 10;
    }
    static isRuleRelevantToDimension(_rule, _dimension) {
        // Simplified mapping - in real implementation, rules would have dimension metadata
        return true;
    }
    static calculateQualityFactors(issues, _dimension) {
        return issues.slice(0, 3).map(issue => ({
            name: issue.ruleId,
            impact: -Math.min(50, issue.severity === IssueSeverity.CRITICAL ? 30 : 15),
            reasoning: `${issue.severity} issue: ${issue.message}`
        }));
    }
    static calculateOverallScore(dimensions, weights) {
        let totalWeightedScore = 0;
        let totalWeight = 0;
        dimensions.forEach(dimension => {
            const weight = weights[dimension.dimension] || 1;
            totalWeightedScore += dimension.score * weight;
            totalWeight += weight;
        });
        return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    }
    static assignGrade(score) {
        if (score >= 90)
            return 'A';
        if (score >= 80)
            return 'B';
        if (score >= 70)
            return 'C';
        if (score >= 60)
            return 'D';
        return 'F';
    }
    static generateRecommendations(issues, score) {
        const recommendations = [];
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
exports.ValidationResultUtils = ValidationResultUtils;
/**
 * Report generation utilities
 */
class ValidationReportGenerator {
    /**
     * Generates a validation report
     */
    static generateReport(result, options) {
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
    static generateReportId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `report_${timestamp}_${random}`;
    }
    static generateContent(result, options) {
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
    static generateJsonReport(result, options) {
        const report = {};
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
    static generateHtmlReport(result, options) {
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
    static generateMarkdownReport(result, options) {
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
    static generateHtmlIssues(issues) {
        if (issues.length === 0)
            return '<p>No issues found.</p>';
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
    static filterAndGroupIssues(issues, options) {
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
exports.ValidationReportGenerator = ValidationReportGenerator;
//# sourceMappingURL=validation-result.js.map