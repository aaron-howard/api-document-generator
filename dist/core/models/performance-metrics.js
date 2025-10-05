"use strict";
/**
 * PerformanceMetrics Model
 *
 * Comprehensive performance measurement system with timing measurements,
 * resource usage tracking, optimization insights, and reporting capabilities.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMetricsUtils = exports.PerformanceMetricsFactory = exports.AlertSeverity = exports.TrendDirection = exports.OptimizationType = exports.MeasurementPrecision = exports.ResourceType = exports.PerformanceCategory = void 0;
/**
 * Performance measurement categories
 */
var PerformanceCategory;
(function (PerformanceCategory) {
    PerformanceCategory["PARSING"] = "parsing";
    PerformanceCategory["ANALYSIS"] = "analysis";
    PerformanceCategory["GENERATION"] = "generation";
    PerformanceCategory["VALIDATION"] = "validation";
    PerformanceCategory["RENDERING"] = "rendering";
    PerformanceCategory["TEMPLATE_PROCESSING"] = "template-processing";
    PerformanceCategory["AI_PROCESSING"] = "ai-processing";
    PerformanceCategory["CACHE_OPERATIONS"] = "cache-operations";
    PerformanceCategory["FILE_IO"] = "file-io";
    PerformanceCategory["NETWORK_IO"] = "network-io";
    PerformanceCategory["DATABASE_IO"] = "database-io";
    PerformanceCategory["SERIALIZATION"] = "serialization";
    PerformanceCategory["COMPRESSION"] = "compression";
    PerformanceCategory["ENCRYPTION"] = "encryption";
    PerformanceCategory["OVERALL"] = "overall";
})(PerformanceCategory || (exports.PerformanceCategory = PerformanceCategory = {}));
/**
 * Resource types for monitoring
 */
var ResourceType;
(function (ResourceType) {
    ResourceType["CPU"] = "cpu";
    ResourceType["MEMORY"] = "memory";
    ResourceType["DISK"] = "disk";
    ResourceType["NETWORK"] = "network";
    ResourceType["GPU"] = "gpu";
    ResourceType["THREADS"] = "threads";
    ResourceType["FILE_HANDLES"] = "file-handles";
    ResourceType["CACHE"] = "cache";
    ResourceType["DATABASE_CONNECTIONS"] = "database-connections";
})(ResourceType || (exports.ResourceType = ResourceType = {}));
/**
 * Performance measurement precision levels
 */
var MeasurementPrecision;
(function (MeasurementPrecision) {
    MeasurementPrecision["MILLISECONDS"] = "milliseconds";
    MeasurementPrecision["MICROSECONDS"] = "microseconds";
    MeasurementPrecision["NANOSECONDS"] = "nanoseconds";
})(MeasurementPrecision || (exports.MeasurementPrecision = MeasurementPrecision = {}));
/**
 * Optimization recommendation types
 */
var OptimizationType;
(function (OptimizationType) {
    OptimizationType["CACHE_OPTIMIZATION"] = "cache-optimization";
    OptimizationType["MEMORY_OPTIMIZATION"] = "memory-optimization";
    OptimizationType["CPU_OPTIMIZATION"] = "cpu-optimization";
    OptimizationType["IO_OPTIMIZATION"] = "io-optimization";
    OptimizationType["ALGORITHM_OPTIMIZATION"] = "algorithm-optimization";
    OptimizationType["PARALLELIZATION"] = "parallelization";
    OptimizationType["BATCHING"] = "batching";
    OptimizationType["LAZY_LOADING"] = "lazy-loading";
    OptimizationType["COMPRESSION"] = "compression";
    OptimizationType["INDEXING"] = "indexing";
})(OptimizationType || (exports.OptimizationType = OptimizationType = {}));
/**
 * Performance trend direction
 */
var TrendDirection;
(function (TrendDirection) {
    TrendDirection["IMPROVING"] = "improving";
    TrendDirection["DEGRADING"] = "degrading";
    TrendDirection["STABLE"] = "stable";
    TrendDirection["VOLATILE"] = "volatile";
})(TrendDirection || (exports.TrendDirection = TrendDirection = {}));
/**
 * Alert severity levels for performance issues
 */
var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["CRITICAL"] = "critical";
    AlertSeverity["WARNING"] = "warning";
    AlertSeverity["INFO"] = "info";
})(AlertSeverity || (exports.AlertSeverity = AlertSeverity = {}));
/**
 * Factory for creating PerformanceMetrics instances
 */
class PerformanceMetricsFactory {
    /**
     * Creates a new performance metrics instance
     */
    static create(params = {}) {
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
        };
    }
    /**
     * Creates performance metrics from existing data
     */
    static fromData(data) {
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
    static update(metrics, updates) {
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
        };
    }
    /**
     * Starts a timing measurement
     */
    static startTiming(metrics, name, category = PerformanceCategory.OVERALL) {
        const timing = {
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
    static endTiming(metrics, name) {
        const timing = metrics.timings[name];
        if (!timing || timing.endTime) {
            return metrics; // Timing not found or already ended
        }
        const endTime = this.getHighResolutionTime();
        const duration = endTime - timing.startTime;
        const updatedTiming = {
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
    static addBenchmark(metrics, benchmark) {
        return this.update(metrics, {
            benchmarks: [...metrics.benchmarks, benchmark]
        });
    }
    /**
     * Adds an optimization recommendation
     */
    static addRecommendation(metrics, recommendation) {
        return this.update(metrics, {
            recommendations: [...metrics.recommendations, recommendation]
        });
    }
    /**
     * Adds a performance alert
     */
    static addAlert(metrics, alert) {
        return this.update(metrics, {
            alerts: [...metrics.alerts, alert]
        });
    }
    /**
     * Completes the performance measurement
     */
    static complete(metrics, finalMeasurements) {
        const completedMetrics = finalMeasurements
            ? this.update(metrics, finalMeasurements)
            : metrics;
        return {
            ...completedMetrics,
            duration: Date.now() - completedMetrics.timestamp.getTime()
        };
    }
    static generateMetricsId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `perf_${timestamp}_${random}`;
    }
    static createEmptyBreakdown() {
        const breakdown = {};
        Object.values(PerformanceCategory).forEach(category => {
            breakdown[category] = 0;
        });
        return breakdown;
    }
    static createInitialCPUMetrics() {
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
    static createInitialMemoryMetrics() {
        return {
            used: 0,
            available: 0,
            total: 0,
            peak: 0,
            average: 0,
            percentage: 0
        };
    }
    static createInitialDiskIOMetrics() {
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
    static createDefaultThresholds() {
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
    static calculateTotalTime(timings) {
        return Object.values(timings)
            .filter(timing => timing.duration !== undefined)
            .reduce((total, timing) => total + (timing.duration || 0), 0);
    }
    static calculateBreakdown(timings) {
        const breakdown = this.createEmptyBreakdown();
        Object.values(timings).forEach(timing => {
            if (timing.duration !== undefined) {
                breakdown[timing.category] += timing.duration;
            }
        });
        return breakdown;
    }
    static getHighResolutionTime() {
        // In a real implementation, use performance.now() or process.hrtime()
        return Date.now();
    }
}
exports.PerformanceMetricsFactory = PerformanceMetricsFactory;
/**
 * Utility functions for working with performance metrics
 */
class PerformanceMetricsUtils {
    /**
     * Compares two performance metrics
     */
    static compare(baseline, current) {
        const changes = [];
        // Compare total time
        changes.push(this.createChange(PerformanceCategory.OVERALL, 'totalTime', baseline.totalTime, current.totalTime));
        // Compare memory usage
        changes.push(this.createChange(PerformanceCategory.OVERALL, 'memory.used', baseline.memory?.used ?? 0, current.memory?.used ?? 0));
        // Compare CPU usage
        changes.push(this.createChange(PerformanceCategory.OVERALL, 'cpu.average', baseline.cpu?.average ?? 0, current.cpu?.average ?? 0));
        // Compare breakdown by category
        Object.entries(current.breakdown).forEach(([category, value]) => {
            const baselineValue = baseline.breakdown[category] || 0;
            changes.push(this.createChange(category, 'duration', baselineValue, value));
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
    static generateRecommendations(metrics) {
        const recommendations = [];
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
    static analyzeTrends(historicalMetrics, metric, category) {
        if (historicalMetrics.length < 2) {
            return this.createEmptyTrend(metric, category);
        }
        const dataPoints = historicalMetrics.map(m => ({
            timestamp: m.timestamp,
            value: this.extractMetricValue(m, metric)
        })).filter(p => p.value !== null).map(p => ({
            timestamp: p.timestamp,
            value: p.value
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
            ? ((dataPoints[dataPoints.length - 1].value - dataPoints[0].value) / dataPoints[0].value) * 100
            : 0;
        const sortedValues = [...values].sort((a, b) => a - b);
        const median = sortedValues.length % 2 === 0
            ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
            : sortedValues[Math.floor(sortedValues.length / 2)];
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
    static checkAlerts(metrics) {
        const alerts = [];
        metrics.thresholds.forEach(threshold => {
            if (!threshold.enabled)
                return;
            const actualValue = this.extractMetricValue(metrics, threshold.metric);
            if (actualValue === null)
                return;
            let severity = null;
            let expectedValue = threshold.warningThreshold;
            if (actualValue >= threshold.criticalThreshold) {
                severity = AlertSeverity.CRITICAL;
                expectedValue = threshold.criticalThreshold;
            }
            else if (actualValue >= threshold.warningThreshold) {
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
    static generateReport(metrics, config) {
        const metricsArray = Array.isArray(metrics) ? metrics : [metrics];
        const latestMetrics = metricsArray[metricsArray.length - 1];
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
    static createChange(category, metric, baselineValue, currentValue) {
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
    static calculateOverallScore(changes) {
        if (changes.length === 0)
            return 0;
        const weightedScores = changes.map(change => {
            const weight = this.getMetricWeight(change.metric);
            const score = change.improvement ? Math.min(change.changePercentage, 50) : Math.max(change.changePercentage, -50);
            return score * weight;
        });
        const totalWeight = changes.reduce((sum, change) => sum + this.getMetricWeight(change.metric), 0);
        return totalWeight > 0 ? weightedScores.reduce((sum, score) => sum + score, 0) / totalWeight : 0;
    }
    static getMetricWeight(metric) {
        // Weight metrics by importance
        if (metric.includes('totalTime') || metric.includes('duration'))
            return 3;
        if (metric.includes('memory'))
            return 2;
        if (metric.includes('cpu'))
            return 2;
        return 1;
    }
    static generateRecommendationId() {
        return `rec_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    }
    static generateAlertId() {
        return `alert_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    }
    static extractMetricValue(metrics, metric) {
        const parts = metric.split('.');
        let value = metrics;
        for (const part of parts) {
            if (value && typeof value === 'object' && part in value) {
                value = value[part];
            }
            else {
                return null;
            }
        }
        return typeof value === 'number' ? value : null;
    }
    static createEmptyTrend(metric, category) {
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
    static determineTrendDirection(slope, standardDeviation) {
        const threshold = standardDeviation * 0.1; // 10% of standard deviation
        if (Math.abs(slope) < threshold)
            return TrendDirection.STABLE;
        if (standardDeviation > Math.abs(slope) * 2)
            return TrendDirection.VOLATILE;
        return slope > 0 ? TrendDirection.DEGRADING : TrendDirection.IMPROVING;
    }
    static generateAlertSuggestion(threshold, _actualValue) {
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
    static generateSummaryText(metrics, config) {
        const lines = [];
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
    static generateDetailedReport(metricsArray, config) {
        const latest = metricsArray[metricsArray.length - 1];
        const report = {};
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
exports.PerformanceMetricsUtils = PerformanceMetricsUtils;
//# sourceMappingURL=performance-metrics.js.map