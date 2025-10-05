/**
 * Generation Service Implementation
 * 
 * Multi-format documentation generation service that provides template-based
 * rendering, theme management, asset handling, and output optimization.
 * Supports Markdown, HTML, PDF, and JSON output formats.
 */

import { 
  Template, 
  TemplateType, 
  TemplateEngine, 
  TemplateAsset, 
  ThemeConfiguration, 
  RenderingContext,
  TemplateCustomization,
  TemplateValidationResult,
  TemplateMetrics
} from '../core/models/template';

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
  content?: string; // For preview/inline generation
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
export class GenerationService {
  private engines: Map<string, ITemplateEngine> = new Map();
  private generators: Map<string, IFormatGenerator> = new Map();
  private templates: Map<string, Template> = new Map();
  private themes: Map<string, ThemeConfiguration> = new Map();
  private _assetManager: AssetManager;

  constructor(options?: GenerationServiceOptions) {
    this._assetManager = new AssetManager(options?.assetConfig);
    this.initializeDefaultTemplates();
    this.initializeDefaultThemes();
  }

  /**
   * Register a template engine
   */
  registerEngine(engine: ITemplateEngine): void {
    this.engines.set(engine.name, engine);
  }

  /**
   * Register a format generator
   */
  registerGenerator(generator: IFormatGenerator): void {
    this.generators.set(generator.format, generator);
  }

  /**
   * Register a template
   */
  registerTemplate(template: Template): void {
    this.templates.set(template.name, template);
  }

  /**
   * Register a theme
   */
  registerTheme(name: string, theme: ThemeConfiguration): void {
    this.themes.set(name, theme);
  }

  /**
   * Generate documentation
   * Implementation of POST /generate endpoint from generation-service.yaml
   */
  async generate(request: GenerationRequest): Promise<GenerationResponse> {
    const startTime = Date.now();
    const generationId = this.generateId('gen');

    try {
      // Validate request
      const validation = await this.validateRequest(request);
      if (!validation.valid) {
        throw new GenerationServiceError(
          'INVALID_REQUEST',
          'Request validation failed',
          { errors: validation.errors }
        );
      }

      // Get format generator
      const generator = this.getGenerator(request.format);

      // Generate documentation
      const response = await generator.generate(request);

      // Update response with metadata
      return {
        ...response,
        generationId,
        generatedAt: new Date().toISOString(),
        metrics: {
          ...response.metrics,
          generationTime: (Date.now() - startTime) / 1000
        }
      };

    } catch (error) {
      throw this.handleError(error, 'GENERATION_FAILED');
    }
  }

  /**
   * Render template with data
   * Implementation of POST /render endpoint from generation-service.yaml
   */
  async render(request: RenderRequest): Promise<RenderResponse> {
    const startTime = Date.now();
    const renderId = this.generateId('render');

    try {
      // Get template engine
      const engineName = request.options?.engine || 'handlebars';
      const engine = this.engines.get(engineName);
      if (!engine) {
        throw new GenerationServiceError('ENGINE_NOT_FOUND', `Template engine '${engineName}' not found`);
      }

      // Register helpers and partials if provided
      if (request.options?.helpers) {
        for (const [name, helper] of Object.entries(request.options.helpers)) {
          engine.registerHelper(name, helper);
        }
      }

      if (request.options?.partials) {
        for (const [name, partial] of Object.entries(request.options.partials)) {
          engine.registerPartial(name, partial);
        }
      }

      // Render template
      const output = await engine.render(request.template, request.data);

      return {
        renderId,
        output,
        renderTime: (Date.now() - startTime) / 1000,
        templateInfo: {
          name: 'inline',
          engine: engine.name,
          version: engine.version
        }
      };

    } catch (error) {
      throw this.handleError(error, 'RENDER_FAILED');
    }
  }

  /**
   * List available templates
   * Implementation of GET /templates endpoint from generation-service.yaml
   */
  async listTemplates(format?: string): Promise<TemplateListResponse> {
    try {
      let availableTemplates: TemplateInfo[] = [];

      if (format) {
        // Get templates for specific format
        const generator = this.generators.get(format);
        if (generator) {
          availableTemplates = await generator.getTemplates();
        }
      } else {
        // Get all templates from all generators
        for (const generator of this.generators.values()) {
          const templates = await generator.getTemplates();
          availableTemplates.push(...templates);
        }
      }

      // Get unique formats
      const formats = Array.from(new Set(availableTemplates.map(t => t.format)));

      return {
        templates: availableTemplates,
        totalCount: availableTemplates.length,
        formats
      };

    } catch (error) {
      throw this.handleError(error, 'TEMPLATE_LIST_FAILED');
    }
  }

  /**
   * Generate preview of documentation
   * Implementation of POST /preview endpoint from generation-service.yaml
   */
  async preview(request: PreviewRequest): Promise<PreviewResponse> {
    const previewId = this.generateId('preview');

    try {
      // Get format generator
      const generator = this.getGenerator(request.format);

      // Generate preview
      const response = await generator.preview(request);

      return {
        ...response,
        previewId
      };

    } catch (error) {
      throw this.handleError(error, 'PREVIEW_FAILED');
    }
  }

  /**
   * Validate generation configuration
   * Implementation of POST /validate endpoint from generation-service.yaml
   */
  async validate(request: ValidationRequest): Promise<ValidationResponse> {
    const validationId = this.generateId('val');

    try {
      // Get format generator
      const generator = this.getGenerator(request.format);

      // Validate request
      const response = await generator.validate(request);

      return {
        ...response,
        validationId
      };

    } catch (error) {
      throw this.handleError(error, 'VALIDATION_FAILED');
    }
  }

  // Private helper methods

  private getGenerator(format: string): IFormatGenerator {
    const generator = this.generators.get(format);
    if (!generator) {
      throw new GenerationServiceError('FORMAT_NOT_SUPPORTED', `Format '${format}' is not supported`);
    }
    return generator;
  }

  private async validateRequest(request: GenerationRequest): Promise<ValidationResponse> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate format
    if (!this.generators.has(request.format)) {
      errors.push({
        type: 'format',
        code: 'UNSUPPORTED_FORMAT',
        message: `Format '${request.format}' is not supported`
      });
    }

    // Validate template
    if (request.template && !this.templates.has(request.template)) {
      errors.push({
        type: 'template',
        code: 'TEMPLATE_NOT_FOUND',
        message: `Template '${request.template}' not found`
      });
    }

    // Validate content
    if (!request.content.project.name) {
      errors.push({
        type: 'content',
        code: 'MISSING_PROJECT_NAME',
        message: 'Project name is required'
      });
    }

    if (!request.content.project.version) {
      errors.push({
        type: 'content',
        code: 'MISSING_PROJECT_VERSION',
        message: 'Project version is required'
      });
    }

    // Check for potential issues
    if (request.content.endpoints && request.content.endpoints.length > 100) {
      warnings.push({
        type: 'performance',
        message: 'Large number of endpoints may impact generation performance',
        impact: 'medium'
      });
    }

    return {
      validationId: this.generateId('val'),
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions: this.generateSuggestions(errors, warnings)
    };
  }

  private generateSuggestions(errors: ValidationError[], warnings: ValidationWarning[]): string[] {
    const suggestions: string[] = [];

    if (errors.some(e => e.code === 'UNSUPPORTED_FORMAT')) {
      suggestions.push('Use one of the supported formats: ' + Array.from(this.generators.keys()).join(', '));
    }

    if (errors.some(e => e.code === 'TEMPLATE_NOT_FOUND')) {
      suggestions.push('Use one of the available templates or register a custom template');
    }

    if (warnings.some(w => w.type === 'performance')) {
      suggestions.push('Consider using batch processing or pagination for large APIs');
    }

    return suggestions;
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleError(error: any, code: string): GenerationError {
    if (error instanceof GenerationServiceError) {
      return {
        status: 'error',
        code: error.code,
        message: error.message,
        details: error.details,
        suggestions: error.suggestions
      };
    }

    return {
      status: 'error',
      code,
      message: error.message || 'Unknown generation error',
      details: {
        originalError: error.toString()
      }
    };
  }

  private initializeDefaultTemplates(): void {
    // Initialize with basic templates
    // In a real implementation, these would be loaded from files
  }

  private initializeDefaultThemes(): void {
    // Initialize with default themes
    const defaultTheme: ThemeConfiguration = {
      name: 'default',
      variant: 'light' as any,
      colors: {
        primary: '#007ACC',
        secondary: '#5C6BC0',
        accent: '#FF5722',
        background: '#FFFFFF',
        surface: '#F5F5F5',
        text: '#212121',
        textSecondary: '#757575',
        border: '#E0E0E0',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3'
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        headingFont: 'Inter, sans-serif',
        codeFont: 'JetBrains Mono, monospace',
        baseFontSize: '16px',
        lineHeight: 1.6,
        headingScale: 1.25
      },
      spacing: {
        baseUnit: 8,
        containerPadding: '2rem',
        sectionGap: '3rem',
        elementGap: '1rem'
      },
      layout: {
        maxWidth: '1200px',
        sidebarWidth: '280px',
        headerHeight: '64px',
        footerHeight: '120px'
      },
      customProperties: {}
    };

    this.themes.set('default', defaultTheme);
  }
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
 * Asset Manager for handling template assets
 */
class AssetManager {
  constructor(private _config?: { basePath?: string; maxSize?: number; allowedTypes?: string[] }) {}

  async loadAsset(path: string): Promise<TemplateAsset | null> {
    // Implementation would load assets from filesystem or CDN
    return null;
  }

  async validateAssets(assets: TemplateAsset[]): Promise<TemplateValidationResult> {
    // Implementation would validate asset integrity and dependencies
    return {
      isValid: true,
      errors: [],
      warnings: [],
      missingAssets: [],
      unusedAssets: [],
      brokenDependencies: []
    };
  }
}

/**
 * Generation Service specific error class
 */
export class GenerationServiceError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, any>,
    public suggestions?: string[]
  ) {
    super(message);
    this.name = 'GenerationServiceError';
  }
}

export default GenerationService;