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
export enum TemplateType {
  HTML = 'html',
  MARKDOWN = 'markdown',
  PDF = 'pdf',
  JSON = 'json',
  OPENAPI = 'openapi',
  POSTMAN = 'postman',
  CONFLUENCE = 'confluence',
  GITBOOK = 'gitbook',
  CUSTOM = 'custom'
}

/**
 * Template engine enumeration
 */
export enum TemplateEngine {
  HANDLEBARS = 'handlebars',
  MUSTACHE = 'mustache',
  LIQUID = 'liquid',
  EJS = 'ejs',
  PUG = 'pug',
  NUNJUCKS = 'nunjucks',
  CUSTOM = 'custom'
}

/**
 * Asset type enumeration
 */
export enum AssetType {
  STYLESHEET = 'stylesheet',
  JAVASCRIPT = 'javascript',
  IMAGE = 'image',
  FONT = 'font',
  ICON = 'icon',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  DATA = 'data'
}

/**
 * Theme variant enumeration
 */
export enum ThemeVariant {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
  HIGH_CONTRAST = 'high-contrast',
  PRINT = 'print'
}

/**
 * Template status enumeration
 */
export enum TemplateStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  DEPRECATED = 'deprecated',
  ARCHIVED = 'archived'
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
  
  // Template content
  readonly mainTemplate: string;
  readonly layoutTemplate?: string;
  readonly partialTemplates: Record<string, string>;
  readonly helpers: Record<string, string>;
  readonly filters: Record<string, string>;
  
  // Theme and styling
  readonly theme: ThemeConfiguration;
  readonly assets: readonly TemplateAsset[];
  readonly assetManifest: Record<string, string>;
  
  // Configuration
  readonly configuration: TemplateConfiguration;
  readonly customization: TemplateCustomization;
  readonly supportedFormats: readonly TemplateType[];
  
  // Metadata
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
export class TemplateFactory {
  /**
   * Creates a new template
   */
  static create(params: CreateTemplateParams): Template {
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
  static fromData(data: Partial<Template> & { 
    id: string; 
    name: string; 
    type: TemplateType; 
    engine: TemplateEngine; 
    mainTemplate: string; 
    theme: ThemeConfiguration; 
    author: string; 
    license: string; 
  }): Template {
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
  static update(template: Template, updates: UpdateTemplateParams): Template {
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
  static createVariant(
    template: Template, 
    variant: ThemeVariant, 
    themeOverrides?: Partial<ThemeConfiguration>
  ): Template {
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
  static activate(template: Template): Template {
    return this.update(template, {
      status: TemplateStatus.ACTIVE
    });
  }

  /**
   * Deprecates a template
   */
  static deprecate(template: Template, reason?: string): Template {
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
  static archive(template: Template): Template {
    return this.update(template, {
      status: TemplateStatus.ARCHIVED
    });
  }

  private static generateTemplateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `template_${timestamp}_${random}`;
  }

  private static createDefaultConfiguration(overrides?: Partial<TemplateConfiguration>): TemplateConfiguration {
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

  private static createDefaultCustomization(): TemplateCustomization {
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

  private static incrementVersion(version: string, type: 'major' | 'minor' | 'patch'): string {
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

/**
 * Utility functions for working with templates
 */
export class TemplateUtils {
  /**
   * Validates a template
   */
  static validate(template: Template): TemplateValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingAssets: string[] = [];
    const unusedAssets: string[] = [];
    const brokenDependencies: string[] = [];

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
  static calculateMetrics(template: Template, renderTime?: number): TemplateMetrics {
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
  static isCompatible(template: Template, format: TemplateType): boolean {
    return template.supportedFormats.includes(format);
  }

  /**
   * Gets template by variant
   */
  static getByVariant(templates: Template[], variant: ThemeVariant): Template[] {
    return templates.filter(template => template.theme.variant === variant);
  }

  /**
   * Gets active templates
   */
  static getActive(templates: Template[]): Template[] {
    return templates.filter(template => template.status === TemplateStatus.ACTIVE);
  }

  /**
   * Gets templates by type
   */
  static getByType(templates: Template[], type: TemplateType): Template[] {
    return templates.filter(template => template.type === type);
  }

  /**
   * Finds template by name
   */
  static findByName(templates: Template[], name: string): Template | undefined {
    return templates.find(template => template.name === name);
  }

  /**
   * Sorts templates by creation date
   */
  static sortByCreated(templates: Template[], descending = true): Template[] {
    return [...templates].sort((a, b) => {
      const diff = a.createdAt.getTime() - b.createdAt.getTime();
      return descending ? -diff : diff;
    });
  }

  /**
   * Sorts templates by update date
   */
  static sortByUpdated(templates: Template[], descending = true): Template[] {
    return [...templates].sort((a, b) => {
      const diff = a.updatedAt.getTime() - b.updatedAt.getTime();
      return descending ? -diff : diff;
    });
  }

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
  } {
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

  private static extractAssetReferences(template: Template): Set<string> {
    const references = new Set<string>();
    
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

  private static extractReferencesFromContent(content: string): string[] {
    const references: string[] = [];
    
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

/**
 * Default theme factory
 */
export class DefaultThemeFactory {
  /**
   * Creates a default light theme
   */
  static createLightTheme(overrides?: Partial<ThemeConfiguration>): ThemeConfiguration {
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
  static createDarkTheme(overrides?: Partial<ThemeConfiguration>): ThemeConfiguration {
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
  static createHighContrastTheme(overrides?: Partial<ThemeConfiguration>): ThemeConfiguration {
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