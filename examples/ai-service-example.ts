/**
 * AI Service Example
 * 
 * Demonstrates the AI service functionality with example usage
 */

import { AIServiceFactory } from '../src/ai/ai-service-factory';
import { SummarizeRequest, EnhanceRequest, ValidateRequest } from '../src/ai/ai-service';

/**
 * Example demonstrating AI service functionality
 */
export async function demonstrateAIService() {
  console.log('🤖 AI Service Demonstration\n');

  try {
    // Create AI service with development configuration
    const aiService = AIServiceFactory.createDevelopmentService();
    console.log('✓ AI Service created with development configuration');

    // Example 1: Summarize an API endpoint
    console.log('\n📋 Example 1: Endpoint Summarization');
    
    const summarizeRequest: SummarizeRequest = {
      endpoint: {
        path: '/api/users/{id}',
        method: 'GET',
        summary: 'Get user by ID',
        description: 'Retrieves a specific user by their unique identifier',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'User ID',
            schema: { type: 'string' }
          }
        ],
        responses: [
          {
            status: '200',
            description: 'User found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          },
          {
            status: '404',
            description: 'User not found'
          }
        ]
      },
      context: {
        projectName: 'User Management API',
        domain: 'User Management',
        version: '1.0.0'
      },
      options: {
        includeExamples: true,
        generateCodeSamples: true,
        targetAudience: 'developers',
        style: 'detailed',
        languages: ['javascript', 'python']
      }
    };

    const summary = await aiService.summarize(summarizeRequest);
    console.log('✓ Endpoint summary generated:');
    console.log(`  • Enhanced Summary: ${summary.enhancedSummary}`);
    console.log(`  • Use Cases: ${summary.useCases?.length || 0} identified`);
    console.log(`  • Code Samples: ${summary.codeSamples?.length || 0} generated`);
    console.log(`  • Confidence: ${(summary.confidence * 100).toFixed(1)}%`);
    console.log(`  • Processing Time: ${summary.processingTime}s`);

    // Example 2: Enhance documentation content
    console.log('\n✨ Example 2: Content Enhancement');
    
    const enhanceRequest: EnhanceRequest = {
      content: 'This endpoint gets a user. Returns user data if found.',
      type: 'description',
      context: {
        projectName: 'User Management API',
        domain: 'User Management'
      },
      options: {
        focusAreas: ['clarity', 'completeness', 'examples'],
        preserveOriginal: false,
        maxEnhancements: 5
      }
    };

    const enhancement = await aiService.enhance(enhanceRequest);
    console.log('✓ Content enhancement generated:');
    console.log(`  • Enhancements: ${enhancement.enhancements.length} suggestions`);
    console.log(`  • Confidence: ${(enhancement.confidence * 100).toFixed(1)}%`);
    
    // Show first enhancement
    if (enhancement.enhancements.length > 0) {
      const firstEnhancement = enhancement.enhancements[0];
      console.log(`  • First suggestion: ${firstEnhancement.suggestion}`);
      console.log(`  • Priority: ${firstEnhancement.priority}`);
    }

    // Example 3: Validate AI-generated content
    console.log('\n🔍 Example 3: Content Validation');
    
    const validateRequest: ValidateRequest = {
      content: 'This endpoint retrieves a user by their unique identifier. It returns the user object if found, or a 404 error if the user does not exist.',
      type: 'description',
      criteria: ['clarity', 'completeness', 'accuracy'],
      context: {
        projectName: 'User Management API',
        domain: 'User Management'
      }
    };

    const validation = await aiService.validate(validateRequest);
    console.log('✓ Content validation completed:');
    console.log(`  • Valid: ${validation.valid ? 'Yes' : 'No'}`);
    console.log(`  • Overall Score: ${(validation.score * 100).toFixed(1)}%`);
    console.log(`  • Clarity: ${(validation.metrics.clarity * 100).toFixed(1)}%`);
    console.log(`  • Completeness: ${(validation.metrics.completeness * 100).toFixed(1)}%`);
    console.log(`  • Accuracy: ${(validation.metrics.accuracy * 100).toFixed(1)}%`);
    console.log(`  • Consistency: ${(validation.metrics.consistency * 100).toFixed(1)}%`);

    // Example 4: Batch processing
    console.log('\n📦 Example 4: Batch Processing');
    
    const batchRequest = {
      items: [
        {
          id: 'summary-1',
          type: 'summarize' as const,
          request: summarizeRequest
        },
        {
          id: 'enhance-1',
          type: 'enhance' as const,
          request: enhanceRequest
        },
        {
          id: 'validate-1',
          type: 'validate' as const,
          request: validateRequest
        }
      ],
      options: {
        maxConcurrency: 2,
        failureStrategy: 'continue' as const
      }
    };

    const batchResult = await aiService.batchProcess(batchRequest);
    console.log('✓ Batch processing completed:');
    console.log(`  • Status: ${batchResult.status}`);
    console.log(`  • Total Items: ${batchResult.totalItems}`);
    console.log(`  • Successful: ${batchResult.successCount}`);
    console.log(`  • Failed: ${batchResult.failureCount}`);
    console.log(`  • Processing Time: ${batchResult.processingTime}s`);

    console.log('\n🎉 AI Service demonstration completed successfully!');

  } catch (error) {
    console.error('❌ Error during AI service demonstration:', error);
    throw error;
  }
}

// Export for use in other modules
export default demonstrateAIService;

// Run demonstration if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  demonstrateAIService().catch(console.error);
}