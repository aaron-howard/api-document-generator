/**
 * PerformanceMetrics Model
 *
 * Comprehensive performance measurement system with timing measurements,
 * resource usage tracking, optimization insights, and reporting capabilities.
 *
 * @packageDocumentation
 */
/**
 * Performance measurement categories
 */
export declare enum PerformanceCategory {
    PARSING = "parsing",
    ANALYSIS = "analysis",
    GENERATION = "generation",
    VALIDATION = "validation",
    RENDERING = "rendering",
    TEMPLATE_PROCESSING = "template-processing",
    AI_PROCESSING = "ai-processing",
    CACHE_OPERATIONS = "cache-operations",
    FILE_IO = "file-io",
    NETWORK_IO = "network-io",
    DATABASE_IO = "database-io",
    SERIALIZATION = "serialization",
    COMPRESSION = "compression",
    ENCRYPTION = "encryption",
    OVERALL = "overall"
}
/**
 * Resource types for monitoring
 */
export declare enum ResourceType {
    CPU = "cpu",
    MEMORY = "memory",
    DISK = "disk",
    NETWORK = "network",
    GPU = "gpu",
    THREADS = "threads",
    FILE_HANDLES = "file-handles",
    CACHE = "cache",
    DATABASE_CONNECTIONS = "database-connections"
}
/**
 * Performance measurement precision levels
 */
export declare enum MeasurementPrecision {
    MILLISECONDS = "milliseconds",
    MICROSECONDS = "microseconds",
    NANOSECONDS = "nanoseconds"
}
/**
 * Optimization recommendation types
 */
export declare enum OptimizationType {
    CACHE_OPTIMIZATION = "cache-optimization",
    MEMORY_OPTIMIZATION = "memory-optimization",
    CPU_OPTIMIZATION = "cpu-optimization",
    IO_OPTIMIZATION = "io-optimization",
    ALGORITHM_OPTIMIZATION = "algorithm-optimization",
    PARALLELIZATION = "parallelization",
    BATCHING = "batching",
    LAZY_LOADING = "lazy-loading",
    COMPRESSION = "compression",
    INDEXING = "indexing"
}
/**
 * Performance trend direction
 */
export declare enum TrendDirection {
    IMPROVING = "improving",
    DEGRADING = "degrading",
    STABLE = "stable",
    VOLATILE = "volatile"
}
/**
 * Alert severity levels for performance issues
 */
export declare enum AlertSeverity {
    CRITICAL = "critical",
    WARNING = "warning",
    INFO = "info"
}
/**
 * Represents a single timing measurement
 */
export interface TimingMeasurement {
    readonly name: string;
    readonly category: PerformanceCategory;
    readonly startTime: number;
    readonly endTime?: number;
    readonly duration?: number;
    readonly precision: MeasurementPrecision;
    readonly metadata: Record<string, any>;
}
/**
 * Resource usage measurement at a point in time
 */
export interface ResourceMeasurement {
    readonly timestamp: number;
    readonly type: ResourceType;
    readonly value: number;
    readonly unit: string;
    readonly limit?: number;
    readonly percentage?: number;
    readonly details: Record<string, any>;
}
/**
 * CPU usage metrics
 */
export interface CPUMetrics {
    readonly usage: number;
    readonly peak: number;
    readonly average: number;
    readonly cores: number;
    readonly loadAverage: readonly number[];
    readonly processes: number;
    readonly threads: number;
    readonly contextSwitches: number;
    readonly systemTime: number;
    readonly userTime: number;
}
/**
 * Memory usage metrics
 */
export interface MemoryMetrics {
    readonly used: number;
    readonly available: number;
    readonly total: number;
    readonly peak: number;
    readonly average: number;
    readonly percentage: number;
    readonly heapUsed?: number;
    readonly heapTotal?: number;
    readonly external?: number;
    readonly buffers?: number;
    readonly cached?: number;
    readonly swapUsed?: number;
    readonly swapTotal?: number;
    readonly gcCount?: number;
    readonly gcDuration?: number;
}
/**
 * Disk I/O metrics
 */
export interface DiskIOMetrics {
    readonly bytesRead: number;
    readonly bytesWritten: number;
    readonly operations: number;
    readonly readOperations: number;
    readonly writeOperations: number;
    readonly averageLatency: number;
    readonly throughput: number;
    readonly queueDepth: number;
    readonly utilization: number;
    readonly fileHandles: number;
    readonly directories: readonly string[];
}
/**
 * Network I/O metrics
 */
export interface NetworkIOMetrics {
    readonly bytesReceived: number;
    readonly bytesSent: number;
    readonly requests: number;
    readonly responses: number;
    readonly errors: number;
    readonly timeouts: number;
    readonly averageLatency: number;
    readonly throughput: number;
    readonly connectionsActive: number;
    readonly connectionsTotal: number;
    readonly retries: number;
    readonly protocols: Record<string, number>;
}
/**
 * Cache performance metrics
 */
export interface CachePerformanceMetrics {
    readonly hits: number;
    readonly misses: number;
    readonly hitRate: number;
    readonly evictions: number;
    readonly size: number;
    readonly entries: number;
    readonly averageAccessTime: number;
    readonly hotKeys: readonly string[];
    readonly coldKeys: readonly string[];
    readonly distribution: Record<string, number>;
}
/**
 * Thread and concurrency metrics
 */
export interface ConcurrencyMetrics {
    readonly activeThreads: number;
    readonly maxThreads: number;
    readonly blockedThreads: number;
    readonly waitingThreads: number;
    readonly completedTasks: number;
    readonly queuedTasks: number;
    readonly parallelism: number;
    readonly contention: number;
    readonly deadlocks: number;
    readonly poolUtilization: number;
}
/**
 * Performance benchmark result
 */
export interface BenchmarkResult {
    readonly name: string;
    readonly category: PerformanceCategory;
    readonly iterations: number;
    readonly duration: number;
    readonly averageTime: number;
    readonly minTime: number;
    readonly maxTime: number;
    readonly standardDeviation: number;
    readonly percentiles: Record<string, number>;
    readonly throughput: number;
    readonly memoryAllocated: number;
    readonly environment: Record<string, any>;
}
/**
 * Performance threshold configuration
 */
export interface PerformanceThreshold {
    readonly name: string;
    readonly category: PerformanceCategory;
    readonly metric: string;
    readonly warningThreshold: number;
    readonly criticalThreshold: number;
    readonly unit: string;
    readonly enabled: boolean;
    readonly description: string;
}
/**
 * Performance alert
 */
export interface PerformanceAlert {
    readonly id: string;
    readonly timestamp: Date;
    readonly severity: AlertSeverity;
    readonly category: PerformanceCategory;
    readonly metric: string;
    readonly threshold: PerformanceThreshold;
    readonly actualValue: number;
    readonly expectedValue: number;
    readonly message: string;
    readonly suggestion?: string;
    readonly resolved: boolean;
    readonly resolvedAt?: Date;
}
/**
 * Optimization recommendation
 */
export interface OptimizationRecommendation {
    readonly id: string;
    readonly type: OptimizationType;
    readonly category: PerformanceCategory;
    readonly title: string;
    readonly description: string;
    readonly impact: 'low' | 'medium' | 'high';
    readonly effort: 'low' | 'medium' | 'high';
    readonly priority: number;
    readonly confidence: number;
    readonly estimatedImprovement: {
        readonly performance: number;
        readonly memory: number;
        readonly cpu: number;
    };
    readonly implementation: {
        readonly steps: readonly string[];
        readonly codeChanges: readonly string[];
        readonly configChanges: readonly string[];
        readonly risks: readonly string[];
    };
    readonly metrics: Record<string, number>;
    readonly applicable: boolean;
}
/**
 * Performance trend analysis
 */
export interface PerformanceTrend {
    readonly metric: string;
    readonly category: PerformanceCategory;
    readonly timeframe: string;
    readonly direction: TrendDirection;
    readonly changePercentage: number;
    readonly dataPoints: readonly {
        readonly timestamp: Date;
        readonly value: number;
    }[];
    readonly statistics: {
        readonly mean: number;
        readonly median: number;
        readonly standardDeviation: number;
        readonly variance: number;
        readonly slope: number;
    };
    readonly forecast: {
        readonly nextValue: number;
        readonly confidence: number;
        readonly timeToThreshold?: number;
    };
}
/**
 * Performance report configuration
 */
export interface PerformanceReportConfig {
    readonly includeTimings: boolean;
    readonly includeResources: boolean;
    readonly includeBenchmarks: boolean;
    readonly includeOptimizations: boolean;
    readonly includeTrends: boolean;
    readonly includeAlerts: boolean;
    readonly timeframe: string;
    readonly categories: readonly PerformanceCategory[];
    readonly format: 'json' | 'html' | 'pdf' | 'csv';
    readonly aggregation: 'none' | 'hourly' | 'daily' | 'weekly';
    readonly comparison?: {
        readonly baseline: Date;
        readonly current: Date;
    };
}
/**
 * Main performance metrics interface
 */
export interface PerformanceMetrics {
    readonly id: string;
    readonly sessionId?: string;
    readonly timestamp: Date;
    readonly duration: number;
    readonly category: PerformanceCategory;
    readonly timings: Record<string, TimingMeasurement>;
    readonly totalTime: number;
    readonly breakdown: Record<PerformanceCategory, number>;
    readonly cpu?: CPUMetrics;
    readonly memory?: MemoryMetrics;
    readonly diskIO?: DiskIOMetrics;
    readonly networkIO?: NetworkIOMetrics;
    readonly cache?: CachePerformanceMetrics;
    readonly concurrency?: ConcurrencyMetrics;
    readonly benchmarks: readonly BenchmarkResult[];
    readonly recommendations: readonly OptimizationRecommendation[];
    readonly alerts: readonly PerformanceAlert[];
    readonly trends: readonly PerformanceTrend[];
    readonly thresholds: readonly PerformanceThreshold[];
    readonly environment: {
        readonly platform: string;
        readonly architecture: string;
        readonly nodeVersion?: string;
        readonly memoryLimit: number;
        readonly cpuCores: number;
        readonly diskSpace: number;
    };
    readonly tags: readonly string[];
    readonly metadata: Record<string, any>;
}
/**
 * Performance metrics creation parameters
 */
export interface CreatePerformanceMetricsParams {
    readonly sessionId?: string;
    readonly category?: PerformanceCategory;
    readonly thresholds?: readonly PerformanceThreshold[];
    readonly environment?: Partial<PerformanceMetrics['environment']>;
    readonly tags?: readonly string[];
    readonly metadata?: Record<string, any>;
}
/**
 * Performance metrics update parameters
 */
export interface UpdatePerformanceMetricsParams {
    readonly timings?: Record<string, TimingMeasurement>;
    readonly cpu?: Partial<CPUMetrics>;
    readonly memory?: Partial<MemoryMetrics>;
    readonly diskIO?: Partial<DiskIOMetrics>;
    readonly networkIO?: Partial<NetworkIOMetrics>;
    readonly cache?: Partial<CachePerformanceMetrics>;
    readonly concurrency?: Partial<ConcurrencyMetrics>;
    readonly benchmarks?: readonly BenchmarkResult[];
    readonly recommendations?: readonly OptimizationRecommendation[];
    readonly alerts?: readonly PerformanceAlert[];
    readonly trends?: readonly PerformanceTrend[];
    readonly tags?: readonly string[];
    readonly metadata?: Record<string, any>;
}
/**
 * Performance comparison result
 */
export interface PerformanceComparison {
    readonly baseline: PerformanceMetrics;
    readonly current: PerformanceMetrics;
    readonly changes: {
        readonly category: PerformanceCategory;
        readonly metric: string;
        readonly baselineValue: number;
        readonly currentValue: number;
        readonly change: number;
        readonly changePercentage: number;
        readonly improvement: boolean;
    }[];
    readonly summary: {
        readonly improvementCount: number;
        readonly regressionCount: number;
        readonly overallScore: number;
        readonly significantChanges: number;
    };
}
/**
 * Factory for creating PerformanceMetrics instances
 */
export declare class PerformanceMetricsFactory {
    /**
     * Creates a new performance metrics instance
     */
    static create(params?: CreatePerformanceMetricsParams): PerformanceMetrics;
    /**
     * Creates performance metrics from existing data
     */
    static fromData(data: Partial<PerformanceMetrics> & {
        id: string;
        timestamp: Date;
    }): PerformanceMetrics;
    /**
     * Updates existing performance metrics
     */
    static update(metrics: PerformanceMetrics, updates: UpdatePerformanceMetricsParams): PerformanceMetrics;
    /**
     * Starts a timing measurement
     */
    static startTiming(metrics: PerformanceMetrics, name: string, category?: PerformanceCategory): PerformanceMetrics;
    /**
     * Ends a timing measurement
     */
    static endTiming(metrics: PerformanceMetrics, name: string): PerformanceMetrics;
    /**
     * Adds a benchmark result
     */
    static addBenchmark(metrics: PerformanceMetrics, benchmark: BenchmarkResult): PerformanceMetrics;
    /**
     * Adds an optimization recommendation
     */
    static addRecommendation(metrics: PerformanceMetrics, recommendation: OptimizationRecommendation): PerformanceMetrics;
    /**
     * Adds a performance alert
     */
    static addAlert(metrics: PerformanceMetrics, alert: PerformanceAlert): PerformanceMetrics;
    /**
     * Completes the performance measurement
     */
    static complete(metrics: PerformanceMetrics, finalMeasurements?: Partial<UpdatePerformanceMetricsParams>): PerformanceMetrics;
    private static generateMetricsId;
    private static createEmptyBreakdown;
    private static createInitialCPUMetrics;
    private static createInitialMemoryMetrics;
    private static createInitialDiskIOMetrics;
    private static createDefaultThresholds;
    private static calculateTotalTime;
    private static calculateBreakdown;
    private static getHighResolutionTime;
}
/**
 * Utility functions for working with performance metrics
 */
export declare class PerformanceMetricsUtils {
    /**
     * Compares two performance metrics
     */
    static compare(baseline: PerformanceMetrics, current: PerformanceMetrics): PerformanceComparison;
    /**
     * Generates optimization recommendations based on metrics
     */
    static generateRecommendations(metrics: PerformanceMetrics): OptimizationRecommendation[];
    /**
     * Analyzes performance trends
     */
    static analyzeTrends(historicalMetrics: readonly PerformanceMetrics[], metric: string, category: PerformanceCategory): PerformanceTrend;
    /**
     * Checks performance alerts
     */
    static checkAlerts(metrics: PerformanceMetrics): PerformanceAlert[];
    /**
     * Generates a performance report
     */
    static generateReport(metrics: PerformanceMetrics | readonly PerformanceMetrics[], config: PerformanceReportConfig): {
        summary: string;
        details: Record<string, any>;
        recommendations: OptimizationRecommendation[];
    };
    private static createChange;
    private static calculateOverallScore;
    private static getMetricWeight;
    private static generateRecommendationId;
    private static generateAlertId;
    private static extractMetricValue;
    private static createEmptyTrend;
    private static determineTrendDirection;
    private static generateAlertSuggestion;
    private static generateSummaryText;
    private static generateDetailedReport;
}
//# sourceMappingURL=performance-metrics.d.ts.map