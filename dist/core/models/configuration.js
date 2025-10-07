"use strict";
/**
 * Configuration Model
 *
 * Represents project-wide configuration settings including global settings,
 * environment-specific configurations, user preferences, and security settings.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationPresets = exports.ConfigurationUtils = exports.ConfigurationFactory = exports.CIPlatform = exports.AccessControlMode = exports.SecurityLevel = exports.LogLevel = exports.Environment = void 0;
/**
 * Environment type enumeration
 */
var Environment;
(function (Environment) {
    Environment["DEVELOPMENT"] = "development";
    Environment["TESTING"] = "testing";
    Environment["STAGING"] = "staging";
    Environment["PRODUCTION"] = "production";
    Environment["LOCAL"] = "local";
})(Environment || (exports.Environment = Environment = {}));
/**
 * Log level enumeration
 */
var LogLevel;
(function (LogLevel) {
    LogLevel["TRACE"] = "trace";
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
    LogLevel["FATAL"] = "fatal";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * Security level enumeration
 */
var SecurityLevel;
(function (SecurityLevel) {
    SecurityLevel["LOW"] = "low";
    SecurityLevel["MEDIUM"] = "medium";
    SecurityLevel["HIGH"] = "high";
    SecurityLevel["CRITICAL"] = "critical";
})(SecurityLevel || (exports.SecurityLevel = SecurityLevel = {}));
/**
 * Access control mode enumeration
 */
var AccessControlMode;
(function (AccessControlMode) {
    AccessControlMode["PUBLIC"] = "public";
    AccessControlMode["PRIVATE"] = "private";
    AccessControlMode["RESTRICTED"] = "restricted";
    AccessControlMode["AUTHENTICATED"] = "authenticated";
})(AccessControlMode || (exports.AccessControlMode = AccessControlMode = {}));
/**
 * CI/CD platform enumeration
 */
var CIPlatform;
(function (CIPlatform) {
    CIPlatform["GITHUB_ACTIONS"] = "github-actions";
    CIPlatform["GITLAB_CI"] = "gitlab-ci";
    CIPlatform["JENKINS"] = "jenkins";
    CIPlatform["AZURE_DEVOPS"] = "azure-devops";
    CIPlatform["CIRCLECI"] = "circleci";
    CIPlatform["TRAVIS_CI"] = "travis-ci";
    CIPlatform["CUSTOM"] = "custom";
})(CIPlatform || (exports.CIPlatform = CIPlatform = {}));
/**
 * Factory for creating Configuration instances
 */
class ConfigurationFactory {
    /**
     * Creates a new configuration
     */
    static create(params) {
        const now = new Date();
        return {
            id: this.generateConfigurationId(),
            name: params.name,
            description: params.description,
            version: '1.0.0',
            environment: params.environment,
            themes: this.createDefaultThemeSettings(params.themes),
            aiSettings: this.createDefaultAISettings(params.aiSettings),
            outputSettings: this.createDefaultOutputSettings(params.outputSettings),
            parserSettings: this.createDefaultParserSettings(params.parserSettings),
            securitySettings: this.createDefaultSecuritySettings(params.securitySettings),
            performanceSettings: this.createDefaultPerformanceSettings(params.performanceSettings),
            integrationSettings: this.createDefaultIntegrationSettings(params.integrationSettings),
            userPreferences: this.createDefaultUserPreferences(params.userPreferences),
            environmentConfigs: [],
            projectId: params.projectId,
            createdBy: params.createdBy,
            createdAt: now,
            updatedAt: now,
            metadata: params.metadata ?? {}
        };
    }
    /**
     * Creates a configuration from existing data
     */
    static fromData(data) {
        const now = new Date();
        return {
            description: '',
            version: '1.0.0',
            themes: this.createDefaultThemeSettings(),
            aiSettings: this.createDefaultAISettings(),
            outputSettings: this.createDefaultOutputSettings(),
            parserSettings: this.createDefaultParserSettings(),
            securitySettings: this.createDefaultSecuritySettings(),
            performanceSettings: this.createDefaultPerformanceSettings(),
            integrationSettings: this.createDefaultIntegrationSettings(),
            userPreferences: this.createDefaultUserPreferences(),
            environmentConfigs: [],
            createdAt: now,
            updatedAt: now,
            metadata: {},
            ...data
        };
    }
    /**
     * Updates an existing configuration
     */
    static update(config, updates) {
        return {
            ...config,
            ...updates,
            updatedAt: new Date(),
            // Deep merge nested objects
            themes: updates.themes ? { ...config.themes, ...updates.themes } : config.themes,
            aiSettings: updates.aiSettings ? { ...config.aiSettings, ...updates.aiSettings } : config.aiSettings,
            outputSettings: updates.outputSettings ? { ...config.outputSettings, ...updates.outputSettings } : config.outputSettings,
            parserSettings: updates.parserSettings ? { ...config.parserSettings, ...updates.parserSettings } : config.parserSettings,
            securitySettings: updates.securitySettings ? { ...config.securitySettings, ...updates.securitySettings } : config.securitySettings,
            performanceSettings: updates.performanceSettings ? { ...config.performanceSettings, ...updates.performanceSettings } : config.performanceSettings,
            integrationSettings: updates.integrationSettings ? { ...config.integrationSettings, ...updates.integrationSettings } : config.integrationSettings,
            userPreferences: updates.userPreferences ? { ...config.userPreferences, ...updates.userPreferences } : config.userPreferences,
            metadata: updates.metadata ? { ...config.metadata, ...updates.metadata } : config.metadata
        };
    }
    /**
     * Creates a development configuration
     */
    static createDevelopmentConfig(projectId, createdBy) {
        return this.create({
            name: 'Development Configuration',
            description: 'Configuration optimized for development environment',
            environment: Environment.DEVELOPMENT,
            projectId,
            createdBy,
            securitySettings: {
                accessControl: AccessControlMode.PUBLIC,
                securityLevel: SecurityLevel.LOW
            },
            performanceSettings: {
                caching: {
                    enabled: false,
                    strategy: 'memory',
                    ttl: 300,
                    maxSize: 10 * 1024 * 1024,
                    compression: false
                },
                monitoring: {
                    enabled: true,
                    metricsInterval: 60,
                    alertThresholds: {
                        memoryUsage: 90,
                        cpuUsage: 90,
                        responseTime: 10000
                    }
                }
            }
        });
    }
    /**
     * Creates a production configuration
     */
    static createProductionConfig(projectId, createdBy) {
        return this.create({
            name: 'Production Configuration',
            description: 'Configuration optimized for production environment',
            environment: Environment.PRODUCTION,
            projectId,
            createdBy,
            securitySettings: {
                accessControl: AccessControlMode.AUTHENTICATED,
                securityLevel: SecurityLevel.HIGH
            },
            performanceSettings: {
                caching: {
                    enabled: true,
                    strategy: 'hybrid',
                    ttl: 3600,
                    maxSize: 200 * 1024 * 1024,
                    compression: true
                },
                monitoring: {
                    enabled: true,
                    metricsInterval: 30,
                    alertThresholds: {
                        memoryUsage: 80,
                        cpuUsage: 75,
                        responseTime: 2000
                    }
                },
                optimization: {
                    lazyLoading: true,
                    incrementalBuilds: true,
                    treeshaking: true,
                    bundling: true
                }
            }
        });
    }
    static generateConfigurationId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `config_${timestamp}_${random}`;
    }
    static createDefaultThemeSettings(overrides) {
        return {
            defaultTheme: 'default',
            supportedThemes: ['default', 'dark', 'light'],
            customThemes: {},
            responsive: true,
            darkModeSupport: true,
            highContrastSupport: true,
            brandingOptions: {},
            ...overrides
        };
    }
    static createDefaultAISettings(overrides) {
        return {
            enabled: true,
            provider: 'openai',
            model: 'gpt-4',
            maxTokens: 4000,
            temperature: 0.3,
            timeout: 30000,
            retryCount: 3,
            batchSize: 10,
            enableReview: true,
            autoApprove: false,
            qualityThreshold: 0.8,
            costLimits: {},
            customPrompts: {},
            ...overrides
        };
    }
    static createDefaultOutputSettings(overrides) {
        return {
            formats: ['html', 'markdown'],
            defaultFormat: 'html',
            outputDirectory: './docs',
            fileNaming: {
                pattern: '{name}-{version}',
                includeVersion: true,
                includeTimestamp: false,
                sanitizeNames: true
            },
            compression: {
                enabled: false,
                algorithm: 'gzip',
                level: 6
            },
            minification: {
                html: false,
                css: false,
                javascript: false,
                json: false
            },
            assets: {
                includeAssets: true,
                assetDirectory: './assets',
                optimizeImages: false,
                generateThumbnails: false
            },
            metadata: {
                includeMetadata: true,
                includeTimestamps: true,
                includeVersions: true,
                customFields: {}
            },
            ...overrides
        };
    }
    static createDefaultParserSettings(overrides) {
        return {
            openApi: {
                validateSpec: true,
                resolveReferences: true,
                includeExamples: true,
                includeDeprecated: true,
                customExtensions: []
            },
            jsDoc: {
                includePrivate: false,
                includeInherited: true,
                includeSource: false,
                customTags: [],
                typeScriptSupport: true
            },
            python: {
                includePrivate: false,
                parseTypeHints: true,
                includeDocTests: true,
                followImports: true,
                customDecorators: []
            },
            go: {
                includeUnexported: false,
                includeTests: false,
                includeExamples: true,
                customBuildTags: []
            },
            java: {
                includePrivate: false,
                includePackagePrivate: false,
                includeAnnotations: true,
                customAnnotations: []
            },
            common: {
                encoding: 'utf-8',
                maxFileSize: 10 * 1024 * 1024, // 10MB
                timeout: 30000,
                concurrent: true,
                maxConcurrency: 4
            },
            ...overrides
        };
    }
    static createDefaultSecuritySettings(overrides) {
        return {
            accessControl: AccessControlMode.PUBLIC,
            securityLevel: SecurityLevel.MEDIUM,
            authentication: {
                required: false,
                provider: 'oauth',
                allowedUsers: [],
                allowedRoles: [],
                sessionTimeout: 3600
            },
            privacy: {
                anonymizeData: false,
                excludePatterns: [],
                sensitiveFields: [],
                dataRetention: 365
            },
            encryption: {
                encryptAtRest: false,
                encryptInTransit: true,
                algorithm: 'AES-256',
                keyRotation: false,
                enabled: true
            },
            audit: {
                enableAuditLog: false,
                auditLevel: LogLevel.INFO,
                retentionPeriod: 90,
                includeUserActions: true
            },
            compliance: {
                gdprCompliant: false,
                hipaaCompliant: false,
                soxCompliant: false,
                customCompliance: []
            },
            ...overrides
        };
    }
    static createDefaultPerformanceSettings(overrides) {
        return {
            caching: {
                enabled: true,
                strategy: 'memory',
                ttl: 3600,
                maxSize: 100 * 1024 * 1024, // 100MB
                compression: true
            },
            parallelization: {
                enabled: true,
                maxWorkers: 4,
                chunkSize: 1000,
                queueSize: 10000
            },
            optimization: {
                lazyLoading: false,
                incrementalBuilds: false,
                treeshaking: false,
                bundling: false
            },
            monitoring: {
                enabled: false,
                metricsInterval: 60,
                alertThresholds: {
                    memoryUsage: 85,
                    cpuUsage: 80,
                    responseTime: 5000
                }
            },
            limits: {
                maxMemoryUsage: 512 * 1024 * 1024, // 512MB
                maxExecutionTime: 300, // 5 minutes
                maxFileSize: 50 * 1024 * 1024, // 50MB
                maxConcurrentJobs: 10
            },
            ...overrides
        };
    }
    static createDefaultIntegrationSettings(overrides) {
        return {
            cicd: {
                enabled: false,
                platform: CIPlatform.GITHUB_ACTIONS,
                configuration: {},
                triggers: [],
                notifications: {}
            },
            versionControl: {
                provider: 'git',
                repository: '',
                branch: 'main',
                autoCommit: false,
                commitMessage: 'Update documentation'
            },
            deployment: {
                enabled: false,
                targets: [],
                staging: false,
                rollback: false
            },
            external: {
                apis: {},
                webhooks: []
            },
            ...overrides
        };
    }
    static createDefaultUserPreferences(overrides) {
        return {
            interface: {
                language: 'en',
                timezone: 'UTC',
                dateFormat: 'YYYY-MM-DD',
                timeFormat: 'HH:mm:ss',
                theme: 'default'
            },
            editor: {
                fontSize: 14,
                fontFamily: 'Monaco, monospace',
                tabSize: 2,
                wordWrap: true,
                showLineNumbers: true,
                syntax: 'auto'
            },
            notifications: {
                email: true,
                push: false,
                desktop: false,
                frequency: 'daily'
            },
            shortcuts: {},
            customization: {},
            ...overrides
        };
    }
}
exports.ConfigurationFactory = ConfigurationFactory;
/**
 * Utility functions for working with configurations
 */
class ConfigurationUtils {
    /**
     * Validates a configuration
     */
    static validate(config) {
        const errors = [];
        const warnings = [];
        const suggestions = [];
        const securityIssues = [];
        const performanceIssues = [];
        // Basic validation
        if (!config.name.trim()) {
            errors.push('Configuration name is required');
        }
        if (!config.projectId.trim()) {
            errors.push('Project ID is required');
        }
        // AI settings validation
        if (config.aiSettings.enabled) {
            if (!config.aiSettings.apiKey && config.aiSettings.provider !== 'local') {
                warnings.push('AI is enabled but no API key provided');
            }
            if (config.aiSettings.maxTokens < 100) {
                warnings.push('AI max tokens is very low');
            }
            if (config.aiSettings.temperature < 0 || config.aiSettings.temperature > 2) {
                errors.push('AI temperature must be between 0 and 2');
            }
        }
        // Security validation
        if (config.securitySettings.securityLevel === SecurityLevel.HIGH) {
            if (!config.securitySettings.authentication.required) {
                securityIssues.push('High security level requires authentication');
            }
            if (!config.securitySettings.encryption.encryptAtRest) {
                securityIssues.push('High security level recommends encryption at rest');
            }
        }
        if (config.securitySettings.accessControl === AccessControlMode.PUBLIC &&
            config.environment === Environment.PRODUCTION) {
            securityIssues.push('Public access in production environment may be a security risk');
        }
        // Performance validation
        if (config.performanceSettings.limits.maxMemoryUsage < 64 * 1024 * 1024) {
            performanceIssues.push('Memory limit is very low (< 64MB)');
        }
        if (!config.performanceSettings.caching.enabled && config.environment === Environment.PRODUCTION) {
            performanceIssues.push('Caching disabled in production may impact performance');
        }
        // Suggestions
        if (config.environment === Environment.PRODUCTION) {
            if (!config.performanceSettings.optimization.bundling) {
                suggestions.push('Consider enabling bundling for production');
            }
            if (!config.outputSettings.compression.enabled) {
                suggestions.push('Consider enabling compression for production');
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            suggestions,
            securityIssues,
            performanceIssues
        };
    }
    /**
     * Merges configurations with environment overrides
     */
    static mergeWithEnvironment(base, envConfig) {
        return {
            ...base,
            environment: envConfig.environment,
            ...envConfig.overrides
        };
    }
    /**
     * Gets configuration by environment
     */
    static getByEnvironment(configs, environment) {
        return configs.filter(config => config.environment === environment);
    }
    /**
     * Finds configuration by project
     */
    static findByProject(configs, projectId) {
        return configs.filter(config => config.projectId === projectId);
    }
    /**
     * Checks if configuration is secure
     */
    static isSecure(config) {
        const validation = this.validate(config);
        return validation.securityIssues.length === 0;
    }
    /**
     * Checks if configuration is optimized
     */
    static isOptimized(config) {
        const validation = this.validate(config);
        return validation.performanceIssues.length === 0;
    }
    /**
     * Creates a configuration summary
     */
    static createSummary(config) {
        const validation = this.validate(config);
        return {
            id: config.id,
            name: config.name,
            environment: config.environment,
            securityLevel: config.securitySettings.securityLevel,
            isValid: validation.isValid,
            isSecure: validation.securityIssues.length === 0,
            isOptimized: validation.performanceIssues.length === 0,
            lastUpdated: config.updatedAt
        };
    }
}
exports.ConfigurationUtils = ConfigurationUtils;
/**
 * Predefined configuration presets
 */
class ConfigurationPresets {
    /**
     * Basic configuration for simple projects
     */
    static basic(projectId, createdBy) {
        return ConfigurationFactory.create({
            name: 'Basic Configuration',
            description: 'Simple configuration for basic documentation needs',
            environment: Environment.DEVELOPMENT,
            projectId,
            createdBy,
            aiSettings: { enabled: false },
            securitySettings: { accessControl: AccessControlMode.PUBLIC },
            performanceSettings: {
                caching: {
                    enabled: false,
                    strategy: 'memory',
                    ttl: 300,
                    maxSize: 10 * 1024 * 1024,
                    compression: false
                }
            }
        });
    }
    /**
     * Enterprise configuration with security and performance features
     */
    static enterprise(projectId, createdBy) {
        return ConfigurationFactory.create({
            name: 'Enterprise Configuration',
            description: 'Full-featured configuration for enterprise environments',
            environment: Environment.PRODUCTION,
            projectId,
            createdBy,
            securitySettings: {
                accessControl: AccessControlMode.AUTHENTICATED,
                securityLevel: SecurityLevel.HIGH,
                encryption: {
                    encryptAtRest: true,
                    encryptInTransit: true,
                    algorithm: 'AES-256',
                    keyRotation: true
                },
                audit: {
                    enableAuditLog: true,
                    auditLevel: LogLevel.INFO,
                    retentionPeriod: 365,
                    includeUserActions: true
                }
            },
            performanceSettings: {
                caching: {
                    enabled: true,
                    strategy: 'distributed',
                    ttl: 7200,
                    maxSize: 500 * 1024 * 1024,
                    compression: true
                },
                optimization: {
                    lazyLoading: true,
                    incrementalBuilds: true,
                    treeshaking: true,
                    bundling: true
                }
            }
        });
    }
    /**
     * Open source configuration for public projects
     */
    static openSource(projectId, createdBy) {
        return ConfigurationFactory.create({
            name: 'Open Source Configuration',
            description: 'Configuration optimized for open source projects',
            environment: Environment.PRODUCTION,
            projectId,
            createdBy,
            securitySettings: { accessControl: AccessControlMode.PUBLIC },
            integrationSettings: {
                cicd: {
                    enabled: true,
                    platform: CIPlatform.GITHUB_ACTIONS,
                    configuration: {},
                    triggers: ['push', 'pull_request'],
                    notifications: {}
                }
            }
        });
    }
}
exports.ConfigurationPresets = ConfigurationPresets;
//# sourceMappingURL=configuration.js.map