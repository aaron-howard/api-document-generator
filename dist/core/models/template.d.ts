/**
 * Template Model
 *
 * Represents templates for documentation generation with theme management,
 * rendering capabilities, asset handling, and customization support.
 *
 * @packageDocumentation
 */
/**
 * Template type enumeration
 */
export declare enum TemplateType {
    HTML = "html",
    MARKDOWN = "markdown",
    PDF = "pdf",
    JSON = "json",
    OPENAPI = "openapi",
    POSTMAN = "postman",
    CONFLUENCE = "confluence",
    GITBOOK = "gitbook",
    CUSTOM = "custom"
}
/**
 * Template engine enumeration
 */
export declare enum TemplateEngine {
    HANDLEBARS = "handlebars",
    MUSTACHE = "mustache",
    LIQUID = "liquid",
    EJS = "ejs",
    PUG = "pug",
    NUNJUCKS = "nunjucks",
    CUSTOM = "custom"
}
/**
 * Asset type enumeration
 */
export declare enum AssetType {
    STYLESHEET = "stylesheet",
    JAVASCRIPT = "javascript",
    IMAGE = "image",
    FONT = "font",
    ICON = "icon",
    VIDEO = "video",
    AUDIO = "audio",
    DOCUMENT = "document",
    DATA = "data"
}
/**
 * Theme variant enumeration
 */
export declare enum ThemeVariant {
    LIGHT = "light",
    DARK = "dark",
    AUTO = "auto",
    HIGH_CONTRAST = "high-contrast",
    PRINT = "print"
}
/**
 * Template status enumeration
 */
export declare enum TemplateStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    DEPRECATED = "deprecated",
    ARCHIVED = "archived"
}
/**
 * Represents a template asset (CSS, JS, images, etc.)
 */
export interface TemplateAsset {
    readonly id: string;
    readonly type: AssetType;
    readonly name: string;
    readonly path: string;
    readonly url?: string;
    readonly size: number;
    readonly mimeType: string;
    readonly hash: string;
    readonly dependencies: readonly string[];
    readonly metadata: Record<string, any>;
    readonly lastModified: Date;
}
/**
 * Theme configuration
 */
export interface ThemeConfiguration {
    readonly name: string;
    readonly variant: ThemeVariant;
    readonly colors: {
        readonly primary: string;
        readonly secondary: string;
        readonly accent: string;
        readonly background: string;
        readonly surface: string;
        readonly text: string;
        readonly textSecondary: string;
        readonly border: string;
        readonly success: string;
        readonly warning: string;
        readonly error: string;
        readonly info: string;
    };
    readonly typography: {
        readonly fontFamily: string;
        readonly headingFont?: string;
        readonly codeFont: string;
        readonly baseFontSize: string;
        readonly lineHeight: number;
        readonly headingScale: number;
    };
    readonly spacing: {
        readonly baseUnit: number;
        readonly containerPadding: string;
        readonly sectionGap: string;
        readonly elementGap: string;
    };
    readonly layout: {
        readonly maxWidth: string;
        readonly sidebarWidth: string;
        readonly headerHeight: string;
        readonly footerHeight: string;
    };
    readonly customProperties: Record<string, string>;
}
/**
 * Template rendering context
 */
export interface RenderingContext {
    readonly project: {
        readonly name: string;
        readonly version: string;
        readonly description: string;
        readonly baseUrl?: string;
    };
    readonly api: {
        readonly endpoints: readonly any[];
        readonly schemas: readonly any[];
        readonly servers: readonly any[];
        readonly tags: readonly any[];
    };
    readonly generation: {
        readonly timestamp: Date;
        readonly version: string;
        readonly format: string;
    };
    readonly theme: ThemeConfiguration;
    readonly customData: Record<string, any>;
}
/**
 * Template customization options
 */
export interface TemplateCustomization {
    readonly overrideTemplates: Record<string, string>;
    readonly customHelpers: Record<string, string>;
    readonly customPartials: Record<string, string>;
    readonly customFilters: Record<string, string>;
    readonly additionalAssets: readonly TemplateAsset[];
    readonly themeOverrides: Partial<ThemeConfiguration>;
    readonly layoutModifications: Record<string, any>;
}
/**
 * Template validation result
 */
export interface TemplateValidationResult {
    readonly isValid: boolean;
    readonly errors: readonly string[];
    readonly warnings: readonly string[];
    readonly missingAssets: readonly string[];
    readonly unusedAssets: readonly string[];
    readonly brokenDependencies: readonly string[];
}
/**
 * Template performance metrics
 */
export interface TemplateMetrics {
    readonly renderTime: number;
    readonly assetLoadTime: number;
    readonly totalSize: number;
    readonly compressedSize: number;
    readonly assetCount: number;
    readonly cacheHits: number;
    readonly cacheMisses: number;
}
/**
 * Represents a documentation template
 */
export interface Template {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly version: string;
    readonly type: TemplateType;
    readonly engine: TemplateEngine;
    readonly status: TemplateStatus;
    readonly mainTemplate: string;
    readonly layoutTemplate?: string;
    readonly partialTemplates: Record<string, string>;
    readonly helpers: Record<string, string>;
    readonly filters: Record<string, string>;
    readonly theme: ThemeConfiguration;
    readonly assets: readonly TemplateAsset[];
    readonly assetManifest: Record<string, string>;
    readonly configuration: TemplateConfiguration;
    readonly customization: TemplateCustomization;
    readonly supportedFormats: readonly TemplateType[];
    readonly author: string;
    readonly license: string;
    readonly repository?: string;
    readonly documentation?: string;
    readonly tags: readonly string[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly metadata: Record<string, any>;
}
/**
 * Template configuration options
 */
export interface TemplateConfiguration {
    readonly enableMinification: boolean;
    readonly enableSourceMaps: boolean;
    readonly enableCaching: boolean;
    readonly enableCompression: boolean;
    readonly compressionLevel: number;
    readonly assetOptimization: {
        readonly optimizeImages: boolean;
        readonly optimizeCSS: boolean;
        readonly optimizeJS: boolean;
        readonly generateWebP: boolean;
        readonly generateAVIF: boolean;
    };
    readonly rendering: {
        readonly strictMode: boolean;
        readonly escapeHTML: boolean;
        readonly allowUnsafeHTML: boolean;
        readonly maxRenderDepth: number;
        readonly timeout: number;
    };
    readonly accessibility: {
        readonly enableA11y: boolean;
        readonly contrastRatio: number;
        readonly skipLinks: boolean;
        readonly ariaLabels: boolean;
    };
    readonly seo: {
        readonly generateSitemap: boolean;
        readonly metaTags: boolean;
        readonly openGraph: boolean;
        readonly structuredData: boolean;
    };
}
/**
 * Template creation parameters
 */
export interface CreateTemplateParams {
    readonly name: string;
    readonly description: string;
    readonly type: TemplateType;
    readonly engine: TemplateEngine;
    readonly mainTemplate: string;
    readonly theme: ThemeConfiguration;
    readonly configuration?: Partial<TemplateConfiguration>;
    readonly author: string;
    readonly license: string;
    readonly tags?: readonly string[];
    readonly metadata?: Record<string, any>;
}
/**
 * Template update parameters
 */
export interface UpdateTemplateParams {
    readonly name?: string;
    readonly description?: string;
    readonly version?: string;
    readonly status?: TemplateStatus;
    readonly mainTemplate?: string;
    readonly layoutTemplate?: string;
    readonly partialTemplates?: Record<string, string>;
    readonly helpers?: Record<string, string>;
    readonly filters?: Record<string, string>;
    readonly theme?: ThemeConfiguration;
    readonly assets?: readonly TemplateAsset[];
    readonly configuration?: Partial<TemplateConfiguration>;
    readonly customization?: Partial<TemplateCustomization>;
    readonly tags?: readonly string[];
    readonly metadata?: Record<string, any>;
}
/**
 * Factory for creating Template instances
 */
export declare class TemplateFactory {
    /**
     * Creates a new template
     */
    static create(params: CreateTemplateParams): Template;
    /**
     * Creates a template from existing data
     */
    static fromData(data: Partial<Template> & {
        id: string;
        name: string;
        type: TemplateType;
        engine: TemplateEngine;
        mainTemplate: string;
        theme: ThemeConfiguration;
        author: string;
        license: string;
    }): Template;
    /**
     * Updates an existing template
     */
    static update(template: Template, updates: UpdateTemplateParams): Template;
    /**
     * Creates a template variant for different theme
     */
    static createVariant(template: Template, variant: ThemeVariant, themeOverrides?: Partial<ThemeConfiguration>): Template;
    /**
     * Activates a template
     */
    static activate(template: Template): Template;
    /**
     * Deprecates a template
     */
    static deprecate(template: Template, reason?: string): Template;
    /**
     * Archives a template
     */
    static archive(template: Template): Template;
    private static generateTemplateId;
    private static createDefaultConfiguration;
    private static createDefaultCustomization;
    private static incrementVersion;
}
/**
 * Utility functions for working with templates
 */
export declare class TemplateUtils {
    /**
     * Validates a template
     */
    static validate(template: Template): TemplateValidationResult;
    /**
     * Calculates template metrics
     */
    static calculateMetrics(template: Template, renderTime?: number): TemplateMetrics;
    /**
     * Checks if template is compatible with a format
     */
    static isCompatible(template: Template, format: TemplateType): boolean;
    /**
     * Gets template by variant
     */
    static getByVariant(templates: Template[], variant: ThemeVariant): Template[];
    /**
     * Gets active templates
     */
    static getActive(templates: Template[]): Template[];
    /**
     * Gets templates by type
     */
    static getByType(templates: Template[], type: TemplateType): Template[];
    /**
     * Finds template by name
     */
    static findByName(templates: Template[], name: string): Template | undefined;
    /**
     * Sorts templates by creation date
     */
    static sortByCreated(templates: Template[], descending?: boolean): Template[];
    /**
     * Sorts templates by update date
     */
    static sortByUpdated(templates: Template[], descending?: boolean): Template[];
    /**
     * Creates a template summary
     */
    static createSummary(template: Template): {
        id: string;
        name: string;
        type: TemplateType;
        status: TemplateStatus;
        version: string;
        assetCount: number;
        totalSize: number;
        isValid: boolean;
        lastUpdated: Date;
    };
    private static extractAssetReferences;
    private static extractReferencesFromContent;
}
/**
 * Default theme factory
 */
export declare class DefaultThemeFactory {
    /**
     * Creates a default light theme
     */
    static createLightTheme(overrides?: Partial<ThemeConfiguration>): ThemeConfiguration;
    /**
     * Creates a default dark theme
     */
    static createDarkTheme(overrides?: Partial<ThemeConfiguration>): ThemeConfiguration;
    /**
     * Creates a high contrast theme
     */
    static createHighContrastTheme(overrides?: Partial<ThemeConfiguration>): ThemeConfiguration;
}
//# sourceMappingURL=template.d.ts.map