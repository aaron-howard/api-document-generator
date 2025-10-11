# Deployment Guide

This guide covers various deployment scenarios for the API Documentation Generator, from simple standalone installations to enterprise-scale deployments.

## Table of Contents

- [Overview](#overview)
- [Standalone Deployment](#standalone-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployments](#cloud-deployments)
- [CI/CD Integration](#cicd-integration)
- [Monitoring and Logging](#monitoring-and-logging)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

## Overview

The API Documentation Generator can be deployed in several ways:

1. **Standalone CLI Tool**: Direct installation on development machines or servers
2. **Docker Container**: Containerized deployment for consistency and isolation
3. **Cloud Services**: Platform-specific deployments (AWS, GCP, Azure)
4. **CI/CD Pipeline**: Automated documentation generation in build pipelines
5. **API Gateway**: Web-based API for integration with other services

## Standalone Deployment

### Server Requirements

**Minimum Requirements:**
- CPU: 2 cores
- RAM: 4GB
- Storage: 10GB available space
- OS: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)
- Node.js: 18.0.0 or higher

**Recommended for Production:**
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 50GB+ SSD
- Network: 1Gbps connection for AI service access

### Installation Steps

1. **Install Node.js and npm**
   ```bash
   # Download and install Node.js 18+ from https://nodejs.org/
   node --version  # Should be 18.0.0 or higher
   npm --version
   ```

2. **Install the API Documentation Generator**
   ```bash
   # Clone the repository
   git clone https://github.com/your-org/api-documentation-generator.git
   cd api-documentation-generator
   
   # Install dependencies
   npm install
   
   # Build the project
   npm run build
   
   # Link globally (optional)
   npm link
   ```

3. **Verify Installation**
   ```bash
   api-doc-gen --version
   api-doc-gen --help
   ```

4. **Configure Environment Variables**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit .env with your configuration
   OPENAI_API_KEY=your-openai-api-key
   NODE_ENV=production
   ```

### Production Configuration

Create a production configuration file:

```javascript
// api-doc-gen.config.js
module.exports = {
  project: {
    name: 'Production API',
    version: '1.0.0',
    description: 'Production API documentation'
  },
  inputs: [
    {
      type: 'express',
      path: './src/routes',
      enabled: true
    }
  ],
  outputs: [
    {
      format: 'html',
      path: './docs',
      theme: 'modern'
    }
  ],
  processing: {
    concurrent: true,
    maxConcurrency: 4,
    cache: {
      enabled: true,
      directory: './.cache'
    }
  }
};
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S apidoc -u 1001

# Change ownership
RUN chown -R apidoc:nodejs /app
USER apidoc

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  api-doc-gen:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./docs:/app/docs
      - ./cache:/app/.cache
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./docs:/usr/share/nginx/html
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api-doc-gen
    restart: unless-stopped
```

### Build and Deploy

```bash
# Build the Docker image
docker build -t api-doc-generator .

# Run with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f api-doc-gen
```

## Cloud Deployments

### AWS Deployment

#### EC2 Instance

1. **Launch EC2 Instance**
   ```bash
   # Use Amazon Linux 2 or Ubuntu 20.04 LTS
   # Instance type: t3.medium or larger
   ```

2. **Install Dependencies**
   ```bash
   # Update system
   sudo yum update -y  # Amazon Linux
   # or
   sudo apt update && sudo apt upgrade -y  # Ubuntu
   
   # Install Node.js
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/your-org/api-documentation-generator.git
   cd api-documentation-generator
   
   # Install and build
   npm install
   npm run build
   
   # Set up systemd service
   sudo cp deployment/api-doc-gen.service /etc/systemd/system/
   sudo systemctl enable api-doc-gen
   sudo systemctl start api-doc-gen
   ```

#### ECS with Fargate

```yaml
# task-definition.json
{
  "family": "api-doc-generator",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "api-doc-generator",
      "image": "your-account.dkr.ecr.region.amazonaws.com/api-doc-generator:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "OPENAI_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:openai-api-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/api-doc-generator",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Google Cloud Platform

#### Cloud Run

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/api-doc-generator', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/api-doc-generator']
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'api-doc-generator'
      - '--image'
      - 'gcr.io/$PROJECT_ID/api-doc-generator'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
```

### Azure

#### Container Instances

```yaml
# azure-deploy.yaml
apiVersion: 2018-10-01
location: eastus
name: api-doc-generator
properties:
  containers:
  - name: api-doc-generator
    properties:
      image: your-registry.azurecr.io/api-doc-generator:latest
      resources:
        requests:
          cpu: 1
          memoryInGb: 2
      ports:
      - port: 3000
        protocol: TCP
  osType: Linux
  restartPolicy: Always
  ipAddress:
    type: Public
    ports:
    - protocol: TCP
      port: 3000
    dnsNameLabel: api-doc-generator
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy API Documentation

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Generate Documentation
        run: |
          npm ci
          npm run build
          api-doc-gen generate src/ --format html --output ./docs
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Generate Documentation') {
            steps {
                sh 'api-doc-gen generate src/ --format html --output ./docs'
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'aws s3 sync ./docs s3://your-bucket/docs --delete'
            }
        }
    }
}
```

## Monitoring and Logging

### Application Monitoring

```javascript
// monitoring.js
const express = require('express');
const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.json({
    requests: {
      total: metrics.totalRequests,
      successful: metrics.successfulRequests,
      failed: metrics.failedRequests
    },
    performance: {
      averageResponseTime: metrics.averageResponseTime,
      cacheHitRate: metrics.cacheHitRate
    }
  });
});
```

### Logging Configuration

```javascript
// logging.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api-doc-generator' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = logger;
```

### Prometheus Metrics

```javascript
// metrics.js
const promClient = require('prom-client');

// Create a Registry
const register = new promClient.Registry();

// Add default metrics
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const documentsGenerated = new promClient.Counter({
  name: 'documents_generated_total',
  help: 'Total number of documents generated',
  labelNames: ['format', 'source_type'],
  registers: [register]
});

module.exports = { register, httpRequestDuration, documentsGenerated };
```

## Security Considerations

### Environment Variables

```bash
# .env.production
NODE_ENV=production
OPENAI_API_KEY=your-secure-api-key
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=https://your-domain.com
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### Security Headers

```javascript
// security.js
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### API Key Management

```javascript
// auth.js
const rateLimit = require('express-rate-limit');

const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || !validApiKeys.includes(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api', limiter, apiKeyAuth);
```

## Troubleshooting

### Common Issues

#### High Memory Usage
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 dist/cli/index.js generate src/

# Monitor memory usage
node --inspect dist/cli/index.js generate src/
```

#### Slow Generation
```bash
# Enable caching
api-doc-gen generate src/ --cache --format html

# Increase concurrency
api-doc-gen generate src/ --concurrency 8 --format html

# Use AI selectively
api-doc-gen generate src/ --ai --format html
```

#### Docker Issues
```bash
# Check container logs
docker logs api-doc-generator

# Debug container
docker exec -it api-doc-generator sh

# Restart container
docker-compose restart api-doc-gen
```

### Performance Tuning

```javascript
// performance.js
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // Worker process
  require('./server.js');
}
```

### Backup and Recovery

```bash
# Backup configuration and cache
tar -czf backup-$(date +%Y%m%d).tar.gz \
  api-doc-gen.config.js \
  .env \
  .cache/ \
  docs/

# Restore from backup
tar -xzf backup-20240101.tar.gz
```

## Support

For deployment issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Review the [GitHub Issues](https://github.com/your-org/api-documentation-generator/issues)
3. Join our [Discord community](https://discord.gg/api-doc-gen)
4. Contact support at [support@api-doc-gen.com](mailto:support@api-doc-gen.com)
