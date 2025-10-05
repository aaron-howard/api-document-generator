"use strict";
/**
 * Handlebars Template Engine Implementation
 *
 * Implementation of the ITemplateEngine interface for Handlebars.js
 * Provides template compilation, rendering, and helper management.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlebarsEngine = void 0;
exports.createHandlebarsEngine = createHandlebarsEngine;
/**
 * Handlebars compiled template wrapper
 */
class HandlebarsCompiledTemplate {
    constructor(template, // Handlebars template function
    source, dependencies = []) {
        this.template = template;
        this.source = source;
        this.dependencies = dependencies;
    }
    async render(data) {
        try {
            return this.template(data);
        }
        catch (error) {
            throw new Error(`Template rendering failed: ${error}`);
        }
    }
    getAst() {
        // In a real implementation, this would return the Handlebars AST
        return null;
    }
    getDependencies() {
        return [...this.dependencies];
    }
}
/**
 * Handlebars Template Engine implementation
 */
class HandlebarsEngine {
    constructor(config = {}) {
        this.name = 'handlebars';
        this.version = '4.7.8';
        this.supportedFormats = ['html', 'markdown', 'json', 'xml', 'text'];
        this.helpers = new Map();
        this.partials = new Map();
        this._config = {
            noEscape: false,
            strict: false,
            assumeObjects: false,
            ...config
        };
        this.initializeBuiltinHelpers();
    }
    /**
     * Compile template string
     */
    async compile(template, _options = {}) {
        try {
            // In a real implementation, this would use actual Handlebars
            // For now, we'll create a mock compiled template
            const compiledFn = this.createMockTemplate(template);
            const dependencies = this.extractDependencies(template);
            return new HandlebarsCompiledTemplate(compiledFn, template, dependencies);
        }
        catch (error) {
            throw new Error(`Template compilation failed: ${error}`);
        }
    }
    /**
     * Render template with data
     */
    async render(template, data, options = {}) {
        try {
            const compiled = await this.compile(template, options);
            return await compiled.render(data);
        }
        catch (error) {
            throw new Error(`Template rendering failed: ${error}`);
        }
    }
    /**
     * Register helper function
     */
    registerHelper(name, helper) {
        this.helpers.set(name, helper);
    }
    /**
     * Register partial template
     */
    registerPartial(name, partial) {
        this.partials.set(name, partial);
    }
    /**
     * Validate template syntax
     */
    validate(template) {
        const errors = [];
        const warnings = [];
        try {
            // Basic validation checks
            const openBraces = (template.match(/\{\{/g) || []).length;
            const closeBraces = (template.match(/\}\}/g) || []).length;
            if (openBraces !== closeBraces) {
                errors.push('Unmatched handlebars braces');
            }
            // Check for common syntax issues
            if (template.includes('{{#each') && !template.includes('{{/each}}')) {
                errors.push('Unclosed #each block');
            }
            if (template.includes('{{#if') && !template.includes('{{/if}}')) {
                errors.push('Unclosed #if block');
            }
            if (template.includes('{{#unless') && !template.includes('{{/unless}}')) {
                errors.push('Unclosed #unless block');
            }
            // Check for undefined helpers
            const helperMatches = template.match(/\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+/g);
            if (helperMatches) {
                for (const match of helperMatches) {
                    const helperName = match.replace(/\{\{\s*/, '').replace(/\s+.*$/, '');
                    if (!this.helpers.has(helperName) && !this.isBuiltinHelper(helperName)) {
                        warnings.push(`Unknown helper: ${helperName}`);
                    }
                }
            }
            return {
                isValid: errors.length === 0,
                errors,
                warnings,
                missingAssets: [],
                unusedAssets: [],
                brokenDependencies: []
            };
        }
        catch (error) {
            return {
                isValid: false,
                errors: [`Validation error: ${error}`],
                warnings,
                missingAssets: [],
                unusedAssets: [],
                brokenDependencies: []
            };
        }
    }
    // Private helper methods
    createMockTemplate(template) {
        return (data) => {
            let result = template;
            // Simple template rendering simulation
            // Replace {{variable}} with actual values
            result = result.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, path) => {
                const value = this.getNestedValue(data, path.trim());
                return value !== undefined ? String(value) : match;
            });
            // Handle basic #each blocks
            result = result.replace(/\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, path, content) => {
                const array = this.getNestedValue(data, path.trim());
                if (Array.isArray(array)) {
                    return array.map(item => {
                        let itemContent = content;
                        // Replace {{this}} with item value
                        itemContent = itemContent.replace(/\{\{this\}\}/g, String(item));
                        // Replace {{@index}} with array index
                        const index = array.indexOf(item);
                        itemContent = itemContent.replace(/\{\{@index\}\}/g, String(index));
                        return itemContent;
                    }).join('');
                }
                return '';
            });
            // Handle basic #if blocks
            result = result.replace(/\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, path, content) => {
                const value = this.getNestedValue(data, path.trim());
                return value ? content : '';
            });
            // Handle basic #unless blocks
            result = result.replace(/\{\{#unless\s+([^}]+)\}\}([\s\S]*?)\{\{\/unless\}\}/g, (_, path, content) => {
                const value = this.getNestedValue(data, path.trim());
                return !value ? content : '';
            });
            return result;
        };
    }
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }
    extractDependencies(template) {
        const dependencies = [];
        // Extract partial references
        const partialMatches = template.match(/\{\{>\s*([^}]+)\}\}/g);
        if (partialMatches) {
            for (const match of partialMatches) {
                const partialName = match.replace(/\{\{>\s*/, '').replace(/\s*\}\}/, '').trim();
                dependencies.push(partialName);
            }
        }
        return dependencies;
    }
    initializeBuiltinHelpers() {
        // Register common built-in helpers
        this.registerHelper('eq', (a, b) => a === b);
        this.registerHelper('ne', (a, b) => a !== b);
        this.registerHelper('gt', (a, b) => a > b);
        this.registerHelper('lt', (a, b) => a < b);
        this.registerHelper('gte', (a, b) => a >= b);
        this.registerHelper('lte', (a, b) => a <= b);
        this.registerHelper('and', (...args) => args.slice(0, -1).every(Boolean));
        this.registerHelper('or', (...args) => args.slice(0, -1).some(Boolean));
        this.registerHelper('not', (value) => !value);
        // String helpers
        this.registerHelper('uppercase', (str) => str ? str.toUpperCase() : '');
        this.registerHelper('lowercase', (str) => str ? str.toLowerCase() : '');
        this.registerHelper('capitalize', (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '');
        this.registerHelper('trim', (str) => str ? str.trim() : '');
        this.registerHelper('truncate', (str, length) => {
            if (!str)
                return '';
            return str.length > length ? str.substring(0, length) + '...' : str;
        });
        // Array helpers
        this.registerHelper('length', (arr) => Array.isArray(arr) ? arr.length : 0);
        this.registerHelper('first', (arr) => Array.isArray(arr) && arr.length > 0 ? arr[0] : null);
        this.registerHelper('last', (arr) => Array.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : null);
        this.registerHelper('join', (arr, separator = ', ') => {
            return Array.isArray(arr) ? arr.join(separator) : '';
        });
        // Date helpers
        this.registerHelper('date', (date, format) => {
            const d = date instanceof Date ? date : new Date(date);
            if (isNaN(d.getTime()))
                return '';
            switch (format) {
                case 'iso':
                    return d.toISOString();
                case 'short':
                    return d.toLocaleDateString();
                case 'long':
                    return d.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                default:
                    return d.toString();
            }
        });
        // JSON helper
        this.registerHelper('json', (obj, pretty) => {
            try {
                return JSON.stringify(obj, null, pretty ? 2 : 0);
            }
            catch {
                return '';
            }
        });
        // URL helpers
        this.registerHelper('encodeUri', (str) => str ? encodeURIComponent(str) : '');
        this.registerHelper('slug', (str) => {
            return str ? str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : '';
        });
        // Math helpers
        this.registerHelper('add', (a, b) => (a || 0) + (b || 0));
        this.registerHelper('subtract', (a, b) => (a || 0) - (b || 0));
        this.registerHelper('multiply', (a, b) => (a || 0) * (b || 0));
        this.registerHelper('divide', (a, b) => b !== 0 ? (a || 0) / b : 0);
        this.registerHelper('round', (num, decimals = 0) => {
            return num ? Number(num.toFixed(decimals)) : 0;
        });
    }
    isBuiltinHelper(name) {
        const builtins = [
            'each', 'if', 'unless', 'with', 'lookup', 'log',
            'eq', 'ne', 'gt', 'lt', 'gte', 'lte', 'and', 'or', 'not',
            'uppercase', 'lowercase', 'capitalize', 'trim', 'truncate',
            'length', 'first', 'last', 'join',
            'date', 'json', 'encodeUri', 'slug',
            'add', 'subtract', 'multiply', 'divide', 'round'
        ];
        return builtins.includes(name);
    }
}
exports.HandlebarsEngine = HandlebarsEngine;
/**
 * Factory function to create Handlebars engine
 */
function createHandlebarsEngine(config) {
    return new HandlebarsEngine(config);
}
exports.default = HandlebarsEngine;
//# sourceMappingURL=handlebars-engine.js.map