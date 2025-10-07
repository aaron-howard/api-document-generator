/**
 * Configuration Model
 *
 * Represents project-wide configuration settings including global settings,
 * environment-specific configurations, user preferences, and security settings.
 *
 * @packageDocumentation
 */
/**
 * Environment type enumeration
 */
export declare enum Environment {
    DEVELOPMENT = "development",
    TESTING = "testing",
    STAGING = "staging",
    PRODUCTION = "production",
    LOCAL = "local"
}
/**
 * Log level enumeration
 */
export declare enum LogLevel {
    TRACE = "trace",
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal"
}
/**
 * Security level enumeration
 */
export declare enum SecurityLevel {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
/**
 * Access control mode enumeration
 */
export declare enum AccessControlMode {
    PUBLIC = "public",
    PRIVATE = "private",
    RESTRICTED = "restricted",
    AUTHENTICATED = "authenticated"
}
/**
 * CI/CD platform enumeration
 */
export declare enum CIPlatform {
    GITHUB_ACTIONS = "github-actions",
    GITLAB_CI = "gitlab-ci",
    JENKINS = "jenkins",
    AZURE_DEVOPS = "azure-devops",
    CIRCLECI = "circleci",
    TRAVIS_CI = "travis-ci",
    CUSTOM = "custom"
}
/**
 * Theme and styling configuration
 */
export interface ThemeSettings {
    readonly defaultTheme: string;
    readonly supportedThemes: readonly string[];
    readonly customThemes: Record<string, any>;
    readonly responsive: boolean;
    readonly darkModeSupport: boolean;
    readonly highContrastSupport: boolean;
    readonly customCSS?: string;
    readonly brandingOptions: {
        readonly logo?: string;
        readonly favicon?: string;
        readonly companyName?: string;
        readonly primaryColor?: string;
        readonly secondaryColor?: string;
    };
}
/**
 * AI summarization configuration
 */
export interface AISettings {
    readonly enabled: boolean;
    readonly provider: 'openai' | 'anthropic' | 'azure' | 'local' | 'custom';
    readonly model: string;
    readonly apiKey?: string;
    readonly apiEndpoint?: string;
    readonly maxTokens: number;
    readonly temperature: number;
    readonly timeout: number;
    readonly retryCount: number;
    readonly batchSize: number;
    readonly enableReview: boolean;
    readonly autoApprove: boolean;
    readonly qualityThreshold: number;
    readonly fallbackProvider?: string;
    readonly costLimits: {
        readonly dailyLimit?: number;
        readonly monthlyLimit?: number;
        readonly perRequestLimit?: number;
    };
    readonly customPrompts: Record<string, string>;
}
/**
 * Output format specific settings
 */
export interface OutputSettings {
    readonly formats: readonly string[];
    readonly defaultFormat: string;
    readonly outputDirectory: string;
    readonly fileNaming: {
        readonly pattern: string;
        readonly includeVersion: boolean;
        readonly includeTimestamp: boolean;
        readonly sanitizeNames: boolean;
    };
    readonly compression: {
        readonly enabled: boolean;
        readonly algorithm: 'gzip' | 'deflate' | 'brotli';
        readonly level: number;
    };
    readonly minification: {
        readonly html: boolean;
        readonly css: boolean;
        readonly javascript: boolean;
        readonly json: boolean;
    };
    readonly assets: {
        readonly includeAssets: boolean;
        readonly assetDirectory: string;
        readonly optimizeImages: boolean;
        readonly generateThumbnails: boolean;
    };
    readonly metadata: {
        readonly includeMetadata: boolean;
        readonly includeTimestamps: boolean;
        readonly includeVersions: boolean;
        readonly customFields: Record<string, any>;
    };
}
/**
 * Parser-specific configurations
 */
export interface ParserSettings {
    readonly openApi: {
        readonly validateSpec: boolean;
        readonly resolveReferences: boolean;
        readonly includeExamples: boolean;
        readonly includeDeprecated: boolean;
        readonly customExtensions: readonly string[];
    };
    readonly jsDoc: {
        readonly includePrivate: boolean;
        readonly includeInherited: boolean;
        readonly includeSource: boolean;
        readonly customTags: readonly string[];
        readonly typeScriptSupport: boolean;
    };
    readonly python: {
        readonly includePrivate: boolean;
        readonly parseTypeHints: boolean;
        readonly includeDocTests: boolean;
        readonly followImports: boolean;
        readonly customDecorators: readonly string[];
    };
    readonly go: {
        readonly includeUnexported: boolean;
        readonly includeTests: boolean;
        readonly includeExamples: boolean;
        readonly customBuildTags: readonly string[];
    };
    readonly java: {
        readonly includePrivate: boolean;
        readonly includePackagePrivate: boolean;
        readonly includeAnnotations: boolean;
        readonly customAnnotations: readonly string[];
    };
    readonly common: {
        readonly encoding: string;
        readonly maxFileSize: number;
        readonly timeout: number;
        readonly concurrent: boolean;
        readonly maxConcurrency: number;
    };
}
/**
 * Access control and privacy settings
 */
export interface SecuritySettings {
    readonly accessControl: AccessControlMode;
    readonly securityLevel: SecurityLevel;
    readonly authentication: {
        readonly required: boolean;
        readonly provider: 'oauth' | 'basic' | 'token' | 'custom';
        readonly allowedUsers: readonly string[];
        readonly allowedRoles: readonly string[];
        readonly sessionTimeout: number;
    };
    readonly privacy: {
        readonly anonymizeData: boolean;
        readonly excludePatterns: readonly string[];
        readonly sensitiveFields: readonly string[];
        readonly dataRetention: number;
    };
    readonly encryption: {
        readonly encryptAtRest: boolean;
        readonly encryptInTransit: boolean;
        readonly algorithm: string;
        readonly keyRotation: boolean;
        /** Added for runtime feature gating */
        readonly enabled?: boolean;
    };
    readonly audit: {
        readonly enableAuditLog: boolean;
        readonly auditLevel: LogLevel;
        readonly retentionPeriod: number;
        readonly includeUserActions: boolean;
    };
    readonly compliance: {
        readonly gdprCompliant: boolean;
        readonly hipaaCompliant: boolean;
        readonly soxCompliant: boolean;
        readonly customCompliance: readonly string[];
    };
}
/**
 * Caching and performance tuning settings
 */
export interface PerformanceSettings {
    readonly caching: {
        readonly enabled: boolean;
        readonly strategy: 'memory' | 'disk' | 'distributed' | 'hybrid';
        readonly ttl: number;
        readonly maxSize: number;
        readonly compression: boolean;
    };
    readonly parallelization: {
        readonly enabled: boolean;
        readonly maxWorkers: number;
        readonly chunkSize: number;
        readonly queueSize: number;
    };
    readonly optimization: {
        readonly lazyLoading: boolean;
        readonly incrementalBuilds: boolean;
        readonly treeshaking: boolean;
        readonly bundling: boolean;
    };
    readonly monitoring: {
        readonly enabled: boolean;
        readonly metricsInterval: number;
        readonly alertThresholds: {
            readonly memoryUsage: number;
            readonly cpuUsage: number;
            readonly responseTime: number;
        };
    };
    readonly limits: {
        readonly maxMemoryUsage: number;
        readonly maxExecutionTime: number;
        readonly maxFileSize: number;
        readonly maxConcurrentJobs: number;
    };
}
/**
 * CI/CD and external tool configuration
 */
export interface IntegrationSettings {
    readonly cicd: {
        readonly enabled: boolean;
        readonly platform: CIPlatform;
        readonly configuration: Record<string, any>;
        readonly triggers: readonly string[];
        readonly notifications: {
            readonly slack?: string;
            readonly email?: readonly string[];
            readonly webhook?: string;
        };
    };
    readonly versionControl: {
        readonly provider: 'git' | 'svn' | 'mercurial';
        readonly repository: string;
        readonly branch: string;
        readonly autoCommit: boolean;
        readonly commitMessage: string;
    };
    readonly deployment: {
        readonly enabled: boolean;
        readonly targets: readonly {
            readonly name: string;
            readonly type: 'static' | 'server' | 'cdn' | 'custom';
            readonly endpoint: string;
            readonly credentials?: Record<string, string>;
        }[];
        readonly staging: boolean;
        readonly rollback: boolean;
    };
    readonly external: {
        readonly apis: Record<string, {
            readonly endpoint: string;
            readonly apiKey?: string;
            readonly timeout: number;
            readonly retries: number;
        }>;
        readonly webhooks: readonly {
            readonly name: string;
            readonly url: string;
            readonly events: readonly string[];
            readonly secret?: string;
        }[];
    };
}
/**
 * User preferences configuration
 */
export interface UserPreferences {
    readonly interface: {
        readonly language: string;
        readonly timezone: string;
        readonly dateFormat: string;
        readonly timeFormat: string;
        readonly theme: string;
    };
    readonly editor: {
        readonly fontSize: number;
        readonly fontFamily: string;
        readonly tabSize: number;
        readonly wordWrap: boolean;
        readonly showLineNumbers: boolean;
        readonly syntax: string;
    };
    readonly notifications: {
        readonly email: boolean;
        readonly push: boolean;
        readonly desktop: boolean;
        readonly frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
    };
    readonly shortcuts: Record<string, string>;
    readonly customization: Record<string, any>;
}
/**
 * Environment-specific configuration overlay
 */
export interface EnvironmentConfig {
    readonly environment: Environment;
    readonly overrides: Partial<Configuration>;
    readonly variables: Record<string, string>;
    readonly features: {
        readonly enabled: readonly string[];
        readonly disabled: readonly string[];
        readonly experimental: readonly string[];
    };
    readonly debug: {
        readonly enabled: boolean;
        readonly level: LogLevel;
        readonly verbose: boolean;
        readonly profiling: boolean;
    };
}
/**
 * Main configuration interface
 */
export interface Configuration {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly version: string;
    readonly environment: Environment;
    readonly themes: ThemeSettings;
    readonly aiSettings: AISettings;
    readonly outputSettings: OutputSettings;
    readonly parserSettings: ParserSettings;
    readonly securitySettings: SecuritySettings;
    readonly performanceSettings: PerformanceSettings;
    readonly integrationSettings: IntegrationSettings;
    readonly userPreferences: UserPreferences;
    readonly environmentConfigs: readonly EnvironmentConfig[];
    readonly projectId: string;
    readonly createdBy: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly metadata: Record<string, any>;
}
/**
 * Configuration creation parameters
 */
export interface CreateConfigurationParams {
    readonly name: string;
    readonly description: string;
    readonly environment: Environment;
    readonly projectId: string;
    readonly createdBy: string;
    readonly themes?: Partial<ThemeSettings>;
    readonly aiSettings?: Partial<AISettings>;
    readonly outputSettings?: Partial<OutputSettings>;
    readonly parserSettings?: Partial<ParserSettings>;
    readonly securitySettings?: Partial<SecuritySettings>;
    readonly performanceSettings?: Partial<PerformanceSettings>;
    readonly integrationSettings?: Partial<IntegrationSettings>;
    readonly userPreferences?: Partial<UserPreferences>;
    readonly metadata?: Record<string, any>;
}
/**
 * Configuration update parameters
 */
export interface UpdateConfigurationParams {
    readonly name?: string;
    readonly description?: string;
    readonly version?: string;
    readonly environment?: Environment;
    readonly themes?: Partial<ThemeSettings>;
    readonly aiSettings?: Partial<AISettings>;
    readonly outputSettings?: Partial<OutputSettings>;
    readonly parserSettings?: Partial<ParserSettings>;
    readonly securitySettings?: Partial<SecuritySettings>;
    readonly performanceSettings?: Partial<PerformanceSettings>;
    readonly integrationSettings?: Partial<IntegrationSettings>;
    readonly userPreferences?: Partial<UserPreferences>;
    readonly environmentConfigs?: readonly EnvironmentConfig[];
    readonly metadata?: Record<string, any>;
}
/**
 * Configuration validation result
 */
export interface ConfigurationValidationResult {
    readonly isValid: boolean;
    readonly errors: readonly string[];
    readonly warnings: readonly string[];
    readonly suggestions: readonly string[];
    readonly securityIssues: readonly string[];
    readonly performanceIssues: readonly string[];
}
/**
 * Factory for creating Configuration instances
 */
export declare class ConfigurationFactory {
    /**
     * Creates a new configuration
     */
    static create(params: CreateConfigurationParams): Configuration;
    /**
     * Creates a configuration from existing data
     */
    static fromData(data: Partial<Configuration> & {
        id: string;
        name: string;
        environment: Environment;
        projectId: string;
        createdBy: string;
    }): Configuration;
    /**
     * Updates an existing configuration
     */
    static update(config: Configuration, updates: UpdateConfigurationParams): Configuration;
    /**
     * Creates a development configuration
     */
    static createDevelopmentConfig(projectId: string, createdBy: string): Configuration;
    /**
     * Creates a production configuration
     */
    static createProductionConfig(projectId: string, createdBy: string): Configuration;
    private static generateConfigurationId;
    private static createDefaultThemeSettings;
    private static createDefaultAISettings;
    private static createDefaultOutputSettings;
    private static createDefaultParserSettings;
    private static createDefaultSecuritySettings;
    private static createDefaultPerformanceSettings;
    private static createDefaultIntegrationSettings;
    private static createDefaultUserPreferences;
}
/**
 * Utility functions for working with configurations
 */
export declare class ConfigurationUtils {
    /**
     * Validates a configuration
     */
    static validate(config: Configuration): ConfigurationValidationResult;
    /**
     * Merges configurations with environment overrides
     */
    static mergeWithEnvironment(base: Configuration, envConfig: EnvironmentConfig): Configuration;
    /**
     * Gets configuration by environment
     */
    static getByEnvironment(configs: Configuration[], environment: Environment): Configuration[];
    /**
     * Finds configuration by project
     */
    static findByProject(configs: Configuration[], projectId: string): Configuration[];
    /**
     * Checks if configuration is secure
     */
    static isSecure(config: Configuration): boolean;
    /**
     * Checks if configuration is optimized
     */
    static isOptimized(config: Configuration): boolean;
    /**
     * Creates a configuration summary
     */
    static createSummary(config: Configuration): {
        id: string;
        name: string;
        environment: Environment;
        securityLevel: SecurityLevel;
        isValid: boolean;
        isSecure: boolean;
        isOptimized: boolean;
        lastUpdated: Date;
    };
}
/**
 * Predefined configuration presets
 */
export declare class ConfigurationPresets {
    /**
     * Basic configuration for simple projects
     */
    static basic(projectId: string, createdBy: string): Configuration;
    /**
     * Enterprise configuration with security and performance features
     */
    static enterprise(projectId: string, createdBy: string): Configuration;
    /**
     * Open source configuration for public projects
     */
    static openSource(projectId: string, createdBy: string): Configuration;
}
//# sourceMappingURL=configuration.d.ts.map