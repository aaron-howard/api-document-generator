"use strict";
/**
 * Generation Service Implementation
 *
 * Multi-format documentation generation service that provides template-based
 * rendering, theme management, asset handling, and output optimization.
 * Supports Markdown, HTML, PDF, and JSON output formats.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerationServiceError = exports.GenerationService = void 0;
/**
 * Main Generation Service class implementing the complete generation service contract
 */
class GenerationService {
    constructor(options) {
        this.engines = new Map();
        this.generators = new Map();
        this.templates = new Map();
        this.themes = new Map();
        this._assetManager = new AssetManager(options?.assetConfig);
        this.initializeDefaultTemplates();
        this.initializeDefaultThemes();
    }
    /**
     * Register a template engine
     */
    registerEngine(engine) {
        this.engines.set(engine.name, engine);
    }
    /**
     * Register a format generator
     */
    registerGenerator(generator) {
        this.generators.set(generator.format, generator);
    }
    /**
     * Register a template
     */
    registerTemplate(template) {
        this.templates.set(template.name, template);
    }
    /**
     * Register a theme
     */
    registerTheme(name, theme) {
        this.themes.set(name, theme);
    }
    /**
     * Generate documentation
     * Implementation of POST /generate endpoint from generation-service.yaml
     */
    async generate(request) {
        const startTime = Date.now();
        const generationId = this.generateId('gen');
        try {
            // Validate request
            const validation = await this.validateRequest(request);
            if (!validation.valid) {
                throw new GenerationServiceError('INVALID_REQUEST', 'Request validation failed', { errors: validation.errors });
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
        }
        catch (error) {
            throw this.handleError(error, 'GENERATION_FAILED');
        }
    }
    /**
     * Render template with data
     * Implementation of POST /render endpoint from generation-service.yaml
     */
    async render(request) {
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
        }
        catch (error) {
            throw this.handleError(error, 'RENDER_FAILED');
        }
    }
    /**
     * List available templates
     * Implementation of GET /templates endpoint from generation-service.yaml
     */
    async listTemplates(format) {
        try {
            let availableTemplates = [];
            if (format) {
                // Get templates for specific format
                const generator = this.generators.get(format);
                if (generator) {
                    availableTemplates = await generator.getTemplates();
                }
            }
            else {
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
        }
        catch (error) {
            throw this.handleError(error, 'TEMPLATE_LIST_FAILED');
        }
    }
    /**
     * Generate preview of documentation
     * Implementation of POST /preview endpoint from generation-service.yaml
     */
    async preview(request) {
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
        }
        catch (error) {
            throw this.handleError(error, 'PREVIEW_FAILED');
        }
    }
    /**
     * Validate generation configuration
     * Implementation of POST /validate endpoint from generation-service.yaml
     */
    async validate(request) {
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
        }
        catch (error) {
            throw this.handleError(error, 'VALIDATION_FAILED');
        }
    }
    // Private helper methods
    getGenerator(format) {
        const generator = this.generators.get(format);
        if (!generator) {
            throw new GenerationServiceError('FORMAT_NOT_SUPPORTED', `Format '${format}' is not supported`);
        }
        return generator;
    }
    async validateRequest(request) {
        const errors = [];
        const warnings = [];
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
    generateSuggestions(errors, warnings) {
        const suggestions = [];
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
    generateId(prefix) {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    handleError(error, code) {
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
    initializeDefaultTemplates() {
        // Initialize with basic templates
        // In a real implementation, these would be loaded from files
    }
    initializeDefaultThemes() {
        // Initialize with default themes
        const defaultTheme = {
            name: 'default',
            variant: 'light',
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
exports.GenerationService = GenerationService;
/**
 * Asset Manager for handling template assets
 */
class AssetManager {
    constructor(_config) {
        this._config = _config;
    }
    async loadAsset(path) {
        // Implementation would load assets from filesystem or CDN
        return null;
    }
    async validateAssets(assets) {
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
class GenerationServiceError extends Error {
    constructor(code, message, details, suggestions) {
        super(message);
        this.code = code;
        this.details = details;
        this.suggestions = suggestions;
        this.name = 'GenerationServiceError';
    }
}
exports.GenerationServiceError = GenerationServiceError;
exports.default = GenerationService;
//# sourceMappingURL=generation-service.js.map