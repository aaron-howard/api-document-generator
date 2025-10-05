/**
 * Core data models and types for the API Documentation Generator
 * 
 * This module exports all the fundamental data structures used throughout
 * the application for representing API specifications, schemas, and metadata.
 */

// API Specification models
export {
  ApiSpecification,
  ApiSpecFormat,
  ApiMetadata,
  ContactInfo,
  LicenseInfo,
  SourceInfo,
  ApiEndpoint,
  HttpMethod,
  Parameter,
  RequestBody,
  Response,
  MediaType,
  Header,
  Link,
  Encoding,
  ExampleObject,
  Callback,
  ServerInfo,
  Tag,
  ExternalDocumentation,
  SecurityScheme,
  SecuritySchemeType,
  OAuthFlows,
  OAuthFlow,
  SourceLocation,
  ApiSpecificationFactory,
} from './api-spec';

// Schema and data model types
export {
  DataModel,
  SchemaObject,
  SchemaType,
  Discriminator,
  XmlObject,
  SchemaUtils,
} from './schema';

// Input source models
export {
  InputSource,
  InputSourceType,
  InputSourceState,
  InputSourceMetadata,
  InputSourceError,
  ParserConfiguration,
  TypeScriptParserConfig,
  PythonParserConfig,
  GoParserConfig,
  JavaParserConfig,
  OpenApiParserConfig,
  JSDocParserConfig,
  FilePattern,
  ParsedFile,
  ParseError,
  InputSourceStats,
  InputSourceFactory,
  InputSourceUtils,
} from './input-source';

// Parsed endpoint models
export {
  ParsedEndpoint,
  EndpointParameter,
  ParameterLocation,
  ParameterStyle,
  ParameterExample,
  ParsedRequestBody,
  ContentType,
  EncodingObject,
  RequestBodyExample,
  ParsedResponse,
  ResponseHeader,
  ResponseLink,
  ServerReference,
  ServerVariable,
  ResponseExample,
  ContentExample,
  EndpointExample,
  ExampleRequest,
  ExampleResponse,
  SecurityRequirement,
  EndpointSourceLocation,
  EndpointMetadata,
  ExtractionMethod,
  EndpointValidation,
  ValidationError,
  ValidationWarning,
  ValidationSuggestion,
  ParsedEndpointFactory,
  ParsedEndpointUtils,
} from './parsed-endpoint';

// AI-generated content models
export {
  AISummary,
  AITargetType,
  AISummaryType,
  AIGeneratedContent,
  ContentFormat,
  ContentSection,
  SectionType,
  AIExample,
  ExampleComplexity,
  CodeSnippet,
  ContentLink,
  LinkType,
  AIModelInfo,
  AIProvider,
  ModelCapability,
  ModelConfiguration,
  AIPromptInfo,
  PromptType,
  TokenUsage,
  PromptContext,
  AIContentValidation,
  ValidationIssue,
  ValidationIssueType,
  IssueSeverity,
  ValidationSuggestion as AIValidationSuggestion,
  SuggestionType,
  SuggestionPriority,
  AISummaryMetadata,
  HumanReview,
  ReviewStatus,
  ReviewChange,
  ChangeType,
  ReviewRating,
  ReviewMetadata,
  ReviewMethod,
  AISummaryFactory,
  AISummaryUtils,
  AISummaryStatistics,
} from './ai-summary';

// Generation session models
export {
  GenerationSession,
  GenerationStatus,
  OutputFormat,
  ErrorSeverity,
  WarningCategory,
  GenerationError,
  GenerationWarning,
  PerformanceMetrics as SessionPerformanceMetrics,
  ProgressInfo,
  SessionConfiguration,
  CreateSessionParams,
  UpdateSessionParams,
  GenerationSessionFactory,
  GenerationSessionUtils,
  DefaultSessionConfigurationFactory,
} from './generation-session';

// Template models
export {
  Template,
  TemplateType,
  TemplateEngine,
  AssetType,
  ThemeVariant,
  TemplateStatus,
  TemplateAsset,
  ThemeConfiguration,
  RenderingContext,
  TemplateCustomization,
  TemplateValidationResult,
  TemplateMetrics,
  TemplateConfiguration,
  CreateTemplateParams,
  UpdateTemplateParams,
  TemplateFactory,
  TemplateUtils,
  DefaultThemeFactory,
} from './template';

// Cache models
export {
  Cache,
  CacheLevel,
  CacheStrategy,
  InvalidationTrigger,
  CacheEntryStatus,
  StorageType,
  CacheEntry,
  CacheEntryMetadata,
  CacheConfiguration,
  CacheMetrics,
  InvalidationRule,
  CacheOperationResult,
  CacheLayer,
  CreateCacheParams,
  UpdateCacheParams,
  CacheFactory,
  CacheUtils,
  CachePresets,
} from './cache';

// Configuration models
export {
  Configuration,
  Environment,
  LogLevel,
  SecurityLevel,
  AccessControlMode,
  CIPlatform,
  ThemeSettings,
  AISettings,
  OutputSettings,
  ParserSettings,
  SecuritySettings,
  PerformanceSettings,
  IntegrationSettings,
  UserPreferences,
  EnvironmentConfig,
  CreateConfigurationParams,
  UpdateConfigurationParams,
  ConfigurationValidationResult,
  ConfigurationFactory,
  ConfigurationUtils,
  ConfigurationPresets,
} from './configuration';

// Re-export commonly used types for convenience
export type {
  // Core specification types
  ApiSpecification as Specification,
  ApiEndpoint as Endpoint,
  ApiMetadata as Metadata,
} from './api-spec';

export type {
  // Schema types
  SchemaObject as Schema,
  DataModel as Model,
} from './schema';

export type {
  // Generation session types
  GenerationSession as Session,
  SessionConfiguration as SessionConfig,
  PerformanceMetrics as Metrics,
} from './generation-session';

export type {
  // Template types
  Template as DocTemplate,
  ThemeConfiguration as Theme,
  TemplateAsset as Asset,
} from './template';

export type {
  // Cache types
  Cache as CacheSystem,
  CacheEntry as CacheItem,
  CacheLayer as Layer,
} from './cache';

export type {
  // Configuration types
  Configuration as Config,
  ThemeSettings as Themes,
  AISettings as AI,
} from './configuration';

// Validation Result models
export {
  ValidationResult,
  ValidationIssue as ValidationResultIssue,
  ValidationStatus,
  ValidationLevel,
  ValidationCategory,
  IssueSeverity as ValidationIssueSeverity,
  ValidationRuleType,
  QualityDimension,
  ReportFormat,
  IssueLocation,
  IssueContext,
  IssueFix,
  QualityScore,
  QualityAssessment,
  ValidationRule,
  ValidationConfiguration,
  ValidationMetrics,
  ValidationReport,
  ReportOptions,
  CreateValidationResultParams,
  UpdateValidationResultParams,
  ValidationResultFactory,
  ValidationResultUtils,
  ValidationReportGenerator,
} from './validation-result';

// Error Log models
export {
  ErrorLogEntry,
  ErrorSeverity as ErrorLogSeverity,
  ErrorCategory,
  ErrorSubsystem,
  RecoveryAction,
  ErrorStatus,
  ErrorImpact,
  AggregationPeriod,
  ErrorContext,
  StackTrace,
  StackFrame,
  RecoverySuggestion,
  ErrorResolution,
  ErrorAnalytics,
  ErrorLogConfiguration,
  ErrorLogStatistics,
  ErrorSearchCriteria,
  ErrorLogQueryResult,
  CreateErrorLogEntryParams,
  UpdateErrorLogEntryParams,
  ErrorLogEntryFactory,
  ErrorLogUtils,
  ErrorLogReportGenerator,
} from './error-log';

// Performance metrics models
export {
  PerformanceMetrics,
  PerformanceCategory,
  ResourceType,
  MeasurementPrecision,
  OptimizationType,
  TrendDirection,
  AlertSeverity,
  TimingMeasurement,
  ResourceMeasurement,
  CPUMetrics,
  MemoryMetrics,
  DiskIOMetrics,
  NetworkIOMetrics,
  CachePerformanceMetrics,
  ConcurrencyMetrics,
  BenchmarkResult,
  PerformanceThreshold,
  PerformanceAlert,
  OptimizationRecommendation,
  PerformanceTrend,
  PerformanceReportConfig,
  CreatePerformanceMetricsParams,
  UpdatePerformanceMetricsParams,
  PerformanceComparison,
  PerformanceMetricsFactory,
  PerformanceMetricsUtils,
} from './performance-metrics';

// User preferences models
export {
  UserPreferences as UserPreferencesModel,
  PreferenceCategory,
  ThemeVariant as UserThemeVariant,
  LanguageCode,
  NotificationFrequency,
  AIProviderPreference,
  CLIOutputFormat,
  SyncStrategy,
  InterfacePreferences,
  EditorPreferences,
  AIPreferences,
  CLIPreferences,
  NotificationPreferences,
  SecurityPreferences,
  PerformancePreferences as UserPerformancePreferences,
  AccessibilityPreferences,
  IntegrationPreferences,
  CustomPreferences,
  PreferenceMetadata,
  CreateUserPreferencesParams,
  UpdateUserPreferencesParams,
  PreferenceValidationResult,
  PreferenceExportConfig,
  PreferenceSyncStatus,
  UserPreferencesFactory,
  UserPreferencesUtils,
  UserPreferenceProfiles,
} from './user-preferences';

/**
 * Version information for the core models
 */
export const CORE_MODELS_VERSION = '1.0.0';