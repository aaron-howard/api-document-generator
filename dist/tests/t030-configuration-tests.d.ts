/**
 * T030 Configuration Management Integration Tests
 *
 * Comprehensive test suite validating all T030 Configuration Management features
 * including hierarchical loading, user preferences, environment variables,
 * validation, export/import, and service integration.
 */
/**
 * T030 Configuration Management Integration Tests
 */
export declare class T030ConfigurationTests {
    private testDataPath;
    private testResults;
    constructor();
    /**
     * Run all T030 configuration management tests
     */
    runAllTests(): Promise<void>;
    /**
     * Test configuration manager initialization
     */
    private testConfigurationManagerInitialization;
    /**
     * Test hierarchical configuration loading
     */
    private testHierarchicalConfigurationLoading;
    /**
     * Test user preferences management
     */
    private testUserPreferencesManagement;
    /**
     * Test environment variable integration
     */
    private testEnvironmentVariableIntegration;
    /**
     * Test configuration validation
     */
    private testConfigurationValidation;
    /**
     * Test configuration export and import
     */
    private testConfigurationExportImport;
    /**
     * Test real-time configuration updates
     */
    private testRealTimeConfigurationUpdates;
    /**
     * Test configuration change tracking
     */
    private testConfigurationChangeTracking;
    /**
     * Test error handling and recovery
     */
    private testErrorHandlingAndRecovery;
    /**
     * Test performance and caching
     */
    private testPerformanceAndCaching;
    /**
     * Create test configuration files
     */
    private createTestConfigurationFiles;
    /**
     * Show test results
     */
    private showTestResults;
    /**
     * Clean up test resources
     */
    private cleanup;
}
/**
 * Run T030 Configuration Management tests
 */
export declare function runT030Tests(): Promise<void>;
//# sourceMappingURL=t030-configuration-tests.d.ts.map