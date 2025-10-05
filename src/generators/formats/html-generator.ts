/**
 * HTML Format Generator
 * 
 * Implementation of the IFormatGenerator interface for HTML output.
 * Generates styled HTML documentation with navigation and responsive design.
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
 * HTML Format Generator implementation
 */
export class HTMLGenerator implements IFormatGenerator {
  readonly format = 'html';
  readonly supportedEngines = ['handlebars', 'mustache'];
  readonly defaultTemplate = 'default-html';

  private templates: Map<string, string> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  /**
   * Generate documentation in HTML format
   */
  async generate(request: GenerationRequest): Promise<GenerationResponse> {
    const startTime = Date.now();
    const generationId = `html_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Get template
      const template = this.getTemplate(request.template || this.defaultTemplate);
      
      // Prepare rendering context
      const context = this.prepareContext(request);
      
      // Render HTML content
      const content = await this.renderHTML(template, context, request.options);
      
      // Calculate metrics
      const metrics: GenerationMetrics = {
        processedEndpoints: request.content.endpoints?.length || 0,
        generatedPages: 1,
        generationTime: (Date.now() - startTime) / 1000,
        templateRenderTime: 0,
        outputSize: content.length
      };

      // Generate warnings
      const warnings = this.generateWarnings(request, content);

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
      throw new Error(`HTML generation failed: ${error}`);
    }
  }

  /**
   * Preview generation without saving
   */
  async preview(request: PreviewRequest): Promise<PreviewResponse> {
    const previewId = `html_preview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const generationRequest: GenerationRequest = {
      format: 'html',
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
    const validationId = `html_val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate template
    if (request.template && !this.templates.has(request.template)) {
      errors.push({
        type: 'template',
        code: 'TEMPLATE_NOT_FOUND',
        message: `HTML template '${request.template}' not found`
      });
    }

    // Validate content structure
    if (!request.content.project.name) {
      errors.push({
        type: 'content',
        code: 'MISSING_PROJECT_NAME',
        message: 'Project name is required for HTML generation'
      });
    }

    // Check for large documents
    const endpointCount = request.content.endpoints?.length || 0;
    if (endpointCount > 100) {
      warnings.push({
        type: 'performance',
        message: `Large number of endpoints (${endpointCount}) may impact page performance`,
        impact: 'high'
      });
    }

    // Validate output path
    if (request.options?.outputPath && !request.options.outputPath.endsWith('.html')) {
      warnings.push({
        type: 'content',
        message: 'Output path should have .html extension for HTML files',
        impact: 'low'
      });
    }

    const suggestions: string[] = [];
    if (errors.length > 0) {
      suggestions.push('Fix the validation errors before generating');
    }
    if (warnings.some(w => w.type === 'performance')) {
      suggestions.push('Consider pagination or collapsible sections for large APIs');
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
        requiredAssets: ['styles.css', 'script.js']
      }
    };
  }

  /**
   * Get available templates for HTML format
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
        tags: ['html', 'documentation', 'responsive'],
        features: this.getTemplateFeatures(name),
        preview: content.substring(0, 200) + '...',
        assets: [
          { name: 'styles.css', type: 'stylesheet', size: 15000, required: true },
          { name: 'script.js', type: 'javascript', size: 8000, required: false }
        ]
      });
    }

    return templates;
  }

  /**
   * Optimize HTML output
   */
  async optimize(content: string, options: any = {}): Promise<string> {
    let optimized = content;

    if (options.minify) {
      // Remove extra whitespace
      optimized = optimized.replace(/\s+/g, ' ');
      optimized = optimized.replace(/>\s+</g, '><');
    }

    if (options.removeComments) {
      optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');
    }

    return optimized.trim();
  }

  // Private helper methods

  private getTemplate(name: string): string {
    const template = this.templates.get(name);
    if (!template) {
      throw new Error(`Template '${name}' not found`);
    }
    return template;
  }

  private prepareContext(request: GenerationRequest): any {
    return {
      project: request.content.project,
      endpoints: request.content.endpoints || [],
      schemas: request.content.schemas || [],
      components: request.content.components || [],
      metadata: request.content.metadata || {},
      options: request.options || {},
      generation: {
        timestamp: new Date(),
        format: this.format,
        template: request.template || this.defaultTemplate
      }
    };
  }

  private async renderHTML(template: string, context: any, options: any = {}): Promise<string> {
    let content = template;

    // Replace basic placeholders
    content = content.replace(/\{\{project\.name\}\}/g, this.escapeHtml(context.project.name || ''));
    content = content.replace(/\{\{project\.version\}\}/g, this.escapeHtml(context.project.version || ''));
    content = content.replace(/\{\{project\.description\}\}/g, this.escapeHtml(context.project.description || ''));

    // Generate navigation if requested
    if (options?.includeTableOfContents) {
      const nav = this.generateNavigation(context.endpoints);
      content = content.replace(/\{\{navigation\}\}/g, nav);
    }

    // Generate endpoints section
    const endpointsSection = this.generateEndpointsHTML(context.endpoints, options);
    content = content.replace(/\{\{endpoints\}\}/g, endpointsSection);

    // Generate schemas section
    const schemasSection = this.generateSchemasHTML(context.schemas);
    content = content.replace(/\{\{schemas\}\}/g, schemasSection);

    // Add theme class
    const theme = options?.theme || 'default';
    content = content.replace(/\{\{theme\}\}/g, theme);

    return content;
  }

  private generateNavigation(endpoints: ProcessedEndpoint[]): string {
    if (!endpoints || endpoints.length === 0) {
      return '';
    }

    let nav = '<nav class="api-nav"><ul>';
    
    // Group endpoints by tags
    const groupedEndpoints = this.groupEndpointsByTags(endpoints);
    
    for (const [tag, tagEndpoints] of groupedEndpoints.entries()) {
      if (tag !== 'default') {
        nav += `<li class="nav-group"><span class="nav-group-title">${this.escapeHtml(tag)}</span><ul>`;
      }
      
      for (const endpoint of tagEndpoints) {
        const id = this.generateId(`${endpoint.method}-${endpoint.path}`);
        const title = `${endpoint.method} ${endpoint.path}`;
        nav += `<li><a href="#${id}" class="nav-link method-${endpoint.method.toLowerCase()}">${this.escapeHtml(title)}</a></li>`;
      }
      
      if (tag !== 'default') {
        nav += '</ul></li>';
      }
    }
    
    nav += '</ul></nav>';
    return nav;
  }

  private generateEndpointsHTML(endpoints: ProcessedEndpoint[], options: any = {}): string {
    if (!endpoints || endpoints.length === 0) {
      return '<section class="endpoints"><h2>Endpoints</h2><p>No endpoints available.</p></section>';
    }

    let html = '<section class="endpoints"><h2>Endpoints</h2>';
    
    // Group endpoints by tags
    const groupedEndpoints = this.groupEndpointsByTags(endpoints);
    
    for (const [tag, tagEndpoints] of groupedEndpoints.entries()) {
      if (tag !== 'default') {
        html += `<div class="endpoint-group"><h3>${this.escapeHtml(tag)}</h3>`;
      }
      
      for (const endpoint of tagEndpoints) {
        html += this.generateEndpointHTML(endpoint, options);
      }
      
      if (tag !== 'default') {
        html += '</div>';
      }
    }

    html += '</section>';
    return html;
  }

  private generateEndpointHTML(endpoint: ProcessedEndpoint, options: any = {}): string {
    const id = this.generateId(`${endpoint.method}-${endpoint.path}`);
    const methodClass = `method-${endpoint.method.toLowerCase()}`;
    
    let html = `<div class="endpoint ${methodClass}" id="${id}">`;
    html += `<div class="endpoint-header">`;
    html += `<span class="method">${endpoint.method}</span>`;
    html += `<span class="path">${this.escapeHtml(endpoint.path)}</span>`;
    html += `</div>`;

    if (endpoint.summary) {
      html += `<h4 class="endpoint-summary">${this.escapeHtml(endpoint.summary)}</h4>`;
    }

    if (endpoint.enhancedDescription || endpoint.description) {
      html += `<div class="endpoint-description">${this.escapeHtml(endpoint.enhancedDescription || endpoint.description || '')}</div>`;
    }

    // Parameters
    if (endpoint.parameters && endpoint.parameters.length > 0) {
      html += '<div class="parameters"><h5>Parameters</h5>';
      html += '<table class="params-table">';
      html += '<thead><tr><th>Name</th><th>Type</th><th>In</th><th>Required</th><th>Description</th></tr></thead>';
      html += '<tbody>';
      
      for (const param of endpoint.parameters) {
        const required = param.required ? '<span class="required">Required</span>' : '';
        html += `<tr>`;
        html += `<td><code>${this.escapeHtml(param.name)}</code></td>`;
        html += `<td><code>${this.escapeHtml(param.schema?.type || 'string')}</code></td>`;
        html += `<td>${this.escapeHtml(param.in)}</td>`;
        html += `<td>${required}</td>`;
        html += `<td>${this.escapeHtml(param.description || '')}</td>`;
        html += `</tr>`;
      }
      
      html += '</tbody></table></div>';
    }

    // Responses
    if (endpoint.responses && endpoint.responses.length > 0) {
      html += '<div class="responses"><h5>Responses</h5>';
      
      for (const response of endpoint.responses) {
        const statusClass = this.getStatusClass(response.status);
        html += `<div class="response ${statusClass}">`;
        html += `<span class="status-code">${this.escapeHtml(response.status)}</span>`;
        html += `<span class="status-description">${this.escapeHtml(response.description)}</span>`;
        html += `</div>`;
      }
      
      html += '</div>';
    }

    // Code samples
    if (options.includeCodeSamples && endpoint.codeSamples) {
      html += '<div class="code-samples"><h5>Code Samples</h5>';
      
      for (const sample of endpoint.codeSamples) {
        html += `<div class="code-sample">`;
        if (sample.description) {
          html += `<h6>${this.escapeHtml(sample.description)}</h6>`;
        }
        html += `<pre><code class="language-${sample.language}">${this.escapeHtml(sample.code)}</code></pre>`;
        html += `</div>`;
      }
      
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  private generateSchemasHTML(schemas: any[]): string {
    if (!schemas || schemas.length === 0) {
      return '';
    }

    let html = '<section class="schemas"><h2>Schemas</h2>';
    
    for (const schema of schemas) {
      html += `<div class="schema">`;
      html += `<h3>${this.escapeHtml(schema.name || 'Schema')}</h3>`;
      
      if (schema.description) {
        html += `<p>${this.escapeHtml(schema.description)}</p>`;
      }
      
      if (schema.properties) {
        html += '<div class="schema-properties"><h4>Properties</h4>';
        html += '<table class="properties-table">';
        html += '<thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead>';
        html += '<tbody>';
        
        for (const [propName, propSchema] of Object.entries(schema.properties)) {
          const prop = propSchema as any;
          html += `<tr>`;
          html += `<td><code>${this.escapeHtml(propName)}</code></td>`;
          html += `<td><code>${this.escapeHtml(prop.type || 'unknown')}</code></td>`;
          html += `<td>${this.escapeHtml(prop.description || '')}</td>`;
          html += `</tr>`;
        }
        
        html += '</tbody></table></div>';
      }
      
      html += '</div>';
    }

    html += '</section>';
    return html;
  }

  private groupEndpointsByTags(endpoints: ProcessedEndpoint[]): Map<string, ProcessedEndpoint[]> {
    const groups = new Map<string, ProcessedEndpoint[]>();
    
    for (const endpoint of endpoints) {
      const tag = (endpoint.tags && endpoint.tags.length > 0 ? endpoint.tags[0] : 'default') || 'default';
      
      if (!groups.has(tag)) {
        groups.set(tag, []);
      }
      
      groups.get(tag)!.push(endpoint);
    }

    return groups;
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m] || m);
  }

  private generateId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private getStatusClass(status: string): string {
    const code = parseInt(status);
    if (code >= 200 && code < 300) return 'success';
    if (code >= 300 && code < 400) return 'redirect';
    if (code >= 400 && code < 500) return 'client-error';
    if (code >= 500) return 'server-error';
    return 'default';
  }

  private generateWarnings(_request: GenerationRequest, content: string): GenerationWarning[] {
    const warnings: GenerationWarning[] = [];

    // Check content size
    if (content.length > 500000) {
      warnings.push({
        type: 'content',
        message: 'Generated HTML is very large and may impact browser performance',
        details: `Document size: ${Math.round(content.length / 1000)}KB`,
        suggestions: ['Consider pagination', 'Use collapsible sections']
      });
    }

    return warnings;
  }

  private estimateSize(content: any): number {
    const baseSize = 5000; // Base HTML template size
    const endpointSize = 1000; // Average size per endpoint in HTML
    const schemaSize = 500; // Average size per schema
    
    const endpointCount = content.endpoints?.length || 0;
    const schemaCount = content.schemas?.length || 0;
    
    return baseSize + (endpointCount * endpointSize) + (schemaCount * schemaSize);
  }

  private estimateRenderTime(content: any): number {
    const baseTime = 0.2;
    const timePerEndpoint = 0.05;
    const timePerSchema = 0.02;
    
    const endpointCount = content.endpoints?.length || 0;
    const schemaCount = content.schemas?.length || 0;
    
    return baseTime + (endpointCount * timePerEndpoint) + (schemaCount * timePerSchema);
  }

  private getDisplayName(templateName: string): string {
    const names: Record<string, string> = {
      'default-html': 'Default HTML',
      'modern-html': 'Modern HTML',
      'minimal-html': 'Minimal HTML'
    };
    return names[templateName] || templateName;
  }

  private getTemplateDescription(templateName: string): string {
    const descriptions: Record<string, string> = {
      'default-html': 'Standard responsive HTML template with navigation',
      'modern-html': 'Modern HTML template with dark theme support',
      'minimal-html': 'Clean, minimal HTML template'
    };
    return descriptions[templateName] || 'Custom HTML template';
  }

  private getTemplateFeatures(templateName: string): string[] {
    const features: Record<string, string[]> = {
      'default-html': ['Responsive Design', 'Navigation Menu', 'Syntax Highlighting', 'Search'],
      'modern-html': ['Dark Theme', 'Interactive Examples', 'Collapsible Sections'],
      'minimal-html': ['Clean Layout', 'Fast Loading', 'Print Friendly']
    };
    return features[templateName] || ['Basic Template'];
  }

  private initializeDefaultTemplates(): void {
    // Default HTML template
    this.templates.set('default-html', `<!DOCTYPE html>
<html lang="en" class="theme-{{theme}}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{project.name}} API Documentation</title>
    <style>
        /* Default styles would be included here */
        body { font-family: Inter, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
        .method { padding: 4px 8px; border-radius: 4px; color: white; font-weight: bold; }
        .method-get { background: #61affe; }
        .method-post { background: #49cc90; }
        .method-put { background: #fca130; }
        .method-delete { background: #f93e3e; }
        .endpoint { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .params-table, .properties-table { width: 100%; border-collapse: collapse; }
        .params-table th, .params-table td, .properties-table th, .properties-table td { 
            padding: 8px; border: 1px solid #ddd; text-align: left; 
        }
        .required { color: #f93e3e; font-size: 0.8em; }
        code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>{{project.name}}</h1>
            {{#if project.description}}
            <p>{{project.description}}</p>
            {{/if}}
            <div>Version: {{project.version}}</div>
        </header>
        
        {{#if navigation}}
        {{navigation}}
        {{/if}}
        
        <main>
            {{endpoints}}
            {{schemas}}
        </main>
        
        <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; color: #666;">
            Generated on {{generation.timestamp}}
        </footer>
    </div>
</body>
</html>`);

    // Minimal HTML template
    this.templates.set('minimal-html', `<!DOCTYPE html>
<html>
<head>
    <title>{{project.name}} API</title>
    <style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px}</style>
</head>
<body>
    <h1>{{project.name}}</h1>
    {{endpoints}}
</body>
</html>`);
  }
}

/**
 * Factory function to create HTML generator
 */
export function createHTMLGenerator(): HTMLGenerator {
  return new HTMLGenerator();
}

export default HTMLGenerator;