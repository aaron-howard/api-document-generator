/**
 * T030 Configuration Management Integration - Main Module
 *
 * Complete T030 Configuration Management Integration system providing hierarchical
 * configuration loading, user preference management, environment variable integration,
 * validation, export/import capabilities, and seamless integration with T023-T029 services.
 *
 * This module serves as the central integration point for all configuration management
 * functionality in the API Documentation Generator system.
 */
import { ConfigurationManager } from '../config/config-manager';
import { T030ConfigDemo } from '../demos/t030-simple-demo';
import { T030ConfigurationTests } from '../tests/t030-configuration-tests';
import { Environment } from '../core/models/configuration';
import { PerformanceMonitor } from '../performance/performance-monitor';
import { ErrorHandler } from '../error/error-handler';
import { CacheManager } from '../cache/cache-manager';
/**
 * T030 Configuration Management Integration
 *
 * Main class that orchestrates the complete configuration management system,
 * providing a unified interface for all configuration-related operations.
 */
export declare class T030ConfigurationIntegration {
    private configurationManager;
    private initialized;
    /**
     * Initialize the T030 Configuration Management Integration
     */
    initialize(environment?: Environment, performanceMonitor?: PerformanceMonitor, errorHandler?: ErrorHandler, cacheManager?: CacheManager): Promise<ConfigurationManager>;
    /**
     * Get the configuration manager instance
     */
    getConfigurationManager(): ConfigurationManager;
    /**
     * Run comprehensive demonstration
     */
    runDemo(): Promise<void>;
    /**
     * Run comprehensive tests
     */
    runTests(): Promise<boolean>;
    /**
     * Show integration status and capabilities
     */
    showStatus(): void;
    /**
     * Clean up resources
     */
    cleanup(): Promise<void>;
}
/**
 * Convenience functions for direct usage
 */
/**
 * Create and initialize a T030 Configuration Management Integration
 */
export declare function createT030Integration(environment?: Environment, performanceMonitor?: PerformanceMonitor, errorHandler?: ErrorHandler, cacheManager?: CacheManager): Promise<T030ConfigurationIntegration>;
/**
 * Run T030 Configuration Management demonstration
 */
export declare function runT030Demo(): Promise<void>;
/**
 * Run T030 Configuration Management tests
 */
export declare function runT030Tests(): Promise<boolean>;
/**
 * Complete T030 showcase - demo, tests, and status
 */
export declare function showcaseT030(): Promise<void>;
export { ConfigurationManager, T030ConfigDemo, T030ConfigurationTests };
export { ConfigurationSource, LoadingStrategy, ConfigurationChangeEvent, ConfigurationManagerOptions, ConfigurationLoadingContext, ConfigurationExportOptions } from '../config/config-manager';
//# sourceMappingURL=t030-configuration-integration.d.ts.map