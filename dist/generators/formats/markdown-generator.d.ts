/**
 * Markdown Format Generator
 *
 * Implementation of the IFormatGenerator interface for Markdown output.
 * Generates clean, readable Markdown documentation from API content.
 */
import { IFormatGenerator, GenerationRequest, GenerationResponse, PreviewRequest, PreviewResponse, ValidationRequest, ValidationResponse, TemplateInfo } from '../generation-service';
/**
 * Markdown generation options
 */
export interface MarkdownOptions {
    includeTableOfContents?: boolean;
    includeCodeSamples?: boolean;
    includeExamples?: boolean;
    headingLevel?: number;
    codeBlockLanguage?: string;
    tableFormat?: 'github' | 'standard';
    linkStyle?: 'inline' | 'reference';
}
/**
 * Markdown Format Generator implementation
 */
export declare class MarkdownGenerator implements IFormatGenerator {
    readonly format = "markdown";
    readonly supportedEngines: string[];
    readonly defaultTemplate = "default-markdown";
    private templates;
    constructor();
    /**
     * Generate documentation in Markdown format
     */
    generate(request: GenerationRequest): Promise<GenerationResponse>;
    /**
     * Preview generation without saving
     */
    preview(request: PreviewRequest): Promise<PreviewResponse>;
    /**
     * Validate generation request
     */
    validate(request: ValidationRequest): Promise<ValidationResponse>;
    /**
     * Get available templates for Markdown format
     */
    getTemplates(): Promise<TemplateInfo[]>;
    /**
     * Optimize Markdown output
     */
    optimize(content: string, options?: any): Promise<string>;
    private getTemplate;
    private prepareContext;
    private renderMarkdown;
    private generateTableOfContents;
    private generateEndpointsSection;
    private generateEndpointSection;
    private generateParametersTable;
    private generateRequestBodySection;
    private generateResponsesSection;
    private generateCodeSamplesSection;
    private generateExamplesSection;
    private generateUseCasesSection;
    private generateBestPracticesSection;
    private generateWarningsSection;
    private generateSchemasSection;
    private groupEndpointsByTags;
    private slugify;
    private generateWarnings;
    private estimateSize;
    private estimateRenderTime;
    private getDisplayName;
    private getTemplateDescription;
    private getTemplateFeatures;
    private initializeDefaultTemplates;
}
/**
 * Factory function to create Markdown generator
 */
export declare function createMarkdownGenerator(): MarkdownGenerator;
export default MarkdownGenerator;
//# sourceMappingURL=markdown-generator.d.ts.map