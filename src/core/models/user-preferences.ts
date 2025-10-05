/**
 * User Preferences Model
 * 
 * Comprehensive user preference management system for the API Documentation Generator.
 * Handles user-specific settings, theme preferences, AI configuration, CLI preferences,
 * and customization options with validation, synchronization, and backup capabilities.
 */

/**
 * User preference categories
 */
export enum PreferenceCategory {
  INTERFACE = 'interface',
  EDITOR = 'editor',
  AI = 'ai',
  CLI = 'cli',
  NOTIFICATIONS = 'notifications',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  ACCESSIBILITY = 'accessibility',
  INTEGRATION = 'integration',
  CUSTOM = 'custom'
}

/**
 * Theme variants supported by the application
 */
export enum ThemeVariant {
  LIGHT = 'light',
  DARK = 'dark',
  HIGH_CONTRAST = 'high-contrast',
  AUTO = 'auto',
  CUSTOM = 'custom'
}

/**
 * Language codes for internationalization
 */
export enum LanguageCode {
  EN_US = 'en-US',
  EN_GB = 'en-GB',
  ES_ES = 'es-ES',
  FR_FR = 'fr-FR',
  DE_DE = 'de-DE',
  IT_IT = 'it-IT',
  PT_BR = 'pt-BR',
  RU_RU = 'ru-RU',
  ZH_CN = 'zh-CN',
  ZH_TW = 'zh-TW',
  JA_JP = 'ja-JP',
  KO_KR = 'ko-KR'
}

/**
 * Notification frequency options
 */
export enum NotificationFrequency {
  REALTIME = 'realtime',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  NEVER = 'never'
}

/**
 * AI provider preferences
 */
export enum AIProviderPreference {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  AZURE = 'azure',
  GOOGLE = 'google',
  LOCAL = 'local',
  CUSTOM = 'custom',
  AUTO = 'auto'
}

/**
 * CLI output format preferences
 */
export enum CLIOutputFormat {
  JSON = 'json',
  YAML = 'yaml',
  TABLE = 'table',
  TEXT = 'text',
  MINIMAL = 'minimal'
}

/**
 * Preference sync strategy
 */
export enum SyncStrategy {
  LOCAL_ONLY = 'local-only',
  CLOUD_SYNC = 'cloud-sync',
  MANUAL_EXPORT = 'manual-export',
  TEAM_SHARED = 'team-shared'
}

/**
 * Interface and UI preferences
 */
export interface InterfacePreferences {
  readonly language: LanguageCode;
  readonly timezone: string;
  readonly dateFormat: string;
  readonly timeFormat: string;
  readonly theme: ThemeVariant;
  readonly customThemeId?: string;
  readonly fontSize: number;
  readonly fontFamily: string;
  readonly density: 'compact' | 'normal' | 'spacious';
  readonly animations: boolean;
  readonly reducedMotion: boolean;
  readonly colorblindSupport: boolean;
  readonly highContrast: boolean;
  readonly screenReader: boolean;
  readonly keyboardNavigation: boolean;
  readonly tooltips: boolean;
  readonly breadcrumbs: boolean;
  readonly minimap: boolean;
  readonly sidebarCollapsed: boolean;
  readonly toolbarVisible: boolean;
  readonly statusBarVisible: boolean;
}

/**
 * Code editor preferences
 */
export interface EditorPreferences {
  readonly theme: string;
  readonly fontSize: number;
  readonly fontFamily: string;
  readonly fontWeight: number;
  readonly lineHeight: number;
  readonly tabSize: number;
  readonly insertSpaces: boolean;
  readonly wordWrap: boolean;
  readonly wordWrapColumn: number;
  readonly showLineNumbers: boolean;
  readonly showFoldingControls: boolean;
  readonly showIndentGuides: boolean;
  readonly showWhitespace: boolean;
  readonly highlightCurrentLine: boolean;
  readonly highlightMatchingBrackets: boolean;
  readonly autoCloseBrackets: boolean;
  readonly autoIndent: boolean;
  readonly formatOnSave: boolean;
  readonly formatOnType: boolean;
  readonly trimTrailingWhitespace: boolean;
  readonly insertFinalNewline: boolean;
  readonly syntaxHighlighting: boolean;
  readonly codeCompletion: boolean;
  readonly snippetsEnabled: boolean;
  readonly linting: boolean;
  readonly folding: boolean;
  readonly minimap: boolean;
  readonly rulers: readonly number[];
  readonly customKeybindings: Record<string, string>;
}

/**
 * AI service preferences
 */
export interface AIPreferences {
  readonly enabled: boolean;
  readonly preferredProvider: AIProviderPreference;
  readonly fallbackProvider?: AIProviderPreference;
  readonly autoSummarize: boolean;
  readonly autoEnhance: boolean;
  readonly autoGenerate: boolean;
  readonly reviewRequired: boolean;
  readonly confidenceThreshold: number;
  readonly maxTokens: number;
  readonly temperature: number;
  readonly customPrompts: Record<string, string>;
  readonly languageModels: Record<string, {
    readonly model: string;
    readonly maxTokens: number;
    readonly temperature: number;
    readonly topP?: number;
    readonly frequencyPenalty?: number;
  }>;
  readonly caching: boolean;
  readonly costLimits: {
    readonly daily?: number;
    readonly monthly?: number;
    readonly perRequest?: number;
  };
  readonly privacyMode: boolean;
  readonly dataRetention: number; // days
}

/**
 * CLI tool preferences
 */
export interface CLIPreferences {
  readonly outputFormat: CLIOutputFormat;
  readonly verbosity: 'silent' | 'minimal' | 'normal' | 'verbose' | 'debug';
  readonly colors: boolean;
  readonly progress: boolean;
  readonly confirmations: boolean;
  readonly autoUpdate: boolean;
  readonly telemetry: boolean;
  readonly errorReporting: boolean;
  readonly shortcuts: Record<string, string>;
  readonly aliases: Record<string, string>;
  readonly defaultOptions: Record<string, any>;
  readonly history: {
    readonly enabled: boolean;
    readonly maxEntries: number;
    readonly persistAcrossSessions: boolean;
  };
  readonly completion: {
    readonly enabled: boolean;
    readonly fuzzyMatching: boolean;
    readonly suggestions: boolean;
  };
  readonly workspaces: {
    readonly defaultPath?: string;
    readonly autoDetect: boolean;
    readonly remember: boolean;
  };
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  readonly email: boolean;
  readonly push: boolean;
  readonly desktop: boolean;
  readonly inApp: boolean;
  readonly frequency: NotificationFrequency;
  readonly quiet: {
    readonly enabled: boolean;
    readonly startTime: string;
    readonly endTime: string;
    readonly days: readonly string[];
  };
  readonly categories: {
    readonly errors: boolean;
    readonly warnings: boolean;
    readonly completion: boolean;
    readonly updates: boolean;
    readonly tips: boolean;
    readonly security: boolean;
  };
  readonly channels: {
    readonly email?: string;
    readonly webhook?: string;
    readonly slack?: string;
    readonly teams?: string;
  };
  readonly filters: readonly string[];
  readonly aggregation: boolean;
  readonly priority: 'low' | 'normal' | 'high' | 'critical';
}

/**
 * Security and privacy preferences
 */
export interface SecurityPreferences {
  readonly sessionTimeout: number; // minutes
  readonly autoLock: boolean;
  readonly autoLockDelay: number; // minutes
  readonly rememberLogin: boolean;
  readonly twoFactorAuth: boolean;
  readonly biometricAuth: boolean;
  readonly encryptLocalData: boolean;
  readonly shareUsageData: boolean;
  readonly shareErrorReports: boolean;
  readonly allowTracking: boolean;
  readonly apiKeyStorage: 'local' | 'keychain' | 'encrypted';
  readonly auditLog: boolean;
  readonly accessControl: {
    readonly restrictToWorkspace: boolean;
    readonly allowedIPs: readonly string[];
    readonly blockedIPs: readonly string[];
  };
  readonly dataRetention: {
    readonly logs: number; // days
    readonly cache: number; // days
    readonly history: number; // days
  };
}

/**
 * Performance and optimization preferences
 */
export interface PerformancePreferences {
  readonly caching: boolean;
  readonly cacheTTL: number; // seconds
  readonly maxCacheSize: number; // MB
  readonly parallelism: number;
  readonly maxMemoryUsage: number; // MB
  readonly timeout: number; // seconds
  readonly retryAttempts: number;
  readonly batchSize: number;
  readonly lazyLoading: boolean;
  readonly preloading: boolean;
  readonly compression: boolean;
  readonly optimization: {
    readonly images: boolean;
    readonly minifyOutput: boolean;
    readonly bundleAssets: boolean;
    readonly treeshaking: boolean;
  };
  readonly monitoring: {
    readonly enabled: boolean;
    readonly metrics: boolean;
    readonly profiling: boolean;
    readonly alerting: boolean;
  };
}

/**
 * Accessibility preferences
 */
export interface AccessibilityPreferences {
  readonly screenReader: boolean;
  readonly highContrast: boolean;
  readonly colorblindSupport: boolean;
  readonly reducedMotion: boolean;
  readonly keyboardNavigation: boolean;
  readonly focusIndicators: boolean;
  readonly skipLinks: boolean;
  readonly ariaLabels: boolean;
  readonly alternativeText: boolean;
  readonly captions: boolean;
  readonly transcripts: boolean;
  readonly audioDescriptions: boolean;
  readonly magnification: number;
  readonly contrastRatio: number;
  readonly fontSize: number;
  readonly lineSpacing: number;
  readonly customCSS?: string;
}

/**
 * Integration and plugin preferences
 */
export interface IntegrationPreferences {
  readonly git: {
    readonly enabled: boolean;
    readonly autoCommit: boolean;
    readonly commitMessage: string;
    readonly pushOnGenerate: boolean;
    readonly branch?: string;
  };
  readonly ci: {
    readonly provider?: string;
    readonly autoTrigger: boolean;
    readonly webhook?: string;
    readonly notifications: boolean;
  };
  readonly plugins: {
    readonly enabled: readonly string[];
    readonly autoUpdate: boolean;
    readonly allowThirdParty: boolean;
    readonly sandbox: boolean;
  };
  readonly extensions: {
    readonly vscode: boolean;
    readonly intellij: boolean;
    readonly vim: boolean;
    readonly emacs: boolean;
  };
  readonly webhooks: readonly {
    readonly url: string;
    readonly events: readonly string[];
    readonly secret?: string;
    readonly enabled: boolean;
  }[];
}

/**
 * Custom preference settings
 */
export interface CustomPreferences {
  readonly templates: Record<string, any>;
  readonly macros: Record<string, {
    readonly commands: readonly string[];
    readonly description?: string;
    readonly keybinding?: string;
  }>;
  readonly variables: Record<string, string>;
  readonly scripts: Record<string, {
    readonly content: string;
    readonly language: string;
    readonly description?: string;
  }>;
  readonly bookmarks: readonly {
    readonly name: string;
    readonly path: string;
    readonly type: string;
    readonly description?: string;
  }[];
  readonly profiles: Record<string, Partial<UserPreferences>>;
  readonly experiments: Record<string, boolean>;
}

/**
 * Preference backup and sync metadata
 */
export interface PreferenceMetadata {
  readonly version: string;
  readonly schema: string;
  readonly exported: Date;
  readonly device: string;
  readonly checksum: string;
  readonly encrypted: boolean;
  readonly partial: boolean;
  readonly categories: readonly PreferenceCategory[];
}

/**
 * Main user preferences interface
 */
export interface UserPreferences {
  readonly id: string;
  readonly userId: string;
  readonly profileName: string;
  readonly version: string;
  readonly lastModified: Date;
  readonly syncStrategy: SyncStrategy;
  
  // Core preference categories
  readonly interface: InterfacePreferences;
  readonly editor: EditorPreferences;
  readonly ai: AIPreferences;
  readonly cli: CLIPreferences;
  readonly notifications: NotificationPreferences;
  readonly security: SecurityPreferences;
  readonly performance: PerformancePreferences;
  readonly accessibility: AccessibilityPreferences;
  readonly integration: IntegrationPreferences;
  readonly custom: CustomPreferences;
  
  // Metadata
  readonly metadata: Record<string, any>;
  readonly tags: readonly string[];
  readonly isDefault: boolean;
  readonly isShared: boolean;
  readonly isReadOnly: boolean;
}

/**
 * User preferences creation parameters
 */
export interface CreateUserPreferencesParams {
  readonly userId: string;
  readonly profileName?: string;
  readonly syncStrategy?: SyncStrategy;
  readonly interface?: Partial<InterfacePreferences>;
  readonly editor?: Partial<EditorPreferences>;
  readonly ai?: Partial<AIPreferences>;
  readonly cli?: Partial<CLIPreferences>;
  readonly notifications?: Partial<NotificationPreferences>;
  readonly security?: Partial<SecurityPreferences>;
  readonly performance?: Partial<PerformancePreferences>;
  readonly accessibility?: Partial<AccessibilityPreferences>;
  readonly integration?: Partial<IntegrationPreferences>;
  readonly custom?: Partial<CustomPreferences>;
  readonly metadata?: Record<string, any>;
  readonly tags?: readonly string[];
  readonly isDefault?: boolean;
  readonly isShared?: boolean;
}

/**
 * User preferences update parameters
 */
export interface UpdateUserPreferencesParams {
  readonly profileName?: string;
  readonly syncStrategy?: SyncStrategy;
  readonly interface?: Partial<InterfacePreferences>;
  readonly editor?: Partial<EditorPreferences>;
  readonly ai?: Partial<AIPreferences>;
  readonly cli?: Partial<CLIPreferences>;
  readonly notifications?: Partial<NotificationPreferences>;
  readonly security?: Partial<SecurityPreferences>;
  readonly performance?: Partial<PerformancePreferences>;
  readonly accessibility?: Partial<AccessibilityPreferences>;
  readonly integration?: Partial<IntegrationPreferences>;
  readonly custom?: Partial<CustomPreferences>;
  readonly metadata?: Record<string, any>;
  readonly tags?: readonly string[];
  readonly isDefault?: boolean;
  readonly isShared?: boolean;
  readonly isReadOnly?: boolean;
}

/**
 * Preference validation result
 */
export interface PreferenceValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly suggestions: readonly string[];
  readonly category: PreferenceCategory;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Preference export/import configuration
 */
export interface PreferenceExportConfig {
  readonly categories: readonly PreferenceCategory[];
  readonly includeMetadata: boolean;
  readonly includeCustom: boolean;
  readonly encrypt: boolean;
  readonly compress: boolean;
  readonly format: 'json' | 'yaml' | 'binary';
  readonly filename?: string;
}

/**
 * Preference synchronization status
 */
export interface PreferenceSyncStatus {
  readonly status: 'idle' | 'syncing' | 'success' | 'error' | 'conflict';
  readonly lastSync: Date;
  readonly nextSync?: Date;
  readonly conflicts: readonly {
    readonly category: PreferenceCategory;
    readonly field: string;
    readonly localValue: any;
    readonly remoteValue: any;
    readonly strategy: 'local' | 'remote' | 'merge' | 'manual';
  }[];
  readonly errors: readonly string[];
  readonly progress: number; // 0-100
}

/**
 * Factory for creating UserPreferences instances
 */
export class UserPreferencesFactory {
  /**
   * Creates a new user preferences instance with defaults
   */
  static create(params: CreateUserPreferencesParams): UserPreferences {
    return {
      id: this.generatePreferencesId(),
      userId: params.userId,
      profileName: params.profileName ?? 'Default',
      version: '1.0.0',
      lastModified: new Date(),
      syncStrategy: params.syncStrategy ?? SyncStrategy.LOCAL_ONLY,
      
      interface: this.createDefaultInterfacePreferences(params.interface),
      editor: this.createDefaultEditorPreferences(params.editor),
      ai: this.createDefaultAIPreferences(params.ai),
      cli: this.createDefaultCLIPreferences(params.cli),
      notifications: this.createDefaultNotificationPreferences(params.notifications),
      security: this.createDefaultSecurityPreferences(params.security),
      performance: this.createDefaultPerformancePreferences(params.performance),
      accessibility: this.createDefaultAccessibilityPreferences(params.accessibility),
      integration: this.createDefaultIntegrationPreferences(params.integration),
      custom: this.createDefaultCustomPreferences(params.custom),
      
      metadata: params.metadata ?? {},
      tags: params.tags ?? [],
      isDefault: params.isDefault ?? false,
      isShared: params.isShared ?? false,
      isReadOnly: false
    };
  }

  /**
   * Creates user preferences from existing data
   */
  static fromData(data: Partial<UserPreferences> & { 
    id: string; 
    userId: string; 
  }): UserPreferences {
    return {
      profileName: 'Imported',
      version: '1.0.0',
      lastModified: new Date(),
      syncStrategy: SyncStrategy.LOCAL_ONLY,
      interface: this.createDefaultInterfacePreferences(),
      editor: this.createDefaultEditorPreferences(),
      ai: this.createDefaultAIPreferences(),
      cli: this.createDefaultCLIPreferences(),
      notifications: this.createDefaultNotificationPreferences(),
      security: this.createDefaultSecurityPreferences(),
      performance: this.createDefaultPerformancePreferences(),
      accessibility: this.createDefaultAccessibilityPreferences(),
      integration: this.createDefaultIntegrationPreferences(),
      custom: this.createDefaultCustomPreferences(),
      metadata: {},
      tags: [],
      isDefault: false,
      isShared: false,
      isReadOnly: false,
      ...data
    };
  }

  /**
   * Updates existing user preferences
   */
  static update(preferences: UserPreferences, updates: UpdateUserPreferencesParams): UserPreferences {
    return {
      ...preferences,
      ...updates,
      lastModified: new Date(),
      // Deep merge nested objects
      interface: updates.interface ? { ...preferences.interface, ...updates.interface } : preferences.interface,
      editor: updates.editor ? { ...preferences.editor, ...updates.editor } : preferences.editor,
      ai: updates.ai ? { ...preferences.ai, ...updates.ai } : preferences.ai,
      cli: updates.cli ? { ...preferences.cli, ...updates.cli } : preferences.cli,
      notifications: updates.notifications ? { ...preferences.notifications, ...updates.notifications } : preferences.notifications,
      security: updates.security ? { ...preferences.security, ...updates.security } : preferences.security,
      performance: updates.performance ? { ...preferences.performance, ...updates.performance } : preferences.performance,
      accessibility: updates.accessibility ? { ...preferences.accessibility, ...updates.accessibility } : preferences.accessibility,
      integration: updates.integration ? { ...preferences.integration, ...updates.integration } : preferences.integration,
      custom: updates.custom ? { ...preferences.custom, ...updates.custom } : preferences.custom,
      metadata: updates.metadata ? { ...preferences.metadata, ...updates.metadata } : preferences.metadata,
      tags: updates.tags ?? preferences.tags
    };
  }

  /**
   * Creates a preference profile from a base preferences object
   */
  static createProfile(
    base: UserPreferences, 
    profileName: string, 
    overrides: Partial<UserPreferences>
  ): UserPreferences {
    return {
      ...base,
      ...overrides,
      id: this.generatePreferencesId(),
      profileName,
      lastModified: new Date(),
      isDefault: false
    };
  }

  /**
   * Merges multiple preference objects with conflict resolution
   */
  static merge(
    base: UserPreferences, 
    ...overrides: readonly Partial<UserPreferences>[]
  ): UserPreferences {
    let result = { ...base };
    
    for (const override of overrides) {
      result = this.update(result, override);
    }
    
    return result;
  }

  /**
   * Generates a unique preferences ID
   */
  private static generatePreferencesId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `pref_${timestamp}_${random}`;
  }

  /**
   * Creates default interface preferences
   */
  private static createDefaultInterfacePreferences(overrides?: Partial<InterfacePreferences>): InterfacePreferences {
    // Fallback timezone detection
    const timezone = typeof Intl !== 'undefined' && Intl.DateTimeFormat 
      ? Intl.DateTimeFormat().resolvedOptions().timeZone 
      : 'UTC';
      
    return {
      language: LanguageCode.EN_US,
      timezone,
      dateFormat: 'YYYY-MM-DD',
      timeFormat: 'HH:mm:ss',
      theme: ThemeVariant.AUTO,
      fontSize: 14,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      density: 'normal',
      animations: true,
      reducedMotion: false,
      colorblindSupport: false,
      highContrast: false,
      screenReader: false,
      keyboardNavigation: true,
      tooltips: true,
      breadcrumbs: true,
      minimap: false,
      sidebarCollapsed: false,
      toolbarVisible: true,
      statusBarVisible: true,
      ...overrides
    };
  }

  /**
   * Creates default editor preferences
   */
  private static createDefaultEditorPreferences(overrides?: Partial<EditorPreferences>): EditorPreferences {
    return {
      theme: 'default',
      fontSize: 14,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      fontWeight: 400,
      lineHeight: 1.4,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: true,
      wordWrapColumn: 120,
      showLineNumbers: true,
      showFoldingControls: true,
      showIndentGuides: true,
      showWhitespace: false,
      highlightCurrentLine: true,
      highlightMatchingBrackets: true,
      autoCloseBrackets: true,
      autoIndent: true,
      formatOnSave: true,
      formatOnType: false,
      trimTrailingWhitespace: true,
      insertFinalNewline: true,
      syntaxHighlighting: true,
      codeCompletion: true,
      snippetsEnabled: true,
      linting: true,
      folding: true,
      minimap: false,
      rulers: [80, 120],
      customKeybindings: {},
      ...overrides
    };
  }

  /**
   * Creates default AI preferences
   */
  private static createDefaultAIPreferences(overrides?: Partial<AIPreferences>): AIPreferences {
    return {
      enabled: true,
      preferredProvider: AIProviderPreference.AUTO,
      autoSummarize: true,
      autoEnhance: false,
      autoGenerate: false,
      reviewRequired: true,
      confidenceThreshold: 0.8,
      maxTokens: 4000,
      temperature: 0.3,
      customPrompts: {},
      languageModels: {
        'gpt-4': {
          model: 'gpt-4',
          maxTokens: 4000,
          temperature: 0.3
        }
      },
      caching: true,
      costLimits: {
        daily: 10.0,
        monthly: 100.0,
        perRequest: 1.0
      },
      privacyMode: false,
      dataRetention: 30,
      ...overrides
    };
  }

  /**
   * Creates default CLI preferences
   */
  private static createDefaultCLIPreferences(overrides?: Partial<CLIPreferences>): CLIPreferences {
    return {
      outputFormat: CLIOutputFormat.TEXT,
      verbosity: 'normal',
      colors: true,
      progress: true,
      confirmations: true,
      autoUpdate: false,
      telemetry: false,
      errorReporting: true,
      shortcuts: {},
      aliases: {},
      defaultOptions: {},
      history: {
        enabled: true,
        maxEntries: 1000,
        persistAcrossSessions: true
      },
      completion: {
        enabled: true,
        fuzzyMatching: true,
        suggestions: true
      },
      workspaces: {
        autoDetect: true,
        remember: true
      },
      ...overrides
    };
  }

  /**
   * Creates default notification preferences
   */
  private static createDefaultNotificationPreferences(overrides?: Partial<NotificationPreferences>): NotificationPreferences {
    return {
      email: false,
      push: false,
      desktop: true,
      inApp: true,
      frequency: NotificationFrequency.DAILY,
      quiet: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00',
        days: ['saturday', 'sunday']
      },
      categories: {
        errors: true,
        warnings: true,
        completion: true,
        updates: false,
        tips: false,
        security: true
      },
      channels: {},
      filters: [],
      aggregation: true,
      priority: 'normal',
      ...overrides
    };
  }

  /**
   * Creates default security preferences
   */
  private static createDefaultSecurityPreferences(overrides?: Partial<SecurityPreferences>): SecurityPreferences {
    return {
      sessionTimeout: 480, // 8 hours
      autoLock: false,
      autoLockDelay: 15,
      rememberLogin: false,
      twoFactorAuth: false,
      biometricAuth: false,
      encryptLocalData: true,
      shareUsageData: false,
      shareErrorReports: true,
      allowTracking: false,
      apiKeyStorage: 'keychain',
      auditLog: false,
      accessControl: {
        restrictToWorkspace: false,
        allowedIPs: [],
        blockedIPs: []
      },
      dataRetention: {
        logs: 30,
        cache: 7,
        history: 90
      },
      ...overrides
    };
  }

  /**
   * Creates default performance preferences
   */
  private static createDefaultPerformancePreferences(overrides?: Partial<PerformancePreferences>): PerformancePreferences {
    return {
      caching: true,
      cacheTTL: 3600,
      maxCacheSize: 100,
      parallelism: 4,
      maxMemoryUsage: 512,
      timeout: 30,
      retryAttempts: 3,
      batchSize: 10,
      lazyLoading: true,
      preloading: false,
      compression: true,
      optimization: {
        images: true,
        minifyOutput: false,
        bundleAssets: true,
        treeshaking: true
      },
      monitoring: {
        enabled: false,
        metrics: false,
        profiling: false,
        alerting: false
      },
      ...overrides
    };
  }

  /**
   * Creates default accessibility preferences
   */
  private static createDefaultAccessibilityPreferences(overrides?: Partial<AccessibilityPreferences>): AccessibilityPreferences {
    return {
      screenReader: false,
      highContrast: false,
      colorblindSupport: false,
      reducedMotion: false,
      keyboardNavigation: true,
      focusIndicators: true,
      skipLinks: true,
      ariaLabels: true,
      alternativeText: true,
      captions: false,
      transcripts: false,
      audioDescriptions: false,
      magnification: 1.0,
      contrastRatio: 4.5,
      fontSize: 14,
      lineSpacing: 1.4,
      ...overrides
    };
  }

  /**
   * Creates default integration preferences
   */
  private static createDefaultIntegrationPreferences(overrides?: Partial<IntegrationPreferences>): IntegrationPreferences {
    return {
      git: {
        enabled: false,
        autoCommit: false,
        commitMessage: 'docs: update API documentation',
        pushOnGenerate: false
      },
      ci: {
        autoTrigger: false,
        notifications: false
      },
      plugins: {
        enabled: [],
        autoUpdate: false,
        allowThirdParty: false,
        sandbox: true
      },
      extensions: {
        vscode: false,
        intellij: false,
        vim: false,
        emacs: false
      },
      webhooks: [],
      ...overrides
    };
  }

  /**
   * Creates default custom preferences
   */
  private static createDefaultCustomPreferences(overrides?: Partial<CustomPreferences>): CustomPreferences {
    return {
      templates: {},
      macros: {},
      variables: {},
      scripts: {},
      bookmarks: [],
      profiles: {},
      experiments: {},
      ...overrides
    };
  }
}

/**
 * Utilities for working with user preferences
 */
export class UserPreferencesUtils {
  /**
   * Validates user preferences
   */
  static validate(preferences: UserPreferences): PreferenceValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Basic validation
    if (!preferences.userId.trim()) {
      errors.push('User ID is required');
    }

    if (!preferences.profileName.trim()) {
      errors.push('Profile name is required');
    }

    // Interface validation
    if (preferences.interface.fontSize < 8 || preferences.interface.fontSize > 72) {
      warnings.push('Interface font size should be between 8 and 72 pixels');
    }

    // Editor validation
    if (preferences.editor.tabSize < 1 || preferences.editor.tabSize > 8) {
      warnings.push('Tab size should be between 1 and 8');
    }

    if (preferences.editor.lineHeight < 0.8 || preferences.editor.lineHeight > 3.0) {
      warnings.push('Line height should be between 0.8 and 3.0');
    }

    // AI validation
    if (preferences.ai.enabled) {
      if (preferences.ai.maxTokens < 100 || preferences.ai.maxTokens > 32000) {
        warnings.push('AI max tokens should be between 100 and 32000');
      }

      if (preferences.ai.temperature < 0 || preferences.ai.temperature > 2) {
        warnings.push('AI temperature should be between 0 and 2');
      }

      if (preferences.ai.confidenceThreshold < 0 || preferences.ai.confidenceThreshold > 1) {
        warnings.push('AI confidence threshold should be between 0 and 1');
      }
    }

    // Performance validation
    if (preferences.performance.parallelism < 1 || preferences.performance.parallelism > 32) {
      warnings.push('Parallelism should be between 1 and 32');
    }

    if (preferences.performance.maxMemoryUsage < 64) {
      warnings.push('Maximum memory usage should be at least 64 MB');
    }

    // Security validation
    if (preferences.security.sessionTimeout < 5) {
      warnings.push('Session timeout should be at least 5 minutes');
    }

    // Suggestions
    if (!preferences.ai.enabled) {
      suggestions.push('Consider enabling AI features for enhanced documentation');
    }

    if (!preferences.performance.caching) {
      suggestions.push('Enable caching for better performance');
    }

    if (!preferences.security.encryptLocalData) {
      suggestions.push('Consider enabling local data encryption for better security');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      category: PreferenceCategory.INTERFACE,
      severity: errors.length > 0 ? 'high' : warnings.length > 0 ? 'medium' : 'low'
    };
  }

  /**
   * Exports user preferences to different formats
   */
  static export(
    preferences: UserPreferences, 
    config: PreferenceExportConfig
  ): { data: string; metadata: PreferenceMetadata } {
    // Filter preferences by categories
    const filtered = this.filterByCategories(preferences, config.categories);
    
    // Create export data
    const exportData = {
      preferences: filtered,
      ...(config.includeMetadata && { metadata: preferences.metadata }),
      ...(config.includeCustom && { custom: preferences.custom })
    };

    // Convert to requested format
    let data: string;
    switch (config.format) {
      case 'yaml':
        data = this.toYAML(exportData);
        break;
      case 'binary':
        data = this.toBinary(exportData);
        break;
      case 'json':
      default:
        data = JSON.stringify(exportData, null, 2);
        break;
    }

    // Encrypt if requested
    if (config.encrypt) {
      data = this.encrypt(data);
    }

    // Compress if requested
    if (config.compress) {
      data = this.compress(data);
    }

    const metadata: PreferenceMetadata = {
      version: preferences.version,
      schema: '1.0.0',
      exported: new Date(),
      device: this.getDeviceInfo(),
      checksum: this.calculateChecksum(data),
      encrypted: config.encrypt,
      partial: config.categories.length < Object.values(PreferenceCategory).length,
      categories: config.categories
    };

    return { data, metadata };
  }

  /**
   * Imports user preferences from exported data
   */
  static import(
    data: string, 
    metadata: PreferenceMetadata,
    basePreferences: UserPreferences
  ): UserPreferences {
    // Verify checksum
    if (this.calculateChecksum(data) !== metadata.checksum) {
      throw new Error('Data integrity check failed');
    }

    // Decrypt if needed
    if (metadata.encrypted) {
      data = this.decrypt(data);
    }

    // Decompress if needed
    if (data.startsWith('H4sI') || data.startsWith('eJ')) { // Common compression signatures
      data = this.decompress(data);
    }

    // Parse data
    let importData: any;
    try {
      importData = JSON.parse(data);
    } catch (error) {
      throw new Error('Invalid JSON data');
    }

    // Merge with base preferences
    return UserPreferencesFactory.merge(basePreferences, importData.preferences);
  }

  /**
   * Compares two preference objects and identifies differences
   */
  static compare(
    preferences1: UserPreferences, 
    preferences2: UserPreferences
  ): {
    readonly changes: readonly {
      readonly category: PreferenceCategory;
      readonly field: string;
      readonly oldValue: any;
      readonly newValue: any;
      readonly type: 'added' | 'removed' | 'modified';
    }[];
    readonly summary: {
      readonly total: number;
      readonly byCategory: Record<PreferenceCategory, number>;
      readonly byType: Record<string, number>;
    };
  } {
    const changes: any[] = [];
    
    // Compare each category
    for (const category of Object.values(PreferenceCategory)) {
      const obj1 = (preferences1 as any)[category] || {};
      const obj2 = (preferences2 as any)[category] || {};
      
      const categoryChanges = this.compareObjects(obj1, obj2, category);
      changes.push(...categoryChanges);
    }

    // Create summary
    const byCategory: any = {};
    const byType: any = {};
    
    for (const change of changes) {
      byCategory[change.category] = (byCategory[change.category] || 0) + 1;
      byType[change.type] = (byType[change.type] || 0) + 1;
    }

    return {
      changes,
      summary: {
        total: changes.length,
        byCategory,
        byType
      }
    };
  }

  /**
   * Synchronizes preferences between local and remote sources
   */
  static sync(
    local: UserPreferences,
    remote: UserPreferences,
    strategy: 'local-wins' | 'remote-wins' | 'merge' | 'manual' = 'merge'
  ): {
    readonly result: UserPreferences;
    readonly conflicts: readonly any[];
    readonly status: 'success' | 'conflict' | 'error';
  } {
    const comparison = this.compare(local, remote);
    const conflicts: any[] = [];
    
    if (comparison.changes.length === 0) {
      return {
        result: local,
        conflicts: [],
        status: 'success'
      };
    }

    let result: UserPreferences;
    
    switch (strategy) {
      case 'local-wins':
        result = local;
        break;
      case 'remote-wins':
        result = remote;
        break;
      case 'merge':
        result = UserPreferencesFactory.merge(local, remote);
        break;
      case 'manual':
        // Flag conflicts for manual resolution
        for (const change of comparison.changes) {
          if (change.type === 'modified') {
            conflicts.push({
              category: change.category,
              field: change.field,
              localValue: change.oldValue,
              remoteValue: change.newValue,
              strategy: 'manual'
            });
          }
        }
        result = local; // Keep local until conflicts resolved
        break;
    }

    return {
      result,
      conflicts,
      status: conflicts.length > 0 ? 'conflict' : 'success'
    };
  }

  /**
   * Creates a preferences profile optimized for specific use cases
   */
  static createOptimizedProfile(
    base: UserPreferences,
    optimization: 'performance' | 'accessibility' | 'security' | 'minimal'
  ): UserPreferences {
    let overrides: Partial<UserPreferences>;

    switch (optimization) {
      case 'performance':
        overrides = {
          interface: { 
            ...base.interface, 
            animations: false, 
            minimap: false 
          },
          editor: { 
            ...base.editor, 
            minimap: false, 
            syntaxHighlighting: false 
          },
          performance: {
            ...base.performance,
            caching: true,
            parallelism: 8,
            lazyLoading: true,
            optimization: {
              images: true,
              minifyOutput: true,
              bundleAssets: true,
              treeshaking: true
            }
          }
        };
        break;
      case 'accessibility':
        overrides = {
          interface: {
            ...base.interface,
            highContrast: true,
            reducedMotion: true,
            keyboardNavigation: true,
            fontSize: 16
          },
          accessibility: {
            ...base.accessibility,
            screenReader: true,
            highContrast: true,
            focusIndicators: true,
            skipLinks: true,
            ariaLabels: true,
            fontSize: 16,
            lineSpacing: 1.6
          }
        };
        break;
      case 'security':
        overrides = {
          security: {
            ...base.security,
            sessionTimeout: 60,
            autoLock: true,
            autoLockDelay: 5,
            encryptLocalData: true,
            shareUsageData: false,
            shareErrorReports: false,
            allowTracking: false,
            auditLog: true
          },
          ai: {
            ...base.ai,
            privacyMode: true,
            dataRetention: 7
          }
        };
        break;
      case 'minimal':
        overrides = {
          interface: {
            ...base.interface,
            animations: false,
            tooltips: false,
            breadcrumbs: false,
            minimap: false,
            sidebarCollapsed: true
          },
          notifications: {
            ...base.notifications,
            email: false,
            push: false,
            desktop: false,
            inApp: false
          },
          ai: {
            ...base.ai,
            enabled: false
          }
        };
        break;
    }

    return UserPreferencesFactory.update(base, overrides);
  }

  /**
   * Filters preferences by categories
   */
  private static filterByCategories(
    preferences: UserPreferences, 
    categories: readonly PreferenceCategory[]
  ): Partial<UserPreferences> {
    const filtered: any = {};
    
    for (const category of categories) {
      if ((preferences as any)[category]) {
        filtered[category] = (preferences as any)[category];
      }
    }
    
    return filtered;
  }

  /**
   * Compares two objects and returns differences
   */
  private static compareObjects(obj1: any, obj2: any, category: PreferenceCategory): any[] {
    const changes: any[] = [];
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
    
    for (const key of allKeys) {
      if (!(key in obj1)) {
        changes.push({
          category,
          field: key,
          oldValue: undefined,
          newValue: obj2[key],
          type: 'added'
        });
      } else if (!(key in obj2)) {
        changes.push({
          category,
          field: key,
          oldValue: obj1[key],
          newValue: undefined,
          type: 'removed'
        });
      } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        changes.push({
          category,
          field: key,
          oldValue: obj1[key],
          newValue: obj2[key],
          type: 'modified'
        });
      }
    }
    
    return changes;
  }

  /**
   * Converts object to YAML format
   */
  private static toYAML(obj: any): string {
    // Simple YAML converter - in real implementation, use a proper YAML library
    return JSON.stringify(obj, null, 2)
      .replace(/"/g, '')
      .replace(/,$/gm, '')
      .replace(/^\s*{\s*$/gm, '')
      .replace(/^\s*}\s*$/gm, '');
  }

  /**
   * Converts object to binary format
   */
  private static toBinary(obj: any): string {
    // Simple binary converter - in real implementation, use proper binary serialization
    const json = JSON.stringify(obj);
    return this.base64Encode(json);
  }

  /**
   * Encrypts data using a simple algorithm
   */
  private static encrypt(data: string): string {
    // Simple encryption - in real implementation, use proper encryption
    return this.base64Encode(data);
  }

  /**
   * Decrypts data
   */
  private static decrypt(data: string): string {
    // Simple decryption - in real implementation, use proper decryption
    return this.base64Decode(data);
  }

  /**
   * Compresses data
   */
  private static compress(data: string): string {
    // Simple compression - in real implementation, use proper compression
    return this.base64Encode(data);
  }

  /**
   * Decompresses data
   */
  private static decompress(data: string): string {
    // Simple decompression - in real implementation, use proper decompression
    return this.base64Decode(data);
  }

  /**
   * Calculates checksum for data integrity
   */
  private static calculateChecksum(data: string): string {
    // Simple checksum - in real implementation, use proper hashing
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  /**
   * Simple base64 encoding
   */
  private static base64Encode(str: string): string {
    // Simple base64 implementation - in real use, use proper library
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;
    
    while (i < str.length) {
      const a = str.charCodeAt(i++);
      const b = i < str.length ? str.charCodeAt(i++) : 0;
      const c = i < str.length ? str.charCodeAt(i++) : 0;
      
      const bitmap = (a << 16) | (b << 8) | c;
      
      result += chars.charAt((bitmap >> 18) & 63);
      result += chars.charAt((bitmap >> 12) & 63);
      result += i - 2 < str.length ? chars.charAt((bitmap >> 6) & 63) : '=';
      result += i - 1 < str.length ? chars.charAt(bitmap & 63) : '=';
    }
    
    return result;
  }

  /**
   * Simple base64 decoding
   */
  private static base64Decode(str: string): string {
    // Simple base64 implementation - in real use, use proper library
    try {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      let result = '';
      let i = 0;
      
      str = str.replace(/[^A-Za-z0-9+/]/g, '');
      
      while (i < str.length) {
        const encoded1 = chars.indexOf(str.charAt(i++));
        const encoded2 = chars.indexOf(str.charAt(i++));
        const encoded3 = chars.indexOf(str.charAt(i++));
        const encoded4 = chars.indexOf(str.charAt(i++));
        
        const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;
        
        result += String.fromCharCode((bitmap >> 16) & 255);
        if (encoded3 !== 64) result += String.fromCharCode((bitmap >> 8) & 255);
        if (encoded4 !== 64) result += String.fromCharCode(bitmap & 255);
      }
      
      return result;
    } catch {
      return str; // Return original on decode error
    }
  }

  /**
   * Gets device information
   */
  private static getDeviceInfo(): string {
    // Simple platform-agnostic device info
    return 'typescript-environment';
  }
}

/**
 * Predefined user preference profiles
 */
export class UserPreferenceProfiles {
  /**
   * Developer-focused preferences
   */
  static developer(userId: string): UserPreferences {
    return UserPreferencesFactory.create({
      userId,
      profileName: 'Developer',
      editor: {
        theme: 'dark',
        fontSize: 12,
        fontFamily: 'JetBrains Mono, Monaco, monospace',
        tabSize: 2,
        showLineNumbers: true,
        syntaxHighlighting: true,
        codeCompletion: true,
        linting: true,
        formatOnSave: true
      },
      cli: {
        outputFormat: CLIOutputFormat.JSON,
        verbosity: 'verbose',
        colors: true,
        progress: true,
        confirmations: false
      },
      ai: {
        enabled: true,
        autoSummarize: true,
        autoEnhance: true,
        reviewRequired: false,
        maxTokens: 8000
      }
    });
  }

  /**
   * Writer-focused preferences
   */
  static writer(userId: string): UserPreferences {
    return UserPreferencesFactory.create({
      userId,
      profileName: 'Writer',
      interface: {
        theme: ThemeVariant.LIGHT,
        fontSize: 16,
        density: 'spacious'
      },
      editor: {
        fontSize: 16,
        lineHeight: 1.6,
        wordWrap: true,
        showLineNumbers: false,
        formatOnSave: true
      },
      ai: {
        enabled: true,
        autoSummarize: false,
        autoEnhance: true,
        reviewRequired: true,
        temperature: 0.7
      }
    });
  }

  /**
   * Team lead preferences
   */
  static teamLead(userId: string): UserPreferences {
    return UserPreferencesFactory.create({
      userId,
      profileName: 'Team Lead',
      notifications: {
        email: true,
        desktop: true,
        frequency: NotificationFrequency.REALTIME,
        categories: {
          errors: true,
          warnings: true,
          completion: true,
          updates: true,
          tips: false,
          security: true
        }
      },
      security: {
        auditLog: true,
        shareUsageData: true,
        shareErrorReports: true
      },
      integration: {
        git: {
          enabled: true,
          autoCommit: true,
          commitMessage: 'docs: update API documentation',
          pushOnGenerate: false
        },
        ci: {
          autoTrigger: true,
          notifications: true
        }
      }
    });
  }

  /**
   * Enterprise user preferences
   */
  static enterprise(userId: string): UserPreferences {
    return UserPreferencesFactory.create({
      userId,
      profileName: 'Enterprise',
      security: {
        sessionTimeout: 240,
        autoLock: true,
        autoLockDelay: 10,
        twoFactorAuth: true,
        encryptLocalData: true,
        shareUsageData: false,
        auditLog: true
      },
      performance: {
        caching: true,
        parallelism: 6,
        monitoring: {
          enabled: true,
          metrics: true,
          profiling: true,
          alerting: true
        }
      },
      ai: {
        enabled: true,
        reviewRequired: true,
        confidenceThreshold: 0.9,
        privacyMode: true,
        dataRetention: 7,
        costLimits: {
          daily: 50.0,
          monthly: 1000.0,
          perRequest: 5.0
        }
      }
    });
  }
}