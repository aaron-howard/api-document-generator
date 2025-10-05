"use strict";
/**
 * User Preferences Model
 *
 * Comprehensive user preference management system for the API Documentation Generator.
 * Handles user-specific settings, theme preferences, AI configuration, CLI preferences,
 * and customization options with validation, synchronization, and backup capabilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferenceProfiles = exports.UserPreferencesUtils = exports.UserPreferencesFactory = exports.SyncStrategy = exports.CLIOutputFormat = exports.AIProviderPreference = exports.NotificationFrequency = exports.LanguageCode = exports.ThemeVariant = exports.PreferenceCategory = void 0;
/**
 * User preference categories
 */
var PreferenceCategory;
(function (PreferenceCategory) {
    PreferenceCategory["INTERFACE"] = "interface";
    PreferenceCategory["EDITOR"] = "editor";
    PreferenceCategory["AI"] = "ai";
    PreferenceCategory["CLI"] = "cli";
    PreferenceCategory["NOTIFICATIONS"] = "notifications";
    PreferenceCategory["SECURITY"] = "security";
    PreferenceCategory["PERFORMANCE"] = "performance";
    PreferenceCategory["ACCESSIBILITY"] = "accessibility";
    PreferenceCategory["INTEGRATION"] = "integration";
    PreferenceCategory["CUSTOM"] = "custom";
})(PreferenceCategory || (exports.PreferenceCategory = PreferenceCategory = {}));
/**
 * Theme variants supported by the application
 */
var ThemeVariant;
(function (ThemeVariant) {
    ThemeVariant["LIGHT"] = "light";
    ThemeVariant["DARK"] = "dark";
    ThemeVariant["HIGH_CONTRAST"] = "high-contrast";
    ThemeVariant["AUTO"] = "auto";
    ThemeVariant["CUSTOM"] = "custom";
})(ThemeVariant || (exports.ThemeVariant = ThemeVariant = {}));
/**
 * Language codes for internationalization
 */
var LanguageCode;
(function (LanguageCode) {
    LanguageCode["EN_US"] = "en-US";
    LanguageCode["EN_GB"] = "en-GB";
    LanguageCode["ES_ES"] = "es-ES";
    LanguageCode["FR_FR"] = "fr-FR";
    LanguageCode["DE_DE"] = "de-DE";
    LanguageCode["IT_IT"] = "it-IT";
    LanguageCode["PT_BR"] = "pt-BR";
    LanguageCode["RU_RU"] = "ru-RU";
    LanguageCode["ZH_CN"] = "zh-CN";
    LanguageCode["ZH_TW"] = "zh-TW";
    LanguageCode["JA_JP"] = "ja-JP";
    LanguageCode["KO_KR"] = "ko-KR";
})(LanguageCode || (exports.LanguageCode = LanguageCode = {}));
/**
 * Notification frequency options
 */
var NotificationFrequency;
(function (NotificationFrequency) {
    NotificationFrequency["REALTIME"] = "realtime";
    NotificationFrequency["HOURLY"] = "hourly";
    NotificationFrequency["DAILY"] = "daily";
    NotificationFrequency["WEEKLY"] = "weekly";
    NotificationFrequency["MONTHLY"] = "monthly";
    NotificationFrequency["NEVER"] = "never";
})(NotificationFrequency || (exports.NotificationFrequency = NotificationFrequency = {}));
/**
 * AI provider preferences
 */
var AIProviderPreference;
(function (AIProviderPreference) {
    AIProviderPreference["OPENAI"] = "openai";
    AIProviderPreference["ANTHROPIC"] = "anthropic";
    AIProviderPreference["AZURE"] = "azure";
    AIProviderPreference["GOOGLE"] = "google";
    AIProviderPreference["LOCAL"] = "local";
    AIProviderPreference["CUSTOM"] = "custom";
    AIProviderPreference["AUTO"] = "auto";
})(AIProviderPreference || (exports.AIProviderPreference = AIProviderPreference = {}));
/**
 * CLI output format preferences
 */
var CLIOutputFormat;
(function (CLIOutputFormat) {
    CLIOutputFormat["JSON"] = "json";
    CLIOutputFormat["YAML"] = "yaml";
    CLIOutputFormat["TABLE"] = "table";
    CLIOutputFormat["TEXT"] = "text";
    CLIOutputFormat["MINIMAL"] = "minimal";
})(CLIOutputFormat || (exports.CLIOutputFormat = CLIOutputFormat = {}));
/**
 * Preference sync strategy
 */
var SyncStrategy;
(function (SyncStrategy) {
    SyncStrategy["LOCAL_ONLY"] = "local-only";
    SyncStrategy["CLOUD_SYNC"] = "cloud-sync";
    SyncStrategy["MANUAL_EXPORT"] = "manual-export";
    SyncStrategy["TEAM_SHARED"] = "team-shared";
})(SyncStrategy || (exports.SyncStrategy = SyncStrategy = {}));
/**
 * Factory for creating UserPreferences instances
 */
class UserPreferencesFactory {
    /**
     * Creates a new user preferences instance with defaults
     */
    static create(params) {
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
    static fromData(data) {
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
    static update(preferences, updates) {
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
    static createProfile(base, profileName, overrides) {
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
    static merge(base, ...overrides) {
        let result = { ...base };
        for (const override of overrides) {
            result = this.update(result, override);
        }
        return result;
    }
    /**
     * Generates a unique preferences ID
     */
    static generatePreferencesId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `pref_${timestamp}_${random}`;
    }
    /**
     * Creates default interface preferences
     */
    static createDefaultInterfacePreferences(overrides) {
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
    static createDefaultEditorPreferences(overrides) {
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
    static createDefaultAIPreferences(overrides) {
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
    static createDefaultCLIPreferences(overrides) {
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
    static createDefaultNotificationPreferences(overrides) {
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
    static createDefaultSecurityPreferences(overrides) {
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
    static createDefaultPerformancePreferences(overrides) {
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
    static createDefaultAccessibilityPreferences(overrides) {
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
    static createDefaultIntegrationPreferences(overrides) {
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
    static createDefaultCustomPreferences(overrides) {
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
exports.UserPreferencesFactory = UserPreferencesFactory;
/**
 * Utilities for working with user preferences
 */
class UserPreferencesUtils {
    /**
     * Validates user preferences
     */
    static validate(preferences) {
        const errors = [];
        const warnings = [];
        const suggestions = [];
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
    static export(preferences, config) {
        // Filter preferences by categories
        const filtered = this.filterByCategories(preferences, config.categories);
        // Create export data
        const exportData = {
            preferences: filtered,
            ...(config.includeMetadata && { metadata: preferences.metadata }),
            ...(config.includeCustom && { custom: preferences.custom })
        };
        // Convert to requested format
        let data;
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
        const metadata = {
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
    static import(data, metadata, basePreferences) {
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
        let importData;
        try {
            importData = JSON.parse(data);
        }
        catch (error) {
            throw new Error('Invalid JSON data');
        }
        // Merge with base preferences
        return UserPreferencesFactory.merge(basePreferences, importData.preferences);
    }
    /**
     * Compares two preference objects and identifies differences
     */
    static compare(preferences1, preferences2) {
        const changes = [];
        // Compare each category
        for (const category of Object.values(PreferenceCategory)) {
            const obj1 = preferences1[category] || {};
            const obj2 = preferences2[category] || {};
            const categoryChanges = this.compareObjects(obj1, obj2, category);
            changes.push(...categoryChanges);
        }
        // Create summary
        const byCategory = {};
        const byType = {};
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
    static sync(local, remote, strategy = 'merge') {
        const comparison = this.compare(local, remote);
        const conflicts = [];
        if (comparison.changes.length === 0) {
            return {
                result: local,
                conflicts: [],
                status: 'success'
            };
        }
        let result;
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
    static createOptimizedProfile(base, optimization) {
        let overrides;
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
    static filterByCategories(preferences, categories) {
        const filtered = {};
        for (const category of categories) {
            if (preferences[category]) {
                filtered[category] = preferences[category];
            }
        }
        return filtered;
    }
    /**
     * Compares two objects and returns differences
     */
    static compareObjects(obj1, obj2, category) {
        const changes = [];
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
            }
            else if (!(key in obj2)) {
                changes.push({
                    category,
                    field: key,
                    oldValue: obj1[key],
                    newValue: undefined,
                    type: 'removed'
                });
            }
            else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
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
    static toYAML(obj) {
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
    static toBinary(obj) {
        // Simple binary converter - in real implementation, use proper binary serialization
        const json = JSON.stringify(obj);
        return this.base64Encode(json);
    }
    /**
     * Encrypts data using a simple algorithm
     */
    static encrypt(data) {
        // Simple encryption - in real implementation, use proper encryption
        return this.base64Encode(data);
    }
    /**
     * Decrypts data
     */
    static decrypt(data) {
        // Simple decryption - in real implementation, use proper decryption
        return this.base64Decode(data);
    }
    /**
     * Compresses data
     */
    static compress(data) {
        // Simple compression - in real implementation, use proper compression
        return this.base64Encode(data);
    }
    /**
     * Decompresses data
     */
    static decompress(data) {
        // Simple decompression - in real implementation, use proper decompression
        return this.base64Decode(data);
    }
    /**
     * Calculates checksum for data integrity
     */
    static calculateChecksum(data) {
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
    static base64Encode(str) {
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
    static base64Decode(str) {
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
                if (encoded3 !== 64)
                    result += String.fromCharCode((bitmap >> 8) & 255);
                if (encoded4 !== 64)
                    result += String.fromCharCode(bitmap & 255);
            }
            return result;
        }
        catch {
            return str; // Return original on decode error
        }
    }
    /**
     * Gets device information
     */
    static getDeviceInfo() {
        // Simple platform-agnostic device info
        return 'typescript-environment';
    }
}
exports.UserPreferencesUtils = UserPreferencesUtils;
/**
 * Predefined user preference profiles
 */
class UserPreferenceProfiles {
    /**
     * Developer-focused preferences
     */
    static developer(userId) {
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
    static writer(userId) {
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
    static teamLead(userId) {
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
    static enterprise(userId) {
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
exports.UserPreferenceProfiles = UserPreferenceProfiles;
//# sourceMappingURL=user-preferences.js.map