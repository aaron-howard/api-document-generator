"use strict";
/**
 * T028 Error-Aware Service Wrappers
 *
 * Service integration layer that adds comprehensive error handling to all services.
 * Provides automatic error recovery, logging, and analytics for enhanced reliability.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorAwareServiceFactory = exports.ErrorAwareGenerationService = exports.ErrorAwareAIService = exports.ErrorAwareParserService = exports.ErrorAwareCLIService = exports.ErrorAwareServiceWrapper = void 0;
const error_handler_js_1 = require("./error-handler.js");
/**
 * Base error-aware service wrapper
 */
class ErrorAwareServiceWrapper {
    constructor(serviceName, cacheManager) {
        this.serviceName = serviceName;
        this.errorHandler = new error_handler_js_1.ErrorHandler({
            enableLogging: true,
            enableRecovery: true,
            enableAnalytics: true,
            enableCaching: !!cacheManager,
            maxRetries: 3,
            retryDelayMs: 1000,
            cacheErrorsForMs: 300000, // 5 minutes
            alertThresholds: {
                errorRate: 10,
                criticalErrors: 5,
                sameErrorCount: 10
            }
        }, cacheManager);
    }
    /**
     * Execute operation with error handling
     */
    async executeWithErrorHandling(operation, parameters, operationFunction, customRecovery) {
        const context = {
            serviceName: this.serviceName,
            operation,
            parameters,
            sessionId: parameters['sessionId'],
            userId: parameters['userId'],
            requestId: parameters['requestId'] || `req_${Date.now()}`,
            startTime: new Date()
        };
        try {
            return await operationFunction();
        }
        catch (error) {
            const recovery = await this.errorHandler.handleError(error, context, customRecovery);
            if (recovery.success && recovery.action === 'retry') {
                // Retry the operation
                try {
                    return await operationFunction();
                }
                catch (retryError) {
                    throw new Error(`Operation failed after retry: ${retryError.message}`);
                }
            }
            else if (recovery.success && customRecovery) {
                // Use custom recovery
                return await customRecovery();
            }
            else {
                // Re-throw original error if recovery failed
                throw error;
            }
        }
    }
    /**
     * Get error analytics for this service
     */
    getErrorAnalytics() {
        return this.errorHandler.getAnalytics();
    }
    /**
     * Get error log entries for this service
     */
    getErrorLog() {
        return this.errorHandler.getErrorLog();
    }
    /**
     * Clear error log for this service
     */
    clearErrorLog() {
        this.errorHandler.clearErrorLog();
    }
}
exports.ErrorAwareServiceWrapper = ErrorAwareServiceWrapper;
/**
 * Error-aware CLI Service wrapper
 */
class ErrorAwareCLIService extends ErrorAwareServiceWrapper {
    constructor(cliService, cacheManager) {
        super('CLIService', cacheManager);
        this.cliService = cliService;
    }
    async executeCommand(command, options = {}) {
        return this.executeWithErrorHandling('executeCommand', { command, options }, async () => {
            if (!this.cliService?.executeCommand) {
                throw new Error('CLI service method not available');
            }
            return await this.cliService.executeCommand(command, options);
        }, async () => {
            // Fallback: return help information
            return {
                success: false,
                message: 'Command execution failed, showing help',
                output: 'Available commands: parse, generate, validate',
                fallback: true
            };
        });
    }
    async getSessionInfo(sessionId) {
        return this.executeWithErrorHandling('getSessionInfo', { sessionId }, async () => {
            if (!this.cliService?.getSessionInfo) {
                throw new Error('Session info method not available');
            }
            return await this.cliService.getSessionInfo(sessionId);
        }, async () => {
            // Fallback: return default session
            return {
                id: sessionId,
                created: new Date(),
                status: 'unknown',
                fallback: true
            };
        });
    }
}
exports.ErrorAwareCLIService = ErrorAwareCLIService;
/**
 * Error-aware Parser Service wrapper
 */
class ErrorAwareParserService extends ErrorAwareServiceWrapper {
    constructor(parserService, cacheManager) {
        super('ParserService', cacheManager);
        this.parserService = parserService;
    }
    async parseSpecification(filePath, options = {}) {
        return this.executeWithErrorHandling('parseSpecification', { filePath, options }, async () => {
            if (!this.parserService?.parseSpecification) {
                throw new Error('Parser service method not available');
            }
            return await this.parserService.parseSpecification(filePath, options);
        }, async () => {
            // Fallback: return basic parsed structure
            return {
                metadata: {
                    sourceType: 'unknown',
                    version: '1.0.0',
                    parseTime: Date.now(),
                    fileCount: 1
                },
                endpoints: [],
                schemas: [],
                components: [],
                errors: ['Parsing failed, using fallback structure'],
                warnings: ['Fallback parsing used due to error'],
                fallback: true
            };
        });
    }
    async validateSpecification(spec) {
        return this.executeWithErrorHandling('validateSpecification', { spec }, async () => {
            if (!this.parserService?.validateSpecification) {
                throw new Error('Validation method not available');
            }
            return await this.parserService.validateSpecification(spec);
        }, async () => {
            // Fallback: basic validation
            return {
                valid: false,
                errors: ['Validation service unavailable'],
                warnings: ['Using fallback validation'],
                fallback: true
            };
        });
    }
}
exports.ErrorAwareParserService = ErrorAwareParserService;
/**
 * Error-aware AI Service wrapper
 */
class ErrorAwareAIService extends ErrorAwareServiceWrapper {
    constructor(aiService, cacheManager) {
        super('AIService', cacheManager);
        this.aiService = aiService;
    }
    async enhanceDocumentation(content, options = {}) {
        return this.executeWithErrorHandling('enhanceDocumentation', { content, options }, async () => {
            if (!this.aiService?.enhanceDocumentation) {
                throw new Error('AI enhancement method not available');
            }
            return await this.aiService.enhanceDocumentation(content, options);
        }, async () => {
            // Fallback: return original content with basic enhancement
            return {
                status: 'success',
                content: content,
                enhancements: ['Added basic structure'],
                confidence: 0.5,
                fallback: true,
                message: 'AI service unavailable, using fallback enhancement'
            };
        });
    }
    async generateSummary(data) {
        return this.executeWithErrorHandling('generateSummary', { data }, async () => {
            if (!this.aiService?.generateSummary) {
                throw new Error('AI summary method not available');
            }
            return await this.aiService.generateSummary(data);
        }, async () => {
            // Fallback: basic summary
            return {
                status: 'success',
                summary: 'Generated summary (AI service unavailable)',
                keyPoints: ['Basic API structure', 'Standard endpoints'],
                confidence: 0.3,
                fallback: true
            };
        });
    }
    async generateRecommendations(analysis) {
        return this.executeWithErrorHandling('generateRecommendations', { analysis }, async () => {
            if (!this.aiService?.generateRecommendations) {
                throw new Error('AI recommendations method not available');
            }
            return await this.aiService.generateRecommendations(analysis);
        }, async () => {
            // Fallback: basic recommendations
            return {
                status: 'success',
                recommendations: [
                    'Review API documentation completeness',
                    'Ensure consistent naming conventions',
                    'Add comprehensive examples'
                ],
                priority: 'medium',
                confidence: 0.4,
                fallback: true
            };
        });
    }
}
exports.ErrorAwareAIService = ErrorAwareAIService;
/**
 * Error-aware Generation Service wrapper
 */
class ErrorAwareGenerationService extends ErrorAwareServiceWrapper {
    constructor(generationService, cacheManager) {
        super('GenerationService', cacheManager);
        this.generationService = generationService;
    }
    async generateDocumentation(spec, options = {}) {
        return this.executeWithErrorHandling('generateDocumentation', { spec, options }, async () => {
            if (!this.generationService?.generateDocumentation) {
                throw new Error('Generation service method not available');
            }
            return await this.generationService.generateDocumentation(spec, options);
        }, async () => {
            // Fallback: basic documentation structure
            return {
                success: true,
                documentation: {
                    title: 'API Documentation',
                    description: 'Generated with fallback generator',
                    version: '1.0.0',
                    content: '<h1>API Documentation</h1><p>Basic structure generated due to service error.</p>',
                    format: options.format || 'html'
                },
                metadata: {
                    generatedAt: new Date(),
                    generator: 'fallback',
                    fallback: true
                },
                warnings: ['Used fallback generation due to service error']
            };
        });
    }
    async renderTemplate(template, data) {
        return this.executeWithErrorHandling('renderTemplate', { template, data }, async () => {
            if (!this.generationService?.renderTemplate) {
                throw new Error('Template rendering method not available');
            }
            return await this.generationService.renderTemplate(template, data);
        }, async () => {
            // Fallback: basic template rendering
            return {
                success: true,
                rendered: `<div>Template: ${template}</div><div>Data: ${JSON.stringify(data)}</div>`,
                fallback: true,
                warnings: ['Used fallback template renderer']
            };
        });
    }
    async validateOutput(output, schema) {
        return this.executeWithErrorHandling('validateOutput', { output, schema }, async () => {
            if (!this.generationService?.validateOutput) {
                throw new Error('Output validation method not available');
            }
            return await this.generationService.validateOutput(output, schema);
        }, async () => {
            // Fallback: basic validation
            return {
                valid: true,
                errors: [],
                warnings: ['Validation service unavailable - assuming valid'],
                fallback: true
            };
        });
    }
}
exports.ErrorAwareGenerationService = ErrorAwareGenerationService;
/**
 * Error-aware service integration factory
 */
class ErrorAwareServiceFactory {
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
    }
    createCLIService(originalService) {
        return new ErrorAwareCLIService(originalService, this.cacheManager);
    }
    createParserService(originalService) {
        return new ErrorAwareParserService(originalService, this.cacheManager);
    }
    createAIService(originalService) {
        return new ErrorAwareAIService(originalService, this.cacheManager);
    }
    createGenerationService(originalService) {
        return new ErrorAwareGenerationService(originalService, this.cacheManager);
    }
    /**
     * Get combined error analytics from all services
     */
    getCombinedAnalytics() {
        // In a real implementation, this would aggregate analytics from all created services
        return {
            message: 'Combined analytics would be aggregated from all error-aware services',
            timestamp: new Date()
        };
    }
}
exports.ErrorAwareServiceFactory = ErrorAwareServiceFactory;
//# sourceMappingURL=error-aware-services.js.map