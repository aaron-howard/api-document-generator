/**
 * T030 Configuration Management Integration
 *
 * Central configuration management system that provides hierarchical configuration
 * loading, environment variable integration, user preference management, and
 * integration with all T023-T029 services.
 *
 * @packageDocumentation
 */
import { Configuration, Environment, UpdateConfigurationParams, ConfigurationValidationResult } from '../core/models/configuration';
import { UserPreferences } from '../core/models/user-preferences';
import { PerformanceMonitor } from '../performance/performance-monitor';
import { ErrorHandler } from '../error/error-handler';
import { CacheManager } from '../cache/cache-manager';
/**
 * Configuration source types
 */
export declare enum ConfigurationSource {
    DEFAULT = "default",
    FILE = "file",
    ENVIRONMENT = "environment",
    USER_PREFERENCES = "user-preferences",
    COMMAND_LINE = "command-line",
    REMOTE = "remote",
    OVERRIDE = "override"
}
/**
 * Configuration loading strategy
 */
export declare enum LoadingStrategy {
    FAIL_FAST = "fail-fast",
    GRACEFUL_FALLBACK = "graceful-fallback",
    MERGE_ALL = "merge-all",
    STRICT_HIERARCHY = "strict-hierarchy"
}
/**
 * Configuration change event
 */
export interface ConfigurationChangeEvent {
    readonly type: 'updated' | 'reloaded' | 'validated' | 'exported' | 'imported';
    readonly source: ConfigurationSource;
    readonly path?: string;
    readonly changes: readonly string[];
    readonly timestamp: Date;
    readonly userId?: string | undefined;
    readonly metadata: Record<string, any>;
}
/**
 * Configuration manager options
 */
export interface ConfigurationManagerOptions {
    readonly configDir?: string;
    readonly userConfigDir?: string;
    readonly environment?: Environment;
    readonly loadingStrategy?: LoadingStrategy;
    readonly autoReload?: boolean;
    readonly reloadInterval?: number;
    readonly enableValidation?: boolean;
    readonly enableCaching?: boolean;
    readonly enableEncryption?: boolean;
    readonly enableBackup?: boolean;
    readonly backupRetention?: number;
    readonly enableChangeTracking?: boolean;
    readonly enableRemoteSync?: boolean;
    readonly remoteEndpoint?: string;
    readonly watchFileChanges?: boolean;
}
/**
 * Configuration loading context
 */
export interface ConfigurationLoadingContext {
    readonly environment: Environment;
    readonly userId?: string;
    readonly projectId?: string;
    readonly workspaceId?: string;
    readonly sources: readonly ConfigurationSource[];
    readonly overrides: Record<string, any>;
    readonly variables: Record<string, string>;
}
/**
 * Configuration export options
 */
export interface ConfigurationExportOptions {
    readonly format: 'json' | 'yaml' | 'toml' | 'env';
    readonly includeSecrets?: boolean;
    readonly includeSensitive?: boolean;
    readonly minify?: boolean;
    readonly encrypt?: boolean;
    readonly categories?: readonly string[];
    readonly profile?: string;
}
/**
 * Configuration import result
 */
export interface ConfigurationImportResult {
    readonly success: boolean;
    configuration?: Configuration;
    userPreferences?: UserPreferences;
    errors: string[];
    warnings: string[];
    imported: string[];
    skipped: string[];
    readonly metadata: Record<string, any>;
}
/**
 * Configuration watcher interface
 */
export interface ConfigurationWatcher {
    readonly path: string;
    readonly source: ConfigurationSource;
    readonly callback: (event: ConfigurationChangeEvent) => void;
    readonly enabled: boolean;
}
/**
 * Configuration backup metadata
 */
export interface ConfigurationBackup {
    readonly id: string;
    readonly timestamp: Date;
    readonly source: ConfigurationSource;
    readonly checksum: string;
    readonly size: number;
    readonly compressed: boolean;
    readonly encrypted: boolean;
    readonly metadata: Record<string, any>;
}
/**
 * Configuration sync status
 */
export interface ConfigurationSyncStatus {
    readonly enabled: boolean;
    readonly lastSync: Date;
    readonly nextSync: Date;
    readonly syncInterval: number;
    readonly remoteEndpoint: string;
    readonly conflicts: readonly string[];
    readonly pending: readonly string[];
}
/**
 * Comprehensive Configuration Manager
 */
export declare class ConfigurationManager {
    private options;
    private configuration;
    private userPreferences;
    private environmentVariables;
    private changeListeners;
    private backups;
    private performanceMonitor?;
    private errorHandler?;
    private cacheManager?;
    private reloadTimer?;
    constructor(options?: ConfigurationManagerOptions);
    /**
     * Initialize configuration manager with service integrations
     */
    initialize(performanceMonitor?: PerformanceMonitor, errorHandler?: ErrorHandler, cacheManager?: CacheManager): Promise<void>;
    /**
     * Load configuration from all sources
     */
    loadConfiguration(context?: Partial<ConfigurationLoadingContext>): Promise<Configuration>;
    /**
     * Load user preferences
     */
    loadUserPreferences(userId?: string, profile?: string): Promise<UserPreferences>;
    /**
     * Save user preferences
     */
    saveUserPreferences(preferences: UserPreferences, userId?: string): Promise<void>;
    /**
     * Update configuration
     */
    updateConfiguration(updates: UpdateConfigurationParams): Promise<Configuration>;
    /**
     * Get current configuration
     */
    getConfiguration(): Configuration | null;
    /**
     * Get current user preferences
     */
    getUserPreferences(): UserPreferences | null;
    /**
     * Get environment variable
     */
    getEnvironmentVariable(key: string, defaultValue?: string): string | undefined;
    /**
     * Set environment variable
     */
    setEnvironmentVariable(key: string, value: string): void;
    /**
     * Export configuration
     */
    exportConfiguration(options: ConfigurationExportOptions): Promise<string>;
    /**
     * Import configuration
     */
    importConfiguration(data: string, format: string): Promise<ConfigurationImportResult>;
    /**
     * Validate configuration
     */
    validateConfiguration(config: Configuration): Promise<ConfigurationValidationResult>;
    /**
     * Add configuration change listener
     */
    addChangeListener(listener: (event: ConfigurationChangeEvent) => void): void;
    /**
     * Remove configuration change listener
     */
    removeChangeListener(listener: (event: ConfigurationChangeEvent) => void): void;
    /**
     * Reload configuration
     */
    reloadConfiguration(): Promise<Configuration>;
    /**
     * Get configuration backup history
     */
    getBackupHistory(): ConfigurationBackup[];
    /**
     * Restore configuration from backup
     */
    restoreFromBackup(backupId: string): Promise<Configuration>;
    /**
     * Clean up resources
     */
    cleanup(): Promise<void>;
    private loadFromSource;
    private loadDefaultConfiguration;
    private loadFileConfiguration;
    private loadEnvironmentConfiguration;
    private loadUserPreferenceConfiguration;
    private mergeConfigurations;
    private saveConfiguration;
    private createBackup;
    private loadPreferenceProfile;
    private loadEnvironmentVariables;
    private ensureDirectories;
    private getUserPreferencesPath;
    private getBackupPath;
    private setupAutoReload;
    private setupFileWatchers;
    private emitChangeEvent;
    private handleError;
    private deepMerge;
    private setNestedProperty;
    private filterConfigurationByCategories;
    private removeSensitiveData;
    private toYaml;
    private toToml;
    private toEnvFormat;
    private fromYaml;
    private fromToml;
    private fromEnvFormat;
    private flattenObject;
    private calculateChecksum;
    private cleanupOldBackups;
}
//# sourceMappingURL=config-manager.d.ts.map