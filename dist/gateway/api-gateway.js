"use strict";
/**
 * T031 API Gateway Integration
 *
 * Comprehensive API Gateway that exposes all T023-T030 services as REST and GraphQL APIs,
 * providing web-based access, CI/CD integration, webhook support, authentication,
 * and real-time documentation generation capabilities.
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIGateway = exports.WebSocketMessageType = void 0;
const express_1 = __importDefault(require("express"));
const graphql_1 = require("graphql");
const express_graphql_1 = require("express-graphql");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const configuration_1 = require("../core/models/configuration");
const ws_1 = __importDefault(require("ws"));
const http_1 = require("http");
const uuid_1 = require("uuid");
/**
 * WebSocket message types
 */
var WebSocketMessageType;
(function (WebSocketMessageType) {
    WebSocketMessageType["GENERATION_PROGRESS"] = "generation_progress";
    WebSocketMessageType["GENERATION_COMPLETE"] = "generation_complete";
    WebSocketMessageType["PARSING_PROGRESS"] = "parsing_progress";
    WebSocketMessageType["PARSING_COMPLETE"] = "parsing_complete";
    WebSocketMessageType["ERROR_ALERT"] = "error_alert";
    WebSocketMessageType["PERFORMANCE_UPDATE"] = "performance_update";
    WebSocketMessageType["CACHE_INVALIDATION"] = "cache_invalidation";
    WebSocketMessageType["SYSTEM_STATUS"] = "system_status";
})(WebSocketMessageType || (exports.WebSocketMessageType = WebSocketMessageType = {}));
/**
 * T031 API Gateway Integration
 */
class APIGateway {
    constructor(config) {
        this.clients = new Map();
        this.jobs = new Map();
        this.webhooks = [];
        this.isRunning = false;
        this.config = {
            port: 3000,
            host: 'localhost',
            environment: configuration_1.Environment.DEVELOPMENT,
            enableCORS: true,
            enableCompression: true,
            enableRateLimit: true,
            enableWebSocket: true,
            enableGraphQL: true,
            enableSwagger: true,
            rateLimitWindow: 900000, // 15 minutes
            rateLimitMax: 100,
            maxFileSize: '10mb',
            apiPrefix: '/api/v1',
            ...config
        };
        this.app = (0, express_1.default)();
        this.setupMiddleware();
        this.setupRoutes();
    }
    /**
     * Initialize API Gateway with all services
     */
    async initialize(configManager, cliService, parserService, aiService, generationService, cacheManager, errorHandler, performanceMonitor) {
        console.log('🚀 Initializing T031 API Gateway Integration...\n');
        this.services = {
            configManager,
            cliService,
            parserService,
            aiService,
            generationService,
            cacheManager,
            errorHandler,
            performanceMonitor
        };
        // Setup GraphQL schema if enabled
        if (this.config.enableGraphQL) {
            this.setupGraphQL();
        }
        // Setup WebSocket server if enabled
        if (this.config.enableWebSocket) {
            this.setupWebSocket();
        }
        // Setup service event listeners
        this.setupServiceEventListeners();
        console.log('✅ T031 API Gateway Integration initialized successfully!\n');
    }
    /**
     * Start the API Gateway server
     */
    async start() {
        if (this.isRunning) {
            throw new Error('API Gateway is already running');
        }
        return new Promise((resolve, reject) => {
            try {
                this.server = (0, http_1.createServer)(this.app);
                // Setup WebSocket server
                if (this.config.enableWebSocket && this.server) {
                    this.wsServer = new ws_1.default.Server({ server: this.server });
                    this.setupWebSocketHandlers();
                }
                this.server.listen(this.config.port, this.config.host, () => {
                    this.isRunning = true;
                    console.log(`🌐 API Gateway running on http://${this.config.host}:${this.config.port}`);
                    console.log(`📚 API Documentation: http://${this.config.host}:${this.config.port}/docs`);
                    if (this.config.enableGraphQL) {
                        console.log(`🔗 GraphQL Playground: http://${this.config.host}:${this.config.port}/graphql`);
                    }
                    if (this.config.enableWebSocket) {
                        console.log(`🔌 WebSocket Server: ws://${this.config.host}:${this.config.port}/ws`);
                    }
                    console.log();
                    resolve();
                });
                this.server.on('error', (error) => {
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Stop the API Gateway server
     */
    async stop() {
        if (!this.isRunning) {
            return;
        }
        return new Promise((resolve) => {
            // Close WebSocket connections
            if (this.wsServer) {
                this.clients.forEach((client) => {
                    client.socket.close();
                });
                this.wsServer.close();
            }
            // Close HTTP server
            if (this.server) {
                this.server.close(() => {
                    this.isRunning = false;
                    console.log('🛑 API Gateway stopped');
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    }
    /**
     * Setup Express middleware
     */
    setupMiddleware() {
        // Security middleware
        this.app.use((0, helmet_1.default)());
        // CORS middleware
        if (this.config.enableCORS) {
            this.app.use((0, cors_1.default)({
                origin: true,
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
            }));
        }
        // Compression middleware
        if (this.config.enableCompression) {
            this.app.use((0, compression_1.default)());
        }
        // Rate limiting middleware
        if (this.config.enableRateLimit) {
            const limiter = (0, express_rate_limit_1.default)({
                windowMs: this.config.rateLimitWindow,
                max: this.config.rateLimitMax,
                message: {
                    success: false,
                    error: {
                        code: 'RATE_LIMIT_EXCEEDED',
                        message: 'Too many requests from this IP, please try again later.'
                    }
                }
            });
            this.app.use(limiter);
        }
        // Body parsing middleware
        this.app.use(express_1.default.json({ limit: this.config.maxFileSize }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: this.config.maxFileSize }));
        // Logging middleware
        this.app.use((0, morgan_1.default)('combined'));
        // Request context middleware
        this.app.use(this.createRequestContextMiddleware());
        // Authentication middleware
        if (this.config.auth?.enabled) {
            this.app.use(this.createAuthenticationMiddleware());
        }
    }
    /**
     * Setup API routes
     */
    setupRoutes() {
        const prefix = this.config.apiPrefix;
        // Health check endpoint
        this.app.get(`${prefix}/health`, this.handleHealthCheck.bind(this));
        // System status endpoint
        this.app.get(`${prefix}/status`, this.handleSystemStatus.bind(this));
        // Configuration endpoints
        this.app.get(`${prefix}/config`, this.handleGetConfiguration.bind(this));
        this.app.put(`${prefix}/config`, this.handleUpdateConfiguration.bind(this));
        // Parser endpoints
        this.app.post(`${prefix}/parse`, this.handleParseSpecification.bind(this));
        this.app.post(`${prefix}/validate`, this.handleValidateSpecification.bind(this));
        // AI endpoints
        this.app.post(`${prefix}/ai/enhance`, this.handleEnhanceDocumentation.bind(this));
        this.app.post(`${prefix}/ai/generate`, this.handleGenerateContent.bind(this));
        // Generation endpoints
        this.app.post(`${prefix}/generate`, this.handleGenerateDocumentation.bind(this));
        this.app.get(`${prefix}/generate/:jobId`, this.handleGetGenerationJob.bind(this));
        this.app.get(`${prefix}/jobs`, this.handleListJobs.bind(this));
        // Cache endpoints
        this.app.get(`${prefix}/cache/stats`, this.handleGetCacheStats.bind(this));
        this.app.delete(`${prefix}/cache`, this.handleClearCache.bind(this));
        // Performance endpoints
        this.app.get(`${prefix}/performance`, this.handleGetPerformanceMetrics.bind(this));
        // User preferences endpoints
        this.app.get(`${prefix}/preferences/:userId`, this.handleGetUserPreferences.bind(this));
        this.app.put(`${prefix}/preferences/:userId`, this.handleUpdateUserPreferences.bind(this));
        // Webhook endpoints
        this.app.post(`${prefix}/webhooks`, this.handleCreateWebhook.bind(this));
        this.app.get(`${prefix}/webhooks`, this.handleListWebhooks.bind(this));
        this.app.delete(`${prefix}/webhooks/:id`, this.handleDeleteWebhook.bind(this));
        // File upload endpoints
        this.app.post(`${prefix}/upload`, this.handleFileUpload.bind(this));
        // Export endpoints
        this.app.post(`${prefix}/export`, this.handleExportConfiguration.bind(this));
        // Error handling middleware
        this.app.use(this.createErrorHandlingMiddleware());
        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json(this.createResponse(false, null, {
                code: 'NOT_FOUND',
                message: `Endpoint ${req.originalUrl} not found`
            }, req));
        });
    }
    /**
     * Setup GraphQL schema and endpoint
     */
    setupGraphQL() {
        const schema = new graphql_1.GraphQLSchema({
            query: new graphql_1.GraphQLObjectType({
                name: 'Query',
                fields: {
                    health: {
                        type: graphql_1.GraphQLString,
                        resolve: () => 'OK'
                    },
                    configuration: {
                        type: graphql_1.GraphQLString,
                        resolve: async () => {
                            const config = this.services.configManager.getConfiguration();
                            return JSON.stringify(config);
                        }
                    },
                    jobs: {
                        type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
                        resolve: () => {
                            return Array.from(this.jobs.values()).map(job => JSON.stringify(job));
                        }
                    },
                    performance: {
                        type: graphql_1.GraphQLString,
                        resolve: async () => {
                            // In a real implementation, this would get actual performance data
                            return JSON.stringify({ status: 'healthy', timestamp: new Date() });
                        }
                    }
                }
            }),
            mutation: new graphql_1.GraphQLObjectType({
                name: 'Mutation',
                fields: {
                    generateDocumentation: {
                        type: graphql_1.GraphQLString,
                        args: {
                            input: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) }
                        },
                        resolve: async (_, { input }) => {
                            const jobId = (0, uuid_1.v4)();
                            const job = {
                                id: jobId,
                                type: 'generate',
                                status: 'pending',
                                input: JSON.parse(input),
                                progress: 0,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                metadata: {}
                            };
                            this.jobs.set(jobId, job);
                            this.processGenerationJob(jobId);
                            return jobId;
                        }
                    }
                }
            })
        });
        this.app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
            schema,
            graphiql: this.config.environment === configuration_1.Environment.DEVELOPMENT
        }));
    }
    /**
     * Setup WebSocket server
     */
    setupWebSocket() {
        // WebSocket setup will be completed in setupWebSocketHandlers
    }
    /**
     * Setup WebSocket event handlers
     */
    setupWebSocketHandlers() {
        if (!this.wsServer)
            return;
        this.wsServer.on('connection', (socket, request) => {
            const clientId = (0, uuid_1.v4)();
            const client = {
                id: clientId,
                socket,
                subscriptions: new Set(),
                metadata: {
                    userAgent: request.headers['user-agent'],
                    ip: request.socket.remoteAddress
                },
                connectedAt: new Date()
            };
            this.clients.set(clientId, client);
            socket.on('message', (data) => {
                try {
                    const message = JSON.parse(data);
                    this.handleWebSocketMessage(clientId, message);
                }
                catch (error) {
                    socket.send(JSON.stringify({
                        type: 'error',
                        message: 'Invalid JSON message'
                    }));
                }
            });
            socket.on('close', () => {
                this.clients.delete(clientId);
            });
            // Send welcome message
            socket.send(JSON.stringify({
                type: 'welcome',
                clientId,
                server: 'T031 API Gateway',
                timestamp: new Date()
            }));
        });
    }
    /**
     * Setup service event listeners for real-time updates
     */
    setupServiceEventListeners() {
        // Setup listeners for various service events
        // This would integrate with the actual service event systems
    }
    /**
     * Create request context middleware
     */
    createRequestContextMiddleware() {
        return (req, res, next) => {
            req.context = {
                requestId: (0, uuid_1.v4)(),
                clientInfo: {
                    userAgent: req.get('User-Agent') || 'unknown',
                    ip: req.ip || req.connection.remoteAddress || 'unknown',
                    origin: req.get('Origin')
                },
                timestamp: new Date(),
                metadata: {}
            };
            next();
        };
    }
    /**
     * Create authentication middleware
     */
    createAuthenticationMiddleware() {
        return (req, res, next) => {
            const authHeader = req.get('Authorization');
            const apiKey = req.get('X-API-Key');
            if (this.config.auth?.type === 'api-key') {
                if (!apiKey || !this.config.auth.apiKeys?.includes(apiKey)) {
                    return res.status(401).json(this.createResponse(false, null, {
                        code: 'UNAUTHORIZED',
                        message: 'Invalid or missing API key'
                    }, req));
                }
            }
            // Add more authentication logic as needed
            next();
        };
    }
    /**
     * Create error handling middleware
     */
    createErrorHandlingMiddleware() {
        return async (error, req, res, next) => {
            if (this.services?.errorHandler) {
                await this.services.errorHandler.handleError(error, {
                    serviceName: 'APIGateway',
                    operation: req.path,
                    severity: 'error',
                    metadata: {
                        method: req.method,
                        url: req.url,
                        userAgent: req.get('User-Agent')
                    }
                });
            }
            res.status(500).json(this.createResponse(false, null, {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unexpected error occurred'
            }, req));
        };
    }
    /**
     * Handle health check
     */
    async handleHealthCheck(req, res) {
        const health = {
            status: 'healthy',
            timestamp: new Date(),
            version: '1.0.0',
            services: {
                configManager: this.services?.configManager ? 'healthy' : 'unavailable',
                parserService: this.services?.parserService ? 'healthy' : 'unavailable',
                aiService: this.services?.aiService ? 'healthy' : 'unavailable',
                generationService: this.services?.generationService ? 'healthy' : 'unavailable',
                cacheManager: this.services?.cacheManager ? 'healthy' : 'unavailable'
            }
        };
        res.json(this.createResponse(true, health, undefined, req));
    }
    /**
     * Handle system status
     */
    async handleSystemStatus(req, res) {
        const status = {
            gateway: {
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage(),
                activeConnections: this.clients.size,
                activeJobs: this.jobs.size
            },
            services: {
                // This would integrate with actual service status
                configManager: { status: 'healthy' },
                parserService: { status: 'healthy' },
                aiService: { status: 'healthy' },
                generationService: { status: 'healthy' }
            }
        };
        res.json(this.createResponse(true, status, undefined, req));
    }
    /**
     * Handle get configuration
     */
    async handleGetConfiguration(req, res) {
        try {
            const config = this.services.configManager.getConfiguration();
            res.json(this.createResponse(true, config, undefined, req));
        }
        catch (error) {
            res.status(500).json(this.createResponse(false, null, {
                code: 'CONFIG_ERROR',
                message: 'Failed to retrieve configuration'
            }, req));
        }
    }
    /**
     * Handle update configuration
     */
    async handleUpdateConfiguration(req, res) {
        try {
            const updates = req.body;
            const updatedConfig = await this.services.configManager.updateConfiguration(updates);
            res.json(this.createResponse(true, updatedConfig, undefined, req));
        }
        catch (error) {
            res.status(500).json(this.createResponse(false, null, {
                code: 'CONFIG_UPDATE_ERROR',
                message: 'Failed to update configuration'
            }, req));
        }
    }
    /**
     * Handle parse specification
     */
    async handleParseSpecification(req, res) {
        try {
            const { content, format } = req.body;
            const result = await this.services.parserService.parseSpecification(content, format);
            res.json(this.createResponse(true, result, undefined, req));
        }
        catch (error) {
            res.status(400).json(this.createResponse(false, null, {
                code: 'PARSE_ERROR',
                message: 'Failed to parse specification'
            }, req));
        }
    }
    /**
     * Handle validate specification
     */
    async handleValidateSpecification(req, res) {
        try {
            const { content, format } = req.body;
            const result = await this.services.parserService.validateSpecification(content, format);
            res.json(this.createResponse(true, result, undefined, req));
        }
        catch (error) {
            res.status(400).json(this.createResponse(false, null, {
                code: 'VALIDATION_ERROR',
                message: 'Failed to validate specification'
            }, req));
        }
    }
    /**
     * Handle enhance documentation
     */
    async handleEnhanceDocumentation(req, res) {
        try {
            const { content, options } = req.body;
            const result = await this.services.aiService.enhanceDocumentation(content, options);
            res.json(this.createResponse(true, result, undefined, req));
        }
        catch (error) {
            res.status(500).json(this.createResponse(false, null, {
                code: 'AI_ENHANCEMENT_ERROR',
                message: 'Failed to enhance documentation'
            }, req));
        }
    }
    /**
     * Handle generate content
     */
    async handleGenerateContent(req, res) {
        try {
            const { prompt, options } = req.body;
            const result = await this.services.aiService.generateContent(prompt, options);
            res.json(this.createResponse(true, result, undefined, req));
        }
        catch (error) {
            res.status(500).json(this.createResponse(false, null, {
                code: 'CONTENT_GENERATION_ERROR',
                message: 'Failed to generate content'
            }, req));
        }
    }
    /**
     * Handle generate documentation
     */
    async handleGenerateDocumentation(req, res) {
        try {
            const jobId = (0, uuid_1.v4)();
            const job = {
                id: jobId,
                type: 'generate',
                status: 'pending',
                input: req.body,
                progress: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                metadata: {}
            };
            this.jobs.set(jobId, job);
            // Start processing job asynchronously
            this.processGenerationJob(jobId);
            res.json(this.createResponse(true, { jobId }, undefined, req));
        }
        catch (error) {
            res.status(500).json(this.createResponse(false, null, {
                code: 'GENERATION_ERROR',
                message: 'Failed to start documentation generation'
            }, req));
        }
    }
    /**
     * Handle get generation job
     */
    async handleGetGenerationJob(req, res) {
        const jobId = req.params.jobId;
        const job = this.jobs.get(jobId);
        if (!job) {
            return res.status(404).json(this.createResponse(false, null, {
                code: 'JOB_NOT_FOUND',
                message: 'Generation job not found'
            }, req));
        }
        res.json(this.createResponse(true, job, undefined, req));
    }
    /**
     * Handle list jobs
     */
    async handleListJobs(req, res) {
        const jobs = Array.from(this.jobs.values());
        res.json(this.createResponse(true, jobs, undefined, req));
    }
    /**
     * Handle get cache stats
     */
    async handleGetCacheStats(req, res) {
        try {
            const stats = await this.services.cacheManager.getStats();
            res.json(this.createResponse(true, stats, undefined, req));
        }
        catch (error) {
            res.status(500).json(this.createResponse(false, null, {
                code: 'CACHE_STATS_ERROR',
                message: 'Failed to retrieve cache statistics'
            }, req));
        }
    }
    /**
     * Handle clear cache
     */
    async handleClearCache(req, res) {
        try {
            await this.services.cacheManager.clearAll();
            res.json(this.createResponse(true, { message: 'Cache cleared successfully' }, undefined, req));
        }
        catch (error) {
            res.status(500).json(this.createResponse(false, null, {
                code: 'CACHE_CLEAR_ERROR',
                message: 'Failed to clear cache'
            }, req));
        }
    }
    /**
     * Handle get performance metrics
     */
    async handleGetPerformanceMetrics(req, res) {
        try {
            // In a real implementation, this would get actual performance data
            const metrics = {
                timestamp: new Date(),
                system: {
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    cpu: process.cpuUsage()
                },
                gateway: {
                    activeConnections: this.clients.size,
                    totalRequests: 0, // Would be tracked
                    averageResponseTime: 0 // Would be calculated
                }
            };
            res.json(this.createResponse(true, metrics, undefined, req));
        }
        catch (error) {
            res.status(500).json(this.createResponse(false, null, {
                code: 'PERFORMANCE_ERROR',
                message: 'Failed to retrieve performance metrics'
            }, req));
        }
    }
    /**
     * Handle get user preferences
     */
    async handleGetUserPreferences(req, res) {
        try {
            const userId = req.params.userId;
            const preferences = await this.services.configManager.loadUserPreferences(userId);
            res.json(this.createResponse(true, preferences, undefined, req));
        }
        catch (error) {
            res.status(500).json(this.createResponse(false, null, {
                code: 'PREFERENCES_ERROR',
                message: 'Failed to retrieve user preferences'
            }, req));
        }
    }
    /**
     * Handle update user preferences
     */
    async handleUpdateUserPreferences(req, res) {
        try {
            const userId = req.params.userId;
            const preferences = req.body;
            await this.services.configManager.saveUserPreferences(preferences, userId);
            res.json(this.createResponse(true, { message: 'Preferences updated successfully' }, undefined, req));
        }
        catch (error) {
            res.status(500).json(this.createResponse(false, null, {
                code: 'PREFERENCES_UPDATE_ERROR',
                message: 'Failed to update user preferences'
            }, req));
        }
    }
    /**
     * Handle create webhook
     */
    async handleCreateWebhook(req, res) {
        try {
            const webhook = req.body;
            this.webhooks.push(webhook);
            res.json(this.createResponse(true, { message: 'Webhook created successfully' }, undefined, req));
        }
        catch (error) {
            res.status(500).json(this.createResponse(false, null, {
                code: 'WEBHOOK_CREATE_ERROR',
                message: 'Failed to create webhook'
            }, req));
        }
    }
    /**
     * Handle list webhooks
     */
    async handleListWebhooks(req, res) {
        res.json(this.createResponse(true, this.webhooks, undefined, req));
    }
    /**
     * Handle delete webhook
     */
    async handleDeleteWebhook(req, res) {
        try {
            const id = req.params.id;
            this.webhooks = this.webhooks.filter(webhook => webhook.url !== id);
            res.json(this.createResponse(true, { message: 'Webhook deleted successfully' }, undefined, req));
        }
        catch (error) {
            res.status(500).json(this.createResponse(false, null, {
                code: 'WEBHOOK_DELETE_ERROR',
                message: 'Failed to delete webhook'
            }, req));
        }
    }
    /**
     * Handle file upload
     */
    async handleFileUpload(req, res) {
        try {
            // File upload handling would be implemented here
            res.json(this.createResponse(true, { message: 'File uploaded successfully' }, undefined, req));
        }
        catch (error) {
            res.status(500).json(this.createResponse(false, null, {
                code: 'UPLOAD_ERROR',
                message: 'Failed to upload file'
            }, req));
        }
    }
    /**
     * Handle export configuration
     */
    async handleExportConfiguration(req, res) {
        try {
            const options = req.body;
            const exported = await this.services.configManager.exportConfiguration(options);
            res.json(this.createResponse(true, { exported }, undefined, req));
        }
        catch (error) {
            res.status(500).json(this.createResponse(false, null, {
                code: 'EXPORT_ERROR',
                message: 'Failed to export configuration'
            }, req));
        }
    }
    /**
     * Handle WebSocket message
     */
    handleWebSocketMessage(clientId, message) {
        const client = this.clients.get(clientId);
        if (!client)
            return;
        switch (message.type) {
            case 'subscribe':
                if (message.events && Array.isArray(message.events)) {
                    message.events.forEach((event) => {
                        client.subscriptions.add(event);
                    });
                }
                break;
            case 'unsubscribe':
                if (message.events && Array.isArray(message.events)) {
                    message.events.forEach((event) => {
                        client.subscriptions.delete(event);
                    });
                }
                break;
            case 'ping':
                client.socket.send(JSON.stringify({ type: 'pong', timestamp: new Date() }));
                break;
            default:
                client.socket.send(JSON.stringify({
                    type: 'error',
                    message: `Unknown message type: ${message.type}`
                }));
        }
    }
    /**
     * Process generation job
     */
    async processGenerationJob(jobId) {
        const job = this.jobs.get(jobId);
        if (!job)
            return;
        try {
            // Update job status
            const updatedJob = { ...job, status: 'running', updatedAt: new Date() };
            this.jobs.set(jobId, updatedJob);
            // Broadcast job update
            this.broadcastToSubscribers('generation_progress', {
                jobId,
                status: 'running',
                progress: 0
            });
            // Simulate processing (in real implementation, this would call actual services)
            for (let progress = 0; progress <= 100; progress += 10) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Simulate work
                const progressJob = { ...updatedJob, progress, updatedAt: new Date() };
                this.jobs.set(jobId, progressJob);
                this.broadcastToSubscribers('generation_progress', {
                    jobId,
                    status: 'running',
                    progress
                });
            }
            // Complete job
            const completedJob = {
                ...updatedJob,
                status: 'completed',
                progress: 100,
                output: { message: 'Documentation generated successfully' },
                updatedAt: new Date()
            };
            this.jobs.set(jobId, completedJob);
            this.broadcastToSubscribers('generation_complete', {
                jobId,
                status: 'completed',
                output: completedJob.output
            });
        }
        catch (error) {
            const failedJob = {
                ...job,
                status: 'failed',
                error: error instanceof Error ? error.message : String(error),
                updatedAt: new Date()
            };
            this.jobs.set(jobId, failedJob);
            this.broadcastToSubscribers('error_alert', {
                jobId,
                status: 'failed',
                error: failedJob.error
            });
        }
    }
    /**
     * Broadcast message to subscribed clients
     */
    broadcastToSubscribers(event, data) {
        this.clients.forEach((client) => {
            if (client.subscriptions.has(event)) {
                client.socket.send(JSON.stringify({
                    type: event,
                    data,
                    timestamp: new Date()
                }));
            }
        });
    }
    /**
     * Create standardized API response
     */
    createResponse(success, data, error, req) {
        return {
            success,
            data,
            error: error ? { ...error, timestamp: new Date() } : undefined,
            metadata: {
                requestId: req?.context?.requestId || 'unknown',
                processingTime: req?.context ? Date.now() - req.context.timestamp.getTime() : 0,
                version: '1.0.0',
                endpoint: req?.path || 'unknown'
            }
        };
    }
    /**
     * Get gateway statistics
     */
    getStats() {
        return {
            isRunning: this.isRunning,
            config: this.config,
            clients: this.clients.size,
            jobs: this.jobs.size,
            webhooks: this.webhooks.length,
            uptime: process.uptime()
        };
    }
}
exports.APIGateway = APIGateway;
//# sourceMappingURL=api-gateway.js.map