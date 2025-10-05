/**
 * Contract tests for Generation Service (generation-service.yaml)
 * These tests validate the multi-format documentation generation service according to the OpenAPI specification
 */

interface GenerateDocumentationRequest {
  data: {
    apiSpec: any; // OpenAPI specification
    endpoints?: Array<{
      path: string;
      method: string;
      summary?: string;
      description?: string;
      metadata?: any;
    }>;
    metadata?: {
      title?: string;
      version?: string;
      description?: string;
      contact?: any;
      license?: any;
      servers?: any[];
      tags?: any[];
    };
    aiEnhanced?: {
      summaries?: Record<string, any>;
      examples?: Record<string, any>;
    };
  };
  template: {
    name: string;
    version?: string;
    customizations?: {
      branding?: {
        logo?: string;
        colors?: Record<string, string>;
        fonts?: Record<string, string>;
      };
      layout?: {
        sections?: string[];
        ordering?: string[];
        hideFields?: string[];
      };
      content?: {
        includeCodeSamples?: boolean;
        includeExamples?: boolean;
        includeSchemas?: boolean;
        targetAudience?: string;
      };
    };
  };
  output: {
    format: 'html' | 'markdown' | 'pdf' | 'json' | 'yaml';
    filename?: string;
    options?: {
      splitFiles?: boolean;
      includeNavigation?: boolean;
      generateIndex?: boolean;
      compression?: 'none' | 'gzip' | 'zip';
      styling?: {
        theme?: string;
        customCSS?: string;
      };
    };
  };
  config?: {
    caching?: boolean;
    optimization?: boolean;
    validation?: boolean;
  };
}

interface GenerateDocumentationResponse {
  generationId: string;
  files: Array<{
    filename: string;
    path: string;
    size: number;
    mimeType: string;
    url?: string;
    checksum?: string;
  }>;
  metadata: {
    generatedAt: string;
    processingTime: number;
    template: {
      name: string;
      version: string;
    };
    stats: {
      totalEndpoints: number;
      totalPages: number;
      totalSize: number;
      compressionRatio?: number;
    };
  };
  validation?: {
    passed: boolean;
    errors?: Array<{
      type: string;
      message: string;
      location?: string;
    }>;
  };
}

interface GetTemplatesResponse {
  templates: Array<{
    name: string;
    version: string;
    description: string;
    formats: string[];
    customizable: boolean;
    preview?: string;
    features: string[];
    requirements?: {
      minApiVersion?: string;
      dependencies?: string[];
    };
  }>;
}

interface PreviewRequest {
  data: {
    apiSpec: any;
    endpoints?: any[];
  };
  template: {
    name: string;
    customizations?: any;
  };
  section?: string;
}

interface PreviewResponse {
  previewId: string;
  content: string;
  mimeType: string;
  section?: string;
  isPartial: boolean;
  dependencies?: string[];
}

interface BatchGenerationRequest {
  requests: GenerateDocumentationRequest[];
  options?: {
    parallel?: boolean;
    priority?: 'high' | 'normal' | 'low';
    failFast?: boolean;
  };
}

interface BatchGenerationResponse {
  batchId: string;
  results: Array<{
    requestIndex: number;
    status: 'success' | 'failed' | 'pending';
    result?: GenerateDocumentationResponse;
    error?: any;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
    pending: number;
    totalProcessingTime: number;
  };
}

describe('Generation Service Contract Tests', () => {
  let mockGenerationService: any;

  beforeEach(() => {
    // Mock generation service implementation (to be implemented later)
    mockGenerationService = {
      generateDocumentation: jest.fn(),
      getTemplates: jest.fn(),
      preview: jest.fn(),
      batchGenerate: jest.fn(),
    };
  });

  describe('POST /generate - Generate Documentation', () => {
    test('should generate HTML documentation from OpenAPI spec', async () => {
      const generateRequest: GenerateDocumentationRequest = {
        data: {
          apiSpec: {
            openapi: '3.0.0',
            info: {
              title: 'Pet Store API',
              version: '1.0.0',
              description: 'A sample pet store API',
            },
            paths: {
              '/pets': {
                get: {
                  summary: 'List all pets',
                  operationId: 'listPets',
                  responses: {
                    200: {
                      description: 'List of pets',
                      content: {
                        'application/json': {
                          schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Pet' },
                          },
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
                  },
                },
              },
            },
          },
        },
        template: {
          name: 'default-html',
          customizations: {
            branding: {
              colors: { primary: '#007acc', secondary: '#f8f9fa' },
            },
            content: {
              includeCodeSamples: true,
              includeExamples: true,
            },
          },
        },
        output: {
          format: 'html',
          filename: 'pet-store-docs',
          options: {
            includeNavigation: true,
            generateIndex: true,
            styling: { theme: 'modern' },
          },
        },
      };

      const expectedResponse: GenerateDocumentationResponse = {
        generationId: 'gen_123456789',
        files: [
          {
            filename: 'pet-store-docs.html',
            path: '/generated/pet-store-docs.html',
            size: 245760,
            mimeType: 'text/html',
            url: 'https://api.example.com/files/gen_123456789/pet-store-docs.html',
            checksum: 'sha256:abc123def456',
          },
          {
            filename: 'assets/styles.css',
            path: '/generated/assets/styles.css',
            size: 12340,
            mimeType: 'text/css',
            url: 'https://api.example.com/files/gen_123456789/assets/styles.css',
          },
        ],
        metadata: {
          generatedAt: '2024-01-15T10:30:00Z',
          processingTime: 2.5,
          template: {
            name: 'default-html',
            version: '1.2.0',
          },
          stats: {
            totalEndpoints: 1,
            totalPages: 1,
            totalSize: 258100,
          },
        },
        validation: {
          passed: true,
        },
      };

      mockGenerationService.generateDocumentation.mockResolvedValue(
        expectedResponse
      );

      const result = await mockGenerationService.generateDocumentation(
        generateRequest
      );

      expect(result).toEqual(expectedResponse);
      expect(result.generationId).toBeDefined();
      expect(result.files).toHaveLength(2);
      expect(result.files[0].mimeType).toBe('text/html');
      expect(result.metadata.stats.totalEndpoints).toBe(1);
      expect(result.validation?.passed).toBe(true);
    });

    test('should generate markdown documentation with AI enhancements', async () => {
      const generateRequest: GenerateDocumentationRequest = {
        data: {
          apiSpec: {
            openapi: '3.0.0',
            info: { title: 'User API', version: '1.0.0' },
            paths: {
              '/users/{id}': {
                get: { summary: 'Get user by ID' },
              },
            },
          },
          aiEnhanced: {
            summaries: {
              '/users/{id}': {
                enhancedSummary: 'Retrieve detailed user information',
                useCases: ['Profile display', 'User management'],
              },
            },
          },
        },
        template: {
          name: 'github-markdown',
        },
        output: {
          format: 'markdown',
          options: {
            splitFiles: true,
          },
        },
      };

      const expectedResponse: GenerateDocumentationResponse = {
        generationId: 'gen_md_123',
        files: [
          {
            filename: 'README.md',
            path: '/generated/README.md',
            size: 5420,
            mimeType: 'text/markdown',
          },
          {
            filename: 'endpoints/users.md',
            path: '/generated/endpoints/users.md',
            size: 3200,
            mimeType: 'text/markdown',
          },
        ],
        metadata: {
          generatedAt: '2024-01-15T10:35:00Z',
          processingTime: 1.8,
          template: {
            name: 'github-markdown',
            version: '2.1.0',
          },
          stats: {
            totalEndpoints: 1,
            totalPages: 2,
            totalSize: 8620,
          },
        },
      };

      mockGenerationService.generateDocumentation.mockResolvedValue(
        expectedResponse
      );

      const result = await mockGenerationService.generateDocumentation(
        generateRequest
      );

      expect(result.files).toHaveLength(2);
      expect(result.files.some((f: any) => f.filename === 'README.md')).toBe(true);
      expect(result.files.some((f: any) => f.path.includes('endpoints/'))).toBe(
        true
      );
    });

    test('should generate PDF documentation with custom styling', async () => {
      const generateRequest: GenerateDocumentationRequest = {
        data: {
          apiSpec: {
            openapi: '3.0.0',
            info: { title: 'API Documentation', version: '1.0.0' },
          },
        },
        template: {
          name: 'professional-pdf',
          customizations: {
            branding: {
              logo: 'https://example.com/logo.png',
              colors: { primary: '#2c3e50' },
            },
          },
        },
        output: {
          format: 'pdf',
          filename: 'api-docs',
        },
      };

      const expectedResponse: GenerateDocumentationResponse = {
        generationId: 'gen_pdf_123',
        files: [
          {
            filename: 'api-docs.pdf',
            path: '/generated/api-docs.pdf',
            size: 1024000,
            mimeType: 'application/pdf',
          },
        ],
        metadata: {
          generatedAt: '2024-01-15T10:40:00Z',
          processingTime: 4.2,
          template: {
            name: 'professional-pdf',
            version: '1.0.0',
          },
          stats: {
            totalEndpoints: 5,
            totalPages: 12,
            totalSize: 1024000,
          },
        },
      };

      mockGenerationService.generateDocumentation.mockResolvedValue(
        expectedResponse
      );

      const result = await mockGenerationService.generateDocumentation(
        generateRequest
      );

      expect(result.files[0].mimeType).toBe('application/pdf');
      expect(result.metadata.processingTime).toBeGreaterThan(3);
    });

    test('should handle validation errors', async () => {
      const invalidRequest: GenerateDocumentationRequest = {
        data: {
          apiSpec: {
            // Invalid OpenAPI spec
            openapi: '2.0', // Wrong version
            info: {}, // Missing required fields
          },
        },
        template: { name: 'default-html' },
        output: { format: 'html' },
      };

      const expectedResponse: GenerateDocumentationResponse = {
        generationId: 'gen_error_123',
        files: [],
        metadata: {
          generatedAt: '2024-01-15T10:45:00Z',
          processingTime: 0.1,
          template: { name: 'default-html', version: '1.0.0' },
          stats: { totalEndpoints: 0, totalPages: 0, totalSize: 0 },
        },
        validation: {
          passed: false,
          errors: [
            {
              type: 'INVALID_OPENAPI_VERSION',
              message: 'OpenAPI version 2.0 is not supported',
              location: 'spec.openapi',
            },
            {
              type: 'MISSING_REQUIRED_FIELD',
              message: 'Missing required field: info.title',
              location: 'spec.info.title',
            },
          ],
        },
      };

      mockGenerationService.generateDocumentation.mockResolvedValue(
        expectedResponse
      );

      const result = await mockGenerationService.generateDocumentation(
        invalidRequest
      );

      expect(result.validation?.passed).toBe(false);
      expect(result.validation?.errors).toHaveLength(2);
      expect(result.files).toHaveLength(0);
    });
  });

  describe('GET /templates - List Available Templates', () => {
    test('should return list of available templates', async () => {
      const expectedResponse: GetTemplatesResponse = {
        templates: [
          {
            name: 'default-html',
            version: '1.2.0',
            description: 'Clean, modern HTML documentation',
            formats: ['html'],
            customizable: true,
            preview: 'https://api.example.com/previews/default-html.png',
            features: [
              'Responsive design',
              'Code syntax highlighting',
              'Interactive examples',
            ],
            requirements: {
              minApiVersion: '3.0.0',
            },
          },
          {
            name: 'github-markdown',
            version: '2.1.0',
            description: 'GitHub-flavored markdown documentation',
            formats: ['markdown'],
            customizable: false,
            features: ['Split files', 'Auto-generated TOC', 'Code blocks'],
          },
          {
            name: 'professional-pdf',
            version: '1.0.0',
            description: 'Professional PDF documentation',
            formats: ['pdf'],
            customizable: true,
            features: ['Custom branding', 'Vector graphics', 'Print-ready'],
            requirements: {
              dependencies: ['wkhtmltopdf'],
            },
          },
        ],
      };

      mockGenerationService.getTemplates.mockResolvedValue(expectedResponse);

      const result = await mockGenerationService.getTemplates();

      expect(result).toEqual(expectedResponse);
      expect(result.templates).toHaveLength(3);
      expect(result.templates[0].name).toBe('default-html');
      expect(result.templates[1].formats).toContain('markdown');
    });
  });

  describe('POST /preview - Preview Documentation Section', () => {
    test('should generate preview of documentation section', async () => {
      const previewRequest: PreviewRequest = {
        data: {
          apiSpec: {
            openapi: '3.0.0',
            info: { title: 'Test API', version: '1.0.0' },
            paths: {
              '/test': {
                get: { summary: 'Test endpoint' },
              },
            },
          },
        },
        template: { name: 'default-html' },
        section: 'endpoint-details',
      };

      const expectedResponse: PreviewResponse = {
        previewId: 'preview_123',
        content: `
          <div class="endpoint">
            <h3>GET /test</h3>
            <p>Test endpoint</p>
            <div class="code-sample">
              <pre><code>curl -X GET /test</code></pre>
            </div>
          </div>
        `,
        mimeType: 'text/html',
        section: 'endpoint-details',
        isPartial: true,
        dependencies: ['styles.css', 'scripts.js'],
      };

      mockGenerationService.preview.mockResolvedValue(expectedResponse);

      const result = await mockGenerationService.preview(previewRequest);

      expect(result).toEqual(expectedResponse);
      expect(result.previewId).toBeDefined();
      expect(result.content).toContain('GET /test');
      expect(result.isPartial).toBe(true);
    });
  });

  describe('POST /batch - Batch Generate Documentation', () => {
    test('should process multiple generation requests in batch', async () => {
      const batchRequest: BatchGenerationRequest = {
        requests: [
          {
            data: { apiSpec: { openapi: '3.0.0', info: { title: 'API 1' } } },
            template: { name: 'default-html' },
            output: { format: 'html' },
          },
          {
            data: { apiSpec: { openapi: '3.0.0', info: { title: 'API 2' } } },
            template: { name: 'github-markdown' },
            output: { format: 'markdown' },
          },
        ],
        options: {
          parallel: true,
          priority: 'high',
        },
      };

      const expectedResponse: BatchGenerationResponse = {
        batchId: 'batch_gen_123',
        results: [
          {
            requestIndex: 0,
            status: 'success',
            result: {
              generationId: 'gen_1',
              files: [
                {
                  filename: 'api1.html',
                  path: '/generated/api1.html',
                  size: 50000,
                  mimeType: 'text/html',
                },
              ],
              metadata: {
                generatedAt: '2024-01-15T11:00:00Z',
                processingTime: 1.5,
                template: { name: 'default-html', version: '1.0.0' },
                stats: { totalEndpoints: 3, totalPages: 1, totalSize: 50000 },
              },
            },
          },
          {
            requestIndex: 1,
            status: 'success',
            result: {
              generationId: 'gen_2',
              files: [
                {
                  filename: 'README.md',
                  path: '/generated/README.md',
                  size: 25000,
                  mimeType: 'text/markdown',
                },
              ],
              metadata: {
                generatedAt: '2024-01-15T11:00:30Z',
                processingTime: 1.2,
                template: { name: 'github-markdown', version: '2.0.0' },
                stats: { totalEndpoints: 2, totalPages: 1, totalSize: 25000 },
              },
            },
          },
        ],
        summary: {
          total: 2,
          successful: 2,
          failed: 0,
          pending: 0,
          totalProcessingTime: 2.7,
        },
      };

      mockGenerationService.batchGenerate.mockResolvedValue(expectedResponse);

      const result = await mockGenerationService.batchGenerate(batchRequest);

      expect(result).toEqual(expectedResponse);
      expect(result.batchId).toBeDefined();
      expect(result.results).toHaveLength(2);
      expect(result.summary.successful).toBe(2);
      expect(result.summary.failed).toBe(0);
    });

    test('should handle mixed success/failure in batch', async () => {
      const batchRequest: BatchGenerationRequest = {
        requests: [
          {
            data: { apiSpec: { openapi: '3.0.0' } }, // Valid
            template: { name: 'default-html' },
            output: { format: 'html' },
          },
          {
            data: { apiSpec: {} }, // Invalid
            template: { name: 'unknown-template' },
            output: { format: 'html' },
          },
        ],
      };

      const expectedResponse: BatchGenerationResponse = {
        batchId: 'batch_mixed_123',
        results: [
          {
            requestIndex: 0,
            status: 'success',
            result: {
              generationId: 'gen_success',
              files: [],
              metadata: {
                generatedAt: '2024-01-15T11:05:00Z',
                processingTime: 1.0,
                template: { name: 'default-html', version: '1.0.0' },
                stats: { totalEndpoints: 0, totalPages: 0, totalSize: 0 },
              },
            },
          },
          {
            requestIndex: 1,
            status: 'failed',
            error: {
              code: 'TEMPLATE_NOT_FOUND',
              message: 'Template "unknown-template" not found',
            },
          },
        ],
        summary: {
          total: 2,
          successful: 1,
          failed: 1,
          pending: 0,
          totalProcessingTime: 1.0,
        },
      };

      mockGenerationService.batchGenerate.mockResolvedValue(expectedResponse);

      const result = await mockGenerationService.batchGenerate(batchRequest);

      expect(result.summary.successful).toBe(1);
      expect(result.summary.failed).toBe(1);
      expect(result.results[1].status).toBe('failed');
      expect(result.results[1].error).toBeDefined();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle template not found error', async () => {
      const templateError = {
        status: 'error',
        code: 'TEMPLATE_NOT_FOUND',
        message: 'Template "non-existent" not found',
        availableTemplates: ['default-html', 'github-markdown'],
      };

      mockGenerationService.generateDocumentation.mockRejectedValue(
        templateError
      );

      await expect(
        mockGenerationService.generateDocumentation({
          data: { apiSpec: {} },
          template: { name: 'non-existent' },
          output: { format: 'html' },
        })
      ).rejects.toEqual(templateError);
    });

    test('should handle unsupported output format', async () => {
      const formatError = {
        status: 'error',
        code: 'UNSUPPORTED_FORMAT',
        message: 'Output format "xml" is not supported',
        supportedFormats: ['html', 'markdown', 'pdf', 'json', 'yaml'],
      };

      mockGenerationService.generateDocumentation.mockRejectedValue(
        formatError
      );

      await expect(
        mockGenerationService.generateDocumentation({
          data: { apiSpec: {} },
          template: { name: 'default-html' },
          output: { format: 'xml' as any },
        })
      ).rejects.toEqual(formatError);
    });

    test('should handle large file generation limits', async () => {
      const sizeError = {
        status: 'error',
        code: 'FILE_SIZE_LIMIT',
        message: 'Generated documentation exceeds size limit',
        details: {
          generatedSize: 52428800, // 50MB
          maxSize: 41943040, // 40MB
        },
      };

      mockGenerationService.generateDocumentation.mockRejectedValue(sizeError);

      await expect(
        mockGenerationService.generateDocumentation({
          data: {
            apiSpec: {
              // Large spec that would generate oversized documentation
              openapi: '3.0.0',
              info: { title: 'Large API' },
            },
          },
          template: { name: 'default-html' },
          output: { format: 'html' },
        })
      ).rejects.toEqual(sizeError);
    });
  });
});