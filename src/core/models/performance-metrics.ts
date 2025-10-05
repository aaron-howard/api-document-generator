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
export enum PerformanceCategory {
  PARSING = 'parsing',
  ANALYSIS = 'analysis',
  GENERATION = 'generation',
  VALIDATION = 'validation',
  RENDERING = 'rendering',
  TEMPLATE_PROCESSING = 'template-processing',
  AI_PROCESSING = 'ai-processing',
  CACHE_OPERATIONS = 'cache-operations',
  FILE_IO = 'file-io',
  NETWORK_IO = 'network-io',
  DATABASE_IO = 'database-io',
  SERIALIZATION = 'serialization',
  COMPRESSION = 'compression',
  ENCRYPTION = 'encryption',
  OVERALL = 'overall'
}

/**
 * Resource types for monitoring
 */
export enum ResourceType {
  CPU = 'cpu',
  MEMORY = 'memory',
  DISK = 'disk',
  NETWORK = 'network',
  GPU = 'gpu',
  THREADS = 'threads',
  FILE_HANDLES = 'file-handles',
  CACHE = 'cache',
  DATABASE_CONNECTIONS = 'database-connections'
}

/**
 * Performance measurement precision levels
 */
export enum MeasurementPrecision {
  MILLISECONDS = 'milliseconds',
  MICROSECONDS = 'microseconds',
  NANOSECONDS = 'nanoseconds'
}

/**
 * Optimization recommendation types
 */
export enum OptimizationType {
  CACHE_OPTIMIZATION = 'cache-optimization',
  MEMORY_OPTIMIZATION = 'memory-optimization',
  CPU_OPTIMIZATION = 'cpu-optimization',
  IO_OPTIMIZATION = 'io-optimization',
  ALGORITHM_OPTIMIZATION = 'algorithm-optimization',
  PARALLELIZATION = 'parallelization',
  BATCHING = 'batching',
  LAZY_LOADING = 'lazy-loading',
  COMPRESSION = 'compression',
  INDEXING = 'indexing'
}

/**
 * Performance trend direction
 */
export enum TrendDirection {
  IMPROVING = 'improving',
  DEGRADING = 'degrading',
  STABLE = 'stable',
  VOLATILE = 'volatile'
}

/**
 * Alert severity levels for performance issues
 */
export enum AlertSeverity {
  CRITICAL = 'critical',
  WARNING = 'warning',
  INFO = 'info'
}

/**
 * Represents a single timing measurement
 */
export interface TimingMeasurement {
  readonly name: string;
  readonly category: PerformanceCategory;
  readonly startTime: number; // high-resolution timestamp
  readonly endTime?: number;
  readonly duration?: number; // milliseconds
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
  readonly usage: number; // percentage (0-100)
  readonly peak: number;
  readonly average: number;
  readonly cores: number;
  readonly loadAverage: readonly number[]; // 1m, 5m, 15m
  readonly processes: number;
  readonly threads: number;
  readonly contextSwitches: number;
  readonly systemTime: number; // milliseconds
  readonly userTime: number; // milliseconds
}

/**
 * Memory usage metrics
 */
export interface MemoryMetrics {
  readonly used: number; // bytes
  readonly available: number;
  readonly total: number;
  readonly peak: number;
  readonly average: number;
  readonly percentage: number; // 0-100
  readonly heapUsed?: number;
  readonly heapTotal?: number;
  readonly external?: number;
  readonly buffers?: number;
  readonly cached?: number;
  readonly swapUsed?: number;
  readonly swapTotal?: number;
  readonly gcCount?: number;
  readonly gcDuration?: number; // milliseconds
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
  readonly averageLatency: number; // milliseconds
  readonly throughput: number; // bytes per second
  readonly queueDepth: number;
  readonly utilization: number; // percentage
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
  readonly averageLatency: number; // milliseconds
  readonly throughput: number; // bytes per second
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
  readonly hitRate: number; // percentage
  readonly evictions: number;
  readonly size: number; // bytes
  readonly entries: number;
  readonly averageAccessTime: number; // milliseconds
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
  readonly contention: number; // lock contention events
  readonly deadlocks: number;
  readonly poolUtilization: number; // percentage
}

/**
 * Performance benchmark result
 */
export interface BenchmarkResult {
  readonly name: string;
  readonly category: PerformanceCategory;
  readonly iterations: number;
  readonly duration: number; // total duration in milliseconds
  readonly averageTime: number; // per iteration
  readonly minTime: number;
  readonly maxTime: number;
  readonly standardDeviation: number;
  readonly percentiles: Record<string, number>; // 50th, 90th, 95th, 99th
  readonly throughput: number; // operations per second
  readonly memoryAllocated: number; // bytes
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
  readonly priority: number; // 1-10
  readonly confidence: number; // 0-1
  readonly estimatedImprovement: {
    readonly performance: number; // percentage improvement
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
  readonly timeframe: string; // e.g., '7d', '30d', '1y'
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
    readonly slope: number; // trend line slope
  };
  readonly forecast: {
    readonly nextValue: number;
    readonly confidence: number;
    readonly timeToThreshold?: number; // days until threshold breach
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
  readonly duration: number; // total measurement duration in milliseconds
  readonly category: PerformanceCategory;
  
  // Timing measurements
  readonly timings: Record<string, TimingMeasurement>;
  readonly totalTime: number;
  readonly breakdown: Record<PerformanceCategory, number>;
  
  // Resource usage
  readonly cpu?: CPUMetrics;
  readonly memory?: MemoryMetrics;
  readonly diskIO?: DiskIOMetrics;
  readonly networkIO?: NetworkIOMetrics;
  readonly cache?: CachePerformanceMetrics;
  readonly concurrency?: ConcurrencyMetrics;
  
  // Performance analysis
  readonly benchmarks: readonly BenchmarkResult[];
  readonly recommendations: readonly OptimizationRecommendation[];
  readonly alerts: readonly PerformanceAlert[];
  readonly trends: readonly PerformanceTrend[];
  
  // Configuration and environment
  readonly thresholds: readonly PerformanceThreshold[];
  readonly environment: {
    readonly platform: string;
    readonly architecture: string;
    readonly nodeVersion?: string;
    readonly memoryLimit: number;
    readonly cpuCores: number;
    readonly diskSpace: number;
  };
  
  // Metadata
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
    readonly change: number; // absolute change
    readonly changePercentage: number;
    readonly improvement: boolean;
  }[];
  readonly summary: {
    readonly improvementCount: number;
    readonly regressionCount: number;
    readonly overallScore: number; // -100 to 100
    readonly significantChanges: number;
  };
}

/**
 * Factory for creating PerformanceMetrics instances
 */
export class PerformanceMetricsFactory {
  /**
   * Creates a new performance metrics instance
   */
  static create(params: CreatePerformanceMetricsParams = {}): PerformanceMetrics {
    const sessionId = params.sessionId;
    
    return {
      id: this.generateMetricsId(),
      ...(sessionId && { sessionId }),
      timestamp: new Date(),
      duration: 0,
      category: params.category ?? PerformanceCategory.OVERALL,
      
      timings: {},
      totalTime: 0,
      breakdown: this.createEmptyBreakdown(),
      
      benchmarks: [],
      recommendations: [],
      alerts: [],
      trends: [],
      
      thresholds: params.thresholds ?? this.createDefaultThresholds(),
      environment: {
        platform: 'unknown',
        architecture: 'unknown',
        memoryLimit: 0,
        cpuCores: 0,
        diskSpace: 0,
        ...params.environment
      },
      
      tags: params.tags ?? [],
      metadata: params.metadata ?? {}
    } as PerformanceMetrics;
  }

  /**
   * Creates performance metrics from existing data
   */
  static fromData(data: Partial<PerformanceMetrics> & {
    id: string;
    timestamp: Date;
  }): PerformanceMetrics {
    return {
      duration: 0,
      category: PerformanceCategory.OVERALL,
      timings: {},
      totalTime: 0,
      breakdown: this.createEmptyBreakdown(),
      cpu: this.createInitialCPUMetrics(),
      memory: this.createInitialMemoryMetrics(),
      diskIO: this.createInitialDiskIOMetrics(),
      benchmarks: [],
      recommendations: [],
      alerts: [],
      trends: [],
      thresholds: this.createDefaultThresholds(),
      environment: {
        platform: 'unknown',
        architecture: 'unknown',
        memoryLimit: 0,
        cpuCores: 0,
        diskSpace: 0
      },
      tags: [],
      metadata: {},
      ...data
    };
  }

  /**
   * Updates existing performance metrics
   */
  static update(metrics: PerformanceMetrics, updates: UpdatePerformanceMetricsParams): PerformanceMetrics {
    const updatedTimings = updates.timings ? { ...metrics.timings, ...updates.timings } : metrics.timings;
    const totalTime = this.calculateTotalTime(updatedTimings);
    const breakdown = this.calculateBreakdown(updatedTimings);
    
    return {
      ...metrics,
      timings: updatedTimings,
      totalTime,
      breakdown,
      ...(updates.cpu ? { cpu: metrics.cpu ? { ...metrics.cpu, ...updates.cpu } : updates.cpu } : {}),
      ...(updates.memory ? { memory: metrics.memory ? { ...metrics.memory, ...updates.memory } : updates.memory } : {}),
      ...(updates.diskIO ? { diskIO: metrics.diskIO ? { ...metrics.diskIO, ...updates.diskIO } : updates.diskIO } : {}),
      ...(updates.networkIO ? { networkIO: metrics.networkIO ? { ...metrics.networkIO, ...updates.networkIO } : updates.networkIO } : {}),
      ...(updates.cache ? { cache: metrics.cache ? { ...metrics.cache, ...updates.cache } : updates.cache } : {}),
      ...(updates.concurrency ? { concurrency: metrics.concurrency ? { ...metrics.concurrency, ...updates.concurrency } : updates.concurrency } : {}),
      benchmarks: updates.benchmarks ?? metrics.benchmarks,
      recommendations: updates.recommendations ?? metrics.recommendations,
      alerts: updates.alerts ?? metrics.alerts,
      trends: updates.trends ?? metrics.trends,
      tags: updates.tags ?? metrics.tags,
      metadata: updates.metadata ? { ...metrics.metadata, ...updates.metadata } : metrics.metadata
    } as PerformanceMetrics;
  }

  /**
   * Starts a timing measurement
   */
  static startTiming(
    metrics: PerformanceMetrics, 
    name: string, 
    category: PerformanceCategory = PerformanceCategory.OVERALL
  ): PerformanceMetrics {
    const timing: TimingMeasurement = {
      name,
      category,
      startTime: this.getHighResolutionTime(),
      precision: MeasurementPrecision.MILLISECONDS,
      metadata: {}
    };

    return this.update(metrics, {
      timings: { [name]: timing }
    });
  }

  /**
   * Ends a timing measurement
   */
  static endTiming(metrics: PerformanceMetrics, name: string): PerformanceMetrics {
    const timing = metrics.timings[name];
    if (!timing || timing.endTime) {
      return metrics; // Timing not found or already ended
    }

    const endTime = this.getHighResolutionTime();
    const duration = endTime - timing.startTime;

    const updatedTiming: TimingMeasurement = {
      ...timing,
      endTime,
      duration
    };

    return this.update(metrics, {
      timings: { [name]: updatedTiming }
    });
  }

  /**
   * Adds a benchmark result
   */
  static addBenchmark(metrics: PerformanceMetrics, benchmark: BenchmarkResult): PerformanceMetrics {
    return this.update(metrics, {
      benchmarks: [...metrics.benchmarks, benchmark]
    });
  }

  /**
   * Adds an optimization recommendation
   */
  static addRecommendation(metrics: PerformanceMetrics, recommendation: OptimizationRecommendation): PerformanceMetrics {
    return this.update(metrics, {
      recommendations: [...metrics.recommendations, recommendation]
    });
  }

  /**
   * Adds a performance alert
   */
  static addAlert(metrics: PerformanceMetrics, alert: PerformanceAlert): PerformanceMetrics {
    return this.update(metrics, {
      alerts: [...metrics.alerts, alert]
    });
  }

  /**
   * Completes the performance measurement
   */
  static complete(metrics: PerformanceMetrics, finalMeasurements?: Partial<UpdatePerformanceMetricsParams>): PerformanceMetrics {
    const completedMetrics = finalMeasurements 
      ? this.update(metrics, finalMeasurements)
      : metrics;

    return {
      ...completedMetrics,
      duration: Date.now() - completedMetrics.timestamp.getTime()
    };
  }

  private static generateMetricsId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `perf_${timestamp}_${random}`;
  }

  private static createEmptyBreakdown(): Record<PerformanceCategory, number> {
    const breakdown: Record<PerformanceCategory, number> = {} as any;
    Object.values(PerformanceCategory).forEach(category => {
      breakdown[category] = 0;
    });
    return breakdown;
  }

  private static createInitialCPUMetrics(): CPUMetrics {
    return {
      usage: 0,
      peak: 0,
      average: 0,
      cores: 1,
      loadAverage: [0, 0, 0],
      processes: 0,
      threads: 0,
      contextSwitches: 0,
      systemTime: 0,
      userTime: 0
    };
  }

  private static createInitialMemoryMetrics(): MemoryMetrics {
    return {
      used: 0,
      available: 0,
      total: 0,
      peak: 0,
      average: 0,
      percentage: 0
    };
  }

  private static createInitialDiskIOMetrics(): DiskIOMetrics {
    return {
      bytesRead: 0,
      bytesWritten: 0,
      operations: 0,
      readOperations: 0,
      writeOperations: 0,
      averageLatency: 0,
      throughput: 0,
      queueDepth: 0,
      utilization: 0,
      fileHandles: 0,
      directories: []
    };
  }

  private static createDefaultThresholds(): PerformanceThreshold[] {
    return [
      {
        name: 'Memory Usage',
        category: PerformanceCategory.OVERALL,
        metric: 'memory.percentage',
        warningThreshold: 80,
        criticalThreshold: 95,
        unit: 'percentage',
        enabled: true,
        description: 'Monitor memory usage percentage'
      },
      {
        name: 'CPU Usage',
        category: PerformanceCategory.OVERALL,
        metric: 'cpu.usage',
        warningThreshold: 70,
        criticalThreshold: 90,
        unit: 'percentage',
        enabled: true,
        description: 'Monitor CPU usage percentage'
      },
      {
        name: 'Response Time',
        category: PerformanceCategory.OVERALL,
        metric: 'totalTime',
        warningThreshold: 5000,
        criticalThreshold: 10000,
        unit: 'milliseconds',
        enabled: true,
        description: 'Monitor total response time'
      }
    ];
  }

  private static calculateTotalTime(timings: Record<string, TimingMeasurement>): number {
    return Object.values(timings)
      .filter(timing => timing.duration !== undefined)
      .reduce((total, timing) => total + (timing.duration || 0), 0);
  }

  private static calculateBreakdown(timings: Record<string, TimingMeasurement>): Record<PerformanceCategory, number> {
    const breakdown = this.createEmptyBreakdown();
    
    Object.values(timings).forEach(timing => {
      if (timing.duration !== undefined) {
        breakdown[timing.category] += timing.duration;
      }
    });
    
    return breakdown;
  }

  private static getHighResolutionTime(): number {
    // In a real implementation, use performance.now() or process.hrtime()
    return Date.now();
  }
}

/**
 * Utility functions for working with performance metrics
 */
export class PerformanceMetricsUtils {
  /**
   * Compares two performance metrics
   */
  static compare(baseline: PerformanceMetrics, current: PerformanceMetrics): PerformanceComparison {
    const changes: PerformanceComparison['changes'] = [];
    
    // Compare total time
    changes.push(this.createChange(
      PerformanceCategory.OVERALL,
      'totalTime',
      baseline.totalTime,
      current.totalTime
    ));
    
    // Compare memory usage
    changes.push(this.createChange(
      PerformanceCategory.OVERALL,
      'memory.used',
      baseline.memory?.used ?? 0,
      current.memory?.used ?? 0
    ));
    
    // Compare CPU usage
    changes.push(this.createChange(
      PerformanceCategory.OVERALL,
      'cpu.average',
      baseline.cpu?.average ?? 0,
      current.cpu?.average ?? 0
    ));
    
    // Compare breakdown by category
    Object.entries(current.breakdown).forEach(([category, value]) => {
      const baselineValue = baseline.breakdown[category as PerformanceCategory] || 0;
      changes.push(this.createChange(
        category as PerformanceCategory,
        'duration',
        baselineValue,
        value
      ));
    });
    
    const improvements = changes.filter(change => change.improvement);
    const regressions = changes.filter(change => !change.improvement && change.change !== 0);
    const significantChanges = changes.filter(change => Math.abs(change.changePercentage) > 10);
    
    const overallScore = this.calculateOverallScore(changes);
    
    return {
      baseline,
      current,
      changes,
      summary: {
        improvementCount: improvements.length,
        regressionCount: regressions.length,
        overallScore,
        significantChanges: significantChanges.length
      }
    };
  }

  /**
   * Generates optimization recommendations based on metrics
   */
  static generateRecommendations(metrics: PerformanceMetrics): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    
    // Memory optimization
    if (metrics.memory && metrics.memory.percentage > 80) {
      recommendations.push({
        id: this.generateRecommendationId(),
        type: OptimizationType.MEMORY_OPTIMIZATION,
        category: PerformanceCategory.OVERALL,
        title: 'High Memory Usage Detected',
        description: `Memory usage is at ${metrics.memory?.percentage.toFixed(1) ?? 'unknown'}%, which may impact performance`,
        impact: 'high',
        effort: 'medium',
        priority: 8,
        confidence: 0.9,
        estimatedImprovement: {
          performance: 15,
          memory: 30,
          cpu: 5
        },
        implementation: {
          steps: [
            'Analyze memory allocation patterns',
            'Implement object pooling for frequently created objects',
            'Enable garbage collection monitoring',
            'Consider increasing memory limits if necessary'
          ],
          codeChanges: [
            'Add memory profiling hooks',
            'Implement WeakMap for caching where appropriate'
          ],
          configChanges: [
            'Adjust memory limit settings',
            'Configure garbage collection parameters'
          ],
          risks: [
            'May require application restart',
            'Could affect response times during optimization'
          ]
        },
        metrics: {
          currentUsage: metrics.memory.percentage,
          targetUsage: 70
        },
        applicable: true
      });
    }
    
    // CPU optimization
    if (metrics.cpu && metrics.cpu.average > 70) {
      recommendations.push({
        id: this.generateRecommendationId(),
        type: OptimizationType.CPU_OPTIMIZATION,
        category: PerformanceCategory.OVERALL,
        title: 'High CPU Usage Detected',
        description: `Average CPU usage is ${metrics.cpu?.average.toFixed(1) ?? 'unknown'}%, consider optimization`,
        impact: 'high',
        effort: 'medium',
        priority: 7,
        confidence: 0.8,
        estimatedImprovement: {
          performance: 20,
          memory: 5,
          cpu: 25
        },
        implementation: {
          steps: [
            'Profile CPU-intensive operations',
            'Implement parallel processing where possible',
            'Optimize algorithms and data structures',
            'Consider task queuing for heavy operations'
          ],
          codeChanges: [
            'Add worker threads for CPU-intensive tasks',
            'Implement efficient algorithms'
          ],
          configChanges: [
            'Adjust worker pool sizes',
            'Configure process priority'
          ],
          risks: [
            'Increased complexity',
            'Potential race conditions with parallel processing'
          ]
        },
        metrics: {
          currentUsage: metrics.cpu?.average ?? 0,
          targetUsage: 50
        },
        applicable: true
      });
    }
    
    // Cache optimization
    if (metrics.cache && metrics.cache.hitRate < 70) {
      recommendations.push({
        id: this.generateRecommendationId(),
        type: OptimizationType.CACHE_OPTIMIZATION,
        category: PerformanceCategory.CACHE_OPERATIONS,
        title: 'Low Cache Hit Rate',
        description: `Cache hit rate is ${metrics.cache.hitRate.toFixed(1)}%, optimization needed`,
        impact: 'medium',
        effort: 'low',
        priority: 6,
        confidence: 0.85,
        estimatedImprovement: {
          performance: 25,
          memory: -5,
          cpu: 10
        },
        implementation: {
          steps: [
            'Analyze cache access patterns',
            'Adjust cache size and TTL settings',
            'Implement intelligent cache warming',
            'Consider distributed caching'
          ],
          codeChanges: [
            'Implement cache warming strategies',
            'Add cache analytics'
          ],
          configChanges: [
            'Increase cache size',
            'Adjust TTL values',
            'Configure cache eviction policies'
          ],
          risks: [
            'Increased memory usage',
            'Cold start performance impact'
          ]
        },
        metrics: {
          currentHitRate: metrics.cache.hitRate,
          targetHitRate: 85
        },
        applicable: true
      });
    }
    
    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Analyzes performance trends
   */
  static analyzeTrends(
    historicalMetrics: readonly PerformanceMetrics[],
    metric: string,
    category: PerformanceCategory
  ): PerformanceTrend {
    if (historicalMetrics.length < 2) {
      return this.createEmptyTrend(metric, category);
    }
    
    const dataPoints = historicalMetrics.map(m => ({
      timestamp: m.timestamp,
      value: this.extractMetricValue(m, metric)
    })).filter(p => p.value !== null).map(p => ({
      timestamp: p.timestamp,
      value: p.value!
    }));
    
    if (dataPoints.length < 2) {
      return this.createEmptyTrend(metric, category);
    }
    
    const values = dataPoints.map(p => p.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Simple linear regression for trend
    const n = dataPoints.length;
    const sumX = dataPoints.reduce((sum, _, i) => sum + i, 0);
    const sumY = values.reduce((sum, v) => sum + v, 0);
    const sumXY = dataPoints.reduce((sum, p, i) => sum + i * p.value, 0);
    const sumXX = dataPoints.reduce((sum, _, i) => sum + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const direction = this.determineTrendDirection(slope, standardDeviation);
    
    const changePercentage = dataPoints.length > 1 
      ? ((dataPoints[dataPoints.length - 1]!.value - dataPoints[0]!.value) / dataPoints[0]!.value) * 100
      : 0;
    
    const sortedValues = [...values].sort((a, b) => a - b);
    const median = sortedValues.length % 2 === 0
      ? (sortedValues[sortedValues.length / 2 - 1]! + sortedValues[sortedValues.length / 2]!) / 2
      : sortedValues[Math.floor(sortedValues.length / 2)]!;
    
    return {
      metric,
      category,
      timeframe: `${dataPoints.length} points`,
      direction,
      changePercentage,
      dataPoints,
      statistics: {
        mean,
        median,
        standardDeviation,
        variance,
        slope
      },
      forecast: {
        nextValue: mean + slope,
        confidence: Math.max(0, 1 - (standardDeviation / mean))
      }
    };
  }

  /**
   * Checks performance alerts
   */
  static checkAlerts(metrics: PerformanceMetrics): PerformanceAlert[] {
    const alerts: PerformanceAlert[] = [];
    
    metrics.thresholds.forEach(threshold => {
      if (!threshold.enabled) return;
      
      const actualValue = this.extractMetricValue(metrics, threshold.metric);
      if (actualValue === null) return;
      
      let severity: AlertSeverity | null = null;
      let expectedValue = threshold.warningThreshold;
      
      if (actualValue >= threshold.criticalThreshold) {
        severity = AlertSeverity.CRITICAL;
        expectedValue = threshold.criticalThreshold;
      } else if (actualValue >= threshold.warningThreshold) {
        severity = AlertSeverity.WARNING;
        expectedValue = threshold.warningThreshold;
      }
      
      if (severity) {
        alerts.push({
          id: this.generateAlertId(),
          timestamp: new Date(),
          severity,
          category: threshold.category,
          metric: threshold.metric,
          threshold,
          actualValue,
          expectedValue,
          message: `${threshold.name}: ${actualValue}${threshold.unit} exceeds ${severity} threshold of ${expectedValue}${threshold.unit}`,
          suggestion: this.generateAlertSuggestion(threshold, actualValue),
          resolved: false
        });
      }
    });
    
    return alerts;
  }

  /**
   * Generates a performance report
   */
  static generateReport(
    metrics: PerformanceMetrics | readonly PerformanceMetrics[],
    config: PerformanceReportConfig
  ): {
    summary: string;
    details: Record<string, any>;
    recommendations: OptimizationRecommendation[];
  } {
    const metricsArray = Array.isArray(metrics) ? metrics : [metrics];
    const latestMetrics = metricsArray[metricsArray.length - 1]!;
    
    const summary = this.generateSummaryText(latestMetrics, config);
    const details = this.generateDetailedReport(metricsArray, config);
    const recommendations = config.includeOptimizations 
      ? this.generateRecommendations(latestMetrics)
      : [];
    
    return {
      summary,
      details,
      recommendations
    };
  }

  private static createChange(
    category: PerformanceCategory,
    metric: string,
    baselineValue: number,
    currentValue: number
  ): PerformanceComparison['changes'][0] {
    const change = currentValue - baselineValue;
    const changePercentage = baselineValue !== 0 ? (change / baselineValue) * 100 : 0;
    
    // For time-based metrics, lower is better
    const timeMetrics = ['totalTime', 'duration', 'averageLatency'];
    const isTimeMetric = timeMetrics.some(tm => metric.includes(tm));
    const improvement = isTimeMetric ? change < 0 : change > 0;
    
    return {
      category,
      metric,
      baselineValue,
      currentValue,
      change,
      changePercentage,
      improvement
    };
  }

  private static calculateOverallScore(changes: PerformanceComparison['changes']): number {
    if (changes.length === 0) return 0;
    
    const weightedScores = changes.map(change => {
      const weight = this.getMetricWeight(change.metric);
      const score = change.improvement ? Math.min(change.changePercentage, 50) : Math.max(change.changePercentage, -50);
      return score * weight;
    });
    
    const totalWeight = changes.reduce((sum, change) => sum + this.getMetricWeight(change.metric), 0);
    return totalWeight > 0 ? weightedScores.reduce((sum, score) => sum + score, 0) / totalWeight : 0;
  }

  private static getMetricWeight(metric: string): number {
    // Weight metrics by importance
    if (metric.includes('totalTime') || metric.includes('duration')) return 3;
    if (metric.includes('memory')) return 2;
    if (metric.includes('cpu')) return 2;
    return 1;
  }

  private static generateRecommendationId(): string {
    return `rec_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private static generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private static extractMetricValue(metrics: PerformanceMetrics, metric: string): number | null {
    const parts = metric.split('.');
    let value: any = metrics;
    
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return null;
      }
    }
    
    return typeof value === 'number' ? value : null;
  }

  private static createEmptyTrend(metric: string, category: PerformanceCategory): PerformanceTrend {
    return {
      metric,
      category,
      timeframe: '0 points',
      direction: TrendDirection.STABLE,
      changePercentage: 0,
      dataPoints: [],
      statistics: {
        mean: 0,
        median: 0,
        standardDeviation: 0,
        variance: 0,
        slope: 0
      },
      forecast: {
        nextValue: 0,
        confidence: 0
      }
    };
  }

  private static determineTrendDirection(slope: number, standardDeviation: number): TrendDirection {
    const threshold = standardDeviation * 0.1; // 10% of standard deviation
    
    if (Math.abs(slope) < threshold) return TrendDirection.STABLE;
    if (standardDeviation > Math.abs(slope) * 2) return TrendDirection.VOLATILE;
    return slope > 0 ? TrendDirection.DEGRADING : TrendDirection.IMPROVING;
  }

  private static generateAlertSuggestion(threshold: PerformanceThreshold, _actualValue: number): string {
    const metric = threshold.metric;
    
    if (metric.includes('memory')) {
      return 'Consider optimizing memory usage, enabling garbage collection monitoring, or increasing memory limits';
    }
    if (metric.includes('cpu')) {
      return 'Review CPU-intensive operations, consider parallel processing, or optimize algorithms';
    }
    if (metric.includes('time') || metric.includes('latency')) {
      return 'Analyze performance bottlenecks, optimize queries, or improve caching strategy';
    }
    
    return 'Review system performance and consider optimization strategies';
  }

  private static generateSummaryText(metrics: PerformanceMetrics, config: PerformanceReportConfig): string {
    const lines: string[] = [];
    
    lines.push(`Performance Report - ${metrics.timestamp.toISOString()}`);
    lines.push('='.repeat(50));
    
    if (config.includeTimings) {
      lines.push(`Total Execution Time: ${metrics.totalTime.toFixed(2)}ms`);
      
      const topCategories = Object.entries(metrics.breakdown)
        .filter(([, time]) => time > 0)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);
      
      if (topCategories.length > 0) {
        lines.push('Top Time Categories:');
        topCategories.forEach(([category, time]) => {
          const percentage = metrics.totalTime > 0 ? (time / metrics.totalTime * 100).toFixed(1) : '0';
          lines.push(`  - ${category}: ${time.toFixed(2)}ms (${percentage}%)`);
        });
      }
    }
    
    if (config.includeResources) {
      if (metrics.memory) {
        lines.push(`Memory Usage: ${(metrics.memory.used / 1024 / 1024).toFixed(1)}MB (${metrics.memory.percentage.toFixed(1)}%)`);
      }
      if (metrics.cpu) {
        lines.push(`CPU Usage: ${metrics.cpu.average.toFixed(1)}% (Peak: ${metrics.cpu.peak.toFixed(1)}%)`);
      }
      
      if (metrics.cache) {
        lines.push(`Cache Hit Rate: ${metrics.cache.hitRate.toFixed(1)}%`);
      }
    }
    
    if (config.includeAlerts && metrics.alerts.length > 0) {
      const criticalAlerts = metrics.alerts.filter(a => a.severity === AlertSeverity.CRITICAL).length;
      const warningAlerts = metrics.alerts.filter(a => a.severity === AlertSeverity.WARNING).length;
      
      lines.push(`Alerts: ${criticalAlerts} Critical, ${warningAlerts} Warning`);
    }
    
    return lines.join('\n');
  }

  private static generateDetailedReport(
    metricsArray: readonly PerformanceMetrics[],
    config: PerformanceReportConfig
  ): Record<string, any> {
    const latest = metricsArray[metricsArray.length - 1]!;
    const report: Record<string, any> = {};
    
    if (config.includeTimings) {
      report['timings'] = {
        total: latest.totalTime,
        breakdown: latest.breakdown,
        individual: Object.values(latest.timings)
          .filter(t => t.duration !== undefined)
          .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      };
    }
    
    if (config.includeResources) {
      report['resources'] = {
        cpu: latest.cpu,
        memory: latest.memory,
        diskIO: latest.diskIO,
        networkIO: latest.networkIO,
        cache: latest.cache,
        concurrency: latest.concurrency
      };
    }
    
    if (config.includeBenchmarks) {
      report['benchmarks'] = latest.benchmarks;
    }
    
    if (config.includeTrends && metricsArray.length > 1) {
      report['trends'] = {
        totalTime: this.analyzeTrends(metricsArray, 'totalTime', PerformanceCategory.OVERALL),
        memoryUsage: this.analyzeTrends(metricsArray, 'memory.used', PerformanceCategory.OVERALL),
        cpuUsage: this.analyzeTrends(metricsArray, 'cpu.average', PerformanceCategory.OVERALL)
      };
    }
    
    if (config.includeAlerts) {
      report['alerts'] = latest.alerts;
    }
    
    return report;
  }
}