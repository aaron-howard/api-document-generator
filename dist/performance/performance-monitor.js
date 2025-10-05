"use strict";
/**
 * T029 Performance Monitoring Integration
 *
 * Comprehensive performance monitoring system that integrates with all services (T023-T028)
 * providing real-time metrics collection, analysis, optimization insights, and alerting.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMonitor = void 0;
const performance_metrics_1 = require("../core/models/performance-metrics");
/**
 * Comprehensive performance monitoring system
 */
class PerformanceMonitor {
    constructor(config = {}, errorHandler, cacheManager) {
        this.metricsHistory = [];
        this.activeMonitoring = new Map();
        this.alertHistory = [];
        this.serviceMetrics = new Map();
        this.config = {
            enabled: true,
            metricsInterval: 5000, // 5 seconds
            historyRetention: 1000, // keep last 1000 metrics
            enableRealTimeAlerts: true,
            enableOptimizationSuggestions: true,
            enableTrendAnalysis: true,
            enableResourceMonitoring: true,
            alertThresholds: {
                memoryUsage: 80,
                cpuUsage: 70,
                responseTime: 5000,
                errorRate: 5,
                cacheHitRate: 60
            },
            categories: Object.values(performance_metrics_1.PerformanceCategory),
            ...config
        };
        this.errorHandler = errorHandler;
        this.cacheManager = cacheManager;
    }
    /**
     * Initialize performance monitoring
     */
    async initialize() {
        if (!this.config.enabled) {
            console.log('Performance monitoring is disabled');
            return;
        }
        try {
            // Start periodic monitoring
            this.startPeriodicMonitoring();
            // Initialize baseline metrics
            await this.captureBaselineMetrics();
            console.log(`Performance monitoring initialized with ${this.config.metricsInterval}ms interval`);
        }
        catch (error) {
            console.error('Failed to initialize performance monitor:', error.message);
            throw error;
        }
    }
    /**
     * Start monitoring a service operation
     */
    startMonitoring(operationId, context) {
        if (!this.config.enabled)
            return;
        this.activeMonitoring.set(operationId, {
            startTime: new Date(),
            context
        });
    }
    /**
     * Stop monitoring and record metrics
     */
    async stopMonitoring(operationId, additionalMetrics = {}) {
        if (!this.config.enabled)
            return null;
        const monitoring = this.activeMonitoring.get(operationId);
        if (!monitoring) {
            console.warn(`No active monitoring found for operation: ${operationId}`);
            return null;
        }
        try {
            const endTime = new Date();
            const duration = endTime.getTime() - monitoring.startTime.getTime();
            // Validate required properties
            if (!monitoring.context.sessionId) {
                throw new Error('Session ID is required for performance monitoring');
            }
            // Create performance metrics
            const metrics = performance_metrics_1.PerformanceMetricsFactory.create({
                category: this.mapServiceToCategory(monitoring.context.serviceName),
                sessionId: monitoring.context.sessionId,
                environment: {
                    platform: process.platform,
                    architecture: process.arch,
                    nodeVersion: process.version,
                    memoryLimit: this.getAvailableMemory(),
                    cpuCores: this.getCpuCores(),
                    diskSpace: 0
                },
                thresholds: this.createDefaultThresholds(),
                metadata: { operation: monitoring.context.operation || 'unknown' },
                ...additionalMetrics
            });
            // Update with timing and resource data
            const completedMetrics = performance_metrics_1.PerformanceMetricsFactory.complete(metrics, {
                metadata: {
                    ...metrics.metadata,
                    totalTime: duration,
                    endTime,
                    operation: monitoring.context.operation || 'unknown'
                },
                cpu: await this.getCpuMetrics(),
                memory: this.getMemoryMetrics(),
                diskIO: await this.getDiskIOMetrics(),
                networkIO: this.getNetworkIOMetrics(),
                cache: this.getCacheMetrics(),
                concurrency: this.getConcurrencyMetrics()
            });
            // Add to history
            this.addToHistory(completedMetrics);
            // Add to service-specific metrics
            this.addToServiceMetrics(monitoring.context.serviceName, completedMetrics);
            // Check for alerts
            await this.checkPerformanceAlerts(completedMetrics);
            // Generate recommendations if enabled
            if (this.config.enableOptimizationSuggestions) {
                await this.generateOptimizationRecommendations(completedMetrics);
            }
            // Clean up
            this.activeMonitoring.delete(operationId);
            return completedMetrics;
        }
        catch (error) {
            console.error('Failed to stop monitoring:', error.message);
            this.activeMonitoring.delete(operationId);
            return null;
        }
    }
    /**
     * Get real-time performance data
     */
    getRealTimeData() {
        const latestMetrics = this.metricsHistory[this.metricsHistory.length - 1];
        const recentAlerts = this.alertHistory.slice(-10);
        const serviceBreakdown = {};
        this.serviceMetrics.forEach((metrics, serviceName) => {
            const recentMetrics = metrics.slice(-10);
            if (recentMetrics.length > 0) {
                serviceBreakdown[serviceName] = {
                    averageResponseTime: recentMetrics.reduce((sum, m) => sum + m.totalTime, 0) / recentMetrics.length,
                    operationCount: recentMetrics.length,
                    errorRate: this.calculateErrorRate(serviceName),
                    throughput: this.calculateThroughput(recentMetrics)
                };
            }
        });
        return {
            timestamp: new Date(),
            metrics: latestMetrics || this.createEmptyMetrics(),
            alerts: recentAlerts,
            trends: this.config.enableTrendAnalysis ? this.generateTrends() : [],
            recommendations: latestMetrics ? performance_metrics_1.PerformanceMetricsUtils.generateRecommendations(latestMetrics) : [],
            serviceBreakdown
        };
    }
    /**
     * Get performance dashboard data
     */
    getDashboard() {
        const recentMetrics = this.metricsHistory.slice(-20);
        const totalRequests = recentMetrics.reduce((sum, m) => sum + (m.concurrency?.completedTasks || 1), 0);
        const averageResponseTime = recentMetrics.length > 0
            ? recentMetrics.reduce((sum, m) => sum + m.totalTime, 0) / recentMetrics.length
            : 0;
        const systemHealth = this.determineSystemHealth();
        const uptime = process.uptime() * 1000;
        // Build services overview
        const services = {};
        this.serviceMetrics.forEach((metrics, serviceName) => {
            const latestMetric = metrics[metrics.length - 1];
            const recentAlerts = this.alertHistory.filter(a => a.message.toLowerCase().includes(serviceName.toLowerCase())).slice(-5);
            services[serviceName] = {
                status: this.determineServiceStatus(serviceName),
                metrics: latestMetric || this.createEmptyMetrics(),
                recentAlerts,
                trends: this.config.enableTrendAnalysis ? this.generateServiceTrends(serviceName) : []
            };
        });
        // Resource information
        const latestMetrics = this.metricsHistory[this.metricsHistory.length - 1];
        const resources = {
            cpu: {
                current: latestMetrics?.cpu?.usage || 0,
                average: latestMetrics?.cpu?.average || 0,
                peak: latestMetrics?.cpu?.peak || 0
            },
            memory: {
                current: latestMetrics?.memory?.used || 0,
                available: latestMetrics?.memory?.available || 0,
                percentage: latestMetrics?.memory?.percentage || 0
            },
            cache: {
                hitRate: latestMetrics?.cache?.hitRate || 0,
                size: latestMetrics?.cache?.hits || 0,
                evictions: latestMetrics?.cache?.evictions || 0
            },
            network: {
                bytesIn: latestMetrics?.networkIO?.bytesReceived || 0,
                bytesOut: latestMetrics?.networkIO?.bytesSent || 0,
                connections: latestMetrics?.networkIO?.connectionsActive || 0
            }
        };
        // Generate insights
        const insights = {
            topBottlenecks: this.identifyBottlenecks(),
            optimizationOpportunities: latestMetrics ? performance_metrics_1.PerformanceMetricsUtils.generateRecommendations(latestMetrics) : [],
            performanceTrends: this.generateTrends(),
            anomalies: this.detectAnomalies()
        };
        return {
            overview: {
                totalRequests,
                averageResponseTime,
                currentThroughput: this.calculateCurrentThroughput(),
                systemHealth,
                uptime
            },
            services,
            resources,
            insights
        };
    }
    /**
     * Compare performance between time periods
     */
    comparePerformance(baselineDate, currentDate) {
        const baselineMetrics = this.findMetricsByDate(baselineDate);
        const currentMetrics = this.findMetricsByDate(currentDate);
        if (!baselineMetrics || !currentMetrics) {
            return null;
        }
        return performance_metrics_1.PerformanceMetricsUtils.compare(baselineMetrics, currentMetrics);
    }
    /**
     * Get performance trends
     */
    getPerformanceTrends(metric, category) {
        return performance_metrics_1.PerformanceMetricsUtils.analyzeTrends(this.metricsHistory, metric, category);
    }
    /**
     * Export performance data
     */
    exportPerformanceData(format = 'json') {
        const data = {
            timestamp: new Date(),
            config: this.config,
            metrics: this.metricsHistory,
            alerts: this.alertHistory,
            serviceMetrics: Object.fromEntries(this.serviceMetrics),
            dashboard: this.getDashboard(),
            summary: {
                totalMetrics: this.metricsHistory.length,
                totalAlerts: this.alertHistory.length,
                averageResponseTime: this.metricsHistory.length > 0
                    ? this.metricsHistory.reduce((sum, m) => sum + m.totalTime, 0) / this.metricsHistory.length
                    : 0,
                healthScore: this.calculateHealthScore()
            }
        };
        switch (format) {
            case 'csv':
                return this.convertToCSV(data);
            case 'html':
                return this.convertToHTML(data);
            default:
                return data;
        }
    }
    /**
     * Shutdown performance monitoring
     */
    async shutdown() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = undefined;
        }
        // Clear active monitoring
        this.activeMonitoring.clear();
        console.log('Performance monitoring shutdown completed');
    }
    // Private helper methods
    startPeriodicMonitoring() {
        this.monitoringInterval = setInterval(async () => {
            try {
                await this.captureSystemMetrics();
            }
            catch (error) {
                console.error('Error in periodic monitoring:', error.message);
            }
        }, this.config.metricsInterval);
    }
    async captureBaselineMetrics() {
        const baselineMetrics = performance_metrics_1.PerformanceMetricsFactory.create({
            category: performance_metrics_1.PerformanceCategory.OVERALL,
            environment: {
                platform: process.platform,
                architecture: process.arch,
                nodeVersion: process.version,
                memoryLimit: this.getAvailableMemory(),
                cpuCores: this.getCpuCores(),
                diskSpace: 0
            },
            thresholds: this.createDefaultThresholds()
        });
        const completedMetrics = performance_metrics_1.PerformanceMetricsFactory.complete(baselineMetrics, {
            metadata: { totalTime: 0 },
            memory: this.getMemoryMetrics(),
            cpu: await this.getCpuMetrics(),
            cache: this.getCacheMetrics()
        });
        this.addToHistory(completedMetrics);
    }
    async captureSystemMetrics() {
        const systemMetrics = performance_metrics_1.PerformanceMetricsFactory.create({
            category: performance_metrics_1.PerformanceCategory.OVERALL,
            environment: {
                platform: process.platform,
                architecture: process.arch,
                nodeVersion: process.version,
                memoryLimit: this.getAvailableMemory(),
                cpuCores: this.getCpuCores(),
                diskSpace: 0
            },
            thresholds: this.createDefaultThresholds()
        });
        const completedMetrics = performance_metrics_1.PerformanceMetricsFactory.complete(systemMetrics, {
            metadata: { operation: 'system-monitoring', totalTime: this.config.metricsInterval },
            memory: this.getMemoryMetrics(),
            cpu: await this.getCpuMetrics(),
            diskIO: await this.getDiskIOMetrics(),
            networkIO: this.getNetworkIOMetrics(),
            cache: this.getCacheMetrics(),
            concurrency: this.getConcurrencyMetrics()
        });
        this.addToHistory(completedMetrics);
        // Check for system-wide alerts
        if (this.config.enableRealTimeAlerts) {
            await this.checkPerformanceAlerts(completedMetrics);
        }
    }
    mapServiceToCategory(serviceName) {
        const mapping = {
            'CLIService': performance_metrics_1.PerformanceCategory.OVERALL,
            'ParserService': performance_metrics_1.PerformanceCategory.PARSING,
            'AIService': performance_metrics_1.PerformanceCategory.AI_PROCESSING,
            'GenerationService': performance_metrics_1.PerformanceCategory.GENERATION,
            'CacheManager': performance_metrics_1.PerformanceCategory.CACHE_OPERATIONS,
            'ErrorHandler': performance_metrics_1.PerformanceCategory.OVERALL
        };
        return mapping[serviceName] || performance_metrics_1.PerformanceCategory.OVERALL;
    }
    createDefaultThresholds() {
        return [
            {
                name: 'Memory Usage',
                category: performance_metrics_1.PerformanceCategory.OVERALL,
                metric: 'memory.percentage',
                warningThreshold: this.config.alertThresholds.memoryUsage,
                criticalThreshold: this.config.alertThresholds.memoryUsage + 15,
                unit: 'percentage',
                enabled: true,
                description: 'Monitor memory usage percentage'
            },
            {
                name: 'CPU Usage',
                category: performance_metrics_1.PerformanceCategory.OVERALL,
                metric: 'cpu.average',
                warningThreshold: this.config.alertThresholds.cpuUsage,
                criticalThreshold: this.config.alertThresholds.cpuUsage + 20,
                unit: 'percentage',
                enabled: true,
                description: 'Monitor CPU usage percentage'
            },
            {
                name: 'Response Time',
                category: performance_metrics_1.PerformanceCategory.OVERALL,
                metric: 'totalTime',
                warningThreshold: this.config.alertThresholds.responseTime,
                criticalThreshold: this.config.alertThresholds.responseTime * 2,
                unit: 'milliseconds',
                enabled: true,
                description: 'Monitor response time'
            }
        ];
    }
    getAvailableMemory() {
        return require('os').totalmem();
    }
    getCpuCores() {
        return require('os').cpus().length;
    }
    async getCpuMetrics() {
        const usage = process.cpuUsage();
        const currentUsage = (usage.user + usage.system) / 1000; // Convert to milliseconds
        return {
            usage: Math.min(currentUsage / 10, 100), // Simplified calculation
            average: Math.min(currentUsage / 10, 100),
            peak: Math.min(currentUsage / 10, 100),
            cores: this.getCpuCores(),
            loadAverage: [require('os').loadavg()[0] * 100 / this.getCpuCores()]
        };
    }
    getMemoryMetrics() {
        const memUsage = process.memoryUsage();
        const totalMem = require('os').totalmem();
        const freeMem = require('os').freemem();
        return {
            used: memUsage.heapUsed,
            available: freeMem,
            percentage: (memUsage.heapUsed / totalMem) * 100,
            heap: {
                used: memUsage.heapUsed,
                total: memUsage.heapTotal,
                limit: require('v8').getHeapStatistics().heap_size_limit
            },
            external: memUsage.external,
            buffers: memUsage.arrayBuffers || 0
        };
    }
    async getDiskIOMetrics() {
        // Simplified disk I/O metrics (in a real implementation, this would use system APIs)
        return {
            bytesRead: 0,
            bytesWritten: 0,
            readOperations: 0,
            writeOperations: 0,
            readTime: 0,
            writeTime: 0,
            queueDepth: 0,
            utilization: 0
        };
    }
    getNetworkIOMetrics() {
        // Simplified network I/O metrics
        return {
            bytesReceived: 0,
            bytesSent: 0,
            packetsReceived: 0,
            packetsSent: 0,
            connectionsActive: this.activeMonitoring.size,
            connectionsTotal: this.activeMonitoring.size,
            errors: 0,
            retransmissions: 0
        };
    }
    getCacheMetrics() {
        if (this.cacheManager) {
            const stats = this.cacheManager.getStats();
            return {
                hitRate: stats.efficiency.hitRate * 100,
                missRate: (1 - stats.efficiency.hitRate) * 100,
                totalRequests: stats.operations.gets,
                hits: Math.floor(stats.operations.gets * stats.efficiency.hitRate),
                misses: Math.floor(stats.operations.gets * (1 - stats.efficiency.hitRate)),
                evictions: 0,
                totalEntries: 0,
                memoryUsage: 0,
                averageAccessTime: stats.performance.avgGetTime
            };
        }
        return {
            hitRate: 0,
            missRate: 100,
            totalRequests: 0,
            hits: 0,
            misses: 0,
            evictions: 0,
            totalEntries: 0,
            memoryUsage: 0,
            averageAccessTime: 0
        };
    }
    getConcurrencyMetrics() {
        const poolUtilization = this.metricsHistory.length > 0
            ? Math.max(...this.metricsHistory.map(m => m.concurrency?.completedTasks || 0))
            : 0;
        return {
            activeThreads: 1, // Node.js is single-threaded for main execution
            maxThreads: 1,
            blockedThreads: 0,
            waitingThreads: 0,
            completedTasks: this.metricsHistory.length,
            queuedTasks: 0,
            parallelism: 1,
            contention: 0,
            deadlocks: 0,
            poolUtilization
        };
    }
    addToHistory(metrics) {
        this.metricsHistory.push(metrics);
        // Trim history if needed
        if (this.metricsHistory.length > this.config.historyRetention) {
            this.metricsHistory = this.metricsHistory.slice(-this.config.historyRetention);
        }
    }
    addToServiceMetrics(serviceName, metrics) {
        if (!this.serviceMetrics.has(serviceName)) {
            this.serviceMetrics.set(serviceName, []);
        }
        const serviceMetrics = this.serviceMetrics.get(serviceName);
        serviceMetrics.push(metrics);
        // Trim service metrics if needed
        if (serviceMetrics.length > Math.floor(this.config.historyRetention / 4)) {
            serviceMetrics.splice(0, serviceMetrics.length - Math.floor(this.config.historyRetention / 4));
        }
    }
    async checkPerformanceAlerts(metrics) {
        const alerts = performance_metrics_1.PerformanceMetricsUtils.checkAlerts(metrics);
        for (const alert of alerts) {
            this.alertHistory.push(alert);
            // Log alert
            console.warn(`🚨 Performance Alert [${alert.severity}]: ${alert.message}`);
            // Integrate with error handler if available
            if (this.errorHandler && alert.severity === 'critical') {
                try {
                    await this.errorHandler.handleError(new Error(`Performance alert: ${alert.message}`), {
                        serviceName: 'PerformanceMonitor',
                        operation: 'alerting',
                        parameters: { alert },
                        startTime: new Date()
                    });
                }
                catch (error) {
                    console.error('Failed to handle performance alert:', error.message);
                }
            }
        }
        // Trim alert history
        if (this.alertHistory.length > this.config.historyRetention) {
            this.alertHistory = this.alertHistory.slice(-this.config.historyRetention);
        }
    }
    async generateOptimizationRecommendations(metrics) {
        const recommendations = performance_metrics_1.PerformanceMetricsUtils.generateRecommendations(metrics);
        if (recommendations.length > 0) {
            console.log(`💡 Generated ${recommendations.length} optimization recommendations`);
            recommendations.forEach((rec, index) => {
                console.log(`   ${index + 1}. ${rec.title} (Impact: ${rec.impact}, Effort: ${rec.effort})`);
            });
        }
    }
    calculateErrorRate(_serviceName) {
        // Integration with error handler to get service-specific error rates
        if (this.errorHandler) {
            const analytics = this.errorHandler.getAnalytics();
            return analytics.errorRate || 0;
        }
        return 0;
    }
    calculateThroughput(metrics) {
        if (metrics.length === 0)
            return 0;
        const timeSpan = metrics.length * this.config.metricsInterval;
        return (metrics.length / timeSpan) * 1000 * 60; // Operations per minute
    }
    calculateCurrentThroughput() {
        const recentMetrics = this.metricsHistory.slice(-10);
        return this.calculateThroughput(recentMetrics);
    }
    determineSystemHealth() {
        const latestMetrics = this.metricsHistory[this.metricsHistory.length - 1];
        if (!latestMetrics)
            return 'healthy';
        const criticalAlerts = this.alertHistory.filter(a => a.severity === 'critical' &&
            Date.now() - a.timestamp.getTime() < 300000 // Last 5 minutes
        );
        if (criticalAlerts.length > 0)
            return 'critical';
        const memoryOk = (latestMetrics.memory?.percentage || 0) < this.config.alertThresholds.memoryUsage;
        const cpuOk = (latestMetrics.cpu?.average || 0) < this.config.alertThresholds.cpuUsage;
        const responseTimeOk = latestMetrics.totalTime < this.config.alertThresholds.responseTime;
        if (!memoryOk || !cpuOk || !responseTimeOk)
            return 'degraded';
        return 'healthy';
    }
    determineServiceStatus(serviceName) {
        const serviceMetrics = this.serviceMetrics.get(serviceName);
        if (!serviceMetrics || serviceMetrics.length === 0)
            return 'error';
        const latestMetric = serviceMetrics[serviceMetrics.length - 1];
        const recentAlerts = this.alertHistory.filter(a => a.message.toLowerCase().includes(serviceName.toLowerCase()) &&
            Date.now() - a.timestamp.getTime() < 300000);
        if (recentAlerts.some(a => a.severity === 'critical'))
            return 'error';
        if (recentAlerts.length > 0)
            return 'degraded';
        if (latestMetric && latestMetric.totalTime > this.config.alertThresholds.responseTime)
            return 'degraded';
        return 'active';
    }
    generateTrends() {
        if (!this.config.enableTrendAnalysis || this.metricsHistory.length < 2) {
            return [];
        }
        return [
            performance_metrics_1.PerformanceMetricsUtils.analyzeTrends(this.metricsHistory, 'totalTime', performance_metrics_1.PerformanceCategory.OVERALL),
            performance_metrics_1.PerformanceMetricsUtils.analyzeTrends(this.metricsHistory, 'memory.percentage', performance_metrics_1.PerformanceCategory.OVERALL),
            performance_metrics_1.PerformanceMetricsUtils.analyzeTrends(this.metricsHistory, 'cpu.average', performance_metrics_1.PerformanceCategory.OVERALL)
        ];
    }
    generateServiceTrends(serviceName) {
        const serviceMetrics = this.serviceMetrics.get(serviceName);
        if (!serviceMetrics || serviceMetrics.length < 2) {
            return [];
        }
        return [
            performance_metrics_1.PerformanceMetricsUtils.analyzeTrends(serviceMetrics, 'totalTime', this.mapServiceToCategory(serviceName))
        ];
    }
    identifyBottlenecks() {
        const latestMetrics = this.metricsHistory[this.metricsHistory.length - 1];
        if (!latestMetrics)
            return [];
        const bottlenecks = [];
        // Check each category in breakdown for high times
        Object.entries(latestMetrics.breakdown).forEach(([category, time]) => {
            if (time > latestMetrics.totalTime * 0.3) { // Takes more than 30% of total time
                bottlenecks.push({
                    category,
                    impact: (time / latestMetrics.totalTime) * 100,
                    suggestion: this.getBottleneckSuggestion(category)
                });
            }
        });
        return bottlenecks.sort((a, b) => b.impact - a.impact);
    }
    getBottleneckSuggestion(category) {
        const suggestions = {
            [performance_metrics_1.PerformanceCategory.PARSING]: 'Consider caching parsed results or using streaming parsers',
            [performance_metrics_1.PerformanceCategory.AI_PROCESSING]: 'Implement request batching or caching for AI operations',
            [performance_metrics_1.PerformanceCategory.GENERATION]: 'Cache template compilation and optimize rendering',
            [performance_metrics_1.PerformanceCategory.CACHE_OPERATIONS]: 'Review cache size and eviction policies',
            [performance_metrics_1.PerformanceCategory.FILE_IO]: 'Implement file pooling or async I/O operations',
            [performance_metrics_1.PerformanceCategory.NETWORK_IO]: 'Add connection pooling and request batching',
            [performance_metrics_1.PerformanceCategory.OVERALL]: 'Review overall architecture and identify optimization opportunities',
            [performance_metrics_1.PerformanceCategory.ANALYSIS]: 'Optimize analysis algorithms and data structures',
            [performance_metrics_1.PerformanceCategory.VALIDATION]: 'Implement validation caching and rule optimization',
            [performance_metrics_1.PerformanceCategory.RENDERING]: 'Cache rendered components and optimize templates',
            [performance_metrics_1.PerformanceCategory.TEMPLATE_PROCESSING]: 'Pre-compile templates and cache results',
            [performance_metrics_1.PerformanceCategory.DATABASE_IO]: 'Add query optimization and connection pooling',
            [performance_metrics_1.PerformanceCategory.SERIALIZATION]: 'Use faster serialization formats or streaming',
            [performance_metrics_1.PerformanceCategory.COMPRESSION]: 'Adjust compression levels and algorithms',
            [performance_metrics_1.PerformanceCategory.ENCRYPTION]: 'Use hardware acceleration or optimize algorithms'
        };
        return suggestions[category] || 'Analyze and optimize this performance category';
    }
    detectAnomalies() {
        // Simplified anomaly detection
        const anomalies = [];
        if (this.metricsHistory.length < 10)
            return anomalies;
        const recent = this.metricsHistory.slice(-10);
        const baseline = this.metricsHistory.slice(-30, -10);
        if (baseline.length === 0)
            return anomalies;
        const baselineAvgTime = baseline.reduce((sum, m) => sum + m.totalTime, 0) / baseline.length;
        const recentAvgTime = recent.reduce((sum, m) => sum + m.totalTime, 0) / recent.length;
        const timeDeviation = Math.abs(recentAvgTime - baselineAvgTime) / baselineAvgTime;
        if (timeDeviation > 0.5) { // 50% deviation
            anomalies.push({
                timestamp: recent[recent.length - 1].timestamp,
                metric: 'totalTime',
                deviation: timeDeviation
            });
        }
        return anomalies;
    }
    calculateHealthScore() {
        if (this.metricsHistory.length === 0)
            return 100;
        const latestMetrics = this.metricsHistory[this.metricsHistory.length - 1];
        let score = 100;
        // Deduct points for high resource usage
        if (latestMetrics.memory?.percentage) {
            score -= Math.max(0, latestMetrics.memory.percentage - 70);
        }
        if (latestMetrics.cpu?.average) {
            score -= Math.max(0, latestMetrics.cpu.average - 60);
        }
        // Deduct points for slow response times
        if (latestMetrics.totalTime > 1000) {
            score -= Math.min(30, (latestMetrics.totalTime - 1000) / 100);
        }
        // Deduct points for recent alerts
        const recentCriticalAlerts = this.alertHistory.filter(a => a.severity === 'critical' &&
            Date.now() - a.timestamp.getTime() < 300000).length;
        score -= recentCriticalAlerts * 10;
        return Math.max(0, Math.min(100, score));
    }
    findMetricsByDate(date) {
        return this.metricsHistory.find(m => Math.abs(m.timestamp.getTime() - date.getTime()) < 60000 // Within 1 minute
        ) || null;
    }
    createEmptyMetrics() {
        return performance_metrics_1.PerformanceMetricsFactory.create({
            category: performance_metrics_1.PerformanceCategory.OVERALL,
            environment: {
                platform: process.platform,
                architecture: process.arch,
                nodeVersion: process.version,
                memoryLimit: this.getAvailableMemory(),
                cpuCores: this.getCpuCores(),
                diskSpace: 0
            },
            thresholds: []
        });
    }
    convertToCSV(data) {
        // Simplified CSV conversion
        const headers = ['timestamp', 'totalTime', 'memoryUsage', 'cpuUsage'];
        const rows = data.metrics.map((m) => [
            m.timestamp.toISOString(),
            m.totalTime,
            m.memory?.percentage || 0,
            m.cpu?.average || 0
        ]);
        return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    }
    convertToHTML(data) {
        return `
      <html>
        <head><title>Performance Report</title></head>
        <body>
          <h1>Performance Monitoring Report</h1>
          <h2>Summary</h2>
          <p>Total Metrics: ${data.summary.totalMetrics}</p>
          <p>Average Response Time: ${data.summary.averageResponseTime.toFixed(2)}ms</p>
          <p>Health Score: ${data.summary.healthScore.toFixed(1)}%</p>
          <h2>Dashboard</h2>
          <pre>${JSON.stringify(data.dashboard, null, 2)}</pre>
        </body>
      </html>
    `;
    }
}
exports.PerformanceMonitor = PerformanceMonitor;
//# sourceMappingURL=performance-monitor.js.map