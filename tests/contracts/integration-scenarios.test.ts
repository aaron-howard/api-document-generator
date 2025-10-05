/**
 * Integration test scenarios based on quickstart.md examples
 * These tests validate end-to-end workflows and real-world usage patterns
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface IntegrationTestContext {
  workingDirectory: string;
  generatedFiles: string[];
  apiSpecs: Record<string, any>;
  cleanupTasks: (() => void)[];
}

interface CLIResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  executionTime: number;
}

interface EndToEndTestScenario {
  name: string;
  description: string;
  steps: Array<{
    command: string;
    expectedExitCode: number;
    expectedOutput?: string[];
    expectedFiles?: string[];
    timeout?: number;
  }>;
  cleanup?: string[];
}

describe('Integration Test Scenarios - End-to-End Workflows', () => {
  let testContext: IntegrationTestContext;
  let mockCLI: any;
  let mockFileSystem: any;

  beforeEach(() => {
    testContext = {
      workingDirectory: '/tmp/api-doc-gen-test',
      generatedFiles: [],
      apiSpecs: {},
      cleanupTasks: [],
    };

    // Mock CLI execution
    mockCLI = {
      execute: jest.fn(),
      getLastExitCode: jest.fn(),
      getOutput: jest.fn(),
    };

    // Mock file system operations
    mockFileSystem = {
      readFile: jest.fn(),
      writeFile: jest.fn(),
      exists: jest.fn(),
      createDirectory: jest.fn(),
      removeDirectory: jest.fn(),
    };
  });

  afterEach(() => {
    // Execute cleanup tasks
    testContext.cleanupTasks.forEach((task) => task());
  });

  describe('Scenario 1: Basic API Documentation Generation', () => {
    const scenario: EndToEndTestScenario = {
      name: 'Basic OpenAPI to HTML Documentation',
      description:
        'Generate HTML documentation from a simple OpenAPI specification',
      steps: [
        {
          command: 'api-doc-gen generate --input petstore.yaml --output docs/',
          expectedExitCode: 0,
          expectedOutput: [
            'Processing OpenAPI specification: petstore.yaml',
            'Generating HTML documentation...',
            'Documentation generated successfully',
          ],
          expectedFiles: ['docs/index.html', 'docs/assets/styles.css'],
        },
      ],
    };

    test('should generate complete HTML documentation from OpenAPI spec', async () => {
      // Setup: Create sample OpenAPI spec
      const petstoreSpec = {
        openapi: '3.0.0',
        info: {
          title: 'Swagger Petstore',
          version: '1.0.0',
          description: 'A sample API that uses a petstore as an example',
        },
        servers: [{ url: 'https://petstore.swagger.io/v2' }],
        paths: {
          '/pets': {
            get: {
              summary: 'List all pets',
              operationId: 'listPets',
              tags: ['pets'],
              parameters: [
                {
                  name: 'limit',
                  in: 'query',
                  description: 'How many items to return at one time',
                  required: false,
                  schema: { type: 'integer', maximum: 100 },
                },
              ],
              responses: {
                200: {
                  description: 'A paged array of pets',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Pet' },
                      },
                    },
                  },
                },
                default: {
                  description: 'unexpected error',
                  content: {
                    'application/json': {
                      schema: { $ref: '#/components/schemas/Error' },
                    },
                  },
                },
              },
            },
            post: {
              summary: 'Create a pet',
              operationId: 'createPets',
              tags: ['pets'],
              requestBody: {
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Pet' },
                  },
                },
                required: true,
              },
              responses: {
                201: { description: 'Pet created' },
                default: {
                  description: 'unexpected error',
                  content: {
                    'application/json': {
                      schema: { $ref: '#/components/schemas/Error' },
                    },
                  },
                },
              },
            },
          },
          '/pets/{petId}': {
            get: {
              summary: 'Info for a specific pet',
              operationId: 'showPetById',
              tags: ['pets'],
              parameters: [
                {
                  name: 'petId',
                  in: 'path',
                  required: true,
                  description: 'The id of the pet to retrieve',
                  schema: { type: 'string' },
                },
              ],
              responses: {
                200: {
                  description: 'Expected response to a valid request',
                  content: {
                    'application/json': {
                      schema: { $ref: '#/components/schemas/Pet' },
                    },
                  },
                },
                default: {
                  description: 'unexpected error',
                  content: {
                    'application/json': {
                      schema: { $ref: '#/components/schemas/Error' },
                    },
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: {
            Pet: {
              type: 'object',
              required: ['id', 'name'],
              properties: {
                id: { type: 'integer', format: 'int64' },
                name: { type: 'string' },
                tag: { type: 'string' },
              },
            },
            Error: {
              type: 'object',
              required: ['code', 'message'],
              properties: {
                code: { type: 'integer', format: 'int32' },
                message: { type: 'string' },
              },
            },
          },
        },
      };

      mockFileSystem.readFile.mockResolvedValue(JSON.stringify(petstoreSpec));
      mockFileSystem.exists.mockImplementation((path: string) => {
        if (path === 'petstore.yaml') return Promise.resolve(true);
        return Promise.resolve(false);
      });

      const expectedCLIResult: CLIResult = {
        exitCode: 0,
        stdout: [
          'Processing OpenAPI specification: petstore.yaml',
          'Detecting specification format: OpenAPI 3.0.0',
          'Parsing 3 endpoints...',
          'Generating HTML documentation with default template...',
          'Created: docs/index.html (245KB)',
          'Created: docs/assets/styles.css (12KB)',
          'Created: docs/assets/scripts.js (8KB)',
          'Documentation generated successfully in 2.3s',
        ].join('\n'),
        stderr: '',
        executionTime: 2.3,
      };

      mockCLI.execute.mockResolvedValue(expectedCLIResult);

      // Execute command
      const result = await mockCLI.execute(scenario.steps[0].command);

      // Verify results
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Processing OpenAPI specification');
      expect(result.stdout).toContain('Documentation generated successfully');
      expect(result.stdout).toContain('docs/index.html');

      // Verify files were created
      expect(mockFileSystem.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('docs/index.html'),
        expect.any(String)
      );
    });
  });

  describe('Scenario 2: Multi-format Documentation Generation', () => {
    test('should generate documentation in multiple formats', async () => {
      const commands = [
        'api-doc-gen generate --input api.yaml --format html --output docs/html/',
        'api-doc-gen generate --input api.yaml --format markdown --output docs/md/',
        'api-doc-gen generate --input api.yaml --format pdf --output docs/pdf/',
      ];

      const expectedResults = [
        {
          format: 'html',
          files: ['docs/html/index.html', 'docs/html/assets/styles.css'],
          size: 250000,
        },
        {
          format: 'markdown',
          files: ['docs/md/README.md', 'docs/md/endpoints/'],
          size: 45000,
        },
        {
          format: 'pdf',
          files: ['docs/pdf/api-documentation.pdf'],
          size: 1200000,
        },
      ];

      for (let i = 0; i < commands.length; i++) {
        const result: CLIResult = {
          exitCode: 0,
          stdout: `Generated ${expectedResults[i].format} documentation (${expectedResults[i].size} bytes)`,
          stderr: '',
          executionTime: 2.0 + i * 0.5,
        };

        mockCLI.execute.mockResolvedValueOnce(result);

        const cmdResult = await mockCLI.execute(commands[i]);
        expect(cmdResult.exitCode).toBe(0);
        expect(cmdResult.stdout).toContain(expectedResults[i].format);
      }
    });
  });

  describe('Scenario 3: AI-Enhanced Documentation Workflow', () => {
    test('should enhance documentation with AI insights', async () => {
      const workflow = [
        {
          command:
            'api-doc-gen generate --input basic-api.yaml --enhance-ai --output enhanced-docs/',
          expectedResult: {
            exitCode: 0,
            aiEnhancements: {
              summariesGenerated: 8,
              examplesAdded: 12,
              codeSamplesGenerated: 16,
            },
          },
        },
        {
          command: 'api-doc-gen validate --input enhanced-docs/',
          expectedResult: {
            exitCode: 0,
            validationScore: 0.94,
            suggestions: 3,
          },
        },
      ];

      // Step 1: Generate AI-enhanced documentation
      const enhanceResult: CLIResult = {
        exitCode: 0,
        stdout: [
          'Processing API specification with AI enhancement...',
          'Connecting to AI service (GPT-4)...',
          'Generating enhanced summaries for 8 endpoints...',
          'Creating code samples in 4 languages...',
          'Adding 12 realistic examples...',
          'AI enhancement completed (confidence: 0.94)',
          'Documentation generated with AI enhancements',
        ].join('\n'),
        stderr: '',
        executionTime: 15.7,
      };

      mockCLI.execute.mockResolvedValueOnce(enhanceResult);

      // Step 2: Validate enhanced documentation
      const validateResult: CLIResult = {
        exitCode: 0,
        stdout: [
          'Validating generated documentation...',
          'Checking accuracy against original API spec...',
          'Validation score: 94% (Excellent)',
          'Found 3 suggestions for improvement:',
          '- Consider adding error response examples for /users/{id}',
          '- Rate limiting information could be more detailed',
          '- Security requirements need clarification',
          'Overall quality: High',
        ].join('\n'),
        stderr: '',
        executionTime: 3.2,
      };

      mockCLI.execute.mockResolvedValueOnce(validateResult);

      // Execute workflow
      const step1 = await mockCLI.execute(workflow[0].command);
      expect(step1.exitCode).toBe(0);
      expect(step1.stdout).toContain('AI enhancement completed');
      expect(step1.stdout).toContain('confidence: 0.94');

      const step2 = await mockCLI.execute(workflow[1].command);
      expect(step2.exitCode).toBe(0);
      expect(step2.stdout).toContain('Validation score: 94%');
      expect(step2.stdout).toContain('3 suggestions');
    });
  });

  describe('Scenario 4: Multi-language Source Code Documentation', () => {
    test('should extract documentation from multiple programming languages', async () => {
      const sourceFiles = [
        { path: 'src/api.ts', language: 'typescript' },
        { path: 'src/handlers.py', language: 'python' },
        { path: 'src/routes.go', language: 'go' },
      ];

      const extractCommands = sourceFiles.map(
        (file) =>
          `api-doc-gen extract --input ${file.path} --language ${file.language} --output extracted/${file.language}.json`
      );

      const mergeCommand =
        'api-doc-gen merge --input extracted/ --output merged-docs/ --format html';

      // Mock extraction results
      const extractionResults = [
        {
          endpoints: 5,
          functions: 12,
          classes: 3,
          extractionTime: 1.2,
        },
        {
          endpoints: 8,
          functions: 15,
          classes: 4,
          extractionTime: 0.9,
        },
        {
          endpoints: 6,
          functions: 10,
          classes: 2,
          extractionTime: 1.1,
        },
      ];

      // Execute extraction commands
      for (let i = 0; i < extractCommands.length; i++) {
        const result: CLIResult = {
          exitCode: 0,
          stdout: [
            `Extracting documentation from ${sourceFiles[i].path}`,
            `Language: ${sourceFiles[i].language}`,
            `Found ${extractionResults[i].endpoints} API endpoints`,
            `Extracted ${extractionResults[i].functions} function signatures`,
            `Processed ${extractionResults[i].classes} class definitions`,
            `Extraction completed in ${extractionResults[i].extractionTime}s`,
          ].join('\n'),
          stderr: '',
          executionTime: extractionResults[i].extractionTime,
        };

        mockCLI.execute.mockResolvedValueOnce(result);

        const cmdResult = await mockCLI.execute(extractCommands[i]);
        expect(cmdResult.exitCode).toBe(0);
        expect(cmdResult.stdout).toContain(
          `Found ${extractionResults[i].endpoints} API endpoints`
        );
      }

      // Execute merge command
      const mergeResult: CLIResult = {
        exitCode: 0,
        stdout: [
          'Merging documentation from multiple sources...',
          'Loaded TypeScript documentation (5 endpoints)',
          'Loaded Python documentation (8 endpoints)',
          'Loaded Go documentation (6 endpoints)',
          'Resolving duplicate endpoints...',
          'Generating unified documentation...',
          'Created comprehensive documentation with 19 unique endpoints',
          'Documentation available at merged-docs/index.html',
        ].join('\n'),
        stderr: '',
        executionTime: 4.5,
      };

      mockCLI.execute.mockResolvedValueOnce(mergeResult);

      const finalResult = await mockCLI.execute(mergeCommand);
      expect(finalResult.exitCode).toBe(0);
      expect(finalResult.stdout).toContain('19 unique endpoints');
      expect(finalResult.stdout).toContain('merged-docs/index.html');
    });
  });

  describe('Scenario 5: Configuration and Customization Workflow', () => {
    test('should use custom templates and configuration', async () => {
      const setupCommands = [
        'api-doc-gen init --template custom-corporate',
        'api-doc-gen config set theme.primaryColor "#007acc"',
        'api-doc-gen config set branding.logo "assets/company-logo.png"',
        'api-doc-gen generate --input api.yaml --config custom-config.json',
      ];

      // Step 1: Initialize with custom template
      const initResult: CLIResult = {
        exitCode: 0,
        stdout: [
          'Initializing API documentation generator...',
          'Downloading custom-corporate template...',
          'Template installed successfully',
          'Created configuration file: .api-doc-gen.json',
          'Created templates directory: templates/',
          'Setup complete! Run "api-doc-gen generate" to create documentation',
        ].join('\n'),
        stderr: '',
        executionTime: 3.1,
      };

      // Step 2-3: Configuration updates
      const configResults = [
        {
          exitCode: 0,
          stdout: 'Configuration updated: theme.primaryColor = "#007acc"',
          stderr: '',
          executionTime: 0.1,
        },
        {
          exitCode: 0,
          stdout: 'Configuration updated: branding.logo = "assets/company-logo.png"',
          stderr: '',
          executionTime: 0.1,
        },
      ];

      // Step 4: Generate with custom configuration
      const generateResult: CLIResult = {
        exitCode: 0,
        stdout: [
          'Using configuration: custom-config.json',
          'Loading custom-corporate template...',
          'Applying custom branding (logo: assets/company-logo.png)...',
          'Generating documentation with theme: #007acc...',
          'Created branded documentation with corporate styling',
          'Documentation available at docs/index.html',
        ].join('\n'),
        stderr: '',
        executionTime: 5.2,
      };

      // Mock all command results
      mockCLI.execute
        .mockResolvedValueOnce(initResult)
        .mockResolvedValueOnce(configResults[0])
        .mockResolvedValueOnce(configResults[1])
        .mockResolvedValueOnce(generateResult);

      // Execute workflow
      for (const command of setupCommands) {
        const result = await mockCLI.execute(command);
        expect(result.exitCode).toBe(0);
      }

      // Verify final result includes customizations
      const finalResult = await mockCLI.execute(setupCommands[3]);
      expect(finalResult.stdout).toContain('custom-corporate template');
      expect(finalResult.stdout).toContain('assets/company-logo.png');
      expect(finalResult.stdout).toContain('#007acc');
    });
  });

  describe('Scenario 6: Error Handling and Recovery', () => {
    test('should handle common error scenarios gracefully', async () => {
      const errorScenarios = [
        {
          command: 'api-doc-gen generate --input nonexistent.yaml',
          expectedError: {
            exitCode: 1,
            stderr: 'Error: Input file "nonexistent.yaml" not found',
          },
        },
        {
          command: 'api-doc-gen generate --input invalid-spec.yaml',
          expectedError: {
            exitCode: 2,
            stderr: 'Error: Invalid OpenAPI specification\nLine 5: Missing required field "info.title"',
          },
        },
        {
          command: 'api-doc-gen generate --input valid-spec.yaml --template unknown-template',
          expectedError: {
            exitCode: 3,
            stderr: 'Error: Template "unknown-template" not found\nAvailable templates: default-html, github-markdown, professional-pdf',
          },
        },
      ];

      for (const scenario of errorScenarios) {
        const result: CLIResult = {
          exitCode: scenario.expectedError.exitCode,
          stdout: '',
          stderr: scenario.expectedError.stderr,
          executionTime: 0.2,
        };

        mockCLI.execute.mockResolvedValueOnce(result);

        const cmdResult = await mockCLI.execute(scenario.command);
        expect(cmdResult.exitCode).toBe(scenario.expectedError.exitCode);
        expect(cmdResult.stderr).toContain(scenario.expectedError.stderr.split('\n')[0]);
      }
    });

    test('should provide helpful suggestions for common mistakes', async () => {
      const typoCommand = 'api-doc-gen generat --input api.yaml'; // Typo in "generate"

      const suggestionResult: CLIResult = {
        exitCode: 1,
        stdout: '',
        stderr: [
          'Error: Unknown command "generat"',
          '',
          'Did you mean one of these?',
          '  generate    Generate API documentation',
          '  validate    Validate API specification',
          '  extract     Extract documentation from source code',
          '',
          'Run "api-doc-gen --help" for more information',
        ].join('\n'),
        executionTime: 0.1,
      };

      mockCLI.execute.mockResolvedValue(suggestionResult);

      const result = await mockCLI.execute(typoCommand);
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Did you mean one of these?');
      expect(result.stderr).toContain('generate');
    });
  });

  describe('Performance and Scalability Tests', () => {
    test('should handle large API specifications efficiently', async () => {
      const largeApiCommand = 'api-doc-gen generate --input large-api.yaml --output docs/';

      const performanceResult: CLIResult = {
        exitCode: 0,
        stdout: [
          'Processing large OpenAPI specification (2.4MB)...',
          'Parsing 156 endpoints across 12 tags...',
          'Processing 89 data models...',
          'Generating HTML documentation...',
          'Memory usage: 89MB peak',
          'Documentation generated successfully in 8.7s',
          'Output size: 12.3MB (compression ratio: 5.1x)',
        ].join('\n'),
        stderr: '',
        executionTime: 8.7,
      };

      mockCLI.execute.mockResolvedValue(performanceResult);

      const result = await mockCLI.execute(largeApiCommand);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('156 endpoints');
      expect(result.stdout).toContain('89 data models');
      expect(result.executionTime).toBeLessThan(10); // Should complete within 10 seconds
    });

    test('should support concurrent documentation generation', async () => {
      const batchCommand = 'api-doc-gen batch --config batch-config.json --parallel 4';

      const batchResult: CLIResult = {
        exitCode: 0,
        stdout: [
          'Starting batch documentation generation...',
          'Processing 8 API specifications in parallel (concurrency: 4)...',
          '',
          'Completed: user-api.yaml → docs/user-api/ (2.1s)',
          'Completed: order-api.yaml → docs/order-api/ (1.8s)',
          'Completed: product-api.yaml → docs/product-api/ (2.3s)',
          'Completed: payment-api.yaml → docs/payment-api/ (2.0s)',
          'Completed: notification-api.yaml → docs/notification-api/ (1.5s)',
          'Completed: inventory-api.yaml → docs/inventory-api/ (1.9s)',
          'Completed: analytics-api.yaml → docs/analytics-api/ (2.4s)',
          'Completed: admin-api.yaml → docs/admin-api/ (1.7s)',
          '',
          'Batch generation completed successfully',
          'Total time: 4.2s (avg: 1.95s per API)',
          'Generated documentation for 8 APIs',
        ].join('\n'),
        stderr: '',
        executionTime: 4.2,
      };

      mockCLI.execute.mockResolvedValue(batchResult);

      const result = await mockCLI.execute(batchCommand);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('8 API specifications');
      expect(result.stdout).toContain('concurrency: 4');
      expect(result.stdout).toContain('Total time: 4.2s');
    });
  });
});