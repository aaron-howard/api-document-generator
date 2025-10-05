"use strict";
/**
 * Core data models and types for the API Documentation Generator
 *
 * This module exports all the fundamental data structures used throughout
 * the application for representing API specifications, schemas, and metadata.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheStrategy = exports.CacheLevel = exports.DefaultThemeFactory = exports.TemplateUtils = exports.TemplateFactory = exports.TemplateStatus = exports.ThemeVariant = exports.AssetType = exports.TemplateEngine = exports.TemplateType = exports.DefaultSessionConfigurationFactory = exports.GenerationSessionUtils = exports.GenerationSessionFactory = exports.WarningCategory = exports.ErrorSeverity = exports.OutputFormat = exports.GenerationStatus = exports.AISummaryUtils = exports.AISummaryFactory = exports.ReviewMethod = exports.ChangeType = exports.ReviewStatus = exports.SuggestionPriority = exports.SuggestionType = exports.IssueSeverity = exports.ValidationIssueType = exports.PromptType = exports.ModelCapability = exports.AIProvider = exports.LinkType = exports.ExampleComplexity = exports.SectionType = exports.ContentFormat = exports.AISummaryType = exports.AITargetType = exports.ParsedEndpointUtils = exports.ParsedEndpointFactory = exports.ExtractionMethod = exports.ParameterStyle = exports.ParameterLocation = exports.InputSourceUtils = exports.InputSourceFactory = exports.InputSourceState = exports.InputSourceType = exports.SchemaUtils = exports.SchemaType = exports.ApiSpecificationFactory = exports.SecuritySchemeType = exports.HttpMethod = exports.ApiSpecFormat = void 0;
exports.UserPreferencesFactory = exports.SyncStrategy = exports.CLIOutputFormat = exports.AIProviderPreference = exports.NotificationFrequency = exports.LanguageCode = exports.UserThemeVariant = exports.PreferenceCategory = exports.PerformanceMetricsUtils = exports.PerformanceMetricsFactory = exports.AlertSeverity = exports.TrendDirection = exports.OptimizationType = exports.MeasurementPrecision = exports.ResourceType = exports.PerformanceCategory = exports.ErrorLogReportGenerator = exports.ErrorLogUtils = exports.ErrorLogEntryFactory = exports.AggregationPeriod = exports.ErrorImpact = exports.ErrorStatus = exports.RecoveryAction = exports.ErrorSubsystem = exports.ErrorCategory = exports.ErrorLogSeverity = exports.ValidationReportGenerator = exports.ValidationResultUtils = exports.ValidationResultFactory = exports.ReportFormat = exports.QualityDimension = exports.ValidationRuleType = exports.ValidationIssueSeverity = exports.ValidationCategory = exports.ValidationLevel = exports.ValidationStatus = exports.ConfigurationPresets = exports.ConfigurationUtils = exports.ConfigurationFactory = exports.CIPlatform = exports.AccessControlMode = exports.SecurityLevel = exports.LogLevel = exports.Environment = exports.CachePresets = exports.CacheUtils = exports.CacheFactory = exports.StorageType = exports.CacheEntryStatus = exports.InvalidationTrigger = void 0;
exports.CORE_MODELS_VERSION = exports.UserPreferenceProfiles = exports.UserPreferencesUtils = void 0;
// API Specification models
var api_spec_1 = require("./api-spec");
Object.defineProperty(exports, "ApiSpecFormat", { enumerable: true, get: function () { return api_spec_1.ApiSpecFormat; } });
Object.defineProperty(exports, "HttpMethod", { enumerable: true, get: function () { return api_spec_1.HttpMethod; } });
Object.defineProperty(exports, "SecuritySchemeType", { enumerable: true, get: function () { return api_spec_1.SecuritySchemeType; } });
Object.defineProperty(exports, "ApiSpecificationFactory", { enumerable: true, get: function () { return api_spec_1.ApiSpecificationFactory; } });
// Schema and data model types
var schema_1 = require("./schema");
Object.defineProperty(exports, "SchemaType", { enumerable: true, get: function () { return schema_1.SchemaType; } });
Object.defineProperty(exports, "SchemaUtils", { enumerable: true, get: function () { return schema_1.SchemaUtils; } });
// Input source models
var input_source_1 = require("./input-source");
Object.defineProperty(exports, "InputSourceType", { enumerable: true, get: function () { return input_source_1.InputSourceType; } });
Object.defineProperty(exports, "InputSourceState", { enumerable: true, get: function () { return input_source_1.InputSourceState; } });
Object.defineProperty(exports, "InputSourceFactory", { enumerable: true, get: function () { return input_source_1.InputSourceFactory; } });
Object.defineProperty(exports, "InputSourceUtils", { enumerable: true, get: function () { return input_source_1.InputSourceUtils; } });
// Parsed endpoint models
var parsed_endpoint_1 = require("./parsed-endpoint");
Object.defineProperty(exports, "ParameterLocation", { enumerable: true, get: function () { return parsed_endpoint_1.ParameterLocation; } });
Object.defineProperty(exports, "ParameterStyle", { enumerable: true, get: function () { return parsed_endpoint_1.ParameterStyle; } });
Object.defineProperty(exports, "ExtractionMethod", { enumerable: true, get: function () { return parsed_endpoint_1.ExtractionMethod; } });
Object.defineProperty(exports, "ParsedEndpointFactory", { enumerable: true, get: function () { return parsed_endpoint_1.ParsedEndpointFactory; } });
Object.defineProperty(exports, "ParsedEndpointUtils", { enumerable: true, get: function () { return parsed_endpoint_1.ParsedEndpointUtils; } });
// AI-generated content models
var ai_summary_1 = require("./ai-summary");
Object.defineProperty(exports, "AITargetType", { enumerable: true, get: function () { return ai_summary_1.AITargetType; } });
Object.defineProperty(exports, "AISummaryType", { enumerable: true, get: function () { return ai_summary_1.AISummaryType; } });
Object.defineProperty(exports, "ContentFormat", { enumerable: true, get: function () { return ai_summary_1.ContentFormat; } });
Object.defineProperty(exports, "SectionType", { enumerable: true, get: function () { return ai_summary_1.SectionType; } });
Object.defineProperty(exports, "ExampleComplexity", { enumerable: true, get: function () { return ai_summary_1.ExampleComplexity; } });
Object.defineProperty(exports, "LinkType", { enumerable: true, get: function () { return ai_summary_1.LinkType; } });
Object.defineProperty(exports, "AIProvider", { enumerable: true, get: function () { return ai_summary_1.AIProvider; } });
Object.defineProperty(exports, "ModelCapability", { enumerable: true, get: function () { return ai_summary_1.ModelCapability; } });
Object.defineProperty(exports, "PromptType", { enumerable: true, get: function () { return ai_summary_1.PromptType; } });
Object.defineProperty(exports, "ValidationIssueType", { enumerable: true, get: function () { return ai_summary_1.ValidationIssueType; } });
Object.defineProperty(exports, "IssueSeverity", { enumerable: true, get: function () { return ai_summary_1.IssueSeverity; } });
Object.defineProperty(exports, "SuggestionType", { enumerable: true, get: function () { return ai_summary_1.SuggestionType; } });
Object.defineProperty(exports, "SuggestionPriority", { enumerable: true, get: function () { return ai_summary_1.SuggestionPriority; } });
Object.defineProperty(exports, "ReviewStatus", { enumerable: true, get: function () { return ai_summary_1.ReviewStatus; } });
Object.defineProperty(exports, "ChangeType", { enumerable: true, get: function () { return ai_summary_1.ChangeType; } });
Object.defineProperty(exports, "ReviewMethod", { enumerable: true, get: function () { return ai_summary_1.ReviewMethod; } });
Object.defineProperty(exports, "AISummaryFactory", { enumerable: true, get: function () { return ai_summary_1.AISummaryFactory; } });
Object.defineProperty(exports, "AISummaryUtils", { enumerable: true, get: function () { return ai_summary_1.AISummaryUtils; } });
// Generation session models
var generation_session_1 = require("./generation-session");
Object.defineProperty(exports, "GenerationStatus", { enumerable: true, get: function () { return generation_session_1.GenerationStatus; } });
Object.defineProperty(exports, "OutputFormat", { enumerable: true, get: function () { return generation_session_1.OutputFormat; } });
Object.defineProperty(exports, "ErrorSeverity", { enumerable: true, get: function () { return generation_session_1.ErrorSeverity; } });
Object.defineProperty(exports, "WarningCategory", { enumerable: true, get: function () { return generation_session_1.WarningCategory; } });
Object.defineProperty(exports, "GenerationSessionFactory", { enumerable: true, get: function () { return generation_session_1.GenerationSessionFactory; } });
Object.defineProperty(exports, "GenerationSessionUtils", { enumerable: true, get: function () { return generation_session_1.GenerationSessionUtils; } });
Object.defineProperty(exports, "DefaultSessionConfigurationFactory", { enumerable: true, get: function () { return generation_session_1.DefaultSessionConfigurationFactory; } });
// Template models
var template_1 = require("./template");
Object.defineProperty(exports, "TemplateType", { enumerable: true, get: function () { return template_1.TemplateType; } });
Object.defineProperty(exports, "TemplateEngine", { enumerable: true, get: function () { return template_1.TemplateEngine; } });
Object.defineProperty(exports, "AssetType", { enumerable: true, get: function () { return template_1.AssetType; } });
Object.defineProperty(exports, "ThemeVariant", { enumerable: true, get: function () { return template_1.ThemeVariant; } });
Object.defineProperty(exports, "TemplateStatus", { enumerable: true, get: function () { return template_1.TemplateStatus; } });
Object.defineProperty(exports, "TemplateFactory", { enumerable: true, get: function () { return template_1.TemplateFactory; } });
Object.defineProperty(exports, "TemplateUtils", { enumerable: true, get: function () { return template_1.TemplateUtils; } });
Object.defineProperty(exports, "DefaultThemeFactory", { enumerable: true, get: function () { return template_1.DefaultThemeFactory; } });
// Cache models
var cache_1 = require("./cache");
Object.defineProperty(exports, "CacheLevel", { enumerable: true, get: function () { return cache_1.CacheLevel; } });
Object.defineProperty(exports, "CacheStrategy", { enumerable: true, get: function () { return cache_1.CacheStrategy; } });
Object.defineProperty(exports, "InvalidationTrigger", { enumerable: true, get: function () { return cache_1.InvalidationTrigger; } });
Object.defineProperty(exports, "CacheEntryStatus", { enumerable: true, get: function () { return cache_1.CacheEntryStatus; } });
Object.defineProperty(exports, "StorageType", { enumerable: true, get: function () { return cache_1.StorageType; } });
Object.defineProperty(exports, "CacheFactory", { enumerable: true, get: function () { return cache_1.CacheFactory; } });
Object.defineProperty(exports, "CacheUtils", { enumerable: true, get: function () { return cache_1.CacheUtils; } });
Object.defineProperty(exports, "CachePresets", { enumerable: true, get: function () { return cache_1.CachePresets; } });
// Configuration models
var configuration_1 = require("./configuration");
Object.defineProperty(exports, "Environment", { enumerable: true, get: function () { return configuration_1.Environment; } });
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return configuration_1.LogLevel; } });
Object.defineProperty(exports, "SecurityLevel", { enumerable: true, get: function () { return configuration_1.SecurityLevel; } });
Object.defineProperty(exports, "AccessControlMode", { enumerable: true, get: function () { return configuration_1.AccessControlMode; } });
Object.defineProperty(exports, "CIPlatform", { enumerable: true, get: function () { return configuration_1.CIPlatform; } });
Object.defineProperty(exports, "ConfigurationFactory", { enumerable: true, get: function () { return configuration_1.ConfigurationFactory; } });
Object.defineProperty(exports, "ConfigurationUtils", { enumerable: true, get: function () { return configuration_1.ConfigurationUtils; } });
Object.defineProperty(exports, "ConfigurationPresets", { enumerable: true, get: function () { return configuration_1.ConfigurationPresets; } });
// Validation Result models
var validation_result_1 = require("./validation-result");
Object.defineProperty(exports, "ValidationStatus", { enumerable: true, get: function () { return validation_result_1.ValidationStatus; } });
Object.defineProperty(exports, "ValidationLevel", { enumerable: true, get: function () { return validation_result_1.ValidationLevel; } });
Object.defineProperty(exports, "ValidationCategory", { enumerable: true, get: function () { return validation_result_1.ValidationCategory; } });
Object.defineProperty(exports, "ValidationIssueSeverity", { enumerable: true, get: function () { return validation_result_1.IssueSeverity; } });
Object.defineProperty(exports, "ValidationRuleType", { enumerable: true, get: function () { return validation_result_1.ValidationRuleType; } });
Object.defineProperty(exports, "QualityDimension", { enumerable: true, get: function () { return validation_result_1.QualityDimension; } });
Object.defineProperty(exports, "ReportFormat", { enumerable: true, get: function () { return validation_result_1.ReportFormat; } });
Object.defineProperty(exports, "ValidationResultFactory", { enumerable: true, get: function () { return validation_result_1.ValidationResultFactory; } });
Object.defineProperty(exports, "ValidationResultUtils", { enumerable: true, get: function () { return validation_result_1.ValidationResultUtils; } });
Object.defineProperty(exports, "ValidationReportGenerator", { enumerable: true, get: function () { return validation_result_1.ValidationReportGenerator; } });
// Error Log models
var error_log_1 = require("./error-log");
Object.defineProperty(exports, "ErrorLogSeverity", { enumerable: true, get: function () { return error_log_1.ErrorSeverity; } });
Object.defineProperty(exports, "ErrorCategory", { enumerable: true, get: function () { return error_log_1.ErrorCategory; } });
Object.defineProperty(exports, "ErrorSubsystem", { enumerable: true, get: function () { return error_log_1.ErrorSubsystem; } });
Object.defineProperty(exports, "RecoveryAction", { enumerable: true, get: function () { return error_log_1.RecoveryAction; } });
Object.defineProperty(exports, "ErrorStatus", { enumerable: true, get: function () { return error_log_1.ErrorStatus; } });
Object.defineProperty(exports, "ErrorImpact", { enumerable: true, get: function () { return error_log_1.ErrorImpact; } });
Object.defineProperty(exports, "AggregationPeriod", { enumerable: true, get: function () { return error_log_1.AggregationPeriod; } });
Object.defineProperty(exports, "ErrorLogEntryFactory", { enumerable: true, get: function () { return error_log_1.ErrorLogEntryFactory; } });
Object.defineProperty(exports, "ErrorLogUtils", { enumerable: true, get: function () { return error_log_1.ErrorLogUtils; } });
Object.defineProperty(exports, "ErrorLogReportGenerator", { enumerable: true, get: function () { return error_log_1.ErrorLogReportGenerator; } });
// Performance metrics models
var performance_metrics_1 = require("./performance-metrics");
Object.defineProperty(exports, "PerformanceCategory", { enumerable: true, get: function () { return performance_metrics_1.PerformanceCategory; } });
Object.defineProperty(exports, "ResourceType", { enumerable: true, get: function () { return performance_metrics_1.ResourceType; } });
Object.defineProperty(exports, "MeasurementPrecision", { enumerable: true, get: function () { return performance_metrics_1.MeasurementPrecision; } });
Object.defineProperty(exports, "OptimizationType", { enumerable: true, get: function () { return performance_metrics_1.OptimizationType; } });
Object.defineProperty(exports, "TrendDirection", { enumerable: true, get: function () { return performance_metrics_1.TrendDirection; } });
Object.defineProperty(exports, "AlertSeverity", { enumerable: true, get: function () { return performance_metrics_1.AlertSeverity; } });
Object.defineProperty(exports, "PerformanceMetricsFactory", { enumerable: true, get: function () { return performance_metrics_1.PerformanceMetricsFactory; } });
Object.defineProperty(exports, "PerformanceMetricsUtils", { enumerable: true, get: function () { return performance_metrics_1.PerformanceMetricsUtils; } });
// User preferences models
var user_preferences_1 = require("./user-preferences");
Object.defineProperty(exports, "PreferenceCategory", { enumerable: true, get: function () { return user_preferences_1.PreferenceCategory; } });
Object.defineProperty(exports, "UserThemeVariant", { enumerable: true, get: function () { return user_preferences_1.ThemeVariant; } });
Object.defineProperty(exports, "LanguageCode", { enumerable: true, get: function () { return user_preferences_1.LanguageCode; } });
Object.defineProperty(exports, "NotificationFrequency", { enumerable: true, get: function () { return user_preferences_1.NotificationFrequency; } });
Object.defineProperty(exports, "AIProviderPreference", { enumerable: true, get: function () { return user_preferences_1.AIProviderPreference; } });
Object.defineProperty(exports, "CLIOutputFormat", { enumerable: true, get: function () { return user_preferences_1.CLIOutputFormat; } });
Object.defineProperty(exports, "SyncStrategy", { enumerable: true, get: function () { return user_preferences_1.SyncStrategy; } });
Object.defineProperty(exports, "UserPreferencesFactory", { enumerable: true, get: function () { return user_preferences_1.UserPreferencesFactory; } });
Object.defineProperty(exports, "UserPreferencesUtils", { enumerable: true, get: function () { return user_preferences_1.UserPreferencesUtils; } });
Object.defineProperty(exports, "UserPreferenceProfiles", { enumerable: true, get: function () { return user_preferences_1.UserPreferenceProfiles; } });
/**
 * Version information for the core models
 */
exports.CORE_MODELS_VERSION = '1.0.0';
//# sourceMappingURL=index.js.map