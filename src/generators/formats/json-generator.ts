/**
 * JSON Format Generator
 * 
 * Implementation of the IFormatGenerator interface for JSON output.
 * Generates structured JSON documentation with comprehensive metadata.
 */

import { 
  IFormatGenerator,
  GenerationRequest,
  GenerationResponse,
  PreviewRequest,
  PreviewResponse,
  ValidationRequest,
  ValidationResponse,
  TemplateInfo,
  GenerationMetrics,
  GenerationWarning,
  ValidationError,
  ValidationWarning,
  ProcessedEndpoint
} from '../generation-service';

/**
 * JSON Format Generator implementation
 */
export class JSONGenerator implements IFormatGenerator {
  readonly format = 'json';
  readonly supportedEngines = ['handlebars', 'mustache'];
  readonly defaultTemplate = 'default-json';

  private templates: Map<string, string> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  /**
   * Generate documentation in JSON format
   */
  async generate(request: GenerationRequest): Promise<GenerationResponse> {
    const startTime = Date.now();
    const generationId = `json_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Get template
      const template = this.getTemplate(request.template || this.defaultTemplate);
      
      // Prepare JSON structure
      const jsonData = this.prepareJSONData(request);
      
      // Render JSON content
      const content = await this.renderJSON(template, jsonData, request.options);
      
      // Calculate metrics
      const metrics: GenerationMetrics = {
        processedEndpoints: request.content.endpoints?.length || 0,
        generatedPages: 1,
        generationTime: (Date.now() - startTime) / 1000,
        templateRenderTime: 0,
        outputSize: content.length
      };

      // Generate warnings
      const warnings = this.generateWarnings(request, jsonData);

      const response: GenerationResponse = {
        generationId,
        status: warnings.length > 0 ? 'warning' : 'success',
        generatedAt: new Date().toISOString(),
        metrics,
        content
      };
      
      if (request.options?.outputPath) {
        response.outputPath = request.options.outputPath;
        response.fileSize = content.length;
      }
      
      if (warnings.length > 0) {
        response.warnings = warnings;
      }
      
      return response;

    } catch (error) {
      throw new Error(`JSON generation failed: ${error}`);
    }
  }

  /**
   * Preview generation without saving
   */
  async preview(request: PreviewRequest): Promise<PreviewResponse> {
    const previewId = `json_preview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const generationRequest: GenerationRequest = {
      format: 'json',
      content: request.content
    };
    
    if (request.template) {
      generationRequest.template = request.template;
    }
    
    if (request.options) {
      generationRequest.options = request.options;
    }

    const result = await this.generate(generationRequest);

    const response: PreviewResponse = {
      previewId,
      content: result.content || '',
      format: this.format,
      metrics: result.metrics
    };
    
    if (result.warnings) {
      response.warnings = result.warnings;
    }
    
    return response;
  }

  /**
   * Validate generation request
   */
  async validate(request: ValidationRequest): Promise<ValidationResponse> {
    const validationId = `json_val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate template
    if (request.template && !this.templates.has(request.template)) {
      errors.push({
        type: 'template',
        code: 'TEMPLATE_NOT_FOUND',
        message: `JSON template '${request.template}' not found`
      });
    }

    // Validate content structure
    if (!request.content.project.name) {
      errors.push({
        type: 'content',
        code: 'MISSING_PROJECT_NAME',
        message: 'Project name is required for JSON generation'
      });
    }

    // Check for circular references in schemas
    if (request.content.schemas && this.hasCircularReferences(request.content.schemas)) {
      warnings.push({
        type: 'content',
        message: 'Circular references detected in schemas - may cause JSON serialization issues',
        impact: 'medium'
      });
    }

    // Validate output path
    if (request.options?.outputPath && !request.options.outputPath.endsWith('.json')) {
      warnings.push({
        type: 'content',
        message: 'Output path should have .json extension for JSON files',
        impact: 'low'
      });
    }

    const suggestions: string[] = [];
    if (errors.length > 0) {
      suggestions.push('Fix the validation errors before generating');
    }
    if (warnings.some(w => w.type === 'content' && w.message.includes('circular'))) {
      suggestions.push('Review schema definitions for circular references');
    }

    return {
      validationId,
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      estimatedMetrics: {
        estimatedSize: this.estimateSize(request.content),
        estimatedRenderTime: this.estimateRenderTime(request.content),
        requiredAssets: []
      }
    };
  }

  /**
   * Get available templates for JSON format
   */
  async getTemplates(): Promise<TemplateInfo[]> {
    const templates: TemplateInfo[] = [];

    for (const [name, content] of this.templates.entries()) {
      templates.push({
        name,
        displayName: this.getDisplayName(name),
        description: this.getTemplateDescription(name),
        format: this.format,
        engine: 'handlebars',
        version: '1.0.0',
        tags: ['json', 'api', 'structured'],
        features: this.getTemplateFeatures(name),
        preview: content.substring(0, 200) + '...',
        assets: []
      });
    }

    return templates;
  }

  /**
   * Optimize JSON output
   */
  async optimize(content: string, options: any = {}): Promise<string> {
    try {
      const parsed = JSON.parse(content);
      
      if (options.pretty) {
        return JSON.stringify(parsed, null, 2);
      }
      
      if (options.compact) {
        return JSON.stringify(parsed);
      }
      
      // Default: readable format
      return JSON.stringify(parsed, null, 2);
      
    } catch (error) {
      // If invalid JSON, return as-is
      return content;
    }
  }

  // Private helper methods

  private getTemplate(name: string): string {
    const template = this.templates.get(name);
    if (!template) {
      throw new Error(`Template '${name}' not found`);
    }
    return template;
  }

  private prepareJSONData(request: GenerationRequest): any {
    return {
      openapi: '3.0.0',
      info: {
        title: request.content.project.name,
        version: request.content.project.version,
        description: request.content.project.description,
        contact: request.content.project.contactInfo,
        license: request.content.project.license
      },
      servers: request.content.project.baseUrl ? [{
        url: request.content.project.baseUrl,
        description: 'Main server'
      }] : [],
      paths: this.convertEndpointsToPaths(request.content.endpoints || []),
      components: {
        schemas: this.convertSchemas(request.content.schemas || [])
      },
      tags: request.content.project.tags || [],
      metadata: {
        generatedAt: new Date().toISOString(),
        generator: 'API Documentation Generator',
        format: this.format,
        template: request.template || this.defaultTemplate,
        options: request.options || {}
      }
    };
  }

  private async renderJSON(template: string, data: any, options: any = {}): Promise<string> {
    // Simple template replacement for JSON
    let content = template;
    content = content.replace(/\{\{data\}\}/g, JSON.stringify(data, null, 2));
    
    // Apply formatting options
    if (options.compact) {
      const parsed = JSON.parse(content);
      return JSON.stringify(parsed);
    }
    
    return content;
  }

  private convertEndpointsToPaths(endpoints: ProcessedEndpoint[]): any {
    const paths: any = {};
    
    for (const endpoint of endpoints) {
      const path = endpoint.path.replace(/\{([^}]+)\}/g, '{$1}'); // Ensure OpenAPI format
      
      if (!paths[path]) {
        paths[path] = {};
      }
      
      paths[path][endpoint.method.toLowerCase()] = {
        summary: endpoint.summary,
        description: endpoint.enhancedDescription || endpoint.description,
        operationId: endpoint.operationId,
        tags: endpoint.tags,
        parameters: endpoint.parameters?.map(param => ({
          name: param.name,
          in: param.in,
          required: param.required,
          description: param.description,
          schema: param.schema
        })),
        responses: this.convertResponses(endpoint.responses || []),
        'x-code-samples': endpoint.codeSamples?.map(sample => ({
          lang: sample.language,
          source: sample.code,
          label: sample.description
        }))
      };
    }
    
    return paths;
  }

  private convertResponses(responses: any[]): any {
    const convertedResponses: any = {};
    
    for (const response of responses) {
      convertedResponses[response.status] = {
        description: response.description,
        content: response.content ? {
          'application/json': {
            schema: response.content.schema,
            examples: response.content.examples
          }
        } : undefined
      };
    }
    
    return convertedResponses;
  }

  private convertSchemas(schemas: any[]): any {
    const convertedSchemas: any = {};
    
    for (const schema of schemas) {
      if (schema.name) {
        convertedSchemas[schema.name] = {
          type: schema.type || 'object',
          description: schema.description,
          properties: schema.properties,
          required: schema.required,
          example: schema.example
        };
      }
    }
    
    return convertedSchemas;
  }

  private hasCircularReferences(schemas: any[]): boolean {
    // Simple circular reference detection
    const visiting = new Set<string>();
    const visited = new Set<string>();
    
    const hasCircular = (schemaName: string): boolean => {
      if (visiting.has(schemaName)) {
        return true; // Circular reference found
      }
      
      if (visited.has(schemaName)) {
        return false;
      }
      
      visiting.add(schemaName);
      
      const schema = schemas.find(s => s.name === schemaName);
      if (schema && schema.properties) {
        for (const prop of Object.values(schema.properties)) {
          const propSchema = prop as any;
          if (propSchema.$ref) {
            const refName = propSchema.$ref.split('/').pop();
            if (refName && hasCircular(refName)) {
              return true;
            }
          }
        }
      }
      
      visiting.delete(schemaName);
      visited.add(schemaName);
      return false;
    };
    
    for (const schema of schemas) {
      if (schema.name && hasCircular(schema.name)) {
        return true;
      }
    }
    
    return false;
  }

  private generateWarnings(_request: GenerationRequest, data: any): GenerationWarning[] {
    const warnings: GenerationWarning[] = [];

    // Check JSON size
    const jsonSize = JSON.stringify(data).length;
    if (jsonSize > 1000000) { // 1MB
      warnings.push({
        type: 'content',
        message: 'Generated JSON is very large and may impact performance',
        details: `JSON size: ${Math.round(jsonSize / 1000)}KB`,
        suggestions: ['Consider pagination', 'Use schema references instead of inline definitions']
      });
    }

    // Check for missing required OpenAPI fields
    if (!data.info?.version) {
      warnings.push({
        type: 'content',
        message: 'API version is recommended for OpenAPI compliance',
        suggestions: ['Add version information to project metadata']
      });
    }

    return warnings;
  }

  private estimateSize(content: any): number {
    const baseSize = 1000; // Base JSON structure size
    const endpointSize = 500; // Average size per endpoint in JSON
    const schemaSize = 300; // Average size per schema
    
    const endpointCount = content.endpoints?.length || 0;
    const schemaCount = content.schemas?.length || 0;
    
    return baseSize + (endpointCount * endpointSize) + (schemaCount * schemaSize);
  }

  private estimateRenderTime(content: any): number {
    const baseTime = 0.1;
    const timePerEndpoint = 0.02;
    const timePerSchema = 0.01;
    
    const endpointCount = content.endpoints?.length || 0;
    const schemaCount = content.schemas?.length || 0;
    
    return baseTime + (endpointCount * timePerEndpoint) + (schemaCount * timePerSchema);
  }

  private getDisplayName(templateName: string): string {
    const names: Record<string, string> = {
      'default-json': 'Default JSON',
      'openapi-json': 'OpenAPI JSON',
      'minimal-json': 'Minimal JSON'
    };
    return names[templateName] || templateName;
  }

  private getTemplateDescription(templateName: string): string {
    const descriptions: Record<string, string> = {
      'default-json': 'Standard JSON format with full metadata',
      'openapi-json': 'OpenAPI 3.0 compliant JSON specification',
      'minimal-json': 'Minimal JSON format for basic documentation'
    };
    return descriptions[templateName] || 'Custom JSON template';
  }

  private getTemplateFeatures(templateName: string): string[] {
    const features: Record<string, string[]> = {
      'default-json': ['Full Metadata', 'Code Samples', 'Enhanced Descriptions', 'Validation'],
      'openapi-json': ['OpenAPI 3.0 Compliance', 'Schema Validation', 'Tool Integration'],
      'minimal-json': ['Compact Format', 'Fast Processing', 'Essential Data Only']
    };
    return features[templateName] || ['Basic Template'];
  }

  private initializeDefaultTemplates(): void {
    // Default JSON template
    this.templates.set('default-json', '{{data}}');

    // OpenAPI JSON template
    this.templates.set('openapi-json', '{{data}}');

    // Minimal JSON template
    this.templates.set('minimal-json', JSON.stringify({
      "name": "{{project.name}}",
      "version": "{{project.version}}",
      "endpoints": "{{endpoints}}",
      "generated": "{{timestamp}}"
    }, null, 2));
  }
}

/**
 * Factory function to create JSON generator
 */
export function createJSONGenerator(): JSONGenerator {
  return new JSONGenerator();
}

export default JSONGenerator;