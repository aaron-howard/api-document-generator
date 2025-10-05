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
export declare enum InputSourceType {
    OPENAPI = "openapi",
    SWAGGER = "swagger",
    JSDOC = "jsdoc",
    PYTHON_DOCSTRING = "python-docstring",
    GO_DOC = "go-doc",
    TYPESCRIPT = "typescript",
    JAVASCRIPT = "javascript",
    PYTHON = "python",
    GO = "go",
    JAVA = "java",
    CSHARP = "csharp",
    POSTMAN = "postman",
    INSOMNIA = "insomnia",
    ASYNCAPI = "asyncapi",
    GRAPHQL = "graphql"
}
export declare enum InputSourceState {
    INACTIVE = "inactive",
    PARSING = "parsing",
    PARSED = "parsed",
    ERROR = "error",
    UPDATING = "updating"
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
    readonly strictMode?: boolean;
    readonly includePrivate?: boolean;
    readonly includeInternal?: boolean;
    readonly followReferences?: boolean;
    readonly maxDepth?: number;
    readonly timeout?: number;
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
    readonly endpoints: string[];
    readonly schemas: string[];
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
export declare class InputSourceFactory {
    /**
     * Create a new InputSource with default configuration
     */
    static create(config: Partial<InputSource> & Pick<InputSource, 'type' | 'path'>): InputSource;
    /**
     * Create InputSource from file path with auto-detected type
     */
    static fromPath(path: string, options?: Partial<InputSource>): InputSource;
    /**
     * Create InputSource for OpenAPI specification
     */
    static fromOpenApi(path: string, options?: Partial<InputSource>): InputSource;
    /**
     * Create InputSource for TypeScript/JavaScript project
     */
    static fromTypeScript(path: string, options?: Partial<InputSource>): InputSource;
    /**
     * Create InputSource for Python project
     */
    static fromPython(path: string, options?: Partial<InputSource>): InputSource;
    /**
     * Create InputSource for Go project
     */
    static fromGo(path: string, options?: Partial<InputSource>): InputSource;
    private static generateId;
    private static detectSourceType;
    private static getDefaultIncludePatterns;
    private static getDefaultExcludePatterns;
    private static getDefaultParserConfig;
    private static createDefaultMetadata;
}
/**
 * Utility functions for InputSource operations
 */
export declare class InputSourceUtils {
    /**
     * Check if two InputSources are equivalent
     */
    static areEquivalent(source1: InputSource, source2: InputSource): boolean;
    /**
     * Get the display name for an InputSource
     */
    static getDisplayName(source: InputSource): string;
    /**
     * Check if a file matches the InputSource patterns
     */
    static matchesPattern(source: InputSource, filePath: string): boolean;
    /**
     * Get the state transition for an InputSource
     */
    static getNextState(currentState: InputSourceState, action: string): InputSourceState;
    private static matchGlob;
}
//# sourceMappingURL=input-source.d.ts.map