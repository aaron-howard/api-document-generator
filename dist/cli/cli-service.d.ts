/**
 * CLI Service Implementation
 *
 * Implements the CLI interface based on the CLI API contract (cli-api.yaml).
 * Provides command parsing, configuration handling, user workflows, and error reporting.
 */
import { UserPreferences } from '../core/models/user-preferences';
/**
 * CLI API request/response interfaces based on cli-api.yaml contract
 */
export interface GenerationRequest {
    project: {
        name: string;
        version: string;
        description?: string;
        baseUrl?: string;
    };
    inputs: Array<{
        type: 'openapi' | 'jsdoc' | 'python-docstring' | 'go-doc' | 'graphql';
        path: string;
        enabled?: boolean;
        include?: string[];
        exclude?: string[];
        parserConfig?: Record<string, any>;
    }>;
    outputs: Array<{
        format: 'markdown' | 'html' | 'pdf' | 'json';
        path: string;
        theme?: string;
        template?: string;
        options?: Record<string, any>;
    }>;
    options?: {
        aiSummarization?: boolean;
        generateChangelog?: boolean;
        validateOutput?: boolean;
        concurrency?: number;
    };
}
export interface GenerationResponse {
    status: 'success' | 'partial' | 'failed';
    sessionId: string;
    outputPaths?: string[];
    metrics?: {
        processedEndpoints: number;
        generationTime: number;
        aiSummariesGenerated: number;
        cacheHitRate: number;
    };
    warnings?: Array<{
        code: string;
        message: string;
        path?: string;
    }>;
    errors?: Array<{
        code: string;
        message: string;
        path?: string;
        stack?: string;
    }>;
}
export interface ValidationRequest {
    inputs: Array<{
        type: 'openapi' | 'jsdoc' | 'python-docstring' | 'go-doc' | 'graphql';
        path: string;
        enabled?: boolean;
    }>;
}
export interface ValidationResponse {
    valid: boolean;
    errors?: Array<{
        code: string;
        message: string;
        path: string;
        line?: number;
        column?: number;
    }>;
    warnings?: Array<{
        code: string;
        message: string;
        path?: string;
    }>;
}
export interface DiffRequest {
    oldVersion: {
        type: 'openapi' | 'jsdoc' | 'python-docstring' | 'go-doc' | 'graphql';
        path: string;
    };
    newVersion: {
        type: 'openapi' | 'jsdoc' | 'python-docstring' | 'go-doc' | 'graphql';
        path: string;
    };
    options?: {
        includeBreaking?: boolean;
        format?: 'markdown' | 'json';
    };
}
export interface DiffResponse {
    changes: Array<{
        type: 'added' | 'removed' | 'modified' | 'breaking';
        path: string;
        description: string;
        details?: any;
    }>;
    summary: {
        totalChanges: number;
        breakingChanges: number;
        additions: number;
        removals: number;
        modifications: number;
    };
}
/**
 * CLI Command types for internal command routing
 */
export type CLICommand = 'generate' | 'validate' | 'diff' | 'init' | 'config' | 'version' | 'help';
export interface CLIOptions {
    config?: string;
    verbose?: boolean;
    quiet?: boolean;
    output?: string;
    format?: string;
    ai?: boolean;
    validate?: boolean;
    [key: string]: any;
}
export interface CLIResult {
    success: boolean;
    data?: any;
    message?: string;
    errors?: string[];
    warnings?: string[];
    exitCode: number;
}
/**
 * Configuration file structure
 */
export interface CLIConfig {
    project: {
        name: string;
        version: string;
        description?: string;
        baseUrl?: string;
    };
    defaults: {
        inputs: GenerationRequest['inputs'];
        outputs: GenerationRequest['outputs'];
        options: GenerationRequest['options'];
    };
    profiles?: Record<string, {
        inputs?: GenerationRequest['inputs'];
        outputs?: GenerationRequest['outputs'];
        options?: GenerationRequest['options'];
    }>;
    preferences?: UserPreferences;
}
/**
 * Main CLI Service class implementing the CLI API contract
 */
export declare class CLIService {
    private config;
    private preferences;
    constructor();
    /**
     * Generate API documentation
     * Implementation of POST /generate endpoint from cli-api.yaml
     */
    generate(request: GenerationRequest): Promise<GenerationResponse>;
    /**
     * Validate input sources
     * Implementation of POST /validate endpoint from cli-api.yaml
     */
    validate(request: ValidationRequest): Promise<ValidationResponse>;
    /**
     * Generate API changelog/diff
     * Implementation of POST /diff endpoint from cli-api.yaml
     */
    diff(request: DiffRequest): Promise<DiffResponse>;
    /**
     * Initialize configuration file
     */
    init(projectPath: string, options?: {
        force?: boolean;
    }): Promise<CLIResult>;
    /**
     * Load configuration from file
     */
    loadConfig(configPath?: string): Promise<CLIConfig | null>;
    /**
     * Save configuration to file
     */
    saveConfig(config: CLIConfig, configPath?: string): Promise<void>;
    /**
     * Get current configuration
     */
    getConfig(): CLIConfig | null;
    /**
     * Set user preferences
     */
    setPreferences(preferences: UserPreferences): void;
    /**
     * Get user preferences
     */
    getPreferences(): UserPreferences | null;
    private validateGenerationRequest;
    private validateInputSources;
    private validateSingleInput;
    private validateFileFormat;
    private validateOpenApiFile;
    private validateJSDocFiles;
    private validatePythonFiles;
    private validateGoFiles;
    private validateGraphQLFiles;
    private parseInputSource;
    private generateAISummaries;
    private generateOutput;
    private compareVersions;
    private generateSessionId;
    private fileExists;
    private readFile;
    private writeFile;
}
export default CLIService;
//# sourceMappingURL=cli-service.d.ts.map