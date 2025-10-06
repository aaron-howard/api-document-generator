"use strict";
/**
 * Input source models for API documentation generation
 * Represents sources of API information that can be parsed and processed
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputSourceUtils = exports.InputSourceFactory = exports.InputSourceState = exports.InputSourceType = void 0;
var InputSourceType;
(function (InputSourceType) {
    InputSourceType["OPENAPI"] = "openapi";
    InputSourceType["SWAGGER"] = "swagger";
    InputSourceType["JSDOC"] = "jsdoc";
    InputSourceType["PYTHON_DOCSTRING"] = "python-docstring";
    InputSourceType["GO_DOC"] = "go-doc";
    InputSourceType["TYPESCRIPT"] = "typescript";
    InputSourceType["JAVASCRIPT"] = "javascript";
    InputSourceType["PYTHON"] = "python";
    InputSourceType["GO"] = "go";
    InputSourceType["JAVA"] = "java";
    InputSourceType["CSHARP"] = "csharp";
    InputSourceType["POSTMAN"] = "postman";
    InputSourceType["INSOMNIA"] = "insomnia";
    InputSourceType["ASYNCAPI"] = "asyncapi";
    InputSourceType["GRAPHQL"] = "graphql";
})(InputSourceType || (exports.InputSourceType = InputSourceType = {}));
var InputSourceState;
(function (InputSourceState) {
    InputSourceState["INACTIVE"] = "inactive";
    InputSourceState["PARSING"] = "parsing";
    InputSourceState["PARSED"] = "parsed";
    InputSourceState["ERROR"] = "error";
    InputSourceState["UPDATING"] = "updating";
})(InputSourceState || (exports.InputSourceState = InputSourceState = {}));
/**
 * Factory and utility functions for InputSource management
 */
class InputSourceFactory {
    /**
     * Create a new InputSource with default configuration
     */
    static create(config) {
        const result = {
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
            result.lastProcessed = config.lastProcessed;
        }
        if (config.error !== undefined) {
            result.error = config.error;
        }
        return result;
    }
    /**
     * Create InputSource from file path with auto-detected type
     */
    static fromPath(path, options) {
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
    static fromOpenApi(path, options) {
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
    static fromTypeScript(path, options) {
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
    static fromPython(path, options) {
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
    static fromGo(path, options) {
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
    static generateId() {
        return `input_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    static detectSourceType(path) {
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
    static getDefaultIncludePatterns(type) {
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
    static getDefaultExcludePatterns() {
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
    static getDefaultParserConfig(type) {
        const baseConfig = {
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
    static createDefaultMetadata() {
        const now = new Date();
        return {
            createdAt: now,
            updatedAt: now,
        };
    }
}
exports.InputSourceFactory = InputSourceFactory;
/**
 * Utility functions for InputSource operations
 */
class InputSourceUtils {
    /**
     * Check if two InputSources are equivalent
     */
    static areEquivalent(source1, source2) {
        return (source1.type === source2.type &&
            source1.path === source2.path &&
            JSON.stringify(source1.include) === JSON.stringify(source2.include) &&
            JSON.stringify(source1.exclude) === JSON.stringify(source2.exclude) &&
            JSON.stringify(source1.parserConfig) === JSON.stringify(source2.parserConfig));
    }
    /**
     * Get the display name for an InputSource
     */
    static getDisplayName(source) {
        return source.metadata.displayName ||
            source.path.split('/').pop() ||
            source.path.split('\\').pop() ||
            source.path;
    }
    /**
     * Check if a file matches the InputSource patterns
     */
    static matchesPattern(source, filePath) {
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
    static getNextState(currentState, action) {
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
    static matchGlob(path, pattern) {
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
exports.InputSourceUtils = InputSourceUtils;
//# sourceMappingURL=input-source.js.map