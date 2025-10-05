"use strict";
/**
 * Template Model
 *
 * Represents templates for documentation generation with theme management,
 * rendering capabilities, asset handling, and customization support.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultThemeFactory = exports.TemplateUtils = exports.TemplateFactory = exports.TemplateStatus = exports.ThemeVariant = exports.AssetType = exports.TemplateEngine = exports.TemplateType = void 0;
/**
 * Template type enumeration
 */
var TemplateType;
(function (TemplateType) {
    TemplateType["HTML"] = "html";
    TemplateType["MARKDOWN"] = "markdown";
    TemplateType["PDF"] = "pdf";
    TemplateType["JSON"] = "json";
    TemplateType["OPENAPI"] = "openapi";
    TemplateType["POSTMAN"] = "postman";
    TemplateType["CONFLUENCE"] = "confluence";
    TemplateType["GITBOOK"] = "gitbook";
    TemplateType["CUSTOM"] = "custom";
})(TemplateType || (exports.TemplateType = TemplateType = {}));
/**
 * Template engine enumeration
 */
var TemplateEngine;
(function (TemplateEngine) {
    TemplateEngine["HANDLEBARS"] = "handlebars";
    TemplateEngine["MUSTACHE"] = "mustache";
    TemplateEngine["LIQUID"] = "liquid";
    TemplateEngine["EJS"] = "ejs";
    TemplateEngine["PUG"] = "pug";
    TemplateEngine["NUNJUCKS"] = "nunjucks";
    TemplateEngine["CUSTOM"] = "custom";
})(TemplateEngine || (exports.TemplateEngine = TemplateEngine = {}));
/**
 * Asset type enumeration
 */
var AssetType;
(function (AssetType) {
    AssetType["STYLESHEET"] = "stylesheet";
    AssetType["JAVASCRIPT"] = "javascript";
    AssetType["IMAGE"] = "image";
    AssetType["FONT"] = "font";
    AssetType["ICON"] = "icon";
    AssetType["VIDEO"] = "video";
    AssetType["AUDIO"] = "audio";
    AssetType["DOCUMENT"] = "document";
    AssetType["DATA"] = "data";
})(AssetType || (exports.AssetType = AssetType = {}));
/**
 * Theme variant enumeration
 */
var ThemeVariant;
(function (ThemeVariant) {
    ThemeVariant["LIGHT"] = "light";
    ThemeVariant["DARK"] = "dark";
    ThemeVariant["AUTO"] = "auto";
    ThemeVariant["HIGH_CONTRAST"] = "high-contrast";
    ThemeVariant["PRINT"] = "print";
})(ThemeVariant || (exports.ThemeVariant = ThemeVariant = {}));
/**
 * Template status enumeration
 */
var TemplateStatus;
(function (TemplateStatus) {
    TemplateStatus["DRAFT"] = "draft";
    TemplateStatus["ACTIVE"] = "active";
    TemplateStatus["DEPRECATED"] = "deprecated";
    TemplateStatus["ARCHIVED"] = "archived";
})(TemplateStatus || (exports.TemplateStatus = TemplateStatus = {}));
/**
 * Factory for creating Template instances
 */
class TemplateFactory {
    /**
     * Creates a new template
     */
    static create(params) {
        const now = new Date();
        return {
            id: this.generateTemplateId(),
            name: params.name,
            description: params.description,
            version: '1.0.0',
            type: params.type,
            engine: params.engine,
            status: TemplateStatus.DRAFT,
            mainTemplate: params.mainTemplate,
            partialTemplates: {},
            helpers: {},
            filters: {},
            theme: params.theme,
            assets: [],
            assetManifest: {},
            configuration: this.createDefaultConfiguration(params.configuration),
            customization: this.createDefaultCustomization(),
            supportedFormats: [params.type],
            author: params.author,
            license: params.license,
            tags: params.tags ?? [],
            createdAt: now,
            updatedAt: now,
            metadata: params.metadata ?? {}
        };
    }
    /**
     * Creates a template from existing data
     */
    static fromData(data) {
        const now = new Date();
        return {
            description: '',
            version: '1.0.0',
            status: TemplateStatus.DRAFT,
            partialTemplates: {},
            helpers: {},
            filters: {},
            assets: [],
            assetManifest: {},
            configuration: this.createDefaultConfiguration(),
            customization: this.createDefaultCustomization(),
            supportedFormats: [data.type],
            tags: [],
            createdAt: now,
            updatedAt: now,
            metadata: {},
            ...data
        };
    }
    /**
     * Updates an existing template
     */
    static update(template, updates) {
        return {
            ...template,
            ...updates,
            updatedAt: new Date(),
            // Merge nested objects
            partialTemplates: updates.partialTemplates ?
                { ...template.partialTemplates, ...updates.partialTemplates } :
                template.partialTemplates,
            helpers: updates.helpers ?
                { ...template.helpers, ...updates.helpers } :
                template.helpers,
            filters: updates.filters ?
                { ...template.filters, ...updates.filters } :
                template.filters,
            theme: updates.theme ?
                { ...template.theme, ...updates.theme } :
                template.theme,
            configuration: updates.configuration ?
                { ...template.configuration, ...updates.configuration } :
                template.configuration,
            customization: updates.customization ?
                { ...template.customization, ...updates.customization } :
                template.customization,
            metadata: updates.metadata ?
                { ...template.metadata, ...updates.metadata } :
                template.metadata
        };
    }
    /**
     * Creates a template variant for different theme
     */
    static createVariant(template, variant, themeOverrides) {
        const newTheme = {
            ...template.theme,
            variant,
            ...themeOverrides
        };
        return this.update(template, {
            name: `${template.name} (${variant})`,
            theme: newTheme,
            version: this.incrementVersion(template.version, 'minor')
        });
    }
    /**
     * Activates a template
     */
    static activate(template) {
        return this.update(template, {
            status: TemplateStatus.ACTIVE
        });
    }
    /**
     * Deprecates a template
     */
    static deprecate(template, reason) {
        const metadata = reason ?
            { ...template.metadata, deprecationReason: reason } :
            template.metadata;
        return this.update(template, {
            status: TemplateStatus.DEPRECATED,
            metadata
        });
    }
    /**
     * Archives a template
     */
    static archive(template) {
        return this.update(template, {
            status: TemplateStatus.ARCHIVED
        });
    }
    static generateTemplateId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `template_${timestamp}_${random}`;
    }
    static createDefaultConfiguration(overrides) {
        return {
            enableMinification: true,
            enableSourceMaps: false,
            enableCaching: true,
            enableCompression: true,
            compressionLevel: 6,
            assetOptimization: {
                optimizeImages: true,
                optimizeCSS: true,
                optimizeJS: true,
                generateWebP: true,
                generateAVIF: false
            },
            rendering: {
                strictMode: true,
                escapeHTML: true,
                allowUnsafeHTML: false,
                maxRenderDepth: 100,
                timeout: 30000
            },
            accessibility: {
                enableA11y: true,
                contrastRatio: 4.5,
                skipLinks: true,
                ariaLabels: true
            },
            seo: {
                generateSitemap: true,
                metaTags: true,
                openGraph: true,
                structuredData: true
            },
            ...overrides
        };
    }
    static createDefaultCustomization() {
        return {
            overrideTemplates: {},
            customHelpers: {},
            customPartials: {},
            customFilters: {},
            additionalAssets: [],
            themeOverrides: {},
            layoutModifications: {}
        };
    }
    static incrementVersion(version, type) {
        const parts = version.split('.').map(Number);
        // Ensure we have at least 3 parts
        while (parts.length < 3) {
            parts.push(0);
        }
        switch (type) {
            case 'major':
                return `${(parts[0] ?? 0) + 1}.0.0`;
            case 'minor':
                return `${parts[0] ?? 0}.${(parts[1] ?? 0) + 1}.0`;
            case 'patch':
                return `${parts[0] ?? 0}.${parts[1] ?? 0}.${(parts[2] ?? 0) + 1}`;
            default:
                return version;
        }
    }
}
exports.TemplateFactory = TemplateFactory;
/**
 * Utility functions for working with templates
 */
class TemplateUtils {
    /**
     * Validates a template
     */
    static validate(template) {
        const errors = [];
        const warnings = [];
        const missingAssets = [];
        const unusedAssets = [];
        const brokenDependencies = [];
        // Basic validation
        if (!template.name.trim()) {
            errors.push('Template name is required');
        }
        if (!template.mainTemplate.trim()) {
            errors.push('Main template content is required');
        }
        // Asset validation
        const referencedAssets = this.extractAssetReferences(template);
        const availableAssets = new Set(template.assets.map(asset => asset.id));
        // Check for missing assets
        for (const assetId of referencedAssets) {
            if (!availableAssets.has(assetId)) {
                missingAssets.push(assetId);
            }
        }
        // Check for unused assets
        for (const asset of template.assets) {
            if (!referencedAssets.has(asset.id)) {
                unusedAssets.push(asset.id);
            }
        }
        // Check asset dependencies
        for (const asset of template.assets) {
            for (const depId of asset.dependencies) {
                if (!availableAssets.has(depId)) {
                    brokenDependencies.push(`${asset.id} -> ${depId}`);
                }
            }
        }
        // Configuration validation
        if (template.configuration.rendering.timeout < 1000) {
            warnings.push('Rendering timeout is very low (< 1s)');
        }
        if (template.configuration.rendering.maxRenderDepth < 10) {
            warnings.push('Max render depth is very low (< 10)');
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            missingAssets,
            unusedAssets,
            brokenDependencies
        };
    }
    /**
     * Calculates template metrics
     */
    static calculateMetrics(template, renderTime) {
        const totalSize = template.assets.reduce((sum, asset) => sum + asset.size, 0);
        return {
            renderTime: renderTime ?? 0,
            assetLoadTime: 0, // Would be measured during actual rendering
            totalSize,
            compressedSize: Math.floor(totalSize * 0.7), // Estimated compression
            assetCount: template.assets.length,
            cacheHits: 0,
            cacheMisses: 0
        };
    }
    /**
     * Checks if template is compatible with a format
     */
    static isCompatible(template, format) {
        return template.supportedFormats.includes(format);
    }
    /**
     * Gets template by variant
     */
    static getByVariant(templates, variant) {
        return templates.filter(template => template.theme.variant === variant);
    }
    /**
     * Gets active templates
     */
    static getActive(templates) {
        return templates.filter(template => template.status === TemplateStatus.ACTIVE);
    }
    /**
     * Gets templates by type
     */
    static getByType(templates, type) {
        return templates.filter(template => template.type === type);
    }
    /**
     * Finds template by name
     */
    static findByName(templates, name) {
        return templates.find(template => template.name === name);
    }
    /**
     * Sorts templates by creation date
     */
    static sortByCreated(templates, descending = true) {
        return [...templates].sort((a, b) => {
            const diff = a.createdAt.getTime() - b.createdAt.getTime();
            return descending ? -diff : diff;
        });
    }
    /**
     * Sorts templates by update date
     */
    static sortByUpdated(templates, descending = true) {
        return [...templates].sort((a, b) => {
            const diff = a.updatedAt.getTime() - b.updatedAt.getTime();
            return descending ? -diff : diff;
        });
    }
    /**
     * Creates a template summary
     */
    static createSummary(template) {
        const validation = this.validate(template);
        const metrics = this.calculateMetrics(template);
        return {
            id: template.id,
            name: template.name,
            type: template.type,
            status: template.status,
            version: template.version,
            assetCount: template.assets.length,
            totalSize: metrics.totalSize,
            isValid: validation.isValid,
            lastUpdated: template.updatedAt
        };
    }
    static extractAssetReferences(template) {
        const references = new Set();
        // Extract from main template
        const mainRefs = this.extractReferencesFromContent(template.mainTemplate);
        mainRefs.forEach(ref => references.add(ref));
        // Extract from layout template
        if (template.layoutTemplate) {
            const layoutRefs = this.extractReferencesFromContent(template.layoutTemplate);
            layoutRefs.forEach(ref => references.add(ref));
        }
        // Extract from partial templates
        Object.values(template.partialTemplates).forEach(content => {
            const partialRefs = this.extractReferencesFromContent(content);
            partialRefs.forEach(ref => references.add(ref));
        });
        return references;
    }
    static extractReferencesFromContent(content) {
        const references = [];
        // Simple regex patterns for common asset references
        const patterns = [
            /href=['"]([^'"]*\.css[^'"]*)['"]/g,
            /src=['"]([^'"]*\.(js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)[^'"]*)['"]/g,
            /url\(['"]?([^'"]*\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)[^'"]*)['"]?\)/g
        ];
        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                if (match[1]) {
                    references.push(match[1]);
                }
            }
        });
        return references;
    }
}
exports.TemplateUtils = TemplateUtils;
/**
 * Default theme factory
 */
class DefaultThemeFactory {
    /**
     * Creates a default light theme
     */
    static createLightTheme(overrides) {
        return {
            name: 'Default Light',
            variant: ThemeVariant.LIGHT,
            colors: {
                primary: '#007bff',
                secondary: '#6c757d',
                accent: '#17a2b8',
                background: '#ffffff',
                surface: '#f8f9fa',
                text: '#212529',
                textSecondary: '#6c757d',
                border: '#dee2e6',
                success: '#28a745',
                warning: '#ffc107',
                error: '#dc3545',
                info: '#17a2b8'
            },
            typography: {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                codeFont: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                baseFontSize: '16px',
                lineHeight: 1.5,
                headingScale: 1.25
            },
            spacing: {
                baseUnit: 8,
                containerPadding: '1rem',
                sectionGap: '2rem',
                elementGap: '1rem'
            },
            layout: {
                maxWidth: '1200px',
                sidebarWidth: '280px',
                headerHeight: '64px',
                footerHeight: '80px'
            },
            customProperties: {},
            ...overrides
        };
    }
    /**
     * Creates a default dark theme
     */
    static createDarkTheme(overrides) {
        return {
            name: 'Default Dark',
            variant: ThemeVariant.DARK,
            colors: {
                primary: '#0d6efd',
                secondary: '#6c757d',
                accent: '#20c997',
                background: '#121212',
                surface: '#1e1e1e',
                text: '#ffffff',
                textSecondary: '#adb5bd',
                border: '#343a40',
                success: '#198754',
                warning: '#fd7e14',
                error: '#dc3545',
                info: '#0dcaf0'
            },
            typography: {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                codeFont: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                baseFontSize: '16px',
                lineHeight: 1.5,
                headingScale: 1.25
            },
            spacing: {
                baseUnit: 8,
                containerPadding: '1rem',
                sectionGap: '2rem',
                elementGap: '1rem'
            },
            layout: {
                maxWidth: '1200px',
                sidebarWidth: '280px',
                headerHeight: '64px',
                footerHeight: '80px'
            },
            customProperties: {},
            ...overrides
        };
    }
    /**
     * Creates a high contrast theme
     */
    static createHighContrastTheme(overrides) {
        return {
            name: 'High Contrast',
            variant: ThemeVariant.HIGH_CONTRAST,
            colors: {
                primary: '#0000ff',
                secondary: '#808080',
                accent: '#ff00ff',
                background: '#000000',
                surface: '#000000',
                text: '#ffffff',
                textSecondary: '#c0c0c0',
                border: '#ffffff',
                success: '#00ff00',
                warning: '#ffff00',
                error: '#ff0000',
                info: '#00ffff'
            },
            typography: {
                fontFamily: 'Arial, sans-serif',
                codeFont: 'Courier New, monospace',
                baseFontSize: '18px',
                lineHeight: 1.6,
                headingScale: 1.3
            },
            spacing: {
                baseUnit: 10,
                containerPadding: '1.5rem',
                sectionGap: '2.5rem',
                elementGap: '1.5rem'
            },
            layout: {
                maxWidth: '1200px',
                sidebarWidth: '320px',
                headerHeight: '80px',
                footerHeight: '100px'
            },
            customProperties: {},
            ...overrides
        };
    }
}
exports.DefaultThemeFactory = DefaultThemeFactory;
//# sourceMappingURL=template.js.map