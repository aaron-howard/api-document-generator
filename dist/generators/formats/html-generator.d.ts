/**
 * HTML Format Generator
 *
 * Implementation of the IFormatGenerator interface for HTML output.
 * Generates styled HTML documentation with navigation and responsive design.
 */
import { IFormatGenerator, GenerationRequest, GenerationResponse, PreviewRequest, PreviewResponse, ValidationRequest, ValidationResponse, TemplateInfo } from '../generation-service';
/**
 * HTML Format Generator implementation
 */
export declare class HTMLGenerator implements IFormatGenerator {
    readonly format = "html";
    readonly supportedEngines: string[];
    readonly defaultTemplate = "default-html";
    private templates;
    constructor();
    /**
     * Generate documentation in HTML format
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
     * Get available templates for HTML format
     */
    getTemplates(): Promise<TemplateInfo[]>;
    /**
     * Optimize HTML output
     */
    optimize(content: string, options?: any): Promise<string>;
    private getTemplate;
    private prepareContext;
    private renderHTML;
    private generateNavigation;
    private generateEndpointsHTML;
    private generateEndpointHTML;
    private generateSchemasHTML;
    private groupEndpointsByTags;
    private escapeHtml;
    private generateId;
    private getStatusClass;
    private generateWarnings;
    private estimateSize;
    private estimateRenderTime;
    private getDisplayName;
    private getTemplateDescription;
    private getTemplateFeatures;
    private initializeDefaultTemplates;
}
/**
 * Factory function to create HTML generator
 */
export declare function createHTMLGenerator(): HTMLGenerator;
export default HTMLGenerator;
//# sourceMappingURL=html-generator.d.ts.map