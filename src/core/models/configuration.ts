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
export enum Environment {
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  STAGING = 'staging',
  PRODUCTION = 'production',
  LOCAL = 'local'
}

/**
 * Log level enumeration
 */
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

/**
 * Security level enumeration
 */
export enum SecurityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Access control mode enumeration
 */
export enum AccessControlMode {
  PUBLIC = 'public',
  PRIVATE = 'private',
  RESTRICTED = 'restricted',
  AUTHENTICATED = 'authenticated'
}

/**
 * CI/CD platform enumeration
 */
export enum CIPlatform {
  GITHUB_ACTIONS = 'github-actions',
  GITLAB_CI = 'gitlab-ci',
  JENKINS = 'jenkins',
  AZURE_DEVOPS = 'azure-devops',
  CIRCLECI = 'circleci',
  TRAVIS_CI = 'travis-ci',
  CUSTOM = 'custom'
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
    readonly dataRetention: number; // days
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
    readonly retentionPeriod: number; // days
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
    readonly ttl: number; // seconds
    readonly maxSize: number; // bytes
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
    readonly metricsInterval: number; // seconds
    readonly alertThresholds: {
      readonly memoryUsage: number; // percentage
      readonly cpuUsage: number; // percentage
      readonly responseTime: number; // milliseconds
    };
  };
  readonly limits: {
    readonly maxMemoryUsage: number; // bytes
    readonly maxExecutionTime: number; // seconds
    readonly maxFileSize: number; // bytes
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
  
  // Core settings
  readonly themes: ThemeSettings;
  readonly aiSettings: AISettings;
  readonly outputSettings: OutputSettings;
  readonly parserSettings: ParserSettings;
  readonly securitySettings: SecuritySettings;
  readonly performanceSettings: PerformanceSettings;
  readonly integrationSettings: IntegrationSettings;
  
  // User and environment settings
  readonly userPreferences: UserPreferences;
  readonly environmentConfigs: readonly EnvironmentConfig[];
  
  // Metadata
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
export class ConfigurationFactory {
  /**
   * Creates a new configuration
   */
  static create(params: CreateConfigurationParams): Configuration {
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
  static fromData(data: Partial<Configuration> & { 
    id: string; 
    name: string; 
    environment: Environment; 
    projectId: string; 
    createdBy: string; 
  }): Configuration {
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
  static update(config: Configuration, updates: UpdateConfigurationParams): Configuration {
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
  static createDevelopmentConfig(projectId: string, createdBy: string): Configuration {
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
  static createProductionConfig(projectId: string, createdBy: string): Configuration {
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

  private static generateConfigurationId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `config_${timestamp}_${random}`;
  }

  private static createDefaultThemeSettings(overrides?: Partial<ThemeSettings>): ThemeSettings {
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

  private static createDefaultAISettings(overrides?: Partial<AISettings>): AISettings {
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

  private static createDefaultOutputSettings(overrides?: Partial<OutputSettings>): OutputSettings {
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

  private static createDefaultParserSettings(overrides?: Partial<ParserSettings>): ParserSettings {
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

  private static createDefaultSecuritySettings(overrides?: Partial<SecuritySettings>): SecuritySettings {
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

  private static createDefaultPerformanceSettings(overrides?: Partial<PerformanceSettings>): PerformanceSettings {
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

  private static createDefaultIntegrationSettings(overrides?: Partial<IntegrationSettings>): IntegrationSettings {
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

  private static createDefaultUserPreferences(overrides?: Partial<UserPreferences>): UserPreferences {
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

/**
 * Utility functions for working with configurations
 */
export class ConfigurationUtils {
  /**
   * Validates a configuration
   */
  static validate(config: Configuration): ConfigurationValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    const securityIssues: string[] = [];
    const performanceIssues: string[] = [];

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
  static mergeWithEnvironment(base: Configuration, envConfig: EnvironmentConfig): Configuration {
    return {
      ...base,
      environment: envConfig.environment,
      ...envConfig.overrides
    };
  }

  /**
   * Gets configuration by environment
   */
  static getByEnvironment(configs: Configuration[], environment: Environment): Configuration[] {
    return configs.filter(config => config.environment === environment);
  }

  /**
   * Finds configuration by project
   */
  static findByProject(configs: Configuration[], projectId: string): Configuration[] {
    return configs.filter(config => config.projectId === projectId);
  }

  /**
   * Checks if configuration is secure
   */
  static isSecure(config: Configuration): boolean {
    const validation = this.validate(config);
    return validation.securityIssues.length === 0;
  }

  /**
   * Checks if configuration is optimized
   */
  static isOptimized(config: Configuration): boolean {
    const validation = this.validate(config);
    return validation.performanceIssues.length === 0;
  }

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
  } {
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

/**
 * Predefined configuration presets
 */
export class ConfigurationPresets {
  /**
   * Basic configuration for simple projects
   */
  static basic(projectId: string, createdBy: string): Configuration {
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
  static enterprise(projectId: string, createdBy: string): Configuration {
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
  static openSource(projectId: string, createdBy: string): Configuration {
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