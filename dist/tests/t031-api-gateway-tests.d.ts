/**
 * T031 API Gateway Integration - Comprehensive Test Suite
 *
 * Comprehensive test suite for the T031 API Gateway Integration, covering
 * REST APIs, GraphQL endpoints, WebSocket functionality, authentication,
 * rate limiting, error handling, and service integration.
 *
 * @author T031 Implementation Team
 * @version 1.0.0
 */
/**
 * T031 API Gateway Comprehensive Test Suite
 */
export declare class T031ApiGatewayTests {
    private gateway?;
    private config;
    private baseUrl;
    private services;
    private testResults;
    private totalTests;
    private passedTests;
    constructor();
    /**
     * Run comprehensive test suite
     */
    runTests(): Promise<void>;
    /**
     * Setup test environment
     */
    private setupTestEnvironment;
    /**
     * Test gateway initialization
     */
    private testGatewayInitialization;
    /**
     * Test service integration
     */
    private testServiceIntegration;
    /**
     * Test REST endpoints
     */
    private testRESTEndpoints;
    /**
     * Test GraphQL endpoints
     */
    private testGraphQLEndpoints;
    /**
     * Test WebSocket functionality
     */
    private testWebSocketFunctionality;
    /**
     * Test authentication
     */
    private testAuthentication;
    /**
     * Test rate limiting
     */
    private testRateLimiting;
    /**
     * Test error handling
     */
    private testErrorHandling;
    /**
     * Test configuration management
     */
    private testConfigurationManagement;
    /**
     * Test performance monitoring
     */
    private testPerformanceMonitoring;
    /**
     * Test file operations
     */
    private testFileOperations;
    /**
     * Test webhook management
     */
    private testWebhookManagement;
    /**
     * Run individual test
     */
    private runTest;
    /**
     * Display test results
     */
    private displayTestResults;
    /**
     * Cleanup test environment
     */
    private cleanup;
    /**
     * Sleep utility
     */
    private sleep;
}
/**
 * Run the T031 API Gateway Integration test suite
 */
declare function runT031Tests(): Promise<void>;
export { runT031Tests };
//# sourceMappingURL=t031-api-gateway-tests.d.ts.map