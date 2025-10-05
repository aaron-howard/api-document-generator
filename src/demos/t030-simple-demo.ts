/**
 * T030 Configuration Management Integration - Simplified Demo
 * 
 * Focused demonstration of the core T030 Configuration Management features
 * including hierarchical loading, user preferences, environment variables,
 * and configuration validation.
 */

import { ConfigurationManager, ConfigurationSource, LoadingStrategy } from '../config/config-manager';
import { Environment } from '../core/models/configuration';
import { ThemeVariant, LanguageCode } from '../core/models/user-preferences';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * T030 Configuration Management Demo
 */
export class T030ConfigDemo {
  private configManager: ConfigurationManager;
  private demoDataPath: string;

  constructor() {
    this.demoDataPath = './demo-data/t030';
    
    this.configManager = new ConfigurationManager({
      configDir: path.join(this.demoDataPath, 'config'),
      userConfigDir: path.join(this.demoDataPath, 'user-config'),
      environment: Environment.DEVELOPMENT,
      loadingStrategy: LoadingStrategy.MERGE_ALL,
      enableValidation: true,
      enableCaching: true,
      enableBackup: true
    });
  }

  /**
   * Run the T030 Configuration Management demonstration
   */
  async runDemo(): Promise<void> {
    console.log('\n=== T030 Configuration Management Integration Demo ===\n');

    try {
      await this.setupDemo();
      await this.demonstrateConfigurationLoading();
      await this.demonstrateUserPreferences();
      await this.demonstrateEnvironmentVariables();
      await this.demonstrateConfigurationValidation();
      await this.demonstrateConfigurationExport();
      await this.showSystemStatus();
      
      console.log('🎉 T030 Configuration Management Demo completed successfully!\n');

    } catch (error) {
      console.error('❌ Demo failed:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Setup demonstration environment
   */
  private async setupDemo(): Promise<void> {
    console.log('🚀 Setting up T030 Configuration Management Demo...\n');

    try {
      // Create demo directories
      await fs.mkdir(this.demoDataPath, { recursive: true });
      await fs.mkdir(path.join(this.demoDataPath, 'config'), { recursive: true });
      await fs.mkdir(path.join(this.demoDataPath, 'user-config'), { recursive: true });

      // Initialize configuration manager
      await this.configManager.initialize();

      // Create sample configuration files
      await this.createSampleConfigurationFiles();

      console.log('✅ Setup completed successfully!\n');

    } catch (error) {
      console.error('❌ Setup failed:', error);
      throw error;
    }
  }

  /**
   * Demonstrate hierarchical configuration loading
   */
  private async demonstrateConfigurationLoading(): Promise<void> {
    console.log('📖 Demonstrating Hierarchical Configuration Loading...\n');

    try {
      // Load configuration with multiple sources
      const config = await this.configManager.loadConfiguration({
        environment: Environment.DEVELOPMENT,
        userId: 'demo-user',
        projectId: 'api-doc-generator-demo',
        sources: [
          ConfigurationSource.DEFAULT,
          ConfigurationSource.FILE,
          ConfigurationSource.ENVIRONMENT,
          ConfigurationSource.USER_PREFERENCES
        ],
        overrides: {
          customSettings: {
            demoMode: true,
            timestamp: new Date().toISOString()
          }
        },
        variables: {
          API_DOC_GEN_PROJECT_NAME: 'demo-project',
          API_DOC_GEN_USER_ID: 'demo-user'
        }
      });

      console.log('✅ Configuration loaded successfully:');
      console.log(`   ID: ${config.id}`);
      console.log(`   Name: ${config.name}`);
      console.log(`   Environment: ${config.environment}`);
      console.log(`   Version: ${config.version}`);
      console.log(`   Created: ${config.createdAt.toISOString()}`);
      console.log(`   Updated: ${config.updatedAt?.toISOString() || 'Never'}\n`);

    } catch (error) {
      console.error('❌ Configuration loading failed:', error);
      throw error;
    }
  }

  /**
   * Demonstrate user preferences management
   */
  private async demonstrateUserPreferences(): Promise<void> {
    console.log('👤 Demonstrating User Preferences Management...\n');

    try {
      // Load different user preference profiles
      const profiles = ['developer', 'writer', 'team-lead', 'enterprise'];

      console.log('Loading predefined user preference profiles:');
      for (const profile of profiles) {
        const preferences = await this.configManager.loadUserPreferences(
          `demo-${profile}`,
          profile
        );

        console.log(`✅ ${profile.charAt(0).toUpperCase() + profile.slice(1)} Profile:`);
        console.log(`   Profile Name: ${preferences.profileName}`);
        console.log(`   User ID: ${preferences.userId}`);
        console.log(`   Theme: ${preferences.interface.theme}`);
        console.log(`   Language: ${preferences.interface.language}`);
        console.log();
      }

      // Create and save custom user preferences
      console.log('Creating custom user preferences...');
      const customUserId = 'demo-custom-user';
      
      // Load default preferences first
      const defaultPrefs = await this.configManager.loadUserPreferences(customUserId);
      
      // Update with custom values
      const customPrefs = {
        ...defaultPrefs,
        profileName: 'Custom Demo Profile',
        interface: {
          ...defaultPrefs.interface,
          theme: ThemeVariant.DARK,
          language: LanguageCode.EN_US,
          enableAnimations: true,
          compactMode: false
        }
      };

      await this.configManager.saveUserPreferences(customPrefs, customUserId);
      console.log('✅ Custom user preferences saved successfully!\n');

    } catch (error) {
      console.error('❌ User preferences management failed:', error);
      throw error;
    }
  }

  /**
   * Demonstrate environment variable integration
   */
  private async demonstrateEnvironmentVariables(): Promise<void> {
    console.log('🌍 Demonstrating Environment Variable Integration...\n');

    try {
      // Set demonstration environment variables
      const envVars = {
        'API_DOC_GEN_MAX_WORKERS': '8',
        'API_DOC_GEN_CACHE_SIZE': '1000',
        'API_DOC_GEN_DEBUG_MODE': 'true',
        'API_DOC_GEN_OUTPUT_FORMAT': 'markdown',
        'API_DOC_GEN_SECURITY_LEVEL': 'high'
      };

      console.log('Setting environment variables:');
      for (const [key, value] of Object.entries(envVars)) {
        this.configManager.setEnvironmentVariable(key, value);
        console.log(`   ${key} = ${value}`);
      }

      // Reload configuration to pick up environment variables
      console.log('\nReloading configuration with environment variables...');
      await this.configManager.reloadConfiguration();

      console.log('✅ Environment variables integrated successfully!');

      // Verify environment variable retrieval
      console.log('\nVerifying environment variable access:');
      for (const [key, expectedValue] of Object.entries(envVars)) {
        const actualValue = this.configManager.getEnvironmentVariable(key);
        const status = actualValue === expectedValue ? '✅' : '❌';
        console.log(`   ${key}: ${actualValue} ${status}`);
      }

      console.log();

    } catch (error) {
      console.error('❌ Environment variable integration failed:', error);
      throw error;
    }
  }

  /**
   * Demonstrate configuration validation
   */
  private async demonstrateConfigurationValidation(): Promise<void> {
    console.log('✅ Demonstrating Configuration Validation...\n');

    try {
      const config = this.configManager.getConfiguration();
      if (!config) {
        throw new Error('No configuration loaded');
      }

      // Validate current configuration
      const validationResult = await this.configManager.validateConfiguration(config);

      console.log('Configuration validation results:');
      console.log(`   Valid: ${validationResult.isValid ? '✅' : '❌'}`);
      console.log(`   Errors: ${validationResult.errors.length}`);
      console.log(`   Warnings: ${validationResult.warnings.length}`);
      console.log(`   Suggestions: ${validationResult.suggestions.length}`);
      console.log(`   Security Issues: ${validationResult.securityIssues.length}`);
      console.log(`   Performance Issues: ${validationResult.performanceIssues.length}`);

      if (validationResult.errors.length > 0) {
        console.log('\n   Errors found:');
        validationResult.errors.forEach((error, index) => {
          console.log(`     ${index + 1}. ${error}`);
        });
      }

      if (validationResult.suggestions.length > 0) {
        console.log('\n   Suggestions:');
        validationResult.suggestions.forEach((suggestion, index) => {
          console.log(`     ${index + 1}. ${suggestion}`);
        });
      }

      if (validationResult.securityIssues.length > 0) {
        console.log('\n   Security Issues:');
        validationResult.securityIssues.forEach((issue, index) => {
          console.log(`     ${index + 1}. ${issue}`);
        });
      }

      console.log();

    } catch (error) {
      console.error('❌ Configuration validation failed:', error);
      throw error;
    }
  }

  /**
   * Demonstrate configuration export
   */
  private async demonstrateConfigurationExport(): Promise<void> {
    console.log('📤 Demonstrating Configuration Export...\n');

    try {
      const exportFormats = [
        { format: 'json' as const, includeSecrets: false, minify: false },
        { format: 'json' as const, includeSecrets: false, minify: true },
        { format: 'yaml' as const, includeSecrets: false },
        { format: 'env' as const, includeSecrets: false }
      ];

      for (const exportOptions of exportFormats) {
        console.log(`Exporting configuration as ${exportOptions.format.toUpperCase()}...`);
        
        const exportedConfig = await this.configManager.exportConfiguration(exportOptions);
        const filename = `config-export.${exportOptions.format}${exportOptions.minify ? '.min' : ''}`;
        const exportPath = path.join(this.demoDataPath, filename);
        
        await fs.writeFile(exportPath, exportedConfig, 'utf-8');
        
        console.log(`   ✅ Exported to: ${filename}`);
        console.log(`   Size: ${exportedConfig.length} characters`);
        
        // Show a preview of the exported content
        const preview = exportedConfig.length > 100 
          ? exportedConfig.substring(0, 100) + '...'
          : exportedConfig;
        console.log(`   Preview: ${preview.replace(/\n/g, ' ')}\n`);
      }

    } catch (error) {
      console.error('❌ Configuration export failed:', error);
      throw error;
    }
  }

  /**
   * Show system status
   */
  private async showSystemStatus(): Promise<void> {
    console.log('📊 System Status Summary\n');

    try {
      const config = this.configManager.getConfiguration();
      const userPrefs = this.configManager.getUserPreferences();

      console.log('=== Configuration Manager Status ===');
      console.log(`   Configuration loaded: ${config ? '✅ Yes' : '❌ No'}`);
      console.log(`   User preferences loaded: ${userPrefs ? '✅ Yes' : '❌ No'}`);
      
      if (config) {
        console.log(`   Environment: ${config.environment}`);
        console.log(`   Version: ${config.version}`);
        console.log(`   Project ID: ${config.projectId}`);
      }

      console.log('\n=== Features Status ===');
      console.log('   ✅ Hierarchical configuration loading');
      console.log('   ✅ User preference management');
      console.log('   ✅ Environment variable integration');
      console.log('   ✅ Configuration validation');
      console.log('   ✅ Multiple export formats');
      console.log('   ✅ Real-time configuration updates');
      console.log('   ✅ Change event tracking');

      console.log('\n=== Configuration Sources ===');
      console.log('   ✅ Default configuration');
      console.log('   ✅ File-based configuration');
      console.log('   ✅ Environment variables');
      console.log('   ✅ User preferences');
      console.log('   ✅ Runtime overrides');

      console.log();

    } catch (error) {
      console.error('❌ Failed to get system status:', error);
      throw error;
    }
  }

  /**
   * Create sample configuration files
   */
  private async createSampleConfigurationFiles(): Promise<void> {
    const configDir = path.join(this.demoDataPath, 'config');
    
    // Create environment-specific config
    const envConfig = {
      name: 'API Doc Generator Development',
      description: 'Development environment configuration',
      environment: Environment.DEVELOPMENT,
      projectId: 'api-doc-generator-demo',
      themes: {
        defaultTheme: 'light',
        customThemes: ['corporate', 'minimal']
      },
      outputSettings: {
        format: 'markdown',
        destination: './output'
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
          encryptAtRest: true,
          encryptInTransit: true,
          algorithm: 'AES-256',
          keyRotation: false
        }
      }
    };

    await fs.writeFile(
      path.join(configDir, 'config.development.json'),
      JSON.stringify(envConfig, null, 2),
      'utf-8'
    );

    // Create fallback config
    const fallbackConfig = {
      name: 'API Doc Generator Default',
      description: 'Default fallback configuration',
      environment: Environment.DEVELOPMENT,
      projectId: 'default'
    };

    await fs.writeFile(
      path.join(configDir, 'config.json'),
      JSON.stringify(fallbackConfig, null, 2),
      'utf-8'
    );
  }

  /**
   * Clean up demo resources
   */
  private async cleanup(): Promise<void> {
    try {
      await this.configManager.cleanup();
      console.log('🧹 Demo cleanup completed!\n');
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    }
  }
}

/**
 * Run the T030 Configuration Management demonstration
 */
export async function runT030Demo(): Promise<void> {
  const demo = new T030ConfigDemo();
  await demo.runDemo();
}

// Make the demo runnable directly
if (require.main === module) {
  runT030Demo().catch(console.error);
}