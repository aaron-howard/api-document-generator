/**
 * T030 Configuration Management Integration Demonstration
 *
 * Comprehensive demonstration showcasing the ConfigurationManager's hierarchical
 * configuration loading, user preferences, environment variables, validation,
 * and integration with all T023-T029 services.
 */
import { Environment } from '../core/models/configuration';
/**
 * Demonstration configuration for the T030 system
 */
interface T030DemoConfig {
    readonly environment: Environment;
    readonly userId: string;
    readonly projectId: string;
    readonly enableAllFeatures: boolean;
    readonly demoDataPath: string;
}
/**
 * T030 Configuration Management Integration Demo
 */
export declare class T030ConfigurationDemo {
    private demoConfig;
    private configManager;
    private performanceMonitor;
    private errorHandler;
    private cacheManager;
    private changeEvents;
    constructor(demoConfig?: T030DemoConfig);
    /**
     * Run comprehensive T030 Configuration Management demonstration
     */
    runDemo(): Promise<void>;
    /**
     * Setup demonstration environment
     */
    private setupDemo;
    /**
     * Demonstrate hierarchical configuration loading
     */
    private demonstrateConfigurationLoading;
    /**
     * Demonstrate user preferences management
     */
    private demonstrateUserPreferences;
    /**
     * Demonstrate environment variable integration
     */
    private demonstrateEnvironmentVariables;
    /**
     * Demonstrate configuration validation
     */
    private demonstrateConfigurationValidation;
    /**
     * Demonstrate configuration export functionality
     */
    private demonstrateConfigurationExport;
    /**
     * Demonstrate real-time configuration updates
     */
    private demonstrateRealTimeUpdates;
    /**
     * Demonstrate integration with all T023-T029 services
     */
    private demonstrateServiceIntegration;
    /**
     * Demonstrate backup and restore functionality
     */
    private demonstrateBackupRestore;
    /**
     * Show comprehensive system status
     */
    private showSystemStatus;
    /**
     * Create sample configuration files for demonstration
     */
    private createSampleConfigurationFiles;
    /**
     * Clean up demo resources
     */
    private cleanup;
}
/**
 * Run the T030 Configuration Management demonstration
 */
export declare function runT030Demo(): Promise<void>;
export { T030ConfigurationDemo };
//# sourceMappingURL=t030-configuration-demo.d.ts.map