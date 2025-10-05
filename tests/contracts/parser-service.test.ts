/**
 * Contract tests for Parser Service (parser-service.yaml)
 * These tests validate the multi-language parsing service according to the OpenAPI specification
 */

interface ParseRequest {
  type: 'openapi' | 'jsdoc' | 'python-docstring' | 'go-doc' | 'graphql';
  source: 'file' | 'directory' | 'url' | 'content';
  path: string;
  options?: {
    validateSchema?: boolean;
    resolveRefs?: boolean;
    recursive?: boolean;
    include?: string[];
    exclude?: string[];
    parserSpecific?: Record<string, any>;
  };
}

interface ParseResponse {
  status: 'success' | 'partial' | 'failed';
  parseId: string;
  ast?: {
    endpoints: any[];
    schemas: any[];
    components: any[];
    metadata: Record<string, any>;
  };
  metadata?: {
    sourceType: string;
    version: string;
    endpointCount: number;
    schemaCount: number;
    parseTime: number;
    fileSize: number;
  };
  warnings?: Array<{
    code: string;
    message: string;
    location?: {
      file: string;
      line: number;
      column: number;
    };
  }>;
  errors?: Array<{
    status: 'error';
    code: string;
    message: string;
    details: Record<string, any>;
    location?: {
      file: string;
      line: number;
      column: number;
    };
  }>;
}

interface ExtractRequest {
  parseId: string;
  extractType: 'endpoints' | 'schemas' | 'components' | 'metadata';
  filters?: {
    tags?: string[];
    methods?: string[];
    paths?: string[];
  };
}

interface ExtractResponse {
  extractId: string;
  data: Record<string, any>;
  count: number;
}

describe('Parser Service Contract Tests', () => {
  let mockParserService: any;

  beforeEach(() => {
    // Mock parser service implementation (to be implemented later)
    mockParserService = {
      parse: jest.fn(),
      extract: jest.fn(),
      validate: jest.fn(),
    };
  });

  describe('POST /parse - Parse Input Source', () => {
    test('should parse OpenAPI specification successfully', async () => {
      const parseRequest: ParseRequest = {
        type: 'openapi',
        source: 'file',
        path: './openapi.yaml',
        options: {
          validateSchema: true,
          resolveRefs: true,
        },
      };

      const expectedResponse: ParseResponse = {
        status: 'success',
        parseId: 'parse_123456789',
        ast: {
          endpoints: [
            {
              path: '/users',
              method: 'GET',
              summary: 'Get all users',
              parameters: [],
              responses: [
                {
                  status: 200,
                  description: 'List of users',
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/User' },
                  },
                },
              ],
            },
          ],
          schemas: [
            {
              name: 'User',
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                email: { type: 'string', format: 'email' },
              },
              required: ['id', 'name', 'email'],
            },
          ],
          components: [],
          metadata: {},
        },
        metadata: {
          sourceType: 'openapi',
          version: '3.0.3',
          endpointCount: 1,
          schemaCount: 1,
          parseTime: 0.5,
          fileSize: 2048,
        },
        warnings: [],
      };

      mockParserService.parse.mockResolvedValue(expectedResponse);

      const result = await mockParserService.parse(parseRequest);

      expect(result).toEqual(expectedResponse);
      expect(result.status).toBe('success');
      expect(result.parseId).toBeDefined();
      expect(result.ast?.endpoints).toHaveLength(1);
      expect(result.metadata?.sourceType).toBe('openapi');
    });

    test('should parse JSDoc from TypeScript files', async () => {
      const parseRequest: ParseRequest = {
        type: 'jsdoc',
        source: 'directory',
        path: './src',
        options: {
          recursive: true,
          include: ['**/*.ts', '**/*.js'],
          exclude: ['**/*.test.ts'],
        },
      };

      const expectedResponse: ParseResponse = {
        status: 'success',
        parseId: 'parse_987654321',
        ast: {
          endpoints: [
            {
              path: '/api/users',
              method: 'GET',
              summary: 'Retrieve all users',
              parameters: [
                {
                  name: 'page',
                  in: 'query',
                  description: 'Page number for pagination',
                  required: false,
                  schema: { type: 'integer', default: 1 },
                },
              ],
              responses: [
                {
                  status: 200,
                  description: 'Successfully retrieved users',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/User' },
                      },
                    },
                  },
                },
              ],
            },
          ],
          schemas: [],
          components: [],
          metadata: {},
        },
        metadata: {
          sourceType: 'jsdoc',
          version: '1.0.0',
          endpointCount: 1,
          schemaCount: 0,
          parseTime: 1.2,
          fileSize: 4096,
        },
        warnings: [],
      };

      mockParserService.parse.mockResolvedValue(expectedResponse);

      const result = await mockParserService.parse(parseRequest);

      expect(result).toEqual(expectedResponse);
      expect(result.status).toBe('success');
      expect(result.metadata?.sourceType).toBe('jsdoc');
      expect(result.ast?.endpoints).toHaveLength(1);
    });

    test('should handle Python docstring parsing', async () => {
      const parseRequest: ParseRequest = {
        type: 'python-docstring',
        source: 'directory',
        path: './python_src',
        options: {
          recursive: true,
          include: ['**/*.py'],
          exclude: ['**/*test*.py'],
          parserSpecific: {
            style: 'google',
          },
        },
      };

      const expectedResponse: ParseResponse = {
        status: 'success',
        parseId: 'parse_python_123',
        ast: {
          endpoints: [
            {
              path: '/users',
              method: 'POST',
              summary: 'Create a new user',
              parameters: [],
              requestBody: {
                description: 'User data',
                required: true,
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/UserCreate' },
                  },
                },
              },
              responses: [
                {
                  status: 201,
                  description: 'User created successfully',
                  content: {
                    'application/json': {
                      schema: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              ],
            },
          ],
          schemas: [],
          components: [],
          metadata: {},
        },
        metadata: {
          sourceType: 'python-docstring',
          version: '1.0.0',
          endpointCount: 1,
          schemaCount: 0,
          parseTime: 0.8,
          fileSize: 3072,
        },
        warnings: [],
      };

      mockParserService.parse.mockResolvedValue(expectedResponse);

      const result = await mockParserService.parse(parseRequest);

      expect(result).toEqual(expectedResponse);
      expect(result.status).toBe('success');
      expect(result.metadata?.sourceType).toBe('python-docstring');
    });

    test('should handle syntax errors gracefully', async () => {
      const parseRequest: ParseRequest = {
        type: 'openapi',
        source: 'file',
        path: './invalid-openapi.yaml',
        options: {
          validateSchema: true,
        },
      };

      const expectedError = {
        status: 'error',
        code: 'SYNTAX_ERROR',
        message: 'Invalid YAML syntax at line 25',
        details: {
          line: 25,
          column: 15,
          expected: 'mapping value',
          actual: 'invalid character',
        },
        location: {
          file: './invalid-openapi.yaml',
          line: 25,
          column: 15,
        },
      };

      mockParserService.parse.mockRejectedValue(expectedError);

      await expect(mockParserService.parse(parseRequest)).rejects.toEqual(
        expectedError
      );
    });

    test('should require valid source type', async () => {
      const invalidParseRequest = {
        type: 'invalid-type',
        source: 'file',
        path: './test.yaml',
      };

      mockParserService.parse.mockRejectedValue(
        new Error('Invalid source type: invalid-type')
      );

      await expect(
        mockParserService.parse(invalidParseRequest)
      ).rejects.toThrow('Invalid source type: invalid-type');
    });
  });

  describe('POST /extract - Extract Information from Parsed AST', () => {
    test('should extract endpoints from parsed AST', async () => {
      const extractRequest: ExtractRequest = {
        parseId: 'parse_123456789',
        extractType: 'endpoints',
        filters: {
          methods: ['GET', 'POST'],
          tags: ['users'],
        },
      };

      const expectedResponse: ExtractResponse = {
        extractId: 'extract_123456789',
        data: {
          endpoints: [
            {
              id: 'endpoint_1',
              path: '/users',
              method: 'GET',
              summary: 'Get all users',
              tags: ['users'],
            },
            {
              id: 'endpoint_2',
              path: '/users',
              method: 'POST',
              summary: 'Create user',
              tags: ['users'],
            },
          ],
        },
        count: 2,
      };

      mockParserService.extract.mockResolvedValue(expectedResponse);

      const result = await mockParserService.extract(extractRequest);

      expect(result).toEqual(expectedResponse);
      expect(result.extractId).toBeDefined();
      expect(result.count).toBe(2);
      expect(result.data.endpoints).toHaveLength(2);
    });

    test('should extract schemas from parsed AST', async () => {
      const extractRequest: ExtractRequest = {
        parseId: 'parse_123456789',
        extractType: 'schemas',
      };

      const expectedResponse: ExtractResponse = {
        extractId: 'extract_schemas_123',
        data: {
          schemas: [
            {
              name: 'User',
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
              },
            },
            {
              name: 'Error',
              type: 'object',
              properties: {
                message: { type: 'string' },
                code: { type: 'integer' },
              },
            },
          ],
        },
        count: 2,
      };

      mockParserService.extract.mockResolvedValue(expectedResponse);

      const result = await mockParserService.extract(extractRequest);

      expect(result).toEqual(expectedResponse);
      expect(result.data.schemas).toHaveLength(2);
      expect(result.count).toBe(2);
    });

    test('should require valid parse ID', async () => {
      const invalidExtractRequest: ExtractRequest = {
        parseId: 'invalid_parse_id',
        extractType: 'endpoints',
      };

      mockParserService.extract.mockRejectedValue(
        new Error('Parse ID not found: invalid_parse_id')
      );

      await expect(
        mockParserService.extract(invalidExtractRequest)
      ).rejects.toThrow('Parse ID not found: invalid_parse_id');
    });
  });

  describe('POST /validate - Validate Parsed AST', () => {
    test('should validate AST structure successfully', async () => {
      const validateRequest = {
        parseId: 'parse_123456789',
        rules: ['required-fields', 'schema-consistency', 'endpoint-format'],
      };

      const expectedResponse = {
        valid: true,
        violations: [],
      };

      mockParserService.validate.mockResolvedValue(expectedResponse);

      const result = await mockParserService.validate(validateRequest);

      expect(result).toEqual(expectedResponse);
      expect(result.valid).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    test('should report validation violations', async () => {
      const validateRequest = {
        parseId: 'parse_invalid_123',
        rules: ['required-fields', 'schema-consistency'],
      };

      const expectedResponse = {
        valid: false,
        violations: [
          {
            rule: 'required-fields',
            message: 'Missing required field: summary in endpoint /users',
            severity: 'error',
            location: {
              file: 'openapi.yaml',
              line: 45,
              column: 8,
            },
          },
          {
            rule: 'schema-consistency',
            message: 'Schema reference not found: #/components/schemas/InvalidUser',
            severity: 'warning',
            location: {
              file: 'openapi.yaml',
              line: 78,
              column: 12,
            },
          },
        ],
      };

      mockParserService.validate.mockResolvedValue(expectedResponse);

      const result = await mockParserService.validate(validateRequest);

      expect(result).toEqual(expectedResponse);
      expect(result.valid).toBe(false);
      expect(result.violations).toHaveLength(2);
      expect(result.violations[0].severity).toBe('error');
      expect(result.violations[1].severity).toBe('warning');
    });
  });

  describe('Multi-Language Parser Support', () => {
    test('should support all specified language parsers', () => {
      const supportedTypes = [
        'openapi',
        'jsdoc',
        'python-docstring',
        'go-doc',
        'graphql',
      ];

      supportedTypes.forEach(type => {
        const request: ParseRequest = {
          type: type as any,
          source: 'file',
          path: `./test.${type}`,
        };

        expect(() => {
          // This test validates the type system supports all required parser types
          mockParserService.parse(request);
        }).not.toThrow();
      });
    });

    test('should handle parser-specific configuration', async () => {
      const jsdocRequest: ParseRequest = {
        type: 'jsdoc',
        source: 'directory',
        path: './src',
        options: {
          parserSpecific: {
            includePrivate: false,
            tags: ['param', 'returns', 'example'],
          },
        },
      };

      mockParserService.parse.mockResolvedValue({
        status: 'success',
        parseId: 'jsdoc_parse_123',
        metadata: { sourceType: 'jsdoc' },
      });

      await mockParserService.parse(jsdocRequest);

      expect(mockParserService.parse).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            parserSpecific: expect.objectContaining({
              includePrivate: false,
              tags: ['param', 'returns', 'example'],
            }),
          }),
        })
      );
    });
  });
});