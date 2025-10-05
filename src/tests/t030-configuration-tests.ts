/**
 * T030 Configuration Management Integration Tests
 * 
 * Comprehensive test suite validating all T030 Configuration Management features
 * including hierarchical loading, user preferences, environment variables,
 * validation, export/import, and service integration.
 */

import { ConfigurationManager, ConfigurationSource, LoadingStrategy } from '../config/config-manager';
import { Environment } from '../core/models/configuration';
import { ThemeVariant, LanguageCode } from '../core/models/user-preferences';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * T030 Configuration Management Integration Tests
 */
export class T030ConfigurationTests {
  private testDataPath: string;
  private testResults: { name: string; passed: boolean; error?: string }[] = [];

  constructor() {
    this.testDataPath = './test-data/t030';
  }

  /**
   * Run all T030 configuration management tests
   */
  async runAllTests(): Promise<void> {
    console.log('\n=== T030 Configuration Management Integration Tests ===\n');

    const tests = [
      { name: 'Configuration Manager Initialization', test: () => this.testConfigurationManagerInitialization() },
      { name: 'Hierarchical Configuration Loading', test: () => this.testHierarchicalConfigurationLoading() },
      { name: 'User Preferences Management', test: () => this.testUserPreferencesManagement() },
      { name: 'Environment Variable Integration', test: () => this.testEnvironmentVariableIntegration() },
      { name: 'Configuration Validation', test: () => this.testConfigurationValidation() },
      { name: 'Configuration Export/Import', test: () => this.testConfigurationExportImport() },
      { name: 'Real-time Configuration Updates', test: () => this.testRealTimeConfigurationUpdates() },
      { name: 'Configuration Change Tracking', test: () => this.testConfigurationChangeTracking() },
      { name: 'Error Handling and Recovery', test: () => this.testErrorHandlingAndRecovery() },
      { name: 'Performance and Caching', test: () => this.testPerformanceAndCaching() }
    ];

    for (const { name, test } of tests) {
      console.log(`🧪 Running: ${name}...`);
      try {
        await test();
        this.testResults.push({ name, passed: true });
        console.log(`✅ PASSED: ${name}\n`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.testResults.push({ name, passed: false, error: errorMessage });
        console.log(`❌ FAILED: ${name}`);
        console.log(`   Error: ${errorMessage}\n`);
      }
    }

    await this.showTestResults();
    await this.cleanup();
  }

  /**
   * Test configuration manager initialization
   */
  private async testConfigurationManagerInitialization(): Promise<void> {
    // Create test directories
    await fs.mkdir(this.testDataPath, { recursive: true });
    await fs.mkdir(path.join(this.testDataPath, 'config'), { recursive: true });
    await fs.mkdir(path.join(this.testDataPath, 'user-config'), { recursive: true });

    // Test basic initialization
    const configManager = new ConfigurationManager({
      configDir: path.join(this.testDataPath, 'config'),
      userConfigDir: path.join(this.testDataPath, 'user-config'),
      environment: Environment.DEVELOPMENT,
      loadingStrategy: LoadingStrategy.MERGE_ALL,
      enableValidation: true,
      enableCaching: true,
      enableBackup: true
    });

    // Initialize without services (minimal setup)
    await configManager.initialize();

    // Verify initialization
    const config = await configManager.loadConfiguration();
    if (!config) {
      throw new Error('Configuration not loaded after initialization');
    }

    if (config.environment !== Environment.DEVELOPMENT) {
      throw new Error('Environment not set correctly');
    }

    await configManager.cleanup();
  }

  /**
   * Test hierarchical configuration loading
   */
  private async testHierarchicalConfigurationLoading(): Promise<void> {
    const configManager = new ConfigurationManager({
      configDir: path.join(this.testDataPath, 'config'),
      userConfigDir: path.join(this.testDataPath, 'user-config'),
      environment: Environment.DEVELOPMENT,
      loadingStrategy: LoadingStrategy.MERGE_ALL
    });

    await configManager.initialize();

    // Create test configuration files
    await this.createTestConfigurationFiles();

    // Test loading with different sources
    const config = await configManager.loadConfiguration({
      environment: Environment.DEVELOPMENT,
      userId: 'test-user',
      projectId: 'test-project',
      sources: [
        ConfigurationSource.DEFAULT,
        ConfigurationSource.FILE,
        ConfigurationSource.ENVIRONMENT
      ],
      overrides: {
        testOverride: true
      },
      variables: {
        API_DOC_GEN_TEST_VAR: 'test-value'
      }
    });

    // Verify configuration properties
    if (!config.id) throw new Error('Configuration ID not set');
    if (!config.name) throw new Error('Configuration name not set');
    if (config.environment !== Environment.DEVELOPMENT) throw new Error('Environment not correct');

    // Test different loading strategies
    const failFastManager = new ConfigurationManager({
      configDir: path.join(this.testDataPath, 'config'),
      loadingStrategy: LoadingStrategy.FAIL_FAST
    });
    await failFastManager.initialize();

    const gracefulManager = new ConfigurationManager({
      configDir: path.join(this.testDataPath, 'config'),
      loadingStrategy: LoadingStrategy.GRACEFUL_FALLBACK
    });
    await gracefulManager.initialize();

    await configManager.cleanup();
    await failFastManager.cleanup();
    await gracefulManager.cleanup();
  }

  /**
   * Test user preferences management
   */
  private async testUserPreferencesManagement(): Promise<void> {
    const configManager = new ConfigurationManager({
      configDir: path.join(this.testDataPath, 'config'),
      userConfigDir: path.join(this.testDataPath, 'user-config'),
      environment: Environment.DEVELOPMENT
    });

    await configManager.initialize();

    // Test loading predefined profiles
    const profiles = ['developer', 'writer', 'team-lead', 'enterprise'];
    
    for (const profile of profiles) {
      const preferences = await configManager.loadUserPreferences(
        `test-${profile}`,
        profile
      );

      if (!preferences.userId) throw new Error(`User ID not set for ${profile} profile`);
      if (!preferences.profileName) throw new Error(`Profile name not set for ${profile} profile`);
      if (!preferences.interface.theme) throw new Error(`Theme not set for ${profile} profile`);
    }

    // Test creating and saving custom preferences
    const customUserId = 'test-custom-user';
    const defaultPrefs = await configManager.loadUserPreferences(customUserId);

    const customPrefs = {
      ...defaultPrefs,
      profileName: 'Test Custom Profile',
      interface: {
        ...defaultPrefs.interface,
        theme: ThemeVariant.DARK,
        language: LanguageCode.EN_US,
        enableAnimations: false
      }
    };

    await configManager.saveUserPreferences(customPrefs, customUserId);

    // Verify saved preferences
    const loadedPrefs = await configManager.loadUserPreferences(customUserId);
    if (loadedPrefs.profileName !== 'Test Custom Profile') {
      throw new Error('Custom profile name not saved correctly');
    }
    if (loadedPrefs.interface.theme !== ThemeVariant.DARK) {
      throw new Error('Custom theme not saved correctly');
    }

    await configManager.cleanup();
  }

  /**
   * Test environment variable integration
   */
  private async testEnvironmentVariableIntegration(): Promise<void> {
    const configManager = new ConfigurationManager({
      configDir: path.join(this.testDataPath, 'config'),
      environment: Environment.DEVELOPMENT
    });

    await configManager.initialize();

    // Test setting environment variables
    const testVars = {
      'API_DOC_GEN_TEST_STRING': 'test-string',
      'API_DOC_GEN_TEST_NUMBER': '42',
      'API_DOC_GEN_TEST_BOOLEAN': 'true'
    };

    for (const [key, value] of Object.entries(testVars)) {
      configManager.setEnvironmentVariable(key, value);
      
      const retrievedValue = configManager.getEnvironmentVariable(key);
      if (retrievedValue !== value) {
        throw new Error(`Environment variable ${key} not set correctly`);
      }
    }

    // Test environment variable with default value
    const defaultValue = configManager.getEnvironmentVariable('NONEXISTENT_VAR', 'default-value');
    if (defaultValue !== 'default-value') {
      throw new Error('Default value not returned for nonexistent environment variable');
    }

    // Test configuration reload with environment variables
    await configManager.reloadConfiguration();

    await configManager.cleanup();
  }

  /**
   * Test configuration validation
   */
  private async testConfigurationValidation(): Promise<void> {
    const configManager = new ConfigurationManager({
      configDir: path.join(this.testDataPath, 'config'),
      environment: Environment.DEVELOPMENT,
      enableValidation: true
    });

    await configManager.initialize();
    const config = await configManager.loadConfiguration();

    // Test validation with valid configuration
    const validationResult = await configManager.validateConfiguration(config);
    if (typeof validationResult.isValid !== 'boolean') {
      throw new Error('Validation result isValid property not boolean');
    }
    if (!Array.isArray(validationResult.errors)) {
      throw new Error('Validation result errors not array');
    }
    if (!Array.isArray(validationResult.warnings)) {
      throw new Error('Validation result warnings not array');
    }

    // Test validation with invalid configuration (missing required fields)
    const invalidConfig = { ...config, id: undefined, name: undefined } as any;

    const invalidValidation = await configManager.validateConfiguration(invalidConfig);
    if (invalidValidation.isValid) {
      throw new Error('Invalid configuration passed validation');
    }
    if (invalidValidation.errors.length === 0) {
      throw new Error('No validation errors for invalid configuration');
    }

    await configManager.cleanup();
  }

  /**
   * Test configuration export and import
   */
  private async testConfigurationExportImport(): Promise<void> {
    const configManager = new ConfigurationManager({
      configDir: path.join(this.testDataPath, 'config'),
      environment: Environment.DEVELOPMENT
    });

    await configManager.initialize();
    await configManager.loadConfiguration();

    // Test JSON export
    const jsonExport = await configManager.exportConfiguration({
      format: 'json',
      includeSecrets: false,
      minify: false
    });

    if (!jsonExport) throw new Error('JSON export failed');
    
    // Verify it's valid JSON
    const parsedJson = JSON.parse(jsonExport);
    if (!parsedJson.id) throw new Error('Exported JSON missing configuration ID');

    // Test minified JSON export
    const minifiedJsonExport = await configManager.exportConfiguration({
      format: 'json',
      includeSecrets: false,
      minify: true
    });

    if (minifiedJsonExport.length >= jsonExport.length) {
      throw new Error('Minified export not smaller than regular export');
    }

    // Test YAML export
    const yamlExport = await configManager.exportConfiguration({
      format: 'yaml',
      includeSecrets: false
    });

    if (!yamlExport) throw new Error('YAML export failed');

    // Test ENV export
    const envExport = await configManager.exportConfiguration({
      format: 'env',
      includeSecrets: false
    });

    if (!envExport) throw new Error('ENV export failed');
    if (!envExport.includes('API_DOC_GEN_')) {
      throw new Error('ENV export missing expected prefix');
    }

    await configManager.cleanup();
  }

  /**
   * Test real-time configuration updates
   */
  private async testRealTimeConfigurationUpdates(): Promise<void> {
    const configManager = new ConfigurationManager({
      configDir: path.join(this.testDataPath, 'config'),
      environment: Environment.DEVELOPMENT
    });

    await configManager.initialize();
    const originalConfig = await configManager.loadConfiguration();

    // Test configuration update
    const updates = {
      name: 'Updated Configuration Name',
      description: 'Updated for testing'
    };

    const updatedConfig = await configManager.updateConfiguration(updates);

    if (updatedConfig.name !== updates.name) {
      throw new Error('Configuration name not updated');
    }
    if (updatedConfig.description !== updates.description) {
      throw new Error('Configuration description not updated');
    }
    if (updatedConfig.id !== originalConfig.id) {
      throw new Error('Configuration ID changed during update');
    }

    // Test that configuration manager has updated configuration
    const currentConfig = configManager.getConfiguration();
    if (!currentConfig || currentConfig.name !== updates.name) {
      throw new Error('Configuration manager not updated with new configuration');
    }

    await configManager.cleanup();
  }

  /**
   * Test configuration change tracking
   */
  private async testConfigurationChangeTracking(): Promise<void> {
    const configManager = new ConfigurationManager({
      configDir: path.join(this.testDataPath, 'config'),
      environment: Environment.DEVELOPMENT
    });

    await configManager.initialize();

    // Set up change listener
    const changeEvents: any[] = [];
    const changeListener = (event: any) => {
      changeEvents.push(event);
    };

    configManager.addChangeListener(changeListener);

    // Trigger configuration changes
    await configManager.loadConfiguration();
    await configManager.updateConfiguration({ name: 'Change Tracking Test' });

    // Verify change events were captured
    if (changeEvents.length === 0) {
      throw new Error('No change events captured');
    }

    // Verify change event structure
    const lastEvent = changeEvents[changeEvents.length - 1];
    if (!lastEvent.type) throw new Error('Change event missing type');
    if (!lastEvent.source) throw new Error('Change event missing source');
    if (!lastEvent.timestamp) throw new Error('Change event missing timestamp');
    if (!Array.isArray(lastEvent.changes)) throw new Error('Change event changes not array');

    // Test removing change listener
    configManager.removeChangeListener(changeListener);
    const eventCountBeforeRemoval = changeEvents.length;
    
    await configManager.updateConfiguration({ description: 'After listener removal' });
    
    if (changeEvents.length !== eventCountBeforeRemoval) {
      throw new Error('Change events still captured after listener removal');
    }

    await configManager.cleanup();
  }

  /**
   * Test error handling and recovery
   */
  private async testErrorHandlingAndRecovery(): Promise<void> {
    // Test with invalid configuration directory
    const configManager = new ConfigurationManager({
      configDir: '/invalid/path/that/does/not/exist',
      loadingStrategy: LoadingStrategy.GRACEFUL_FALLBACK
    });

    try {
      await configManager.initialize();
      // Should not throw with graceful fallback
    } catch (error) {
      throw new Error('Graceful fallback should not throw on invalid paths');
    }

    // Test with fail-fast strategy
    const failFastManager = new ConfigurationManager({
      configDir: '/invalid/path/that/does/not/exist',
      loadingStrategy: LoadingStrategy.FAIL_FAST
    });

    let errorThrown = false;
    try {
      await failFastManager.initialize();
    } catch (error) {
      errorThrown = true;
    }

    if (!errorThrown) {
      throw new Error('Fail-fast strategy should throw on invalid paths');
    }

    await configManager.cleanup();
  }

  /**
   * Test performance and caching
   */
  private async testPerformanceAndCaching(): Promise<void> {
    const configManager = new ConfigurationManager({
      configDir: path.join(this.testDataPath, 'config'),
      environment: Environment.DEVELOPMENT,
      enableCaching: true
    });

    await configManager.initialize();

    // Create test configuration file
    await this.createTestConfigurationFiles();

    // Test multiple loads to verify caching
    const startTime = Date.now();
    
    for (let i = 0; i < 5; i++) {
      await configManager.loadConfiguration();
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Performance check - multiple loads should be reasonably fast
    if (totalTime > 5000) { // 5 seconds for 5 loads
      throw new Error(`Configuration loading too slow: ${totalTime}ms for 5 loads`);
    }

    // Test configuration reload
    const reloadStartTime = Date.now();
    await configManager.reloadConfiguration();
    const reloadTime = Date.now() - reloadStartTime;

    if (reloadTime > 2000) { // 2 seconds for reload
      throw new Error(`Configuration reload too slow: ${reloadTime}ms`);
    }

    await configManager.cleanup();
  }

  /**
   * Create test configuration files
   */
  private async createTestConfigurationFiles(): Promise<void> {
    const configDir = path.join(this.testDataPath, 'config');
    
    const testConfig = {
      name: 'Test Configuration',
      description: 'Configuration for testing',
      environment: Environment.DEVELOPMENT,
      projectId: 'test-project',
      themes: {
        defaultTheme: 'light',
        customThemes: []
      },
      outputSettings: {
        format: 'markdown',
        destination: './test-output'
      },
      performanceSettings: {
        caching: {
          enabled: true,
          strategy: 'memory',
          ttl: 300000,
          maxSize: 100,
          compression: false
        }
      },
      securitySettings: {
        accessControl: 'authenticated',
        encryption: {
          encryptAtRest: false,
          encryptInTransit: false,
          algorithm: 'AES-256',
          keyRotation: false
        }
      }
    };

    await fs.writeFile(
      path.join(configDir, 'config.development.json'),
      JSON.stringify(testConfig, null, 2),
      'utf-8'
    );

    const fallbackConfig = {
      name: 'Test Fallback Configuration',
      description: 'Fallback configuration for testing',
      environment: Environment.DEVELOPMENT,
      projectId: 'test-fallback'
    };

    await fs.writeFile(
      path.join(configDir, 'config.json'),
      JSON.stringify(fallbackConfig, null, 2),
      'utf-8'
    );
  }

  /**
   * Show test results
   */
  private async showTestResults(): Promise<void> {
    console.log('\n=== T030 Configuration Management Test Results ===\n');

    const passedTests = this.testResults.filter(result => result.passed);
    const failedTests = this.testResults.filter(result => !result.passed);

    console.log(`📊 Test Summary:`);
    console.log(`   Total Tests: ${this.testResults.length}`);
    console.log(`   Passed: ${passedTests.length} ✅`);
    console.log(`   Failed: ${failedTests.length} ${failedTests.length > 0 ? '❌' : ''}`);
    console.log(`   Success Rate: ${((passedTests.length / this.testResults.length) * 100).toFixed(1)}%`);

    if (failedTests.length > 0) {
      console.log('\n❌ Failed Tests:');
      failedTests.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.name}`);
        console.log(`      Error: ${result.error}`);
      });
    }

    console.log('\n✅ Passed Tests:');
    passedTests.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.name}`);
    });

    const overallSuccess = failedTests.length === 0;
    console.log(`\n🎯 Overall Result: ${overallSuccess ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

    if (overallSuccess) {
      console.log('\n🎉 T030 Configuration Management Integration is fully functional!\n');
    } else {
      console.log('\n⚠️  T030 Configuration Management has issues that need attention.\n');
    }
  }

  /**
   * Clean up test resources
   */
  private async cleanup(): Promise<void> {
    try {
      // Clean up test files
      await fs.rm(this.testDataPath, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}

/**
 * Run T030 Configuration Management tests
 */
export async function runT030Tests(): Promise<void> {
  const tests = new T030ConfigurationTests();
  await tests.runAllTests();
}

// Make the tests runnable directly
if (require.main === module) {
  runT030Tests().catch(console.error);
}