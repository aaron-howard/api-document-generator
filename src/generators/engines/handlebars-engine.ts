/**
 * Handlebars Template Engine Implementation
 * 
 * Implementation of the ITemplateEngine interface for Handlebars.js
 * Provides template compilation, rendering, and helper management.
 */

import { 
  ITemplateEngine, 
  CompiledTemplate, 
  TemplateHelper
} from '../generation-service';
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
 * Handlebars compiled template wrapper
 */
class HandlebarsCompiledTemplate implements CompiledTemplate {
  constructor(
    private template: any, // Handlebars template function
    private source: string,
    private dependencies: string[] = []
  ) {}

  async render(data: any): Promise<string> {
    try {
      return this.template(data);
    } catch (error) {
      throw new Error(`Template rendering failed: ${error}`);
    }
  }

  getAst(): any {
    // In a real implementation, this would return the Handlebars AST
    return null;
  }

  getDependencies(): string[] {
    return [...this.dependencies];
  }
}

/**
 * Handlebars Template Engine implementation
 */
export class HandlebarsEngine implements ITemplateEngine {
  readonly name = 'handlebars';
  readonly version = '4.7.8';
  readonly supportedFormats = ['html', 'markdown', 'json', 'xml', 'text'];
  
  private helpers: Map<string, TemplateHelper> = new Map();
  private partials: Map<string, string> = new Map();
  private _config: HandlebarsConfig;

  constructor(config: HandlebarsConfig = {}) {
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
  async compile(template: string, _options: any = {}): Promise<CompiledTemplate> {
    try {
      // In a real implementation, this would use actual Handlebars
      // For now, we'll create a mock compiled template
      const compiledFn = this.createMockTemplate(template);
      const dependencies = this.extractDependencies(template);
      
      return new HandlebarsCompiledTemplate(compiledFn, template, dependencies);
    } catch (error) {
      throw new Error(`Template compilation failed: ${error}`);
    }
  }

  /**
   * Render template with data
   */
  async render(template: string, data: any, options: any = {}): Promise<string> {
    try {
      const compiled = await this.compile(template, options);
      return await compiled.render(data);
    } catch (error) {
      throw new Error(`Template rendering failed: ${error}`);
    }
  }

  /**
   * Register helper function
   */
  registerHelper(name: string, helper: TemplateHelper): void {
    this.helpers.set(name, helper);
  }

  /**
   * Register partial template
   */
  registerPartial(name: string, partial: string): void {
    this.partials.set(name, partial);
  }

  /**
   * Validate template syntax
   */
  validate(template: string): TemplateValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

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

    } catch (error) {
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

  private createMockTemplate(template: string): (data: any) => string {
    return (data: any) => {
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

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  private extractDependencies(template: string): string[] {
    const dependencies: string[] = [];
    
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

  private initializeBuiltinHelpers(): void {
    // Register common built-in helpers
    this.registerHelper('eq', (a: any, b: any) => a === b);
    this.registerHelper('ne', (a: any, b: any) => a !== b);
    this.registerHelper('gt', (a: any, b: any) => a > b);
    this.registerHelper('lt', (a: any, b: any) => a < b);
    this.registerHelper('gte', (a: any, b: any) => a >= b);
    this.registerHelper('lte', (a: any, b: any) => a <= b);
    this.registerHelper('and', (...args: any[]) => args.slice(0, -1).every(Boolean));
    this.registerHelper('or', (...args: any[]) => args.slice(0, -1).some(Boolean));
    this.registerHelper('not', (value: any) => !value);
    
    // String helpers
    this.registerHelper('uppercase', (str: string) => str ? str.toUpperCase() : '');
    this.registerHelper('lowercase', (str: string) => str ? str.toLowerCase() : '');
    this.registerHelper('capitalize', (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '');
    this.registerHelper('trim', (str: string) => str ? str.trim() : '');
    this.registerHelper('truncate', (str: string, length: number) => {
      if (!str) return '';
      return str.length > length ? str.substring(0, length) + '...' : str;
    });
    
    // Array helpers
    this.registerHelper('length', (arr: any[]) => Array.isArray(arr) ? arr.length : 0);
    this.registerHelper('first', (arr: any[]) => Array.isArray(arr) && arr.length > 0 ? arr[0] : null);
    this.registerHelper('last', (arr: any[]) => Array.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : null);
    this.registerHelper('join', (arr: any[], separator: string = ', ') => {
      return Array.isArray(arr) ? arr.join(separator) : '';
    });
    
    // Date helpers
    this.registerHelper('date', (date: Date | string, format?: string) => {
      const d = date instanceof Date ? date : new Date(date);
      if (isNaN(d.getTime())) return '';
      
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
    this.registerHelper('json', (obj: any, pretty?: boolean) => {
      try {
        return JSON.stringify(obj, null, pretty ? 2 : 0);
      } catch {
        return '';
      }
    });
    
    // URL helpers
    this.registerHelper('encodeUri', (str: string) => str ? encodeURIComponent(str) : '');
    this.registerHelper('slug', (str: string) => {
      return str ? str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : '';
    });
    
    // Math helpers
    this.registerHelper('add', (a: number, b: number) => (a || 0) + (b || 0));
    this.registerHelper('subtract', (a: number, b: number) => (a || 0) - (b || 0));
    this.registerHelper('multiply', (a: number, b: number) => (a || 0) * (b || 0));
    this.registerHelper('divide', (a: number, b: number) => b !== 0 ? (a || 0) / b : 0);
    this.registerHelper('round', (num: number, decimals: number = 0) => {
      return num ? Number(num.toFixed(decimals)) : 0;
    });
  }

  private isBuiltinHelper(name: string): boolean {
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

/**
 * Factory function to create Handlebars engine
 */
export function createHandlebarsEngine(config?: HandlebarsConfig): HandlebarsEngine {
  return new HandlebarsEngine(config);
}

export default HandlebarsEngine;