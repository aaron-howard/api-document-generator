"use strict";
/**
 * Markdown Format Generator
 *
 * Implementation of the IFormatGenerator interface for Markdown output.
 * Generates clean, readable Markdown documentation from API content.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownGenerator = void 0;
exports.createMarkdownGenerator = createMarkdownGenerator;
/**
 * Markdown Format Generator implementation
 */
class MarkdownGenerator {
    constructor() {
        this.format = 'markdown';
        this.supportedEngines = ['handlebars', 'mustache', 'liquid'];
        this.defaultTemplate = 'default-markdown';
        this.templates = new Map();
        this.initializeDefaultTemplates();
    }
    /**
     * Generate documentation in Markdown format
     */
    async generate(request) {
        const startTime = Date.now();
        const generationId = `md_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        try {
            // Get template
            const template = this.getTemplate(request.template || this.defaultTemplate);
            // Prepare rendering context
            const context = this.prepareContext(request);
            // Render markdown content
            const content = await this.renderMarkdown(template, context, request.options);
            // Calculate metrics
            const metrics = {
                processedEndpoints: request.content.endpoints?.length || 0,
                generatedPages: 1,
                generationTime: (Date.now() - startTime) / 1000,
                templateRenderTime: 0, // Would be measured during actual rendering
                outputSize: content.length
            };
            // Generate warnings
            const warnings = this.generateWarnings(request, content);
            const response = {
                generationId,
                status: warnings.length > 0 ? 'warning' : 'success',
                generatedAt: new Date().toISOString(),
                metrics,
                content // Include content for preview/inline use
            };
            if (request.options?.outputPath) {
                response.outputPath = request.options.outputPath;
                response.fileSize = content.length;
            }
            if (warnings.length > 0) {
                response.warnings = warnings;
            }
            return response;
        }
        catch (error) {
            throw new Error(`Markdown generation failed: ${error}`);
        }
    }
    /**
     * Preview generation without saving
     */
    async preview(request) {
        const previewId = `md_preview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // Convert preview request to generation request
        const generationRequest = {
            format: 'markdown',
            content: request.content
        };
        if (request.template) {
            generationRequest.template = request.template;
        }
        if (request.options) {
            generationRequest.options = request.options;
        }
        const result = await this.generate(generationRequest);
        const response = {
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
    async validate(request) {
        const validationId = `md_val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const errors = [];
        const warnings = [];
        // Validate template
        if (request.template && !this.templates.has(request.template)) {
            errors.push({
                type: 'template',
                code: 'TEMPLATE_NOT_FOUND',
                message: `Markdown template '${request.template}' not found`
            });
        }
        // Validate content structure
        if (!request.content.project.name) {
            errors.push({
                type: 'content',
                code: 'MISSING_PROJECT_NAME',
                message: 'Project name is required for Markdown generation'
            });
        }
        // Check for performance issues
        const endpointCount = request.content.endpoints?.length || 0;
        if (endpointCount > 50) {
            warnings.push({
                type: 'performance',
                message: `Large number of endpoints (${endpointCount}) may result in very long documentation`,
                impact: 'medium'
            });
        }
        // Validate options
        if (request.options?.outputPath && !request.options.outputPath.endsWith('.md')) {
            warnings.push({
                type: 'content',
                message: 'Output path should have .md extension for Markdown files',
                impact: 'low'
            });
        }
        const suggestions = [];
        if (errors.length > 0) {
            suggestions.push('Fix the validation errors before generating');
        }
        if (warnings.some(w => w.type === 'performance')) {
            suggestions.push('Consider splitting large APIs into multiple documents');
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
     * Get available templates for Markdown format
     */
    async getTemplates() {
        const templates = [];
        for (const [name, content] of this.templates.entries()) {
            templates.push({
                name,
                displayName: this.getDisplayName(name),
                description: this.getTemplateDescription(name),
                format: this.format,
                engine: 'handlebars',
                version: '1.0.0',
                tags: ['markdown', 'documentation'],
                features: this.getTemplateFeatures(name),
                preview: content.substring(0, 200) + '...'
            });
        }
        return templates;
    }
    /**
     * Optimize Markdown output
     */
    async optimize(content, options = {}) {
        let optimized = content;
        // Remove excessive whitespace
        optimized = optimized.replace(/\n{3,}/g, '\n\n');
        // Normalize heading spacing
        optimized = optimized.replace(/^(#{1,6})\s*(.+)$/gm, '$1 $2');
        // Ensure proper list formatting
        optimized = optimized.replace(/^(\s*)[*-]\s+/gm, '$1- ');
        // Clean up table formatting
        optimized = optimized.replace(/\|\s+/g, '| ');
        optimized = optimized.replace(/\s+\|/g, ' |');
        if (options.removeComments) {
            optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');
        }
        return optimized.trim() + '\n';
    }
    // Private helper methods
    getTemplate(name) {
        const template = this.templates.get(name);
        if (!template) {
            throw new Error(`Template '${name}' not found`);
        }
        return template;
    }
    prepareContext(request) {
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
    async renderMarkdown(template, context, options = {}) {
        // Simple template rendering - in real implementation would use proper template engine
        let content = template;
        // Replace basic placeholders
        content = content.replace(/\{\{project\.name\}\}/g, context.project.name || '');
        content = content.replace(/\{\{project\.version\}\}/g, context.project.version || '');
        content = content.replace(/\{\{project\.description\}\}/g, context.project.description || '');
        // Generate table of contents if requested
        if (options?.includeTableOfContents) {
            const toc = this.generateTableOfContents(context.endpoints);
            content = content.replace(/\{\{tableOfContents\}\}/g, toc);
        }
        // Generate endpoints section
        const endpointsSection = this.generateEndpointsSection(context.endpoints, options);
        content = content.replace(/\{\{endpoints\}\}/g, endpointsSection);
        // Generate schemas section
        const schemasSection = this.generateSchemasSection(context.schemas);
        content = content.replace(/\{\{schemas\}\}/g, schemasSection);
        return content;
    }
    generateTableOfContents(endpoints) {
        if (!endpoints || endpoints.length === 0) {
            return '';
        }
        let toc = '## Table of Contents\n\n';
        // Group endpoints by tags
        const groupedEndpoints = this.groupEndpointsByTags(endpoints);
        for (const [tag, tagEndpoints] of groupedEndpoints.entries()) {
            if (tag !== 'default') {
                toc += `- [${tag}](#${this.slugify(tag)})\n`;
            }
            for (const endpoint of tagEndpoints) {
                const title = `${endpoint.method} ${endpoint.path}`;
                const slug = this.slugify(`${endpoint.method}-${endpoint.path}`);
                toc += `  - [${title}](#${slug})\n`;
            }
        }
        return toc + '\n';
    }
    generateEndpointsSection(endpoints, options = {}) {
        if (!endpoints || endpoints.length === 0) {
            return '## Endpoints\n\nNo endpoints available.\n';
        }
        let section = '## Endpoints\n\n';
        // Group endpoints by tags
        const groupedEndpoints = this.groupEndpointsByTags(endpoints);
        for (const [tag, tagEndpoints] of groupedEndpoints.entries()) {
            if (tag !== 'default') {
                section += `### ${tag}\n\n`;
            }
            for (const endpoint of tagEndpoints) {
                section += this.generateEndpointSection(endpoint, options);
            }
        }
        return section;
    }
    generateEndpointSection(endpoint, options = {}) {
        const slug = this.slugify(`${endpoint.method}-${endpoint.path}`);
        let section = `#### ${endpoint.method} ${endpoint.path}\n\n`;
        // Add anchor
        section += `<a id="${slug}"></a>\n\n`;
        // Summary and description
        if (endpoint.summary) {
            section += `**${endpoint.summary}**\n\n`;
        }
        if (endpoint.enhancedDescription || endpoint.description) {
            section += `${endpoint.enhancedDescription || endpoint.description}\n\n`;
        }
        // Parameters
        if (endpoint.parameters && endpoint.parameters.length > 0) {
            section += this.generateParametersTable(endpoint.parameters);
        }
        // Request body
        if (endpoint.requestBody) {
            section += this.generateRequestBodySection(endpoint.requestBody);
        }
        // Responses
        if (endpoint.responses && endpoint.responses.length > 0) {
            section += this.generateResponsesSection(endpoint.responses);
        }
        // Code samples
        if (options.includeCodeSamples && endpoint.codeSamples) {
            section += this.generateCodeSamplesSection(endpoint.codeSamples);
        }
        // Examples
        if (options.includeExamples && endpoint.examples) {
            section += this.generateExamplesSection(endpoint.examples);
        }
        // Use cases and best practices
        if (endpoint.useCases && endpoint.useCases.length > 0) {
            section += this.generateUseCasesSection(endpoint.useCases);
        }
        if (endpoint.bestPractices && endpoint.bestPractices.length > 0) {
            section += this.generateBestPracticesSection(endpoint.bestPractices);
        }
        // Warnings
        if (endpoint.warnings && endpoint.warnings.length > 0) {
            section += this.generateWarningsSection(endpoint.warnings);
        }
        section += '\n---\n\n';
        return section;
    }
    generateParametersTable(parameters) {
        let table = '##### Parameters\n\n';
        table += '| Name | Type | In | Required | Description |\n';
        table += '|------|------|----|---------:|-------------|\n';
        for (const param of parameters) {
            const type = param.schema?.type || 'string';
            const required = param.required ? '✓' : '';
            const description = param.description || '';
            table += `| \`${param.name}\` | \`${type}\` | ${param.in} | ${required} | ${description} |\n`;
        }
        return table + '\n';
    }
    generateRequestBodySection(requestBody) {
        let section = '##### Request Body\n\n';
        if (requestBody.description) {
            section += `${requestBody.description}\n\n`;
        }
        if (requestBody.required) {
            section += '**Required**: Yes\n\n';
        }
        if (requestBody.content) {
            section += '**Content Types**:\n';
            for (const contentType of Object.keys(requestBody.content)) {
                section += `- \`${contentType}\`\n`;
            }
            section += '\n';
        }
        return section;
    }
    generateResponsesSection(responses) {
        let section = '##### Responses\n\n';
        for (const response of responses) {
            section += `**${response.status}**: ${response.description}\n\n`;
            if (response.content) {
                const contentTypes = Object.keys(response.content);
                if (contentTypes.length > 0) {
                    section += 'Content Types:\n';
                    for (const contentType of contentTypes) {
                        section += `- \`${contentType}\`\n`;
                    }
                    section += '\n';
                }
            }
        }
        return section;
    }
    generateCodeSamplesSection(codeSamples) {
        let section = '##### Code Samples\n\n';
        for (const sample of codeSamples) {
            if (sample.description) {
                section += `**${sample.description}**\n\n`;
            }
            section += `\`\`\`${sample.language}\n${sample.code}\n\`\`\`\n\n`;
        }
        return section;
    }
    generateExamplesSection(examples) {
        let section = '##### Examples\n\n';
        for (const example of examples) {
            if (example.description) {
                section += `**${example.description}**\n\n`;
            }
            if (example.request) {
                section += 'Request:\n```json\n' + JSON.stringify(example.request, null, 2) + '\n```\n\n';
            }
            if (example.response) {
                section += 'Response:\n```json\n' + JSON.stringify(example.response, null, 2) + '\n```\n\n';
            }
        }
        return section;
    }
    generateUseCasesSection(useCases) {
        let section = '##### Use Cases\n\n';
        for (const useCase of useCases) {
            section += `- ${useCase}\n`;
        }
        return section + '\n';
    }
    generateBestPracticesSection(bestPractices) {
        let section = '##### Best Practices\n\n';
        for (const practice of bestPractices) {
            section += `- ${practice}\n`;
        }
        return section + '\n';
    }
    generateWarningsSection(warnings) {
        let section = '##### ⚠️ Warnings\n\n';
        for (const warning of warnings) {
            section += `> **Warning**: ${warning}\n\n`;
        }
        return section;
    }
    generateSchemasSection(schemas) {
        if (!schemas || schemas.length === 0) {
            return '';
        }
        let section = '## Schemas\n\n';
        for (const schema of schemas) {
            section += `### ${schema.name || 'Schema'}\n\n`;
            if (schema.description) {
                section += `${schema.description}\n\n`;
            }
            // Add schema properties if available
            if (schema.properties) {
                section += '#### Properties\n\n';
                section += '| Property | Type | Description |\n';
                section += '|----------|------|-------------|\n';
                for (const [propName, propSchema] of Object.entries(schema.properties)) {
                    const prop = propSchema;
                    section += `| \`${propName}\` | \`${prop.type || 'unknown'}\` | ${prop.description || ''} |\n`;
                }
                section += '\n';
            }
        }
        return section;
    }
    groupEndpointsByTags(endpoints) {
        const groups = new Map();
        for (const endpoint of endpoints) {
            const tag = (endpoint.tags && endpoint.tags.length > 0 ? endpoint.tags[0] : 'default') || 'default';
            if (!groups.has(tag)) {
                groups.set(tag, []);
            }
            groups.get(tag).push(endpoint);
        }
        return groups;
    }
    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    generateWarnings(request, content) {
        const warnings = [];
        // Check content size
        if (content.length > 100000) {
            warnings.push({
                type: 'content',
                message: 'Generated document is very large and may be difficult to navigate',
                details: `Document size: ${Math.round(content.length / 1000)}KB`,
                suggestions: ['Consider splitting into multiple documents', 'Use table of contents for navigation']
            });
        }
        // Check endpoint count
        const endpointCount = request.content.endpoints?.length || 0;
        if (endpointCount > 30) {
            warnings.push({
                type: 'content',
                message: 'Large number of endpoints may overwhelm readers',
                details: `Endpoint count: ${endpointCount}`,
                suggestions: ['Group related endpoints', 'Create separate documents by feature']
            });
        }
        return warnings;
    }
    estimateSize(content) {
        // Rough estimation based on content
        const baseSize = 1000; // Base template size
        const endpointSize = 500; // Average size per endpoint
        const schemaSize = 200; // Average size per schema
        const endpointCount = content.endpoints?.length || 0;
        const schemaCount = content.schemas?.length || 0;
        return baseSize + (endpointCount * endpointSize) + (schemaCount * schemaSize);
    }
    estimateRenderTime(content) {
        // Rough estimation in seconds
        const baseTime = 0.1;
        const timePerEndpoint = 0.02;
        const timePerSchema = 0.01;
        const endpointCount = content.endpoints?.length || 0;
        const schemaCount = content.schemas?.length || 0;
        return baseTime + (endpointCount * timePerEndpoint) + (schemaCount * timePerSchema);
    }
    getDisplayName(templateName) {
        const names = {
            'default-markdown': 'Default Markdown',
            'minimal-markdown': 'Minimal Markdown',
            'detailed-markdown': 'Detailed Markdown'
        };
        return names[templateName] || templateName;
    }
    getTemplateDescription(templateName) {
        const descriptions = {
            'default-markdown': 'Standard Markdown template with all sections',
            'minimal-markdown': 'Clean, minimal Markdown with essential information only',
            'detailed-markdown': 'Comprehensive Markdown with examples and code samples'
        };
        return descriptions[templateName] || 'Custom Markdown template';
    }
    getTemplateFeatures(templateName) {
        const features = {
            'default-markdown': ['Table of Contents', 'Parameters Table', 'Response Codes', 'Examples'],
            'minimal-markdown': ['Basic Endpoints', 'Simple Tables'],
            'detailed-markdown': ['Full Documentation', 'Code Samples', 'Use Cases', 'Best Practices', 'Warnings']
        };
        return features[templateName] || ['Basic Template'];
    }
    initializeDefaultTemplates() {
        // Default Markdown template
        this.templates.set('default-markdown', `# {{project.name}}

{{#if project.description}}
{{project.description}}
{{/if}}

**Version**: {{project.version}}

{{#if tableOfContents}}
{{tableOfContents}}
{{/if}}

{{endpoints}}

{{#if schemas}}
{{schemas}}
{{/if}}

---
*Generated on {{generation.timestamp}}*
`);
        // Minimal Markdown template
        this.templates.set('minimal-markdown', `# {{project.name}}

{{project.description}}

{{endpoints}}
`);
        // Detailed Markdown template
        this.templates.set('detailed-markdown', `# {{project.name}} API Documentation

{{#if project.description}}
## Overview

{{project.description}}
{{/if}}

**Version**: {{project.version}}
{{#if project.baseUrl}}
**Base URL**: {{project.baseUrl}}
{{/if}}

{{tableOfContents}}

{{endpoints}}

{{schemas}}

## Additional Information

This documentation was automatically generated from API specifications.

---
*Generated on {{generation.timestamp}} using {{generation.template}}*
`);
    }
}
exports.MarkdownGenerator = MarkdownGenerator;
/**
 * Factory function to create Markdown generator
 */
function createMarkdownGenerator() {
    return new MarkdownGenerator();
}
exports.default = MarkdownGenerator;
//# sourceMappingURL=markdown-generator.js.map