/**
 * AI-generated content models for documentation enhancement
 * Manages AI summaries, human reviews, and validation results
 */
export interface AISummary {
    readonly id: string;
    readonly targetType: AITargetType;
    readonly targetId: string;
    readonly summaryType: AISummaryType;
    readonly content: AIGeneratedContent;
    readonly accuracy: number;
    readonly humanReviewed: boolean;
    readonly generatedAt: Date;
    readonly model: AIModelInfo;
    readonly prompt: AIPromptInfo;
    readonly validation: AIContentValidation;
    readonly metadata: AISummaryMetadata;
    readonly humanReview?: HumanReview;
}
export declare enum AITargetType {
    ENDPOINT = "endpoint",
    SCHEMA = "schema",
    MODULE = "module",
    PROJECT = "project",
    PARAMETER = "parameter",
    RESPONSE = "response",
    EXAMPLE = "example",
    TAG = "tag"
}
export declare enum AISummaryType {
    OVERVIEW = "overview",
    USAGE = "usage",
    EXAMPLES = "examples",
    DESCRIPTION = "description",
    BEST_PRACTICES = "best-practices",
    TROUBLESHOOTING = "troubleshooting",
    MIGRATION_GUIDE = "migration-guide",
    TUTORIAL = "tutorial",
    REFERENCE = "reference",
    CHANGELOG = "changelog"
}
export interface AIGeneratedContent {
    readonly text: string;
    readonly format: ContentFormat;
    readonly sections?: ContentSection[];
    readonly examples?: AIExample[];
    readonly codeSnippets?: CodeSnippet[];
    readonly links?: ContentLink[];
    readonly warnings?: string[];
    readonly recommendations?: string[];
}
export declare enum ContentFormat {
    MARKDOWN = "markdown",
    HTML = "html",
    PLAIN_TEXT = "plain-text",
    JSON = "json",
    STRUCTURED = "structured"
}
export interface ContentSection {
    readonly title: string;
    readonly content: string;
    readonly level: number;
    readonly type: SectionType;
    readonly order: number;
}
export declare enum SectionType {
    SUMMARY = "summary",
    DESCRIPTION = "description",
    PARAMETERS = "parameters",
    EXAMPLES = "examples",
    RESPONSES = "responses",
    ERRORS = "errors",
    NOTES = "notes",
    SEE_ALSO = "see-also"
}
export interface AIExample {
    readonly id: string;
    readonly title: string;
    readonly description?: string;
    readonly code: string;
    readonly language: string;
    readonly scenario: string;
    readonly complexity: ExampleComplexity;
    readonly tags: string[];
}
export declare enum ExampleComplexity {
    BASIC = "basic",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced"
}
export interface CodeSnippet {
    readonly language: string;
    readonly code: string;
    readonly description?: string;
    readonly framework?: string;
    readonly dependencies?: string[];
    readonly runnable: boolean;
}
export interface ContentLink {
    readonly url: string;
    readonly title: string;
    readonly description?: string;
    readonly type: LinkType;
}
export declare enum LinkType {
    DOCUMENTATION = "documentation",
    EXAMPLE = "example",
    REFERENCE = "reference",
    TUTORIAL = "tutorial",
    SOURCE_CODE = "source-code",
    EXTERNAL = "external"
}
export interface AIModelInfo {
    readonly name: string;
    readonly version: string;
    readonly provider: AIProvider;
    readonly capabilities: ModelCapability[];
    readonly maxTokens: number;
    readonly temperature: number;
    readonly configuration: ModelConfiguration;
}
export declare enum AIProvider {
    OPENAI = "openai",
    ANTHROPIC = "anthropic",
    GOOGLE = "google",
    COHERE = "cohere",
    HUGGING_FACE = "hugging-face",
    LOCAL = "local",
    AZURE = "azure",
    AWS = "aws"
}
export declare enum ModelCapability {
    TEXT_GENERATION = "text-generation",
    CODE_GENERATION = "code-generation",
    SUMMARIZATION = "summarization",
    TRANSLATION = "translation",
    QUESTION_ANSWERING = "question-answering",
    CLASSIFICATION = "classification",
    EMBEDDING = "embedding"
}
export interface ModelConfiguration {
    readonly maxTokens?: number;
    readonly temperature?: number;
    readonly topP?: number;
    readonly topK?: number;
    readonly frequencyPenalty?: number;
    readonly presencePenalty?: number;
    readonly stopSequences?: string[];
    readonly customParameters?: Record<string, any>;
}
export interface AIPromptInfo {
    readonly template: string;
    readonly variables: Record<string, any>;
    readonly version: string;
    readonly type: PromptType;
    readonly tokens: TokenUsage;
    readonly context: PromptContext;
}
export declare enum PromptType {
    SUMMARIZATION = "summarization",
    ENHANCEMENT = "enhancement",
    EXAMPLE_GENERATION = "example-generation",
    VALIDATION = "validation",
    TRANSLATION = "translation",
    FORMATTING = "formatting",
    ANALYSIS = "analysis"
}
export interface TokenUsage {
    readonly promptTokens: number;
    readonly completionTokens: number;
    readonly totalTokens: number;
    readonly estimatedCost: number;
    readonly currency: string;
}
export interface PromptContext {
    readonly projectName?: string;
    readonly projectVersion?: string;
    readonly targetAudience: string;
    readonly documentationStyle: string;
    readonly includeExamples: boolean;
    readonly includeCodeSamples: boolean;
    readonly maxLength?: number;
    readonly language?: string;
    readonly frameworks?: string[];
}
export interface AIContentValidation {
    readonly isValid: boolean;
    readonly confidence: number;
    readonly accuracyScore: number;
    readonly relevanceScore: number;
    readonly completenessScore: number;
    readonly clarityScore: number;
    readonly errors: ValidationIssue[];
    readonly warnings: ValidationIssue[];
    readonly suggestions: ValidationSuggestion[];
    readonly validatedAt: Date;
    readonly validator: string;
}
export interface ValidationIssue {
    readonly type: ValidationIssueType;
    readonly severity: IssueSeverity;
    readonly message: string;
    readonly location?: string;
    readonly suggestion?: string;
    readonly automated: boolean;
}
export declare enum ValidationIssueType {
    ACCURACY = "accuracy",
    RELEVANCE = "relevance",
    COMPLETENESS = "completeness",
    CLARITY = "clarity",
    CONSISTENCY = "consistency",
    FACTUAL_ERROR = "factual-error",
    FORMATTING = "formatting",
    GRAMMAR = "grammar",
    TONE = "tone"
}
export declare enum IssueSeverity {
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
    SUGGESTION = "suggestion"
}
export interface ValidationSuggestion {
    readonly type: SuggestionType;
    readonly message: string;
    readonly priority: SuggestionPriority;
    readonly automated: boolean;
    readonly implementation?: string;
}
export declare enum SuggestionType {
    ENHANCEMENT = "enhancement",
    CLARIFICATION = "clarification",
    EXAMPLE_ADDITION = "example-addition",
    RESTRUCTURING = "restructuring",
    SIMPLIFICATION = "simplification",
    EXPANSION = "expansion"
}
export declare enum SuggestionPriority {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
export interface AISummaryMetadata {
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly version: number;
    readonly hash: string;
    readonly processingTime: number;
    readonly retryCount: number;
    readonly sourceHash?: string;
    readonly tags: string[];
    readonly customFields?: Record<string, any>;
}
export interface HumanReview {
    readonly id: string;
    readonly reviewerId: string;
    readonly status: ReviewStatus;
    readonly feedback: string;
    readonly modifiedContent?: AIGeneratedContent;
    readonly reviewedAt: Date;
    readonly changes: ReviewChange[];
    readonly rating: ReviewRating;
    readonly metadata: ReviewMetadata;
}
export declare enum ReviewStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    MODIFIED = "modified",
    NEEDS_REVISION = "needs-revision",
    ARCHIVED = "archived"
}
export interface ReviewChange {
    readonly type: ChangeType;
    readonly section: string;
    readonly before: string;
    readonly after: string;
    readonly reason: string;
    readonly timestamp: Date;
}
export declare enum ChangeType {
    ADDITION = "addition",
    DELETION = "deletion",
    MODIFICATION = "modification",
    RESTRUCTURING = "restructuring",
    FORMATTING = "formatting"
}
export interface ReviewRating {
    readonly overall: number;
    readonly accuracy: number;
    readonly clarity: number;
    readonly completeness: number;
    readonly usefulness: number;
    readonly comments?: string;
}
export interface ReviewMetadata {
    readonly reviewerName?: string;
    readonly reviewerRole?: string;
    readonly reviewDuration: number;
    readonly reviewMethod: ReviewMethod;
    readonly tools?: string[];
}
export declare enum ReviewMethod {
    MANUAL = "manual",
    ASSISTED = "assisted",
    AUTOMATED = "automated",
    COLLABORATIVE = "collaborative"
}
/**
 * Factory for creating AISummary instances
 */
export declare class AISummaryFactory {
    /**
     * Create a basic AISummary
     */
    static create(config: {
        targetType: AITargetType;
        targetId: string;
        summaryType: AISummaryType;
        content: string;
        model: AIModelInfo;
        prompt: AIPromptInfo;
    }): AISummary;
    /**
     * Create AISummary for endpoint enhancement
     */
    static forEndpoint(endpointId: string, summaryType: AISummaryType, content: AIGeneratedContent, model: AIModelInfo, prompt: AIPromptInfo, validation?: AIContentValidation): AISummary;
    /**
     * Create AISummary for schema documentation
     */
    static forSchema(schemaId: string, summaryType: AISummaryType, content: AIGeneratedContent, model: AIModelInfo, prompt: AIPromptInfo): AISummary;
    /**
     * Create AISummary with human review
     */
    static withReview(baseSummary: AISummary, review: HumanReview): AISummary;
    private static generateId;
    private static generateHash;
    private static createDefaultValidation;
}
/**
 * Utility functions for AI summaries
 */
export declare class AISummaryUtils {
    /**
     * Calculate overall quality score for an AI summary
     */
    static getQualityScore(summary: AISummary): number;
    /**
     * Check if summary needs human review
     */
    static needsHumanReview(summary: AISummary): boolean;
    /**
     * Get token cost for a summary
     */
    static getTokenCost(summary: AISummary): number;
    /**
     * Get processing time for a summary
     */
    static getProcessingTime(summary: AISummary): number;
    /**
     * Check if summary is stale and needs regeneration
     */
    static isStale(summary: AISummary, maxAge?: number): boolean;
    /**
     * Get summary by target
     */
    static findByTarget(summaries: AISummary[], targetType: AITargetType, targetId: string, summaryType?: AISummaryType): AISummary[];
    /**
     * Get summaries that need review
     */
    static getNeedingReview(summaries: AISummary[]): AISummary[];
    /**
     * Get approved summaries
     */
    static getApproved(summaries: AISummary[]): AISummary[];
    /**
     * Calculate total token usage across summaries
     */
    static getTotalTokenUsage(summaries: AISummary[]): TokenUsage;
    /**
     * Get statistics for AI summaries
     */
    static getStatistics(summaries: AISummary[]): AISummaryStatistics;
}
export interface AISummaryStatistics {
    readonly total: number;
    readonly humanReviewed: number;
    readonly needingReview: number;
    readonly approved: number;
    readonly averageQuality: number;
    readonly totalTokens: TokenUsage;
}
//# sourceMappingURL=ai-summary.d.ts.map