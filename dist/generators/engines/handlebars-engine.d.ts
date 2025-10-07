/**
 * Handlebars Template Engine Implementation
 *
 * Implementation of the ITemplateEngine interface for Handlebars.js
 * Provides template compilation, rendering, and helper management.
 */
import { ITemplateEngine, CompiledTemplate, TemplateHelper } from '../generation-service';
import { TemplateValidationResult } from '../../core/models/template';
/**
 * Handlebars engine configuration
 */
export interface HandlebarsConfig {
    noEscape?: boolean;
    strict?: boolean;
    assumeObjects?: boolean;
    preventIndent?: boolean;
    ignoreStandalone?: boolean;
    explicitPartialContext?: boolean;
}
/**
 * Handlebars Template Engine implementation
 */
export declare class HandlebarsEngine implements ITemplateEngine {
    readonly name = "handlebars";
    readonly version = "4.7.8";
    readonly supportedFormats: string[];
    private helpers;
    private partials;
    private _internalConfig;
    constructor(config?: HandlebarsConfig);
    /**
     * Compile template string
     */
    compile(template: string, _options?: any): Promise<CompiledTemplate>;
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
    private createMockTemplate;
    private getNestedValue;
    private extractDependencies;
    private initializeBuiltinHelpers;
    private isBuiltinHelper;
}
/**
 * Factory function to create Handlebars engine
 */
export declare function createHandlebarsEngine(config?: HandlebarsConfig): HandlebarsEngine;
export default HandlebarsEngine;
//# sourceMappingURL=handlebars-engine.d.ts.map