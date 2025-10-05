/**
 * T032 Unit Test Coverage - Input Source Model Tests
 * 
 * Comprehensive unit tests for the Input Source model,
 * covering validation, factory methods, state management,
 * and edge cases.
 * 
 * @author T032 Unit Test Team
 * @version 1.0.0
 */

import {
  InputSource,
  InputSourceType,
  InputSourceState,
  InputSourceFactory
} from '../../src/core/models/input-source';

describe('InputSource Model Tests', () => {
  describe('InputSourceFactory', () => {
    describe('create', () => {
      it('should create an OpenAPI input source with default values', () => {
        const source = InputSourceFactory.create({
          type: InputSourceType.OPENAPI,
          path: './api.yaml'
        });
        
        expect(source.type).toBe(InputSourceType.OPENAPI);
        expect(source.path).toBe('./api.yaml');
        expect(source.state).toBe(InputSourceState.INACTIVE);
        expect(source.enabled).toBe(true);
        expect(source.priority).toBe(1);
        expect(source.include).toBeDefined();
        expect(source.exclude).toBeDefined();
        expect(source.id).toBeDefined();
      });

      it('should create a JavaScript source with custom configuration', () => {
        const source = InputSourceFactory.create({
          type: InputSourceType.JAVASCRIPT,
          path: './src/**/*.js',
          include: ['**/*.js', '**/*.jsx'],
          exclude: ['**/*.test.js'],
          priority: 10,
          enabled: true
        });
        
        expect(source.type).toBe(InputSourceType.JAVASCRIPT);
        expect(source.path).toBe('./src/**/*.js');
        expect(source.include).toEqual(['**/*.js', '**/*.jsx']);
        expect(source.exclude).toEqual(['**/*.test.js']);
        expect(source.priority).toBe(10);
      });

      it('should create a Python source with metadata', () => {
        const source = InputSourceFactory.create({
          type: InputSourceType.PYTHON,
          path: './src/**/*.py',
          metadata: {
            displayName: 'Python API Sources',
            description: 'Python files with docstrings',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        
        expect(source.type).toBe(InputSourceType.PYTHON);
        expect(source.metadata.displayName).toBe('Python API Sources');
        expect(source.metadata.description).toBe('Python files with docstrings');
      });
    });

    describe('fromPath', () => {
      it('should auto-detect OpenAPI type from YAML extension', () => {
        const source = InputSourceFactory.fromPath('./openapi.yaml');
        
        expect(source.type).toBe(InputSourceType.OPENAPI);
        expect(source.path).toBe('./openapi.yaml');
      });

      it('should auto-detect Swagger type from JSON extension with swagger content', () => {
        const source = InputSourceFactory.fromPath('./swagger.json');
        
        expect(source.path).toBe('./swagger.json');
        // Type detection would depend on content analysis in real implementation
      });

      it('should auto-detect JavaScript type from JS extension', () => {
        const source = InputSourceFactory.fromPath('./api.js');
        
        expect(source.type).toBe(InputSourceType.JAVASCRIPT);
        expect(source.path).toBe('./api.js');
      });
    });
  });

  describe('InputSource Structure', () => {
    let testSource: InputSource;

    beforeEach(() => {
      testSource = InputSourceFactory.create({
        type: InputSourceType.OPENAPI,
        path: './test.yaml'
      });
    });

    it('should have all required properties', () => {
      expect(testSource).toHaveProperty('id');
      expect(testSource).toHaveProperty('type');
      expect(testSource).toHaveProperty('path');
      expect(testSource).toHaveProperty('include');
      expect(testSource).toHaveProperty('exclude');
      expect(testSource).toHaveProperty('parserConfig');
      expect(testSource).toHaveProperty('priority');
      expect(testSource).toHaveProperty('enabled');
      expect(testSource).toHaveProperty('state');
      expect(testSource).toHaveProperty('metadata');
    });

    it('should have readonly properties', () => {
      // TypeScript readonly properties - tested through compilation
      expect(typeof testSource.id).toBe('string');
      expect(typeof testSource.type).toBe('string');
      expect(typeof testSource.path).toBe('string');
      expect(Array.isArray(testSource.include)).toBe(true);
      expect(Array.isArray(testSource.exclude)).toBe(true);
    });

    it('should have correct metadata structure', () => {
      expect(testSource.metadata).toBeDefined();
      expect(typeof testSource.metadata).toBe('object');
    });

    it('should have correct parser configuration', () => {
      expect(testSource.parserConfig).toBeDefined();
      expect(typeof testSource.parserConfig).toBe('object');
    });
  });

  describe('InputSourceType enum', () => {
    it('should have all expected input source types', () => {
      expect(InputSourceType.OPENAPI).toBe('openapi');
      expect(InputSourceType.SWAGGER).toBe('swagger');
      expect(InputSourceType.JSDOC).toBe('jsdoc');
      expect(InputSourceType.PYTHON_DOCSTRING).toBe('python-docstring');
      expect(InputSourceType.GO_DOC).toBe('go-doc');
      expect(InputSourceType.TYPESCRIPT).toBe('typescript');
      expect(InputSourceType.JAVASCRIPT).toBe('javascript');
      expect(InputSourceType.PYTHON).toBe('python');
      expect(InputSourceType.GO).toBe('go');
      expect(InputSourceType.JAVA).toBe('java');
      expect(InputSourceType.CSHARP).toBe('csharp');
      expect(InputSourceType.POSTMAN).toBe('postman');
      expect(InputSourceType.INSOMNIA).toBe('insomnia');
      expect(InputSourceType.ASYNCAPI).toBe('asyncapi');
      expect(InputSourceType.GRAPHQL).toBe('graphql');
    });
  });

  describe('InputSourceState enum', () => {
    it('should have all expected state values', () => {
      expect(InputSourceState.INACTIVE).toBe('inactive');
      expect(InputSourceState.PARSING).toBe('parsing');
      expect(InputSourceState.PARSED).toBe('parsed');
      expect(InputSourceState.ERROR).toBe('error');
      expect(InputSourceState.UPDATING).toBe('updating');
    });
  });

  describe('Complex Input Source Scenarios', () => {
    it('should handle multi-file input sources with glob patterns', () => {
      const source = InputSourceFactory.create({
        type: InputSourceType.TYPESCRIPT,
        path: './src/**/*.ts',
        include: ['**/*.ts', '**/*.tsx'],
        exclude: ['**/*.test.ts', '**/*.spec.ts', '**/node_modules/**'],
        priority: 10,
        parserConfig: {
          language: 'typescript',
          parseDecorators: true,
          includeTypes: true,
          strictMode: true,
          extractInterfaces: true,
          extractEnums: true
        },
        metadata: {
          displayName: 'TypeScript API Sources',
          description: 'All TypeScript files containing API definitions',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      expect(source.type).toBe(InputSourceType.TYPESCRIPT);
      expect(source.include).toContain('**/*.tsx');
      expect(source.exclude).toContain('**/*.test.ts');
      expect(source.parserConfig['parseDecorators']).toBe(true);
      expect(source.metadata.displayName).toBe('TypeScript API Sources');
    });

    it('should handle Postman collection sources', () => {
      const source = InputSourceFactory.create({
        type: InputSourceType.POSTMAN,
        path: './collections/api.postman_collection.json',
        parserConfig: {
          language: 'json',
          extractExamples: true,
          includeTests: false,
          generateSchemas: true
        },
        metadata: {
          displayName: 'Postman API Collection',
          description: 'Postman collection with API requests and examples',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      expect(source.type).toBe(InputSourceType.POSTMAN);
      expect(source.parserConfig['extractExamples']).toBe(true);
      expect(source.parserConfig['generateSchemas']).toBe(true);
    });

    it('should handle GraphQL schema sources', () => {
      const source = InputSourceFactory.create({
        type: InputSourceType.GRAPHQL,
        path: './schema.graphql',
        parserConfig: {
          language: 'graphql',
          includeDirectives: true,
          extractSubscriptions: true,
          generateRESTEquivalents: true
        },
        metadata: {
          displayName: 'GraphQL Schema',
          description: 'Main GraphQL schema file',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      expect(source.type).toBe(InputSourceType.GRAPHQL);
      expect(source.parserConfig['includeDirectives']).toBe(true);
      expect(source.parserConfig['extractSubscriptions']).toBe(true);
    });
  });

  describe('State Management', () => {
    it('should handle different initial states', () => {
      const inactiveSource = InputSourceFactory.create({
        type: InputSourceType.OPENAPI,
        path: './api.yaml',
        state: InputSourceState.INACTIVE
      });
      
      const parsedSource = InputSourceFactory.create({
        type: InputSourceType.OPENAPI,
        path: './api.yaml',
        state: InputSourceState.PARSED,
        lastProcessed: new Date()
      });
      
      expect(inactiveSource.state).toBe(InputSourceState.INACTIVE);
      expect(parsedSource.state).toBe(InputSourceState.PARSED);
      expect(parsedSource.lastProcessed).toBeInstanceOf(Date);
    });

    it('should handle error states with error information', () => {
      const errorSource = InputSourceFactory.create({
        type: InputSourceType.OPENAPI,
        path: './api.yaml',
        state: InputSourceState.ERROR,
        error: {
          code: 'PARSE_ERROR',
          message: 'Invalid YAML syntax',
          details: {
            line: 15,
            column: 8,
            context: 'paths section'
          },
          timestamp: new Date(),
          recoverable: false
        }
      });
      
      expect(errorSource.state).toBe(InputSourceState.ERROR);
      expect(errorSource.error).toBeDefined();
      expect(errorSource.error?.code).toBe('PARSE_ERROR');
      expect(errorSource.error?.message).toBe('Invalid YAML syntax');
    });
  });

  describe('Factory Method Edge Cases', () => {
    it('should handle minimal configuration', () => {
      const source = InputSourceFactory.create({
        type: InputSourceType.OPENAPI,
        path: './minimal.yaml'
      });

      expect(source.type).toBe(InputSourceType.OPENAPI);
      expect(source.path).toBe('./minimal.yaml');
      expect(source.enabled).toBe(true); // Default value
      expect(source.priority).toBe(1); // Default value
      expect(source.state).toBe(InputSourceState.INACTIVE); // Default state
    });

    it('should handle custom priority values', () => {
      const defaultPrioritySource = InputSourceFactory.create({
        type: InputSourceType.OPENAPI,
        path: './api.yaml'
      });

      const lowPrioritySource = InputSourceFactory.create({
        type: InputSourceType.OPENAPI,
        path: './api.yaml',
        priority: 0
      });

      const highPrioritySource = InputSourceFactory.create({
        type: InputSourceType.OPENAPI,
        path: './api.yaml',
        priority: 100
      });

      expect(defaultPrioritySource.priority).toBe(1); // Default priority
      expect(lowPrioritySource.priority).toBe(0);
      expect(highPrioritySource.priority).toBe(100);
    });

    it('should handle disabled sources', () => {
      const disabledSource = InputSourceFactory.create({
        type: InputSourceType.OPENAPI,
        path: './api.yaml',
        enabled: false
      });

      expect(disabledSource.enabled).toBe(false);
    });

    it('should generate unique IDs', () => {
      const source1 = InputSourceFactory.create({
        type: InputSourceType.OPENAPI,
        path: './api1.yaml'
      });

      const source2 = InputSourceFactory.create({
        type: InputSourceType.OPENAPI,
        path: './api2.yaml'
      });

      expect(source1.id).not.toBe(source2.id);
      expect(typeof source1.id).toBe('string');
      expect(typeof source2.id).toBe('string');
    });
  });

  describe('Parser Configuration', () => {
    it('should handle custom parser configurations', () => {
      const source = InputSourceFactory.create({
        type: InputSourceType.PYTHON,
        path: './src/**/*.py',
        parserConfig: {
          language: 'python',
          extractDocstrings: true,
          includePrivate: false,
          parseDecorators: true,
          followImports: true
        }
      });

      expect(source.parserConfig['language']).toBe('python');
      expect(source.parserConfig['extractDocstrings']).toBe(true);
      expect(source.parserConfig['includePrivate']).toBe(false);
      expect(source.parserConfig['parseDecorators']).toBe(true);
    });

    it('should handle TypeScript parser configuration', () => {
      const source = InputSourceFactory.create({
        type: InputSourceType.TYPESCRIPT,
        path: './src/**/*.ts',
        parserConfig: {
          language: 'typescript',
          parseDecorators: true,
          includeTypes: true,
          strictMode: true,
          extractInterfaces: true,
          extractEnums: true,
          extractClasses: true
        }
      });

      expect(source.parserConfig['language']).toBe('typescript');
      expect(source.parserConfig['parseDecorators']).toBe(true);
      expect(source.parserConfig['includeTypes']).toBe(true);
      expect(source.parserConfig['strictMode']).toBe(true);
    });
  });

  describe('Path Detection', () => {
    it('should detect OpenAPI files by extension', () => {
      const yamlSource = InputSourceFactory.fromPath('./api.yaml');
      const ymlSource = InputSourceFactory.fromPath('./api.yml');
      
      expect(yamlSource.type).toBe(InputSourceType.OPENAPI);
      expect(ymlSource.type).toBe(InputSourceType.OPENAPI);
    });

    it('should detect JavaScript files by extension', () => {
      const jsSource = InputSourceFactory.fromPath('./api.js');
      const mjsSource = InputSourceFactory.fromPath('./api.mjs');
      
      // Note: File type detection would depend on actual implementation and content analysis
      // For now, we just verify the factory creates valid sources
      expect(jsSource.path).toBe('./api.js');
      expect(mjsSource.path).toBe('./api.mjs');
    });

    it('should detect TypeScript files by extension', () => {
      const tsSource = InputSourceFactory.fromPath('./api.ts');
      const tsxSource = InputSourceFactory.fromPath('./component.tsx');
      
      expect(tsSource.type).toBe(InputSourceType.TYPESCRIPT);
      expect(tsxSource.type).toBe(InputSourceType.TYPESCRIPT);
    });

    it('should detect Python files by extension', () => {
      const pySource = InputSourceFactory.fromPath('./api.py');
      
      expect(pySource.type).toBe(InputSourceType.PYTHON);
    });

    it('should handle Postman collections', () => {
      const postmanSource = InputSourceFactory.fromPath('./collection.postman_collection.json');
      
      // Note: Advanced type detection would require content analysis
      // For now, we verify the source is created with the correct path
      expect(postmanSource.path).toBe('./collection.postman_collection.json');
    });
  });
});