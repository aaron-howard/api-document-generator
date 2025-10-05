// Jest setup file
import 'jest';

// Global test timeout
jest.setTimeout(30000);

// Mock console.log in tests unless explicitly needed
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

beforeEach(() => {
  // Suppress console output in tests unless VERBOSE_TESTS is set
  if (!process.env['VERBOSE_TESTS']) {
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  }
});

afterEach(() => {
  // Restore console functions
  console.log = originalConsoleLog;
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

// Extend global namespace for test utilities
declare global {
  var testUtils: {
    createMockEndpoint: () => any;
    createMockProject: () => any;
  };
}

// Global test utilities
(global as any).testUtils = {
  createMockEndpoint: () => ({
    id: 'test-endpoint-1',
    path: '/test',
    method: 'GET',
    summary: 'Test endpoint',
    description: 'A test endpoint for unit testing',
    parameters: [],
    responses: [{
      status: '200',
      description: 'Success',
      content: {
        'application/json': {
          schema: { type: 'object' }
        }
      }
    }],
    tags: ['test'],
    deprecated: false,
    sourceLocation: {
      file: 'test.ts',
      line: 1,
      column: 1
    }
  }),
  
  createMockProject: () => ({
    id: 'test-project-1',
    name: 'Test API',
    version: '1.0.0',
    description: 'Test API for unit testing',
    inputSources: [],
    outputFormats: [],
    configuration: {},
    metadata: {}
  })
};