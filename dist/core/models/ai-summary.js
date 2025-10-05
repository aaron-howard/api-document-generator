"use strict";
/**
 * AI-generated content models for documentation enhancement
 * Manages AI summaries, human reviews, and validation results
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AISummaryUtils = exports.AISummaryFactory = exports.ReviewMethod = exports.ChangeType = exports.ReviewStatus = exports.SuggestionPriority = exports.SuggestionType = exports.IssueSeverity = exports.ValidationIssueType = exports.PromptType = exports.ModelCapability = exports.AIProvider = exports.LinkType = exports.ExampleComplexity = exports.SectionType = exports.ContentFormat = exports.AISummaryType = exports.AITargetType = void 0;
var AITargetType;
(function (AITargetType) {
    AITargetType["ENDPOINT"] = "endpoint";
    AITargetType["SCHEMA"] = "schema";
    AITargetType["MODULE"] = "module";
    AITargetType["PROJECT"] = "project";
    AITargetType["PARAMETER"] = "parameter";
    AITargetType["RESPONSE"] = "response";
    AITargetType["EXAMPLE"] = "example";
    AITargetType["TAG"] = "tag";
})(AITargetType || (exports.AITargetType = AITargetType = {}));
var AISummaryType;
(function (AISummaryType) {
    AISummaryType["OVERVIEW"] = "overview";
    AISummaryType["USAGE"] = "usage";
    AISummaryType["EXAMPLES"] = "examples";
    AISummaryType["DESCRIPTION"] = "description";
    AISummaryType["BEST_PRACTICES"] = "best-practices";
    AISummaryType["TROUBLESHOOTING"] = "troubleshooting";
    AISummaryType["MIGRATION_GUIDE"] = "migration-guide";
    AISummaryType["TUTORIAL"] = "tutorial";
    AISummaryType["REFERENCE"] = "reference";
    AISummaryType["CHANGELOG"] = "changelog";
})(AISummaryType || (exports.AISummaryType = AISummaryType = {}));
var ContentFormat;
(function (ContentFormat) {
    ContentFormat["MARKDOWN"] = "markdown";
    ContentFormat["HTML"] = "html";
    ContentFormat["PLAIN_TEXT"] = "plain-text";
    ContentFormat["JSON"] = "json";
    ContentFormat["STRUCTURED"] = "structured";
})(ContentFormat || (exports.ContentFormat = ContentFormat = {}));
var SectionType;
(function (SectionType) {
    SectionType["SUMMARY"] = "summary";
    SectionType["DESCRIPTION"] = "description";
    SectionType["PARAMETERS"] = "parameters";
    SectionType["EXAMPLES"] = "examples";
    SectionType["RESPONSES"] = "responses";
    SectionType["ERRORS"] = "errors";
    SectionType["NOTES"] = "notes";
    SectionType["SEE_ALSO"] = "see-also";
})(SectionType || (exports.SectionType = SectionType = {}));
var ExampleComplexity;
(function (ExampleComplexity) {
    ExampleComplexity["BASIC"] = "basic";
    ExampleComplexity["INTERMEDIATE"] = "intermediate";
    ExampleComplexity["ADVANCED"] = "advanced";
})(ExampleComplexity || (exports.ExampleComplexity = ExampleComplexity = {}));
var LinkType;
(function (LinkType) {
    LinkType["DOCUMENTATION"] = "documentation";
    LinkType["EXAMPLE"] = "example";
    LinkType["REFERENCE"] = "reference";
    LinkType["TUTORIAL"] = "tutorial";
    LinkType["SOURCE_CODE"] = "source-code";
    LinkType["EXTERNAL"] = "external";
})(LinkType || (exports.LinkType = LinkType = {}));
var AIProvider;
(function (AIProvider) {
    AIProvider["OPENAI"] = "openai";
    AIProvider["ANTHROPIC"] = "anthropic";
    AIProvider["GOOGLE"] = "google";
    AIProvider["COHERE"] = "cohere";
    AIProvider["HUGGING_FACE"] = "hugging-face";
    AIProvider["LOCAL"] = "local";
    AIProvider["AZURE"] = "azure";
    AIProvider["AWS"] = "aws";
})(AIProvider || (exports.AIProvider = AIProvider = {}));
var ModelCapability;
(function (ModelCapability) {
    ModelCapability["TEXT_GENERATION"] = "text-generation";
    ModelCapability["CODE_GENERATION"] = "code-generation";
    ModelCapability["SUMMARIZATION"] = "summarization";
    ModelCapability["TRANSLATION"] = "translation";
    ModelCapability["QUESTION_ANSWERING"] = "question-answering";
    ModelCapability["CLASSIFICATION"] = "classification";
    ModelCapability["EMBEDDING"] = "embedding";
})(ModelCapability || (exports.ModelCapability = ModelCapability = {}));
var PromptType;
(function (PromptType) {
    PromptType["SUMMARIZATION"] = "summarization";
    PromptType["ENHANCEMENT"] = "enhancement";
    PromptType["EXAMPLE_GENERATION"] = "example-generation";
    PromptType["VALIDATION"] = "validation";
    PromptType["TRANSLATION"] = "translation";
    PromptType["FORMATTING"] = "formatting";
    PromptType["ANALYSIS"] = "analysis";
})(PromptType || (exports.PromptType = PromptType = {}));
var ValidationIssueType;
(function (ValidationIssueType) {
    ValidationIssueType["ACCURACY"] = "accuracy";
    ValidationIssueType["RELEVANCE"] = "relevance";
    ValidationIssueType["COMPLETENESS"] = "completeness";
    ValidationIssueType["CLARITY"] = "clarity";
    ValidationIssueType["CONSISTENCY"] = "consistency";
    ValidationIssueType["FACTUAL_ERROR"] = "factual-error";
    ValidationIssueType["FORMATTING"] = "formatting";
    ValidationIssueType["GRAMMAR"] = "grammar";
    ValidationIssueType["TONE"] = "tone";
})(ValidationIssueType || (exports.ValidationIssueType = ValidationIssueType = {}));
var IssueSeverity;
(function (IssueSeverity) {
    IssueSeverity["ERROR"] = "error";
    IssueSeverity["WARNING"] = "warning";
    IssueSeverity["INFO"] = "info";
    IssueSeverity["SUGGESTION"] = "suggestion";
})(IssueSeverity || (exports.IssueSeverity = IssueSeverity = {}));
var SuggestionType;
(function (SuggestionType) {
    SuggestionType["ENHANCEMENT"] = "enhancement";
    SuggestionType["CLARIFICATION"] = "clarification";
    SuggestionType["EXAMPLE_ADDITION"] = "example-addition";
    SuggestionType["RESTRUCTURING"] = "restructuring";
    SuggestionType["SIMPLIFICATION"] = "simplification";
    SuggestionType["EXPANSION"] = "expansion";
})(SuggestionType || (exports.SuggestionType = SuggestionType = {}));
var SuggestionPriority;
(function (SuggestionPriority) {
    SuggestionPriority["HIGH"] = "high";
    SuggestionPriority["MEDIUM"] = "medium";
    SuggestionPriority["LOW"] = "low";
})(SuggestionPriority || (exports.SuggestionPriority = SuggestionPriority = {}));
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["PENDING"] = "pending";
    ReviewStatus["APPROVED"] = "approved";
    ReviewStatus["REJECTED"] = "rejected";
    ReviewStatus["MODIFIED"] = "modified";
    ReviewStatus["NEEDS_REVISION"] = "needs-revision";
    ReviewStatus["ARCHIVED"] = "archived";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
var ChangeType;
(function (ChangeType) {
    ChangeType["ADDITION"] = "addition";
    ChangeType["DELETION"] = "deletion";
    ChangeType["MODIFICATION"] = "modification";
    ChangeType["RESTRUCTURING"] = "restructuring";
    ChangeType["FORMATTING"] = "formatting";
})(ChangeType || (exports.ChangeType = ChangeType = {}));
var ReviewMethod;
(function (ReviewMethod) {
    ReviewMethod["MANUAL"] = "manual";
    ReviewMethod["ASSISTED"] = "assisted";
    ReviewMethod["AUTOMATED"] = "automated";
    ReviewMethod["COLLABORATIVE"] = "collaborative";
})(ReviewMethod || (exports.ReviewMethod = ReviewMethod = {}));
/**
 * Factory for creating AISummary instances
 */
class AISummaryFactory {
    /**
     * Create a basic AISummary
     */
    static create(config) {
        const now = new Date();
        const hash = this.generateHash(config.content, config.targetId);
        return {
            id: this.generateId(),
            targetType: config.targetType,
            targetId: config.targetId,
            summaryType: config.summaryType,
            content: {
                text: config.content,
                format: ContentFormat.MARKDOWN,
                sections: [],
                examples: [],
                codeSnippets: [],
                links: [],
                warnings: [],
                recommendations: [],
            },
            accuracy: 0.8, // Default accuracy
            humanReviewed: false,
            generatedAt: now,
            model: config.model,
            prompt: config.prompt,
            validation: this.createDefaultValidation(),
            metadata: {
                createdAt: now,
                updatedAt: now,
                version: 1,
                hash,
                processingTime: 0,
                retryCount: 0,
                tags: [],
            },
        };
    }
    /**
     * Create AISummary for endpoint enhancement
     */
    static forEndpoint(endpointId, summaryType, content, model, prompt, validation) {
        const summary = this.create({
            targetType: AITargetType.ENDPOINT,
            targetId: endpointId,
            summaryType,
            content: content.text,
            model,
            prompt,
        });
        return {
            ...summary,
            content,
            validation: validation || this.createDefaultValidation(),
            accuracy: validation?.accuracyScore || 0.8,
        };
    }
    /**
     * Create AISummary for schema documentation
     */
    static forSchema(schemaId, summaryType, content, model, prompt) {
        const summary = this.create({
            targetType: AITargetType.SCHEMA,
            targetId: schemaId,
            summaryType,
            content: content.text,
            model,
            prompt,
        });
        return {
            ...summary,
            content,
        };
    }
    /**
     * Create AISummary with human review
     */
    static withReview(baseSummary, review) {
        return {
            ...baseSummary,
            humanReviewed: true,
            humanReview: review,
            content: review.modifiedContent || baseSummary.content,
            metadata: {
                ...baseSummary.metadata,
                updatedAt: new Date(),
                version: baseSummary.metadata.version + 1,
            },
        };
    }
    static generateId() {
        return `ai_summary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    static generateHash(content, targetId) {
        const data = `${content}:${targetId}`;
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }
    static createDefaultValidation() {
        return {
            isValid: true,
            confidence: 0.8,
            accuracyScore: 0.8,
            relevanceScore: 0.85,
            completenessScore: 0.75,
            clarityScore: 0.8,
            errors: [],
            warnings: [],
            suggestions: [],
            validatedAt: new Date(),
            validator: 'default',
        };
    }
}
exports.AISummaryFactory = AISummaryFactory;
/**
 * Utility functions for AI summaries
 */
class AISummaryUtils {
    /**
     * Calculate overall quality score for an AI summary
     */
    static getQualityScore(summary) {
        const validation = summary.validation;
        const weights = {
            accuracy: 0.3,
            relevance: 0.25,
            completeness: 0.25,
            clarity: 0.2,
        };
        return (validation.accuracyScore * weights.accuracy +
            validation.relevanceScore * weights.relevance +
            validation.completenessScore * weights.completeness +
            validation.clarityScore * weights.clarity);
    }
    /**
     * Check if summary needs human review
     */
    static needsHumanReview(summary) {
        const qualityScore = this.getQualityScore(summary);
        const hasErrors = summary.validation.errors.length > 0;
        const lowAccuracy = summary.accuracy < 0.7;
        return hasErrors || lowAccuracy || qualityScore < 0.75;
    }
    /**
     * Get token cost for a summary
     */
    static getTokenCost(summary) {
        return summary.prompt.tokens.estimatedCost;
    }
    /**
     * Get processing time for a summary
     */
    static getProcessingTime(summary) {
        return summary.metadata.processingTime;
    }
    /**
     * Check if summary is stale and needs regeneration
     */
    static isStale(summary, maxAge = 30 * 24 * 60 * 60 * 1000) {
        const age = Date.now() - summary.generatedAt.getTime();
        return age > maxAge;
    }
    /**
     * Get summary by target
     */
    static findByTarget(summaries, targetType, targetId, summaryType) {
        return summaries.filter(summary => summary.targetType === targetType &&
            summary.targetId === targetId &&
            (!summaryType || summary.summaryType === summaryType));
    }
    /**
     * Get summaries that need review
     */
    static getNeedingReview(summaries) {
        return summaries.filter(summary => !summary.humanReviewed && this.needsHumanReview(summary));
    }
    /**
     * Get approved summaries
     */
    static getApproved(summaries) {
        return summaries.filter(summary => summary.humanReviewed &&
            summary.humanReview?.status === ReviewStatus.APPROVED);
    }
    /**
     * Calculate total token usage across summaries
     */
    static getTotalTokenUsage(summaries) {
        const totals = summaries.reduce((acc, summary) => ({
            promptTokens: acc.promptTokens + summary.prompt.tokens.promptTokens,
            completionTokens: acc.completionTokens + summary.prompt.tokens.completionTokens,
            totalTokens: acc.totalTokens + summary.prompt.tokens.totalTokens,
            estimatedCost: acc.estimatedCost + summary.prompt.tokens.estimatedCost,
        }), { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCost: 0 });
        return {
            ...totals,
            currency: summaries[0]?.prompt.tokens.currency || 'USD',
        };
    }
    /**
     * Get statistics for AI summaries
     */
    static getStatistics(summaries) {
        const total = summaries.length;
        const humanReviewed = summaries.filter(s => s.humanReviewed).length;
        const needingReview = this.getNeedingReview(summaries).length;
        const approved = this.getApproved(summaries).length;
        const averageQuality = total > 0
            ? summaries.reduce((sum, s) => sum + this.getQualityScore(s), 0) / total
            : 0;
        const totalTokens = this.getTotalTokenUsage(summaries);
        return {
            total,
            humanReviewed,
            needingReview,
            approved,
            averageQuality,
            totalTokens,
        };
    }
}
exports.AISummaryUtils = AISummaryUtils;
//# sourceMappingURL=ai-summary.js.map