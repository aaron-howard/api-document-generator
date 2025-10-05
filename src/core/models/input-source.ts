/**
 * Input source models for API documentation generation
 * Represents sources of API information that can be parsed and processed
 */

import { SourceLocation } from './api-spec';

export interface InputSource {
  readonly id: string;
  readonly type: InputSourceType;
  readonly path: string;
  readonly include: string[];
  readonly exclude: string[];
  readonly parserConfig: ParserConfiguration;
  readonly priority: number;
  readonly enabled: boolean;
  readonly state: InputSourceState;
  readonly metadata: InputSourceMetadata;
  readonly lastProcessed?: Date;
  readonly error?: InputSourceError;
}

export enum InputSourceType {
  OPENAPI = 'openapi',
  SWAGGER = 'swagger',
  JSDOC = 'jsdoc',
  PYTHON_DOCSTRING = 'python-docstring',
  GO_DOC = 'go-doc',
  TYPESCRIPT = 'typescript',
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  GO = 'go',
  JAVA = 'java',
  CSHARP = 'csharp',
  POSTMAN = 'postman',
  INSOMNIA = 'insomnia',
  ASYNCAPI = 'asyncapi',
  GRAPHQL = 'graphql',
}

export enum InputSourceState {
  INACTIVE = 'inactive',
  PARSING = 'parsing',
  PARSED = 'parsed',
  ERROR = 'error',
  UPDATING = 'updating',
}

export interface InputSourceMetadata {
  readonly displayName?: string;
  readonly description?: string;
  readonly version?: string;
  readonly language?: string;
  readonly framework?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly fileCount?: number;
  readonly totalLines?: number;
  readonly encoding?: string;
}

export interface InputSourceError {
  readonly code: string;
  readonly message: string;
  readonly details?: any;
  readonly timestamp: Date;
  readonly recoverable: boolean;
  readonly suggestions?: string[];
}

export interface ParserConfiguration {
  readonly [key: string]: any;
  
  // Common parser options
  readonly strictMode?: boolean;
  readonly includePrivate?: boolean;
  readonly includeInternal?: boolean;
  readonly followReferences?: boolean;
  readonly maxDepth?: number;
  readonly timeout?: number;
  
  // Language-specific options
  readonly typescript?: TypeScriptParserConfig;
  readonly python?: PythonParserConfig;
  readonly go?: GoParserConfig;
  readonly java?: JavaParserConfig;
  readonly openapi?: OpenApiParserConfig;
  readonly jsdoc?: JSDocParserConfig;
}

export interface TypeScriptParserConfig {
  readonly tsConfigPath?: string;
  readonly includeTypeDefinitions?: boolean;
  readonly followImports?: boolean;
  readonly decorators?: boolean;
  readonly experimentalDecorators?: boolean;
  readonly strictNullChecks?: boolean;
}

export interface PythonParserConfig {
  readonly pythonPath?: string;
  readonly virtualEnv?: string;
  readonly includePrivateMethods?: boolean;
  readonly followImports?: boolean;
  readonly docstringStyle?: 'google' | 'numpy' | 'sphinx' | 'auto';
  readonly typeHints?: boolean;
}

export interface GoParserConfig {
  readonly goPath?: string;
  readonly goMod?: string;
  readonly includeUnexported?: boolean;
  readonly followPackages?: boolean;
  readonly buildTags?: string[];
}

export interface JavaParserConfig {
  readonly classPath?: string[];
  readonly sourceVersion?: string;
  readonly includePrivate?: boolean;
  readonly followInheritance?: boolean;
  readonly annotationProcessing?: boolean;
}

export interface OpenApiParserConfig {
  readonly validateSpec?: boolean;
  readonly resolveReferences?: boolean;
  readonly includeExamples?: boolean;
  readonly bundleReferences?: boolean;
  readonly dereferenceMode?: 'bundle' | 'inline' | 'keep';
}

export interface JSDocParserConfig {
  readonly includePrivate?: boolean;
  readonly followRequires?: boolean;
  readonly moduleSystem?: 'commonjs' | 'es6' | 'amd' | 'auto';
  readonly typedefResolving?: boolean;
}

export interface FilePattern {
  readonly pattern: string;
  readonly type: 'include' | 'exclude';
  readonly caseSensitive?: boolean;
  readonly recursive?: boolean;
}

export interface ParsedFile {
  readonly filePath: string;
  readonly sourceType: InputSourceType;
  readonly content: string;
  readonly contentHash: string;
  readonly size: number;
  readonly lastModified: Date;
  readonly parsedAt: Date;
  readonly encoding: string;
  readonly lineCount: number;
  readonly endpoints: string[]; // IDs of parsed endpoints
  readonly schemas: string[]; // IDs of parsed schemas
  readonly errors: ParseError[];
  readonly sourceLocation: SourceLocation;
}

export interface ParseError {
  readonly type: 'syntax' | 'semantic' | 'reference' | 'validation';
  readonly severity: 'error' | 'warning' | 'info';
  readonly message: string;
  readonly line?: number;
  readonly column?: number;
  readonly source?: string;
  readonly code?: string;
}

export interface InputSourceStats {
  readonly totalFiles: number;
  readonly parsedFiles: number;
  readonly errorFiles: number;
  readonly skippedFiles: number;
  readonly totalEndpoints: number;
  readonly totalSchemas: number;
  readonly totalLines: number;
  readonly processingTime: number;
  readonly lastProcessed: Date;
}

/**
 * Factory and utility functions for InputSource management
 */
export class InputSourceFactory {
  /**
   * Create a new InputSource with default configuration
   */
  static create(config: Partial<InputSource> & Pick<InputSource, 'type' | 'path'>): InputSource {
    const result: InputSource = {
      id: this.generateId(),
      type: config.type,
      path: config.path,
      include: config.include || this.getDefaultIncludePatterns(config.type),
      exclude: config.exclude || this.getDefaultExcludePatterns(),
      parserConfig: config.parserConfig || this.getDefaultParserConfig(config.type),
      priority: config.priority ?? 1,
      enabled: config.enabled !== false,
      state: config.state || InputSourceState.INACTIVE,
      metadata: config.metadata || this.createDefaultMetadata(),
    };

    if (config.lastProcessed !== undefined) {
      (result as any).lastProcessed = config.lastProcessed;
    }
    
    if (config.error !== undefined) {
      (result as any).error = config.error;
    }

    return result;
  }

  /**
   * Create InputSource from file path with auto-detected type
   */
  static fromPath(path: string, options?: Partial<InputSource>): InputSource {
    const type = this.detectSourceType(path);
    return this.create({
      type,
      path,
      ...options,
    });
  }

  /**
   * Create InputSource for OpenAPI specification
   */
  static fromOpenApi(path: string, options?: Partial<InputSource>): InputSource {
    return this.create({
      type: InputSourceType.OPENAPI,
      path,
      parserConfig: {
        openapi: {
          validateSpec: true,
          resolveReferences: true,
          includeExamples: true,
          dereferenceMode: 'bundle',
        },
      },
      ...options,
    });
  }

  /**
   * Create InputSource for TypeScript/JavaScript project
   */
  static fromTypeScript(path: string, options?: Partial<InputSource>): InputSource {
    return this.create({
      type: InputSourceType.TYPESCRIPT,
      path,
      include: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      parserConfig: {
        typescript: {
          includeTypeDefinitions: true,
          followImports: true,
          decorators: true,
          experimentalDecorators: true,
        },
        jsdoc: {
          includePrivate: false,
          followRequires: true,
          moduleSystem: 'auto',
        },
      },
      ...options,
    });
  }

  /**
   * Create InputSource for Python project
   */
  static fromPython(path: string, options?: Partial<InputSource>): InputSource {
    return this.create({
      type: InputSourceType.PYTHON,
      path,
      include: ['**/*.py'],
      parserConfig: {
        python: {
          includePrivateMethods: false,
          followImports: true,
          docstringStyle: 'auto',
          typeHints: true,
        },
      },
      ...options,
    });
  }

  /**
   * Create InputSource for Go project
   */
  static fromGo(path: string, options?: Partial<InputSource>): InputSource {
    return this.create({
      type: InputSourceType.GO,
      path,
      include: ['**/*.go'],
      exclude: ['**/*_test.go'],
      parserConfig: {
        go: {
          includeUnexported: false,
          followPackages: true,
        },
      },
      ...options,
    });
  }

  private static generateId(): string {
    return `input_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static detectSourceType(path: string): InputSourceType {
    const ext = path.toLowerCase().split('.').pop();
    
    switch (ext) {
      case 'yaml':
      case 'yml':
      case 'json':
        return InputSourceType.OPENAPI; // Assume OpenAPI for YAML/JSON
      case 'ts':
      case 'tsx':
        return InputSourceType.TYPESCRIPT;
      case 'js':
      case 'jsx':
        return InputSourceType.JAVASCRIPT;
      case 'py':
        return InputSourceType.PYTHON;
      case 'go':
        return InputSourceType.GO;
      case 'java':
        return InputSourceType.JAVA;
      case 'cs':
        return InputSourceType.CSHARP;
      default:
        return InputSourceType.OPENAPI; // Default fallback
    }
  }

  private static getDefaultIncludePatterns(type: InputSourceType): string[] {
    switch (type) {
      case InputSourceType.OPENAPI:
      case InputSourceType.SWAGGER:
        return ['**/*.yaml', '**/*.yml', '**/*.json'];
      case InputSourceType.TYPESCRIPT:
        return ['**/*.ts', '**/*.tsx'];
      case InputSourceType.JAVASCRIPT:
        return ['**/*.js', '**/*.jsx'];
      case InputSourceType.PYTHON:
        return ['**/*.py'];
      case InputSourceType.GO:
        return ['**/*.go'];
      case InputSourceType.JAVA:
        return ['**/*.java'];
      case InputSourceType.CSHARP:
        return ['**/*.cs'];
      default:
        return ['**/*'];
    }
  }

  private static getDefaultExcludePatterns(): string[] {
    return [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/target/**',
      '**/.git/**',
      '**/.vscode/**',
      '**/.idea/**',
      '**/*.min.js',
      '**/*.test.*',
      '**/*.spec.*',
      '**/test/**',
      '**/tests/**',
      '**/__tests__/**',
      '**/__pycache__/**',
      '**/*.pyc',
      '**/vendor/**',
    ];
  }

  private static getDefaultParserConfig(type: InputSourceType): ParserConfiguration {
    const baseConfig: ParserConfiguration = {
      strictMode: false,
      includePrivate: false,
      includeInternal: false,
      followReferences: true,
      maxDepth: 10,
      timeout: 30000,
    };

    switch (type) {
      case InputSourceType.OPENAPI:
      case InputSourceType.SWAGGER:
        return {
          ...baseConfig,
          openapi: {
            validateSpec: true,
            resolveReferences: true,
            includeExamples: true,
            dereferenceMode: 'bundle',
          },
        };
      case InputSourceType.TYPESCRIPT:
        return {
          ...baseConfig,
          typescript: {
            includeTypeDefinitions: true,
            followImports: true,
            decorators: true,
          },
          jsdoc: {
            includePrivate: false,
            followRequires: true,
            moduleSystem: 'auto',
          },
        };
      case InputSourceType.PYTHON:
        return {
          ...baseConfig,
          python: {
            includePrivateMethods: false,
            followImports: true,
            docstringStyle: 'auto',
            typeHints: true,
          },
        };
      case InputSourceType.GO:
        return {
          ...baseConfig,
          go: {
            includeUnexported: false,
            followPackages: true,
          },
        };
      default:
        return baseConfig;
    }
  }

  private static createDefaultMetadata(): InputSourceMetadata {
    const now = new Date();
    return {
      createdAt: now,
      updatedAt: now,
    };
  }
}

/**
 * Utility functions for InputSource operations
 */
export class InputSourceUtils {
  /**
   * Check if two InputSources are equivalent
   */
  static areEquivalent(source1: InputSource, source2: InputSource): boolean {
    return (
      source1.type === source2.type &&
      source1.path === source2.path &&
      JSON.stringify(source1.include) === JSON.stringify(source2.include) &&
      JSON.stringify(source1.exclude) === JSON.stringify(source2.exclude) &&
      JSON.stringify(source1.parserConfig) === JSON.stringify(source2.parserConfig)
    );
  }

  /**
   * Get the display name for an InputSource
   */
  static getDisplayName(source: InputSource): string {
    return source.metadata.displayName || 
           source.path.split('/').pop() || 
           source.path.split('\\').pop() || 
           source.path;
  }

  /**
   * Check if a file matches the InputSource patterns
   */
  static matchesPattern(source: InputSource, filePath: string): boolean {
    const normalizedPath = filePath.replace(/\\/g, '/');
    
    // Check exclude patterns first
    for (const excludePattern of source.exclude) {
      if (this.matchGlob(normalizedPath, excludePattern)) {
        return false;
      }
    }
    
    // Check include patterns
    for (const includePattern of source.include) {
      if (this.matchGlob(normalizedPath, includePattern)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get the state transition for an InputSource
   */
  static getNextState(currentState: InputSourceState, action: string): InputSourceState {
    switch (currentState) {
      case InputSourceState.INACTIVE:
        return action === 'parse' ? InputSourceState.PARSING : currentState;
      case InputSourceState.PARSING:
        switch (action) {
          case 'success':
            return InputSourceState.PARSED;
          case 'error':
            return InputSourceState.ERROR;
          default:
            return currentState;
        }
      case InputSourceState.PARSED:
        switch (action) {
          case 'update':
            return InputSourceState.UPDATING;
          case 'reparse':
            return InputSourceState.PARSING;
          case 'error':
            return InputSourceState.ERROR;
          default:
            return currentState;
        }
      case InputSourceState.UPDATING:
        switch (action) {
          case 'success':
            return InputSourceState.PARSED;
          case 'error':
            return InputSourceState.ERROR;
          default:
            return currentState;
        }
      case InputSourceState.ERROR:
        return action === 'retry' ? InputSourceState.PARSING : currentState;
      default:
        return currentState;
    }
  }

  private static matchGlob(path: string, pattern: string): boolean {
    // Simple glob matching - in a real implementation, use a proper glob library
    const regexPattern = pattern
      .replace(/\*\*/g, '___DOUBLE_STAR___')
      .replace(/\*/g, '[^/]*')
      .replace(/___DOUBLE_STAR___/g, '.*')
      .replace(/\?/g, '[^/]');
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  }
}