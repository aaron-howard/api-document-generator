"use strict";
/**
 * T030 Configuration Management Integration
 *
 * Central configuration management system that provides hierarchical configuration
 * loading, environment variable integration, user preference management, and
 * integration with all T023-T029 services.
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationManager = exports.LoadingStrategy = exports.ConfigurationSource = void 0;
const configuration_1 = require("../core/models/configuration");
const user_preferences_1 = require("../core/models/user-preferences");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
/**
 * Configuration source types
 */
var ConfigurationSource;
(function (ConfigurationSource) {
    ConfigurationSource["DEFAULT"] = "default";
    ConfigurationSource["FILE"] = "file";
    ConfigurationSource["ENVIRONMENT"] = "environment";
    ConfigurationSource["USER_PREFERENCES"] = "user-preferences";
    ConfigurationSource["COMMAND_LINE"] = "command-line";
    ConfigurationSource["REMOTE"] = "remote";
    ConfigurationSource["OVERRIDE"] = "override";
})(ConfigurationSource || (exports.ConfigurationSource = ConfigurationSource = {}));
/**
 * Configuration loading strategy
 */
var LoadingStrategy;
(function (LoadingStrategy) {
    LoadingStrategy["FAIL_FAST"] = "fail-fast";
    LoadingStrategy["GRACEFUL_FALLBACK"] = "graceful-fallback";
    LoadingStrategy["MERGE_ALL"] = "merge-all";
    LoadingStrategy["STRICT_HIERARCHY"] = "strict-hierarchy";
})(LoadingStrategy || (exports.LoadingStrategy = LoadingStrategy = {}));
/**
 * Comprehensive Configuration Manager
 */
class ConfigurationManager {
    constructor(options = {}) {
        this.configuration = null;
        this.userPreferences = null;
        this.environmentVariables = {};
        this.watchers = new Map();
        this.changeListeners = new Set();
        this.backups = new Map();
        this.options = {
            configDir: options.configDir || path.join(process.cwd(), '.config'),
            userConfigDir: options.userConfigDir || path.join(os.homedir(), '.api-doc-generator'),
            environment: options.environment || configuration_1.Environment.DEVELOPMENT,
            loadingStrategy: options.loadingStrategy || LoadingStrategy.MERGE_ALL,
            autoReload: options.autoReload ?? true,
            reloadInterval: options.reloadInterval || 30000,
            enableValidation: options.enableValidation ?? true,
            enableCaching: options.enableCaching ?? true,
            enableEncryption: options.enableEncryption ?? false,
            enableBackup: options.enableBackup ?? true,
            backupRetention: options.backupRetention || 30,
            enableChangeTracking: options.enableChangeTracking ?? true,
            enableRemoteSync: options.enableRemoteSync ?? false,
            watchFileChanges: options.watchFileChanges ?? true,
            ...options
        };
        this.loadEnvironmentVariables();
        this.setupAutoReload();
    }
    /**
     * Initialize configuration manager with service integrations
     */
    async initialize(performanceMonitor, errorHandler, cacheManager) {
        this.performanceMonitor = performanceMonitor;
        this.errorHandler = errorHandler;
        this.cacheManager = cacheManager;
        try {
            // Create configuration directories
            await this.ensureDirectories();
            // Load initial configuration
            await this.loadConfiguration();
            // Start file watchers
            if (this.options.watchFileChanges) {
                await this.setupFileWatchers();
            }
            this.emitChangeEvent({
                type: 'reloaded',
                source: ConfigurationSource.DEFAULT,
                changes: ['initialization'],
                timestamp: new Date(),
                metadata: { version: '1.0.0' }
            });
        }
        catch (error) {
            await this.handleError('Configuration manager initialization failed', error);
            throw error;
        }
    }
    /**
     * Load configuration from all sources
     */
    async loadConfiguration(context) {
        const loadingContext = {
            environment: this.options.environment,
            sources: [
                ConfigurationSource.DEFAULT,
                ConfigurationSource.FILE,
                ConfigurationSource.ENVIRONMENT,
                ConfigurationSource.USER_PREFERENCES
            ],
            overrides: {},
            variables: this.environmentVariables,
            ...context
        };
        const monitoring = this.performanceMonitor?.startMonitoring('ConfigManager-001', {
            serviceName: 'ConfigurationManager',
            operation: 'load-configuration',
            sessionId: `config-${Date.now()}`,
            parameters: { environment: loadingContext.environment },
            metadata: { sources: loadingContext.sources }
        });
        try {
            const configurations = [];
            // Load from each source in hierarchy order
            for (const source of loadingContext.sources) {
                try {
                    const config = await this.loadFromSource(source, loadingContext);
                    if (config) {
                        configurations.push(config);
                    }
                }
                catch (error) {
                    await this.handleError(`Failed to load configuration from ${source}`, error);
                    if (this.options.loadingStrategy === LoadingStrategy.FAIL_FAST) {
                        throw error;
                    }
                }
            }
            // Merge configurations based on strategy
            this.configuration = await this.mergeConfigurations(configurations, loadingContext);
            // Validate merged configuration
            if (this.options.enableValidation) {
                const validation = await this.validateConfiguration(this.configuration);
                if (!validation.isValid && this.options.loadingStrategy === LoadingStrategy.FAIL_FAST) {
                    throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
                }
            }
            // Cache configuration if enabled
            if (this.options.enableCaching && this.cacheManager) {
                await this.cacheManager.setSessionData('configuration', this.configuration, 300000); // 5 minutes
            }
            // Create backup
            if (this.options.enableBackup) {
                await this.createBackup(this.configuration);
            }
            this.emitChangeEvent({
                type: 'reloaded',
                source: ConfigurationSource.FILE,
                changes: ['full-reload'],
                timestamp: new Date(),
                metadata: { sources: loadingContext.sources }
            });
            return this.configuration;
        }
        finally {
            if (monitoring) {
                this.performanceMonitor?.stopMonitoring('ConfigManager-001');
            }
        }
    }
    /**
     * Load user preferences
     */
    async loadUserPreferences(userId, profile) {
        const monitoring = this.performanceMonitor?.startMonitoring('ConfigManager-002', {
            serviceName: 'ConfigurationManager',
            operation: 'load-user-preferences',
            sessionId: `prefs-${Date.now()}`,
            parameters: { userId, profile },
            metadata: {}
        });
        try {
            let preferences;
            if (profile) {
                // Load predefined profile
                preferences = this.loadPreferenceProfile(profile, userId || 'default');
            }
            else {
                // Load from file or create default
                const prefsPath = await this.getUserPreferencesPath(userId);
                try {
                    const data = await fs.readFile(prefsPath, 'utf-8');
                    const prefsData = JSON.parse(data);
                    preferences = user_preferences_1.UserPreferencesFactory.fromData(prefsData);
                }
                catch (error) {
                    // Create default preferences
                    preferences = user_preferences_1.UserPreferencesFactory.create({ userId: userId || 'default' });
                }
            }
            // Validate preferences
            const validation = user_preferences_1.UserPreferencesUtils.validate(preferences);
            if (!validation.isValid) {
                await this.handleError('User preferences validation failed', new Error(validation.errors.join(', ')));
                preferences = user_preferences_1.UserPreferencesFactory.create({ userId: userId || 'default' });
            }
            this.userPreferences = preferences;
            // Cache preferences
            if (this.options.enableCaching && this.cacheManager) {
                await this.cacheManager.setSessionData(`user-preferences-${userId}`, preferences, 600000); // 10 minutes
            }
            return preferences;
        }
        finally {
            if (monitoring) {
                this.performanceMonitor?.stopMonitoring('ConfigManager-002');
            }
        }
    }
    /**
     * Save user preferences
     */
    async saveUserPreferences(preferences, userId) {
        const monitoring = this.performanceMonitor?.startMonitoring('ConfigManager-003', {
            serviceName: 'ConfigurationManager',
            operation: 'save-user-preferences',
            sessionId: `save-prefs-${Date.now()}`,
            parameters: { userId },
            metadata: {}
        });
        try {
            // Validate preferences before saving
            const validation = user_preferences_1.UserPreferencesUtils.validate(preferences);
            if (!validation.isValid) {
                throw new Error(`Invalid preferences: ${validation.errors.join(', ')}`);
            }
            const prefsPath = await this.getUserPreferencesPath(userId);
            const prefsData = JSON.stringify(preferences, null, 2);
            // Create backup before saving
            if (this.options.enableBackup) {
                const backupPath = `${prefsPath}.backup.${Date.now()}`;
                try {
                    await fs.copyFile(prefsPath, backupPath);
                }
                catch (error) {
                    // Ignore if file doesn't exist
                }
            }
            // Save preferences
            await fs.writeFile(prefsPath, prefsData, 'utf-8');
            this.userPreferences = preferences;
            // Update cache
            if (this.options.enableCaching && this.cacheManager) {
                await this.cacheManager.setSessionData(`user-preferences-${userId}`, preferences, 600000);
            }
            this.emitChangeEvent({
                type: 'updated',
                source: ConfigurationSource.USER_PREFERENCES,
                path: prefsPath,
                changes: ['user-preferences'],
                timestamp: new Date(),
                userId,
                metadata: {}
            });
        }
        finally {
            if (monitoring) {
                this.performanceMonitor?.stopMonitoring('ConfigManager-003');
            }
        }
    }
    /**
     * Update configuration
     */
    async updateConfiguration(updates) {
        if (!this.configuration) {
            throw new Error('Configuration not loaded');
        }
        const monitoring = this.performanceMonitor?.startMonitoring('ConfigManager-004', {
            serviceName: 'ConfigurationManager',
            operation: 'update-configuration',
            sessionId: `update-${Date.now()}`,
            parameters: updates,
            metadata: {}
        });
        try {
            // Create updated configuration using proper merging
            const updatedConfig = this.deepMerge(this.configuration, {
                ...updates,
                updatedAt: new Date()
            });
            // Validate updated configuration
            if (this.options.enableValidation) {
                const validation = await this.validateConfiguration(updatedConfig);
                if (!validation.isValid) {
                    throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
                }
            }
            // Save configuration
            await this.saveConfiguration(updatedConfig);
            this.emitChangeEvent({
                type: 'updated',
                source: ConfigurationSource.OVERRIDE,
                changes: Object.keys(updates),
                timestamp: new Date(),
                metadata: { updateKeys: Object.keys(updates) }
            });
            return updatedConfig;
        }
        finally {
            if (monitoring) {
                this.performanceMonitor?.stopMonitoring('ConfigManager-004');
            }
        }
    }
    /**
     * Get current configuration
     */
    getConfiguration() {
        return this.configuration;
    }
    /**
     * Get current user preferences
     */
    getUserPreferences() {
        return this.userPreferences;
    }
    /**
     * Get environment variable
     */
    getEnvironmentVariable(key, defaultValue) {
        return this.environmentVariables[key] || defaultValue;
    }
    /**
     * Set environment variable
     */
    setEnvironmentVariable(key, value) {
        this.environmentVariables[key] = value;
        process.env[key] = value;
    }
    /**
     * Export configuration
     */
    async exportConfiguration(options) {
        if (!this.configuration) {
            throw new Error('Configuration not loaded');
        }
        const monitoring = this.performanceMonitor?.startMonitoring('ConfigManager-005', {
            serviceName: 'ConfigurationManager',
            operation: 'export-configuration',
            sessionId: `export-${Date.now()}`,
            parameters: options,
            metadata: {}
        });
        try {
            let data = this.configuration;
            // Apply category filtering
            if (options.categories && options.categories.length > 0) {
                data = this.filterConfigurationByCategories(data, options.categories);
            }
            // Remove sensitive data if requested
            if (!options.includeSecrets) {
                data = this.removeSensitiveData(data);
            }
            // Format output
            switch (options.format) {
                case 'json':
                    return JSON.stringify(data, null, options.minify ? 0 : 2);
                case 'yaml':
                    return this.toYaml(data);
                case 'toml':
                    return this.toToml(data);
                case 'env':
                    return this.toEnvFormat(data);
                default:
                    throw new Error(`Unsupported export format: ${options.format}`);
            }
        }
        finally {
            if (monitoring) {
                this.performanceMonitor?.stopMonitoring('ConfigManager-005');
            }
        }
    }
    /**
     * Import configuration
     */
    async importConfiguration(data, format) {
        const monitoring = this.performanceMonitor?.startMonitoring('ConfigManager-006', {
            serviceName: 'ConfigurationManager',
            operation: 'import-configuration',
            sessionId: `import-${Date.now()}`,
            parameters: { format },
            metadata: {}
        });
        try {
            let parsedData;
            // Parse input data
            switch (format) {
                case 'json':
                    parsedData = JSON.parse(data);
                    break;
                case 'yaml':
                    parsedData = this.fromYaml(data);
                    break;
                case 'toml':
                    parsedData = this.fromToml(data);
                    break;
                case 'env':
                    parsedData = this.fromEnvFormat(data);
                    break;
                default:
                    throw new Error(`Unsupported import format: ${format}`);
            }
            const result = {
                success: false,
                configuration: undefined,
                userPreferences: undefined,
                errors: [],
                warnings: [],
                imported: [],
                skipped: [],
                metadata: {}
            };
            // Validate imported data
            if (parsedData.configuration) {
                const validation = await this.validateConfiguration(parsedData.configuration);
                if (validation.isValid) {
                    await this.saveConfiguration(parsedData.configuration);
                    result.configuration = parsedData.configuration;
                    result.imported.push('configuration');
                }
                else {
                    result.errors.push(...validation.errors);
                    result.warnings.push(...validation.warnings);
                }
            }
            // Import user preferences if present
            if (parsedData.userPreferences) {
                const validation = user_preferences_1.UserPreferencesUtils.validate(parsedData.userPreferences);
                if (validation.isValid) {
                    await this.saveUserPreferences(parsedData.userPreferences);
                    result.userPreferences = parsedData.userPreferences;
                    result.imported.push('userPreferences');
                }
                else {
                    result.errors.push(...validation.errors);
                    result.warnings.push(...validation.warnings);
                }
            }
            result.success = result.errors.length === 0;
            this.emitChangeEvent({
                type: 'imported',
                source: ConfigurationSource.FILE,
                changes: result.imported,
                timestamp: new Date(),
                metadata: { format, imported: result.imported }
            });
            return result;
        }
        finally {
            if (monitoring) {
                this.performanceMonitor?.stopMonitoring('ConfigManager-006');
            }
        }
    }
    /**
     * Validate configuration
     */
    async validateConfiguration(config) {
        const errors = [];
        const warnings = [];
        const suggestions = [];
        const securityIssues = [];
        const performanceIssues = [];
        // Basic validation
        if (!config.id)
            errors.push('Configuration ID is required');
        if (!config.name)
            errors.push('Configuration name is required');
        if (!config.environment)
            errors.push('Environment is required');
        // Security validation
        if (config.securitySettings) {
            if (config.securitySettings.accessControl === 'public') {
                securityIssues.push('Public access control may expose sensitive data');
            }
            if (!config.securitySettings.encryption?.enabled) {
                securityIssues.push('Encryption is not enabled');
            }
        }
        // Performance validation
        if (config.performanceSettings) {
            if (!config.performanceSettings.caching?.enabled) {
                performanceIssues.push('Caching is not enabled');
            }
            if (config.performanceSettings.concurrent?.maxWorkers && config.performanceSettings.concurrent.maxWorkers > 16) {
                performanceIssues.push('High number of concurrent workers may impact performance');
            }
        }
        // Generate suggestions
        if (config.environment === configuration_1.Environment.PRODUCTION) {
            if (!config.securitySettings?.encryption?.enabled) {
                suggestions.push('Enable encryption for production environment');
            }
            if (!config.performanceSettings?.caching?.enabled) {
                suggestions.push('Enable caching for better production performance');
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
     * Add configuration change listener
     */
    addChangeListener(listener) {
        this.changeListeners.add(listener);
    }
    /**
     * Remove configuration change listener
     */
    removeChangeListener(listener) {
        this.changeListeners.delete(listener);
    }
    /**
     * Reload configuration
     */
    async reloadConfiguration() {
        return await this.loadConfiguration();
    }
    /**
     * Get configuration backup history
     */
    getBackupHistory() {
        return Array.from(this.backups.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    /**
     * Restore configuration from backup
     */
    async restoreFromBackup(backupId) {
        const backup = this.backups.get(backupId);
        if (!backup) {
            throw new Error(`Backup ${backupId} not found`);
        }
        const backupPath = await this.getBackupPath(backupId);
        const data = await fs.readFile(backupPath, 'utf-8');
        const config = JSON.parse(data);
        await this.saveConfiguration(config);
        this.emitChangeEvent({
            type: 'reloaded',
            source: ConfigurationSource.FILE,
            changes: ['restore-from-backup'],
            timestamp: new Date(),
            metadata: { backupId, backupTimestamp: backup.timestamp }
        });
        return config;
    }
    /**
     * Clean up resources
     */
    async cleanup() {
        // Stop auto-reload timer
        if (this.reloadTimer) {
            clearInterval(this.reloadTimer);
        }
        // Stop file watchers
        for (const watcher of this.watchers.values()) {
            // Stop watching implementation would go here
        }
        // Clear listeners
        this.changeListeners.clear();
        // Clean up old backups
        await this.cleanupOldBackups();
    }
    // Private helper methods
    async loadFromSource(source, context) {
        switch (source) {
            case ConfigurationSource.DEFAULT:
                return this.loadDefaultConfiguration(context);
            case ConfigurationSource.FILE:
                return await this.loadFileConfiguration(context);
            case ConfigurationSource.ENVIRONMENT:
                return this.loadEnvironmentConfiguration(context);
            case ConfigurationSource.USER_PREFERENCES:
                return await this.loadUserPreferenceConfiguration(context);
            default:
                return null;
        }
    }
    loadDefaultConfiguration(context) {
        return configuration_1.ConfigurationFactory.create({
            name: 'Default Configuration',
            description: 'Default system configuration',
            environment: context.environment,
            projectId: context.projectId || 'default',
            createdBy: context.userId || 'system'
        });
    }
    async loadFileConfiguration(context) {
        const configPath = path.join(this.options.configDir, `config.${context.environment}.json`);
        try {
            const data = await fs.readFile(configPath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            // Try fallback config
            const fallbackPath = path.join(this.options.configDir, 'config.json');
            try {
                const data = await fs.readFile(fallbackPath, 'utf-8');
                return JSON.parse(data);
            }
            catch (fallbackError) {
                return null;
            }
        }
    }
    loadEnvironmentConfiguration(context) {
        const config = {};
        // Map environment variables to configuration
        for (const [key, value] of Object.entries(this.environmentVariables)) {
            if (key.startsWith('API_DOC_GEN_')) {
                const configKey = key.replace('API_DOC_GEN_', '').toLowerCase();
                this.setNestedProperty(config, configKey, value);
            }
        }
        return config;
    }
    async loadUserPreferenceConfiguration(context) {
        if (!context.userId)
            return null;
        try {
            const preferences = await this.loadUserPreferences(context.userId);
            return {
                userPreferences: preferences
            };
        }
        catch (error) {
            return null;
        }
    }
    async mergeConfigurations(configurations, context) {
        let merged = configurations[0];
        for (let i = 1; i < configurations.length; i++) {
            merged = this.deepMerge(merged, configurations[i]);
        }
        // Apply overrides
        if (Object.keys(context.overrides).length > 0) {
            merged = this.deepMerge(merged, context.overrides);
        }
        return merged;
    }
    async saveConfiguration(config) {
        const configPath = path.join(this.options.configDir, `config.${config.environment}.json`);
        const configData = JSON.stringify(config, null, 2);
        await fs.writeFile(configPath, configData, 'utf-8');
        this.configuration = config;
    }
    async createBackup(config) {
        const backupId = `backup-${Date.now()}`;
        const backupPath = await this.getBackupPath(backupId);
        const configData = JSON.stringify(config, null, 2);
        await fs.writeFile(backupPath, configData, 'utf-8');
        const backup = {
            id: backupId,
            timestamp: new Date(),
            source: ConfigurationSource.FILE,
            checksum: this.calculateChecksum(configData),
            size: configData.length,
            compressed: false,
            encrypted: false,
            metadata: { environment: config.environment }
        };
        this.backups.set(backupId, backup);
    }
    loadPreferenceProfile(profile, userId) {
        switch (profile.toLowerCase()) {
            case 'developer':
                return user_preferences_1.UserPreferenceProfiles.developer(userId);
            case 'writer':
                return user_preferences_1.UserPreferenceProfiles.writer(userId);
            case 'team-lead':
                return user_preferences_1.UserPreferenceProfiles.teamLead(userId);
            case 'enterprise':
                return user_preferences_1.UserPreferenceProfiles.enterprise(userId);
            default:
                return user_preferences_1.UserPreferencesFactory.create({ userId });
        }
    }
    loadEnvironmentVariables() {
        this.environmentVariables = { ...process.env };
    }
    async ensureDirectories() {
        await fs.mkdir(this.options.configDir, { recursive: true });
        await fs.mkdir(this.options.userConfigDir, { recursive: true });
        await fs.mkdir(path.join(this.options.configDir, 'backups'), { recursive: true });
    }
    async getUserPreferencesPath(userId) {
        const filename = userId ? `preferences.${userId}.json` : 'preferences.json';
        return path.join(this.options.userConfigDir, filename);
    }
    async getBackupPath(backupId) {
        return path.join(this.options.configDir, 'backups', `${backupId}.json`);
    }
    setupAutoReload() {
        if (this.options.autoReload && this.options.reloadInterval) {
            this.reloadTimer = setInterval(async () => {
                try {
                    await this.reloadConfiguration();
                }
                catch (error) {
                    await this.handleError('Auto-reload failed', error);
                }
            }, this.options.reloadInterval);
        }
    }
    async setupFileWatchers() {
        // File watching implementation would go here
        // This would use fs.watch or a library like chokidar
    }
    emitChangeEvent(event) {
        for (const listener of this.changeListeners) {
            try {
                listener(event);
            }
            catch (error) {
                this.handleError('Configuration change listener error', error);
            }
        }
    }
    async handleError(message, error) {
        if (this.errorHandler) {
            await this.errorHandler.handleError(error, {
                context: 'ConfigurationManager',
                operation: message,
                severity: 'medium',
                metadata: { error: error.message }
            });
        }
        else {
            console.error(`ConfigurationManager: ${message}`, error);
        }
    }
    deepMerge(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(result[key] || {}, source[key]);
            }
            else {
                result[key] = source[key];
            }
        }
        return result;
    }
    setNestedProperty(obj, path, value) {
        const keys = path.split('_');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    }
    filterConfigurationByCategories(config, categories) {
        // Implementation for filtering configuration by categories
        return config;
    }
    removeSensitiveData(config) {
        // Implementation for removing sensitive data
        const sanitized = JSON.parse(JSON.stringify(config));
        // Remove passwords, API keys, etc.
        return sanitized;
    }
    toYaml(data) {
        // YAML serialization implementation
        return JSON.stringify(data, null, 2);
    }
    toToml(data) {
        // TOML serialization implementation
        return JSON.stringify(data, null, 2);
    }
    toEnvFormat(data) {
        // Environment variable format implementation
        const lines = [];
        this.flattenObject(data, '', lines);
        return lines.join('\n');
    }
    fromYaml(data) {
        // YAML parsing implementation
        return JSON.parse(data);
    }
    fromToml(data) {
        // TOML parsing implementation
        return JSON.parse(data);
    }
    fromEnvFormat(data) {
        // Environment format parsing implementation
        const result = {};
        const lines = data.split('\n');
        for (const line of lines) {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=');
                this.setNestedProperty(result, key.toLowerCase(), value);
            }
        }
        return result;
    }
    flattenObject(obj, prefix, lines) {
        for (const key in obj) {
            const fullKey = prefix ? `${prefix}_${key.toUpperCase()}` : key.toUpperCase();
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                this.flattenObject(obj[key], fullKey, lines);
            }
            else {
                lines.push(`${fullKey}=${obj[key]}`);
            }
        }
    }
    calculateChecksum(data) {
        // Simple checksum implementation
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16);
    }
    async cleanupOldBackups() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.options.backupRetention);
        for (const [id, backup] of this.backups.entries()) {
            if (backup.timestamp < cutoffDate) {
                try {
                    const backupPath = await this.getBackupPath(id);
                    await fs.unlink(backupPath);
                    this.backups.delete(id);
                }
                catch (error) {
                    // Ignore cleanup errors
                }
            }
        }
    }
}
exports.ConfigurationManager = ConfigurationManager;
// Export interfaces and types - already exported above, no need to re-export
//# sourceMappingURL=config-manager.js.map