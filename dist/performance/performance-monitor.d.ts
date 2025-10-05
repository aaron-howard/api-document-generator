/**
 * T029 Performance Monitoring Integration
 *
 * Comprehensive performance monitoring system that integrates with all services (T023-T028)
 * providing real-time metrics collection, analysis, optimization insights, and alerting.
 *
 * @packageDocumentation
 */
import { PerformanceMetrics, PerformanceCategory, PerformanceAlert, OptimizationRecommendation, PerformanceComparison, PerformanceTrend } from '../core/models/performance-metrics';
import { ErrorHandler } from '../error/error-handler';
import { CacheManager } from '../cache/cache-manager';
/**
 * Performance monitoring configuration
 */
export interface PerformanceMonitorConfig {
    enabled: boolean;
    metricsInterval: number;
    historyRetention: number;
    enableRealTimeAlerts: boolean;
    enableOptimizationSuggestions: boolean;
    enableTrendAnalysis: boolean;
    enableResourceMonitoring: boolean;
    alertThresholds: {
        memoryUsage: number;
        cpuUsage: number;
        responseTime: number;
        errorRate: number;
        cacheHitRate: number;
    };
    categories: PerformanceCategory[];
}
/**
 * Service performance context
 */
export interface ServicePerformanceContext {
    serviceName: string;
    operation: string;
    sessionId?: string;
    userId?: string;
    requestId?: string;
    parameters: Record<string, any>;
    metadata: Record<string, any>;
}
/**
 * Real-time performance data
 */
export interface RealTimePerformanceData {
    timestamp: Date;
    metrics: PerformanceMetrics;
    alerts: PerformanceAlert[];
    trends: PerformanceTrend[];
    recommendations: OptimizationRecommendation[];
    serviceBreakdown: Record<string, {
        averageResponseTime: number;
        operationCount: number;
        errorRate: number;
        throughput: number;
    }>;
}
/**
 * Performance dashboard data
 */
export interface PerformanceDashboard {
    overview: {
        totalRequests: number;
        averageResponseTime: number;
        currentThroughput: number;
        systemHealth: 'healthy' | 'degraded' | 'critical';
        uptime: number;
    };
    services: Record<string, {
        status: 'active' | 'degraded' | 'error';
        metrics: PerformanceMetrics;
        recentAlerts: PerformanceAlert[];
        trends: PerformanceTrend[];
    }>;
    resources: {
        cpu: {
            current: number;
            average: number;
            peak: number;
        };
        memory: {
            current: number;
            available: number;
            percentage: number;
        };
        cache: {
            hitRate: number;
            size: number;
            evictions: number;
        };
        network: {
            bytesIn: number;
            bytesOut: number;
            connections: number;
        };
    };
    insights: {
        topBottlenecks: Array<{
            category: string;
            impact: number;
            suggestion: string;
        }>;
        optimizationOpportunities: OptimizationRecommendation[];
        performanceTrends: PerformanceTrend[];
        anomalies: Array<{
            timestamp: Date;
            metric: string;
            deviation: number;
        }>;
    };
}
/**
 * Comprehensive performance monitoring system
 */
export declare class PerformanceMonitor {
    private config;
    private metricsHistory;
    private activeMonitoring;
    private alertHistory;
    private serviceMetrics;
    private monitoringInterval;
    private errorHandler;
    private cacheManager;
    constructor(config?: Partial<PerformanceMonitorConfig>, errorHandler?: ErrorHandler, cacheManager?: CacheManager);
    /**
     * Initialize performance monitoring
     */
    initialize(): Promise<void>;
    /**
     * Start monitoring a service operation
     */
    startMonitoring(operationId: string, context: ServicePerformanceContext): void;
    /**
     * Stop monitoring and record metrics
     */
    stopMonitoring(operationId: string, additionalMetrics?: Partial<PerformanceMetrics>): Promise<PerformanceMetrics | null>;
    /**
     * Get real-time performance data
     */
    getRealTimeData(): RealTimePerformanceData;
    /**
     * Get performance dashboard data
     */
    getDashboard(): PerformanceDashboard;
    /**
     * Compare performance between time periods
     */
    comparePerformance(baselineDate: Date, currentDate: Date): PerformanceComparison | null;
    /**
     * Get performance trends
     */
    getPerformanceTrends(metric: string, category: PerformanceCategory): PerformanceTrend;
    /**
     * Export performance data
     */
    exportPerformanceData(format?: 'json' | 'csv' | 'html'): any;
    /**
     * Shutdown performance monitoring
     */
    shutdown(): Promise<void>;
    private startPeriodicMonitoring;
    private captureBaselineMetrics;
    private captureSystemMetrics;
    private mapServiceToCategory;
    private createDefaultThresholds;
    private getAvailableMemory;
    private getCpuCores;
    private getCpuMetrics;
    private getMemoryMetrics;
    private getDiskIOMetrics;
    private getNetworkIOMetrics;
    private getCacheMetrics;
    private getConcurrencyMetrics;
    private addToHistory;
    private addToServiceMetrics;
    private checkPerformanceAlerts;
    private generateOptimizationRecommendations;
    private calculateErrorRate;
    private calculateThroughput;
    private calculateCurrentThroughput;
    private determineSystemHealth;
    private determineServiceStatus;
    private generateTrends;
    private generateServiceTrends;
    private identifyBottlenecks;
    private getBottleneckSuggestion;
    private detectAnomalies;
    private calculateHealthScore;
    private findMetricsByDate;
    private createEmptyMetrics;
    private convertToCSV;
    private convertToHTML;
}
//# sourceMappingURL=performance-monitor.d.ts.map