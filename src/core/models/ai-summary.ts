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

export enum AITargetType {
  ENDPOINT = 'endpoint',
  SCHEMA = 'schema',
  MODULE = 'module',
  PROJECT = 'project',
  PARAMETER = 'parameter',
  RESPONSE = 'response',
  EXAMPLE = 'example',
  TAG = 'tag',
}

export enum AISummaryType {
  OVERVIEW = 'overview',
  USAGE = 'usage',
  EXAMPLES = 'examples',
  DESCRIPTION = 'description',
  BEST_PRACTICES = 'best-practices',
  TROUBLESHOOTING = 'troubleshooting',
  MIGRATION_GUIDE = 'migration-guide',
  TUTORIAL = 'tutorial',
  REFERENCE = 'reference',
  CHANGELOG = 'changelog',
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

export enum ContentFormat {
  MARKDOWN = 'markdown',
  HTML = 'html',
  PLAIN_TEXT = 'plain-text',
  JSON = 'json',
  STRUCTURED = 'structured',
}

export interface ContentSection {
  readonly title: string;
  readonly content: string;
  readonly level: number;
  readonly type: SectionType;
  readonly order: number;
}

export enum SectionType {
  SUMMARY = 'summary',
  DESCRIPTION = 'description',
  PARAMETERS = 'parameters',
  EXAMPLES = 'examples',
  RESPONSES = 'responses',
  ERRORS = 'errors',
  NOTES = 'notes',
  SEE_ALSO = 'see-also',
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

export enum ExampleComplexity {
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
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

export enum LinkType {
  DOCUMENTATION = 'documentation',
  EXAMPLE = 'example',
  REFERENCE = 'reference',
  TUTORIAL = 'tutorial',
  SOURCE_CODE = 'source-code',
  EXTERNAL = 'external',
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

export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
  COHERE = 'cohere',
  HUGGING_FACE = 'hugging-face',
  LOCAL = 'local',
  AZURE = 'azure',
  AWS = 'aws',
}

export enum ModelCapability {
  TEXT_GENERATION = 'text-generation',
  CODE_GENERATION = 'code-generation',
  SUMMARIZATION = 'summarization',
  TRANSLATION = 'translation',
  QUESTION_ANSWERING = 'question-answering',
  CLASSIFICATION = 'classification',
  EMBEDDING = 'embedding',
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

export enum PromptType {
  SUMMARIZATION = 'summarization',
  ENHANCEMENT = 'enhancement',
  EXAMPLE_GENERATION = 'example-generation',
  VALIDATION = 'validation',
  TRANSLATION = 'translation',
  FORMATTING = 'formatting',
  ANALYSIS = 'analysis',
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

export enum ValidationIssueType {
  ACCURACY = 'accuracy',
  RELEVANCE = 'relevance',
  COMPLETENESS = 'completeness',
  CLARITY = 'clarity',
  CONSISTENCY = 'consistency',
  FACTUAL_ERROR = 'factual-error',
  FORMATTING = 'formatting',
  GRAMMAR = 'grammar',
  TONE = 'tone',
}

export enum IssueSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUGGESTION = 'suggestion',
}

export interface ValidationSuggestion {
  readonly type: SuggestionType;
  readonly message: string;
  readonly priority: SuggestionPriority;
  readonly automated: boolean;
  readonly implementation?: string;
}

export enum SuggestionType {
  ENHANCEMENT = 'enhancement',
  CLARIFICATION = 'clarification',
  EXAMPLE_ADDITION = 'example-addition',
  RESTRUCTURING = 'restructuring',
  SIMPLIFICATION = 'simplification',
  EXPANSION = 'expansion',
}

export enum SuggestionPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
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

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  MODIFIED = 'modified',
  NEEDS_REVISION = 'needs-revision',
  ARCHIVED = 'archived',
}

export interface ReviewChange {
  readonly type: ChangeType;
  readonly section: string;
  readonly before: string;
  readonly after: string;
  readonly reason: string;
  readonly timestamp: Date;
}

export enum ChangeType {
  ADDITION = 'addition',
  DELETION = 'deletion',
  MODIFICATION = 'modification',
  RESTRUCTURING = 'restructuring',
  FORMATTING = 'formatting',
}

export interface ReviewRating {
  readonly overall: number; // 1-5 scale
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

export enum ReviewMethod {
  MANUAL = 'manual',
  ASSISTED = 'assisted',
  AUTOMATED = 'automated',
  COLLABORATIVE = 'collaborative',
}

/**
 * Factory for creating AISummary instances
 */
export class AISummaryFactory {
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
  }): AISummary {
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
  static forEndpoint(
    endpointId: string,
    summaryType: AISummaryType,
    content: AIGeneratedContent,
    model: AIModelInfo,
    prompt: AIPromptInfo,
    validation?: AIContentValidation
  ): AISummary {
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
  static forSchema(
    schemaId: string,
    summaryType: AISummaryType,
    content: AIGeneratedContent,
    model: AIModelInfo,
    prompt: AIPromptInfo
  ): AISummary {
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
  static withReview(
    baseSummary: AISummary,
    review: HumanReview
  ): AISummary {
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

  private static generateId(): string {
    return `ai_summary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static generateHash(content: string, targetId: string): string {
    const data = `${content}:${targetId}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  private static createDefaultValidation(): AIContentValidation {
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

/**
 * Utility functions for AI summaries
 */
export class AISummaryUtils {
  /**
   * Calculate overall quality score for an AI summary
   */
  static getQualityScore(summary: AISummary): number {
    const validation = summary.validation;
    const weights = {
      accuracy: 0.3,
      relevance: 0.25,
      completeness: 0.25,
      clarity: 0.2,
    };

    return (
      validation.accuracyScore * weights.accuracy +
      validation.relevanceScore * weights.relevance +
      validation.completenessScore * weights.completeness +
      validation.clarityScore * weights.clarity
    );
  }

  /**
   * Check if summary needs human review
   */
  static needsHumanReview(summary: AISummary): boolean {
    const qualityScore = this.getQualityScore(summary);
    const hasErrors = summary.validation.errors.length > 0;
    const lowAccuracy = summary.accuracy < 0.7;
    
    return hasErrors || lowAccuracy || qualityScore < 0.75;
  }

  /**
   * Get token cost for a summary
   */
  static getTokenCost(summary: AISummary): number {
    return summary.prompt.tokens.estimatedCost;
  }

  /**
   * Get processing time for a summary
   */
  static getProcessingTime(summary: AISummary): number {
    return summary.metadata.processingTime;
  }

  /**
   * Check if summary is stale and needs regeneration
   */
  static isStale(summary: AISummary, maxAge: number = 30 * 24 * 60 * 60 * 1000): boolean {
    const age = Date.now() - summary.generatedAt.getTime();
    return age > maxAge;
  }

  /**
   * Get summary by target
   */
  static findByTarget(
    summaries: AISummary[],
    targetType: AITargetType,
    targetId: string,
    summaryType?: AISummaryType
  ): AISummary[] {
    return summaries.filter(summary => 
      summary.targetType === targetType &&
      summary.targetId === targetId &&
      (!summaryType || summary.summaryType === summaryType)
    );
  }

  /**
   * Get summaries that need review
   */
  static getNeedingReview(summaries: AISummary[]): AISummary[] {
    return summaries.filter(summary => 
      !summary.humanReviewed && this.needsHumanReview(summary)
    );
  }

  /**
   * Get approved summaries
   */
  static getApproved(summaries: AISummary[]): AISummary[] {
    return summaries.filter(summary => 
      summary.humanReviewed && 
      summary.humanReview?.status === ReviewStatus.APPROVED
    );
  }

  /**
   * Calculate total token usage across summaries
   */
  static getTotalTokenUsage(summaries: AISummary[]): TokenUsage {
    const totals = summaries.reduce(
      (acc, summary) => ({
        promptTokens: acc.promptTokens + summary.prompt.tokens.promptTokens,
        completionTokens: acc.completionTokens + summary.prompt.tokens.completionTokens,
        totalTokens: acc.totalTokens + summary.prompt.tokens.totalTokens,
        estimatedCost: acc.estimatedCost + summary.prompt.tokens.estimatedCost,
      }),
      { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCost: 0 }
    );

    return {
      ...totals,
      currency: summaries[0]?.prompt.tokens.currency || 'USD',
    };
  }

  /**
   * Get statistics for AI summaries
   */
  static getStatistics(summaries: AISummary[]): AISummaryStatistics {
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

export interface AISummaryStatistics {
  readonly total: number;
  readonly humanReviewed: number;
  readonly needingReview: number;
  readonly approved: number;
  readonly averageQuality: number;
  readonly totalTokens: TokenUsage;
}