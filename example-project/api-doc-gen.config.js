module.exports = {
  project: {
    name: 'Sample API Documentation',
    version: '1.0.0',
    description: 'Documentation for the Sample API'
  },
  input: {
    sources: [
      {
        type: 'openapi',
        path: './specs/sample-api.yaml',
        enabled: true
      }
    ]
  },
  output: {
    formats: ['html', 'markdown'],
    directory: './docs'
  },
  ai: {
    provider: 'openai',
    model: 'gpt-4',
    enabled: true,
    temperature: 0.3
  },
  processing: {
    cache: {
      enabled: true
    }
  }
};