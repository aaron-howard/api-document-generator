/**
 * JSON Format Generator
 *
 * Implementation of the IFormatGenerator interface for JSON output.
 * Generates structured JSON documentation with comprehensive metadata.
 */
import { IFormatGenerator, GenerationRequest, GenerationResponse, PreviewRequest, PreviewResponse, ValidationRequest, ValidationResponse, TemplateInfo } from '../generation-service';
/**
 * JSON Format Generator implementation
 */
export declare class JSONGenerator implements IFormatGenerator {
    readonly format = "json";
    readonly supportedEngines: string[];
    readonly defaultTemplate = "default-json";
    private templates;
    constructor();
    /**
     * Generate documentation in JSON format
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
     * Get available templates for JSON format
     */
    getTemplates(): Promise<TemplateInfo[]>;
    /**
     * Optimize JSON output
     */
    optimize(content: string, options?: any): Promise<string>;
    private getTemplate;
    private prepareJSONData;
    private renderJSON;
    private convertEndpointsToPaths;
    private convertResponses;
    private convertSchemas;
    private hasCircularReferences;
    private generateWarnings;
    private estimateSize;
    private estimateRenderTime;
    private getDisplayName;
    private getTemplateDescription;
    private getTemplateFeatures;
    private initializeDefaultTemplates;
}
/**
 * Factory function to create JSON generator
 */
export declare function createJSONGenerator(): JSONGenerator;
export default JSONGenerator;
//# sourceMappingURL=json-generator.d.ts.map