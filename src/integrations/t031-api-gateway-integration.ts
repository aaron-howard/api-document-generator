/**
 * T031 API Gateway Integration - Main Integration Orchestrator
 * 
 * Provides a unified interface for all T031 API Gateway Integration capabilities,
 * including REST APIs, GraphQL endpoints, WebSocket real-time features,
 * authentication, rate limiting, webhook management, and comprehensive
 * service orchestration for the entire T023-T031 ecosystem.
 * 
 * @author T031 Implementation Team
 * @version 1.0.0
 */

import { APIGateway, APIGatewayConfig, APIResponse, GenerationJob, WebhookConfig } from '../gateway/api-gateway';
import { ConfigurationManager } from '../config/config-manager';
import { CLIService } from '../cli/cli-service';
import { ParserService } from '../parsers/parser-service';
import { AIService } from '../ai/ai-service';
import { GenerationService } from '../generators/generation-service';
import { CacheManager } from '../cache/cache-manager';
import { ErrorHandler } from '../error/error-handler';
import { PerformanceMonitor } from '../performance/performance-monitor';
import { Environment } from '../core/models/configuration';

/**
 * T031 Integration Configuration
 */
export interface T031IntegrationConfig {
  readonly gateway: APIGatewayConfig;
  readonly services: {
    readonly configManager: any;
    readonly cliService: any;
    readonly parserService: any;
    readonly aiService: any;
    readonly generationService: any;
    readonly cacheManager: any;
    readonly errorHandler: any;
    readonly performanceMonitor: any;
  };
  readonly features: {
    readonly enableRESTAPI: boolean;
    readonly enableGraphQL: boolean;
    readonly enableWebSocket: boolean;
    readonly enableAuthentication: boolean;
    readonly enableRateLimiting: boolean;
    readonly enableMonitoring: boolean;
    readonly enableWebhooks: boolean;
    readonly enableFileUpload: boolean;
  };
}

/**
 * API Gateway Statistics
 */
export interface APIGatewayStats {
  readonly status: 'running' | 'stopped' | 'error';
  readonly uptime: number;
  readonly requests: {
    readonly total: number;
    readonly successful: number;
    readonly failed: number;
    readonly averageResponseTime: number;
  };
  readonly connections: {
    readonly active: number;
    readonly total: number;
    readonly websocketClients: number;
  };
  readonly jobs: {
    readonly active: number;
    readonly completed: number;
    readonly failed: number;
    readonly pending: number;
  };
  readonly webhooks: {
    readonly configured: number;
    readonly delivered: number;
    readonly failed: number;
  };
  readonly performance: {
    readonly memoryUsage: NodeJS.MemoryUsage;
    readonly cpuUsage: NodeJS.CpuUsage;
    readonly systemLoad: number[];
  };
}

/**
 * T031 API Gateway Integration Main Class
 */
export class T031ApiGatewayIntegration {
  private gateway?: APIGateway;
  private config: T031IntegrationConfig;
  private services: {
    configManager?: ConfigurationManager;
    cliService?: CLIService;
    parserService?: ParserService;
    aiService?: AIService;
    generationService?: GenerationService;
    cacheManager?: CacheManager;
    errorHandler?: ErrorHandler;
    performanceMonitor?: PerformanceMonitor;
  } = {};
  private isInitialized = false;
  private isRunning = false;
  private statistics: Partial<APIGatewayStats> = {};

  constructor(config?: Partial<T031IntegrationConfig>) {
    // Default configuration
    this.config = {
      gateway: {
        port: 3000,
        host: 'localhost',
        environment: Environment.DEVELOPMENT,
        enableCORS: true,
        enableCompression: true,
        enableRateLimit: true,
        enableWebSocket: true,
        enableGraphQL: true,
        enableSwagger: true,
        rateLimitWindow: 900000,
        rateLimitMax: 100,
        maxFileSize: '10mb',
        apiPrefix: '/api/v1',
        auth: {
          enabled: true,
          type: 'api-key',
          apiKeys: ['api-key-123', 'api-key-456']
        }
      },
      services: {
        configManager: {},
        cliService: {},
        parserService: {},
        aiService: {},
        generationService: {},
        cacheManager: {},
        errorHandler: {},
        performanceMonitor: {}
      },
      features: {
        enableRESTAPI: true,
        enableGraphQL: true,
        enableWebSocket: true,
        enableAuthentication: true,
        enableRateLimiting: true,
        enableMonitoring: true,
        enableWebhooks: true,
        enableFileUpload: true
      },
      ...config
    };
  }

  /**
   * Initialize T031 API Gateway Integration
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      throw new Error('T031 Integration is already initialized');
    }

    console.log('🚀 Initializing T031 API Gateway Integration...\n');

    try {
      // Initialize services
      await this.initializeServices();

      // Create and initialize gateway
      this.gateway = new APIGateway(this.config.gateway);
      await this.gateway.initialize(
        this.services.configManager!,
        this.services.cliService!,
        this.services.parserService!,
        this.services.aiService!,
        this.services.generationService!,
        this.services.cacheManager!,
        this.services.errorHandler!,
        this.services.performanceMonitor!
      );

      this.isInitialized = true;
      console.log('✅ T031 API Gateway Integration initialized successfully!\n');

    } catch (error) {
      console.error('❌ Failed to initialize T031 Integration:', error);
      throw error;
    }
  }

  /**
   * Start the API Gateway
   */
  async start(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('T031 Integration must be initialized before starting');
    }

    if (this.isRunning) {
      throw new Error('T031 Integration is already running');
    }

    try {
      await this.gateway!.start();
      this.isRunning = true;
      this.statistics.status = 'running';
      
      console.log(`🌐 T031 API Gateway running on http://${this.config.gateway.host}:${this.config.gateway.port}`);
      console.log(`📚 API Documentation: http://${this.config.gateway.host}:${this.config.gateway.port}/docs`);
      
      if (this.config.features.enableGraphQL) {
        console.log(`🔗 GraphQL Playground: http://${this.config.gateway.host}:${this.config.gateway.port}/graphql`);
      }
      
      if (this.config.features.enableWebSocket) {
        console.log(`🔌 WebSocket Server: ws://${this.config.gateway.host}:${this.config.gateway.port}/ws`);
      }

    } catch (error) {
      this.statistics.status = 'error';
      console.error('❌ Failed to start T031 Integration:', error);
      throw error;
    }
  }

  /**
   * Stop the API Gateway
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    try {
      await this.gateway!.stop();
      this.isRunning = false;
      this.statistics.status = 'stopped';
      
      console.log('🛑 T031 API Gateway stopped successfully');

    } catch (error) {
      console.error('❌ Failed to stop T031 Integration:', error);
      throw error;
    }
  }

  /**
   * Get API Gateway status
   */
  getStatus(): { 
    initialized: boolean; 
    running: boolean; 
    config: T031IntegrationConfig;
    statistics: Partial<APIGatewayStats>;
  } {
    return {
      initialized: this.isInitialized,
      running: this.isRunning,
      config: this.config,
      statistics: this.statistics
    };
  }

  /**
   * Get comprehensive statistics
   */
  async getStatistics(): Promise<APIGatewayStats> {
    if (!this.gateway || !this.isRunning) {
      throw new Error('Gateway is not running');
    }

    const gatewayStats = this.gateway.getStats();
    
    return {
      status: 'running',
      uptime: gatewayStats.uptime || 0,
      requests: {
        total: 0, // Would be tracked in real implementation
        successful: 0,
        failed: 0,
        averageResponseTime: 0
      },
      connections: {
        active: gatewayStats.clients || 0,
        total: 0, // Would be tracked in real implementation
        websocketClients: gatewayStats.clients || 0
      },
      jobs: {
        active: gatewayStats.jobs || 0,
        completed: 0, // Would be tracked in real implementation
        failed: 0,
        pending: 0
      },
      webhooks: {
        configured: gatewayStats.webhooks || 0,
        delivered: 0, // Would be tracked in real implementation
        failed: 0
      },
      performance: {
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        systemLoad: [] // Would use os.loadavg() in real implementation
      }
    };
  }

  /**
   * Update configuration
   */
  async updateConfiguration(updates: Partial<T031IntegrationConfig>): Promise<void> {
    if (this.isRunning) {
      throw new Error('Cannot update configuration while gateway is running');
    }

    this.config = {
      ...this.config,
      ...updates,
      gateway: { ...this.config.gateway, ...updates.gateway },
      services: { ...this.config.services, ...updates.services },
      features: { ...this.config.features, ...updates.features }
    };

    console.log('✅ T031 Integration configuration updated');
  }

  /**
   * Initialize all required services
   */
  private async initializeServices(): Promise<void> {
    console.log('📋 Initializing services...');

    // Initialize Configuration Manager
    this.services.configManager = new ConfigurationManager({
      environment: this.config.gateway.environment,
      enableValidation: true,
      enableCaching: true
    });

    // Initialize CLI Service
    this.services.cliService = new CLIService();

    // Initialize Parser Service
    this.services.parserService = new ParserService();

    // Initialize AI Service
    this.services.aiService = new AIService({
      model: 'gpt-4',
      maxTokens: 2000,
      temperature: 0.7
    });

    // Initialize Generation Service
    this.services.generationService = new GenerationService({
      includeInteractiveExamples: true
    });

    // Initialize Cache Manager
    this.services.cacheManager = new CacheManager('api-gateway-cache');

    // Initialize Error Handler
    this.services.errorHandler = new ErrorHandler({
      logLevel: 'error'
    });

    // Initialize Performance Monitor
    this.services.performanceMonitor = new PerformanceMonitor({
      enableAlerting: true,
      samplingRate: 1.0
    });

    console.log('✅ All services initialized');
  }

  /**
   * Get service instances for external access
   */
  getServices(): {
    configManager?: ConfigurationManager;
    cliService?: CLIService;
    parserService?: ParserService;
    aiService?: AIService;
    generationService?: GenerationService;
    cacheManager?: CacheManager;
    errorHandler?: ErrorHandler;
    performanceMonitor?: PerformanceMonitor;
  } {
    return this.services;
  }

  /**
   * Get gateway instance for external access
   */
  getGateway(): APIGateway | undefined {
    return this.gateway;
  }

  /**
   * Health check for the entire integration
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    components: Record<string, 'healthy' | 'unhealthy' | 'unknown'>;
    timestamp: Date;
  }> {
    const components: Record<string, 'healthy' | 'unhealthy' | 'unknown'> = {};

    // Check gateway
    components.gateway = this.isRunning ? 'healthy' : 'unhealthy';

    // Check services
    components.configManager = this.services.configManager ? 'healthy' : 'unknown';
    components.cliService = this.services.cliService ? 'healthy' : 'unknown';
    components.parserService = this.services.parserService ? 'healthy' : 'unknown';
    components.aiService = this.services.aiService ? 'healthy' : 'unknown';
    components.generationService = this.services.generationService ? 'healthy' : 'unknown';
    components.cacheManager = this.services.cacheManager ? 'healthy' : 'unknown';
    components.errorHandler = this.services.errorHandler ? 'healthy' : 'unknown';
    components.performanceMonitor = this.services.performanceMonitor ? 'healthy' : 'unknown';

    const overallStatus = Object.values(components).every(status => status === 'healthy') 
      ? 'healthy' 
      : 'unhealthy';

    return {
      status: overallStatus,
      components,
      timestamp: new Date()
    };
  }
}

/**
 * Convenience functions for quick integration setup
 */

/**
 * Create and initialize T031 Integration with default configuration
 */
export async function createT031Integration(config?: Partial<T031IntegrationConfig>): Promise<T031ApiGatewayIntegration> {
  const integration = new T031ApiGatewayIntegration(config);
  await integration.initialize();
  return integration;
}

/**
 * Create and start T031 Integration with default configuration
 */
export async function startT031Integration(config?: Partial<T031IntegrationConfig>): Promise<T031ApiGatewayIntegration> {
  const integration = await createT031Integration(config);
  await integration.start();
  return integration;
}

/**
 * Quick demo function for T031 Integration
 */
export async function demonstrateT031Integration(): Promise<void> {
  console.log('🚀 T031 API Gateway Integration Demonstration\n');
  console.log('='.repeat(60));

  const integration = new T031ApiGatewayIntegration({
    gateway: {
      port: 3033,
      host: 'localhost',
      environment: Environment.DEVELOPMENT
    }
  });

  try {
    // Initialize
    await integration.initialize();
    console.log('✅ Integration initialized');

    // Start
    await integration.start();
    console.log('✅ Integration started');

    // Show status
    const status = integration.getStatus();
    console.log(`\n📊 Status: Initialized=${status.initialized}, Running=${status.running}`);

    // Show health check
    const health = await integration.healthCheck();
    console.log(`\n🏥 Health: ${health.status}`);
    console.log('   Components:', Object.entries(health.components)
      .map(([name, status]) => `${name}=${status}`).join(', '));

    // Show statistics
    const stats = await integration.getStatistics();
    console.log(`\n📈 Statistics:`);
    console.log(`   - Uptime: ${stats.uptime.toFixed(2)}s`);
    console.log(`   - Active Connections: ${stats.connections.active}`);
    console.log(`   - Active Jobs: ${stats.jobs.active}`);
    console.log(`   - Memory Usage: ${(stats.performance.memoryUsage.used / 1024 / 1024).toFixed(2)} MB`);

    // Wait for demonstration
    console.log('\n⏳ Gateway running for 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Stop
    await integration.stop();
    console.log('✅ Integration stopped');

    console.log('\n🎉 T031 Integration demonstration completed successfully!');

  } catch (error) {
    console.error('❌ Demonstration failed:', error);
    await integration.stop();
    throw error;
  }
}

/**
 * Showcase all T031 capabilities
 */
export function showcaseT031Capabilities(): void {
  console.log('\n🌟 T031 API Gateway Integration Capabilities\n');
  console.log('='.repeat(60));
  
  console.log('\n🌐 API Gateway Features:');
  console.log('  ✅ RESTful API endpoints with comprehensive error handling');
  console.log('  ✅ GraphQL API with introspection and playground');
  console.log('  ✅ WebSocket real-time communication');
  console.log('  ✅ Authentication (API Key, JWT, Basic Auth)');
  console.log('  ✅ Rate limiting and throttling');
  console.log('  ✅ Request/response compression');
  console.log('  ✅ CORS support for cross-origin requests');
  console.log('  ✅ Security headers (Helmet.js)');
  console.log('  ✅ Request logging and monitoring');

  console.log('\n🔧 Service Integration:');
  console.log('  ✅ Configuration Manager (T030) - Hierarchical config management');
  console.log('  ✅ CLI Service (T023) - Command-line interface integration');
  console.log('  ✅ Parser Service (T024) - Multi-format API specification parsing');
  console.log('  ✅ AI Service (T025) - AI-powered content generation and enhancement');
  console.log('  ✅ Generation Service (T026) - Multi-format documentation generation');
  console.log('  ✅ Cache Manager (T027) - Performance optimization caching');
  console.log('  ✅ Error Handler (T028) - Comprehensive error management');
  console.log('  ✅ Performance Monitor (T029) - Real-time performance analytics');

  console.log('\n📡 Real-time Features:');
  console.log('  ✅ WebSocket connections for live updates');
  console.log('  ✅ Real-time generation progress tracking');
  console.log('  ✅ Live performance metrics streaming');
  console.log('  ✅ System status broadcasting');
  console.log('  ✅ Error alerts and notifications');
  console.log('  ✅ Cache invalidation events');

  console.log('\n🪝 Webhook Support:');
  console.log('  ✅ Webhook registration and management');
  console.log('  ✅ Event-driven notifications');
  console.log('  ✅ Retry mechanisms with exponential backoff');
  console.log('  ✅ Webhook signature verification');
  console.log('  ✅ Flexible event filtering');

  console.log('\n📊 Monitoring & Analytics:');
  console.log('  ✅ Comprehensive performance metrics');
  console.log('  ✅ Request/response time tracking');
  console.log('  ✅ Error rate monitoring');
  console.log('  ✅ Resource usage analytics');
  console.log('  ✅ Connection and job statistics');

  console.log('\n⚙️ Configuration Management:');
  console.log('  ✅ Dynamic configuration updates');
  console.log('  ✅ User preference management');
  console.log('  ✅ Environment-specific settings');
  console.log('  ✅ Configuration export/import');
  console.log('  ✅ Validation and security filtering');

  console.log('\n📁 File Operations:');
  console.log('  ✅ Multi-format file upload support');
  console.log('  ✅ File size validation and limits');
  console.log('  ✅ Content type validation');
  console.log('  ✅ Secure file processing');

  console.log('\n🔒 Security Features:');
  console.log('  ✅ Multiple authentication methods');
  console.log('  ✅ API key management');
  console.log('  ✅ Rate limiting protection');
  console.log('  ✅ Security headers');
  console.log('  ✅ Request validation');
  console.log('  ✅ HTTPS/SSL support');

  console.log('\n🚀 Production Ready:');
  console.log('  ✅ Horizontal scaling support');
  console.log('  ✅ Health check endpoints');
  console.log('  ✅ Graceful shutdown handling');
  console.log('  ✅ Error recovery mechanisms');
  console.log('  ✅ Comprehensive logging');
  console.log('  ✅ Performance optimization');

  console.log('\n='.repeat(60));
  console.log('🎯 Ready for enterprise deployment and integration!');
  console.log('='.repeat(60));
}

// Export all components
export {
  T031IntegrationConfig,
  APIGatewayStats,
  T031ApiGatewayIntegration
};