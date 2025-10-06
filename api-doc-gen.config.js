module.exports = {
  // Project metadata
  project: {
    name: 'My API Documentation',
    version: '1.0.0',
    description: 'API documentation generated with AI assistance',
    author: 'Your Name',
    license: 'MIT'
  },

  // Input sources configuration
  input: {
    sources: [
      {
        type: 'openapi',
        path: './specs/**/*.{yaml,yml,json}',
        priority: 1,
        enabled: true,
        parserConfig: {
          validateSpec: true,
          resolveReferences: true
        }
      },
      {
        type: 'typescript',
        path: './src/**/*.ts',
        include: ['**/*.ts'],
        exclude: ['**/*.test.ts', '**/*.spec.ts'],
        priority: 2,
        enabled: true
      }
    ]
  },

  // Output configuration
  output: {
    formats: ['html', 'markdown'],
    directory: './generated-docs',
    templates: {
      html: 'default'
    },
    styling: {
      theme: 'default',
      primaryColor: '#007bff'
    }
  },

  // AI enhancement configuration
  ai: {
    provider: 'openai',
    model: 'gpt-4',
    enabled: true,
    temperature: 0.3,
    maxTokens: 2000,
    enhancement: {
      improveDescriptions: true,
      generateExamples: true,
      addTags: true,
      generateSummaries: true
    }
  },

  // Processing options
  processing: {
    concurrent: true,
    maxConcurrency: 2,
    timeout: 30000,
    cache: {
      enabled: true,
      directory: './.cache'
    }
  }
};