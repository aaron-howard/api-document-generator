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
export declare enum PreferenceCategory {
    INTERFACE = "interface",
    EDITOR = "editor",
    AI = "ai",
    CLI = "cli",
    NOTIFICATIONS = "notifications",
    SECURITY = "security",
    PERFORMANCE = "performance",
    ACCESSIBILITY = "accessibility",
    INTEGRATION = "integration",
    CUSTOM = "custom"
}
/**
 * Theme variants supported by the application
 */
export declare enum ThemeVariant {
    LIGHT = "light",
    DARK = "dark",
    HIGH_CONTRAST = "high-contrast",
    AUTO = "auto",
    CUSTOM = "custom"
}
/**
 * Language codes for internationalization
 */
export declare enum LanguageCode {
    EN_US = "en-US",
    EN_GB = "en-GB",
    ES_ES = "es-ES",
    FR_FR = "fr-FR",
    DE_DE = "de-DE",
    IT_IT = "it-IT",
    PT_BR = "pt-BR",
    RU_RU = "ru-RU",
    ZH_CN = "zh-CN",
    ZH_TW = "zh-TW",
    JA_JP = "ja-JP",
    KO_KR = "ko-KR"
}
/**
 * Notification frequency options
 */
export declare enum NotificationFrequency {
    REALTIME = "realtime",
    HOURLY = "hourly",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    NEVER = "never"
}
/**
 * AI provider preferences
 */
export declare enum AIProviderPreference {
    OPENAI = "openai",
    ANTHROPIC = "anthropic",
    AZURE = "azure",
    GOOGLE = "google",
    LOCAL = "local",
    CUSTOM = "custom",
    AUTO = "auto"
}
/**
 * CLI output format preferences
 */
export declare enum CLIOutputFormat {
    JSON = "json",
    YAML = "yaml",
    TABLE = "table",
    TEXT = "text",
    MINIMAL = "minimal"
}
/**
 * Preference sync strategy
 */
export declare enum SyncStrategy {
    LOCAL_ONLY = "local-only",
    CLOUD_SYNC = "cloud-sync",
    MANUAL_EXPORT = "manual-export",
    TEAM_SHARED = "team-shared"
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
    readonly dataRetention: number;
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
    readonly sessionTimeout: number;
    readonly autoLock: boolean;
    readonly autoLockDelay: number;
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
        readonly logs: number;
        readonly cache: number;
        readonly history: number;
    };
}
/**
 * Performance and optimization preferences
 */
export interface PerformancePreferences {
    readonly caching: boolean;
    readonly cacheTTL: number;
    readonly maxCacheSize: number;
    readonly parallelism: number;
    readonly maxMemoryUsage: number;
    readonly timeout: number;
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
    readonly progress: number;
}
/**
 * Factory for creating UserPreferences instances
 */
export declare class UserPreferencesFactory {
    /**
     * Creates a new user preferences instance with defaults
     */
    static create(params: CreateUserPreferencesParams): UserPreferences;
    /**
     * Creates user preferences from existing data
     */
    static fromData(data: Partial<UserPreferences> & {
        id: string;
        userId: string;
    }): UserPreferences;
    /**
     * Updates existing user preferences
     */
    static update(preferences: UserPreferences, updates: UpdateUserPreferencesParams): UserPreferences;
    /**
     * Creates a preference profile from a base preferences object
     */
    static createProfile(base: UserPreferences, profileName: string, overrides: Partial<UserPreferences>): UserPreferences;
    /**
     * Merges multiple preference objects with conflict resolution
     */
    static merge(base: UserPreferences, ...overrides: readonly Partial<UserPreferences>[]): UserPreferences;
    /**
     * Generates a unique preferences ID
     */
    private static generatePreferencesId;
    /**
     * Creates default interface preferences
     */
    private static createDefaultInterfacePreferences;
    /**
     * Creates default editor preferences
     */
    private static createDefaultEditorPreferences;
    /**
     * Creates default AI preferences
     */
    private static createDefaultAIPreferences;
    /**
     * Creates default CLI preferences
     */
    private static createDefaultCLIPreferences;
    /**
     * Creates default notification preferences
     */
    private static createDefaultNotificationPreferences;
    /**
     * Creates default security preferences
     */
    private static createDefaultSecurityPreferences;
    /**
     * Creates default performance preferences
     */
    private static createDefaultPerformancePreferences;
    /**
     * Creates default accessibility preferences
     */
    private static createDefaultAccessibilityPreferences;
    /**
     * Creates default integration preferences
     */
    private static createDefaultIntegrationPreferences;
    /**
     * Creates default custom preferences
     */
    private static createDefaultCustomPreferences;
}
/**
 * Utilities for working with user preferences
 */
export declare class UserPreferencesUtils {
    /**
     * Validates user preferences
     */
    static validate(preferences: UserPreferences): PreferenceValidationResult;
    /**
     * Exports user preferences to different formats
     */
    static export(preferences: UserPreferences, config: PreferenceExportConfig): {
        data: string;
        metadata: PreferenceMetadata;
    };
    /**
     * Imports user preferences from exported data
     */
    static import(data: string, metadata: PreferenceMetadata, basePreferences: UserPreferences): UserPreferences;
    /**
     * Compares two preference objects and identifies differences
     */
    static compare(preferences1: UserPreferences, preferences2: UserPreferences): {
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
    };
    /**
     * Synchronizes preferences between local and remote sources
     */
    static sync(local: UserPreferences, remote: UserPreferences, strategy?: 'local-wins' | 'remote-wins' | 'merge' | 'manual'): {
        readonly result: UserPreferences;
        readonly conflicts: readonly any[];
        readonly status: 'success' | 'conflict' | 'error';
    };
    /**
     * Creates a preferences profile optimized for specific use cases
     */
    static createOptimizedProfile(base: UserPreferences, optimization: 'performance' | 'accessibility' | 'security' | 'minimal'): UserPreferences;
    /**
     * Filters preferences by categories
     */
    private static filterByCategories;
    /**
     * Compares two objects and returns differences
     */
    private static compareObjects;
    /**
     * Converts object to YAML format
     */
    private static toYAML;
    /**
     * Converts object to binary format
     */
    private static toBinary;
    /**
     * Encrypts data using a simple algorithm
     */
    private static encrypt;
    /**
     * Decrypts data
     */
    private static decrypt;
    /**
     * Compresses data
     */
    private static compress;
    /**
     * Decompresses data
     */
    private static decompress;
    /**
     * Calculates checksum for data integrity
     */
    private static calculateChecksum;
    /**
     * Simple base64 encoding
     */
    private static base64Encode;
    /**
     * Simple base64 decoding
     */
    private static base64Decode;
    /**
     * Gets device information
     */
    private static getDeviceInfo;
}
/**
 * Predefined user preference profiles
 */
export declare class UserPreferenceProfiles {
    /**
     * Developer-focused preferences
     */
    static developer(userId: string): UserPreferences;
    /**
     * Writer-focused preferences
     */
    static writer(userId: string): UserPreferences;
    /**
     * Team lead preferences
     */
    static teamLead(userId: string): UserPreferences;
    /**
     * Enterprise user preferences
     */
    static enterprise(userId: string): UserPreferences;
}
//# sourceMappingURL=user-preferences.d.ts.map