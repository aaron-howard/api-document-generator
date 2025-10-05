/**
 * Generation Service Implementation
 *
 * Multi-format documentation generation service that provides template-based
 * rendering, theme management, asset handling, and output optimization.
 * Supports Markdown, HTML, PDF, and JSON output formats.
 */
import { Template, ThemeConfiguration, TemplateCustomization, TemplateValidationResult } from '../core/models/template';
/**
 * Generation Service API request/response interfaces based on generation-service.yaml contract
 */
export interface GenerationRequest {
    format: 'markdown' | 'html' | 'pdf' | 'json';
    template?: string;
    content: DocumentationContent;
    options?: GenerationOptions;
}
export interface DocumentationContent {
    project: ProjectInfo;
    endpoints?: ProcessedEndpoint[];
    schemas?: ProcessedSchema[];
    components?: ProcessedComponent[];
    metadata?: Record<string, any>;
}
export interface ProjectInfo {
    name: string;
    version: string;
    description?: string;
    baseUrl?: string;
    contactInfo?: ContactInfo;
    license?: LicenseInfo;
    tags?: TagInfo[];
}
export interface ContactInfo {
    name?: string;
    email?: string;
    url?: string;
}
export interface LicenseInfo {
    name?: string;
    url?: string;
}
export interface TagInfo {
    name: string;
    description?: string;
}
export interface ProcessedEndpoint {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    summary?: string;
    description?: string;
    enhancedDescription?: string;
    operationId?: string;
    tags?: string[];
    parameters?: ProcessedParameter[];
    requestBody?: ProcessedRequestBody;
    responses?: ProcessedResponse[];
    security?: any[];
    deprecated?: boolean;
    examples?: EndpointExample[];
    codeSamples?: CodeSample[];
    useCases?: string[];
    bestPractices?: string[];
    warnings?: string[];
}
export interface ProcessedParameter {
    name: string;
    in: 'query' | 'header' | 'path' | 'cookie';
    description?: string;
    required?: boolean;
    schema?: ProcessedSchema;
    example?: any;
    examples?: any[];
}
export interface ProcessedRequestBody {
    description?: string;
    required?: boolean;
    content?: Record<string, ProcessedMediaType>;
}
export interface ProcessedResponse {
    status: string;
    description: string;
    content?: Record<string, ProcessedMediaType>;
    headers?: Record<string, any>;
}
export interface ProcessedMediaType {
    schema?: ProcessedSchema;
    example?: any;
    examples?: Record<string, any>;
}
export interface ProcessedSchema {
    type?: string;
    format?: string;
    description?: string;
    properties?: Record<string, ProcessedSchema>;
    items?: ProcessedSchema;
    required?: string[];
    enum?: any[];
    example?: any;
    default?: any;
}
export interface ProcessedComponent {
    name: string;
    type: 'schema' | 'response' | 'parameter' | 'example' | 'requestBody' | 'header' | 'securityScheme';
    content: any;
    description?: string;
}
export interface EndpointExample {
    description: string;
    request: any;
    response: any;
    scenario?: string;
}
export interface CodeSample {
    language: string;
    code: string;
    description?: string;
    framework?: string;
}
export interface GenerationOptions {
    theme?: string;
    includeTableOfContents?: boolean;
    includeExamples?: boolean;
    includeCodeSamples?: boolean;
    outputPath?: string;
    customization?: TemplateCustomization;
    optimization?: {
        minify?: boolean;
        compress?: boolean;
        bundleAssets?: boolean;
    };
    metadata?: Record<string, any>;
}
export interface GenerationResponse {
    generationId: string;
    status: 'success' | 'warning' | 'error';
    outputPath?: string;
    fileSize?: number;
    generatedAt: string;
    metrics: GenerationMetrics;
    warnings?: GenerationWarning[];
    content?: string;
}
export interface GenerationMetrics {
    processedEndpoints: number;
    generatedPages: number;
    generationTime: number;
    templateRenderTime: number;
    assetProcessingTime?: number;
    totalAssets?: number;
    outputSize?: number;
}
export interface GenerationWarning {
    type: 'template' | 'asset' | 'content' | 'optimization';
    message: string;
    details?: string;
    suggestions?: string[];
}
export interface RenderRequest {
    template: string;
    data: Record<string, any>;
    format?: string;
    options?: {
        engine?: string;
        helpers?: Record<string, any>;
        partials?: Record<string, any>;
    };
}
export interface RenderResponse {
    renderId: string;
    output: string;
    renderTime: number;
    templateInfo: {
        name: string;
        engine: string;
        version?: string;
    };
}
export interface PreviewRequest {
    format: 'markdown' | 'html' | 'pdf' | 'json';
    template?: string;
    content: DocumentationContent;
    options?: Omit<GenerationOptions, 'outputPath'>;
}
export interface PreviewResponse {
    previewId: string;
    content: string;
    format: string;
    metrics: GenerationMetrics;
    warnings?: GenerationWarning[];
}
export interface ValidationRequest {
    format: 'markdown' | 'html' | 'pdf' | 'json';
    template?: string;
    content: DocumentationContent;
    options?: GenerationOptions;
}
export interface ValidationResponse {
    validationId: string;
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    suggestions: string[];
    estimatedMetrics?: {
        estimatedSize: number;
        estimatedRenderTime: number;
        requiredAssets: string[];
    };
}
export interface ValidationError {
    type: 'template' | 'content' | 'format' | 'configuration';
    code: string;
    message: string;
    path?: string;
    line?: number;
    column?: number;
}
export interface ValidationWarning {
    type: 'template' | 'content' | 'performance' | 'compatibility';
    message: string;
    path?: string;
    impact: 'low' | 'medium' | 'high';
}
export interface TemplateListResponse {
    templates: TemplateInfo[];
    totalCount: number;
    formats: string[];
}
export interface TemplateInfo {
    name: string;
    displayName: string;
    description: string;
    format: string;
    engine: string;
    version: string;
    author?: string;
    tags: string[];
    features: string[];
    preview?: string;
    assets?: TemplateAssetInfo[];
}
export interface TemplateAssetInfo {
    name: string;
    type: string;
    size: number;
    required: boolean;
}
export interface GenerationError {
    status: 'error';
    code: string;
    message: string;
    details?: Record<string, any>;
    suggestions?: string[];
}
/**
 * Template engine interface for pluggable template engines
 */
export interface ITemplateEngine {
    readonly name: string;
    readonly version: string;
    readonly supportedFormats: string[];
    /**
     * Compile template string
     */
    compile(template: string, options?: any): Promise<CompiledTemplate>;
    /**
     * Render template with data
     */
    render(template: string, data: any, options?: any): Promise<string>;
    /**
     * Register helper function
     */
    registerHelper(name: string, helper: TemplateHelper): void;
    /**
     * Register partial template
     */
    registerPartial(name: string, partial: string): void;
    /**
     * Validate template syntax
     */
    validate(template: string): TemplateValidationResult;
}
export interface CompiledTemplate {
    render(data: any): Promise<string>;
    getAst?(): any;
    getDependencies?(): string[];
}
export type TemplateHelper = (...args: any[]) => any;
/**
 * Format generator interface for different output formats
 */
export interface IFormatGenerator {
    readonly format: string;
    readonly supportedEngines: string[];
    readonly defaultTemplate: string;
    /**
     * Generate documentation in this format
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
     * Get available templates for this format
     */
    getTemplates(): Promise<TemplateInfo[]>;
    /**
     * Optimize output
     */
    optimize(content: string, options?: any): Promise<string>;
}
/**
 * Main Generation Service class implementing the complete generation service contract
 */
export declare class GenerationService {
    private engines;
    private generators;
    private templates;
    private themes;
    private _assetManager;
    constructor(options?: GenerationServiceOptions);
    /**
     * Register a template engine
     */
    registerEngine(engine: ITemplateEngine): void;
    /**
     * Register a format generator
     */
    registerGenerator(generator: IFormatGenerator): void;
    /**
     * Register a template
     */
    registerTemplate(template: Template): void;
    /**
     * Register a theme
     */
    registerTheme(name: string, theme: ThemeConfiguration): void;
    /**
     * Generate documentation
     * Implementation of POST /generate endpoint from generation-service.yaml
     */
    generate(request: GenerationRequest): Promise<GenerationResponse>;
    /**
     * Render template with data
     * Implementation of POST /render endpoint from generation-service.yaml
     */
    render(request: RenderRequest): Promise<RenderResponse>;
    /**
     * List available templates
     * Implementation of GET /templates endpoint from generation-service.yaml
     */
    listTemplates(format?: string): Promise<TemplateListResponse>;
    /**
     * Generate preview of documentation
     * Implementation of POST /preview endpoint from generation-service.yaml
     */
    preview(request: PreviewRequest): Promise<PreviewResponse>;
    /**
     * Validate generation configuration
     * Implementation of POST /validate endpoint from generation-service.yaml
     */
    validate(request: ValidationRequest): Promise<ValidationResponse>;
    private getGenerator;
    private validateRequest;
    private generateSuggestions;
    private generateId;
    private handleError;
    private initializeDefaultTemplates;
    private initializeDefaultThemes;
}
/**
 * Generation Service configuration options
 */
export interface GenerationServiceOptions {
    templatePath?: string;
    themePath?: string;
    assetConfig?: {
        basePath?: string;
        maxSize?: number;
        allowedTypes?: string[];
    };
    engineConfig?: Record<string, any>;
}
/**
 * Generation Service specific error class
 */
export declare class GenerationServiceError extends Error {
    code: string;
    details?: Record<string, any> | undefined;
    suggestions?: string[] | undefined;
    constructor(code: string, message: string, details?: Record<string, any> | undefined, suggestions?: string[] | undefined);
}
export default GenerationService;
//# sourceMappingURL=generation-service.d.ts.map