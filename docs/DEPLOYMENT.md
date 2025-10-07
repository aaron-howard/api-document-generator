# Deployment Instructions

> ⚠️ **Windows-Only Deployment**  
> All deployment scenarios described in this document are intended **exclusively for Windows environments**. Docker, Kubernetes, or Linux-based deployment targets referenced previously are deprecated for this repository. Any non-Windows usage is out of scope and unsupported.

This guide covers various deployment scenarios for the API Documentation Generator, from simple standalone installations to enterprise-scale containerized deployments.

## Table of Contents

- [Overview](#overview)
- [Standalone Deployment](#standalone-deployment)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Cloud Deployments](#cloud-deployments)
- [CI/CD Integration](#cicd-integration)
- [Monitoring and Logging](#monitoring-and-logging)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

## Overview

The API Documentation Generator can be deployed in several ways:

1. **Standalone CLI Tool**: Direct installation on development machines or servers
2. **Docker Container**: Containerized deployment for consistency and isolation
3. **Kubernetes Cluster**: Scalable deployment with orchestration
4. **Cloud Services**: Platform-specific deployments (AWS, GCP, Azure)
5. **CI/CD Pipeline**: Automated documentation generation in build pipelines

## Standalone Deployment

### Server Requirements

**Minimum Requirements (Windows Only):**
- CPU: 2 cores
- RAM: 4GB
- Storage: 10GB available space
- OS: Windows 10 or Windows Server 2019+
- Node.js: 18.0.0 or higher (Windows build)

**Recommended for Production (Windows):**
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 50GB+ SSD
- Network: 1Gbps connection for AI service access

### Installation Steps

1. **Install Node.js and npm**
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # CentOS/RHEL
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs
   
   # macOS (using Homebrew)
   brew install node@18
   
   # Windows (using Chocolatey)
   choco install nodejs --version=18.0.0
   ```

2. **Install the API Documentation Generator**
   ```bash
   # Global installation
   npm install -g api-documentation-generator
   
   # Verify installation
   api-doc-gen --version
   api-doc-gen --help
   ```

3. **Configure the system service (Linux)**
   ```bash
   # Create service user
   sudo useradd --system --create-home --shell /bin/bash api-doc-gen
   
   # Create service file
   sudo tee /etc/systemd/system/api-doc-gen.service > /dev/null <<EOF
   [Unit]
   Description=API Documentation Generator Service
   After=network.target
   
   [Service]
   Type=simple
   User=api-doc-gen
   WorkingDirectory=/home/api-doc-gen
   ExecStart=/usr/bin/api-doc-gen serve --port 3000 --host 0.0.0.0
   Restart=always
   RestartSec=10
   StandardOutput=syslog
   StandardError=syslog
   SyslogIdentifier=api-doc-gen
   Environment=NODE_ENV=production
   Environment=PORT=3000
   
   [Install]
   WantedBy=multi-user.target
   EOF
   
   # Enable and start service
   sudo systemctl enable api-doc-gen
   sudo systemctl start api-doc-gen
   sudo systemctl status api-doc-gen
   ```

4. **Configure reverse proxy (nginx)**
   ```nginx
   # /etc/nginx/sites-available/api-doc-gen
   server {
       listen 80;
       server_name docs.example.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
           
           # File upload limits
           client_max_body_size 50M;
           
           # Timeouts
           proxy_connect_timeout 60s;
           proxy_send_timeout 60s;
           proxy_read_timeout 60s;
       }
       
       # Serve static documentation files
       location /docs/ {
           alias /var/www/api-docs/;
           expires 1h;
           add_header Cache-Control "public, immutable";
       }
   }
   
   # Enable site
   sudo ln -s /etc/nginx/sites-available/api-doc-gen /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## Docker Deployment

### Docker Image

The official Docker image is available at `api-doc-gen/api-documentation-generator`.

#### Basic Docker Run

```bash
# Pull the latest image
docker pull api-doc-gen/api-documentation-generator:latest

# Run with basic configuration
docker run -d \
  --name api-doc-gen \
  -p 3000:3000 \
  -v $(pwd)/config:/app/config \
  -v $(pwd)/output:/app/output \
  -e NODE_ENV=production \
  -e OPENAI_API_KEY=your-api-key \
  api-doc-gen/api-documentation-generator:latest

# Check logs
docker logs api-doc-gen

# Stop container
docker stop api-doc-gen
```

#### Custom Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  api-doc-gen:
    image: api-doc-gen/api-documentation-generator:latest
    container_name: api-doc-gen
    ports:
      - "3000:3000"
    volumes:
      - ./config:/app/config:ro
      - ./input:/app/input:ro
      - ./output:/app/output
      - ./templates:/app/templates:ro
      - ./cache:/app/cache
    environment:
      - NODE_ENV=production
      - PORT=3000
      - CACHE_ENABLED=true
      - CACHE_DIRECTORY=/app/cache
      - LOG_LEVEL=info
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    depends_on:
      - redis
      
  redis:
    image: redis:7-alpine
    container_name: api-doc-gen-redis
    volumes:
      - redis_data:/data
    restart: unless-stopped
    command: redis-server --appendonly yes
    
  nginx:
    image: nginx:alpine
    container_name: api-doc-gen-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./output:/var/www/docs:ro
    depends_on:
      - api-doc-gen
    restart: unless-stopped

volumes:
  redis_data:
```

#### Build Custom Image

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS runtime

# Install system dependencies
RUN apk add --no-cache \
    curl \
    git \
    python3 \
    make \
    g++

# Create app user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

# Copy dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=appuser:appgroup . .

# Build application
RUN npm run build

# Set permissions
RUN chown -R appuser:appgroup /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run custom image
docker build -t my-api-doc-gen .
docker run -d --name my-api-doc-gen -p 3000:3000 my-api-doc-gen
```

## Kubernetes Deployment

### Basic Kubernetes Manifests

#### Namespace

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: api-doc-gen
  labels:
    name: api-doc-gen
```

#### ConfigMap

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-doc-gen-config
  namespace: api-doc-gen
data:
  config.js: |
    module.exports = {
      project: {
        name: process.env.PROJECT_NAME || 'API Documentation',
        version: process.env.PROJECT_VERSION || '1.0.0'
      },
      input: {
        sources: JSON.parse(process.env.INPUT_SOURCES || '[]')
      },
      output: {
        formats: ['html', 'markdown'],
        directory: '/app/output'
      },
      processing: {
        concurrent: true,
        maxConcurrency: parseInt(process.env.MAX_CONCURRENCY || '4'),
        cache: {
          enabled: process.env.CACHE_ENABLED === 'true',
          directory: '/app/cache'
        }
      },
      ai: {
        provider: process.env.AI_PROVIDER || 'openai',
        model: process.env.AI_MODEL || 'gpt-4',
        enabled: process.env.AI_ENABLED === 'true'
      }
    };
```

#### Secret

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: api-doc-gen-secret
  namespace: api-doc-gen
type: Opaque
data:
  # Base64 encoded values
  openai-api-key: <base64-encoded-api-key>
  github-token: <base64-encoded-github-token>
```

#### Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-doc-gen
  namespace: api-doc-gen
  labels:
    app: api-doc-gen
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: api-doc-gen
  template:
    metadata:
      labels:
        app: api-doc-gen
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3000"
        prometheus.io/path: "/metrics"
    spec:
      containers:
      - name: api-doc-gen
        image: api-doc-gen/api-documentation-generator:latest
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3000"
        - name: CACHE_ENABLED
          value: "true"
        - name: AI_ENABLED
          value: "true"
        - name: MAX_CONCURRENCY
          value: "4"
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-doc-gen-secret
              key: openai-api-key
        - name: GITHUB_TOKEN
          valueFrom:
            secretKeyRef:
              name: api-doc-gen-secret
              key: github-token
        volumeMounts:
        - name: config
          mountPath: /app/config
          readOnly: true
        - name: cache
          mountPath: /app/cache
        - name: output
          mountPath: /app/output
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        lifecycle:
          preStop:
            exec:
              command: ["/bin/sh", "-c", "sleep 15"]
      volumes:
      - name: config
        configMap:
          name: api-doc-gen-config
      - name: cache
        emptyDir:
          sizeLimit: 10Gi
      - name: output
        persistentVolumeClaim:
          claimName: api-doc-gen-output
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - api-doc-gen
              topologyKey: kubernetes.io/hostname
```

#### Service and Ingress

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: api-doc-gen-service
  namespace: api-doc-gen
  labels:
    app: api-doc-gen
spec:
  selector:
    app: api-doc-gen
  ports:
  - name: http
    port: 80
    targetPort: 3000
    protocol: TCP
  type: ClusterIP

---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-doc-gen-ingress
  namespace: api-doc-gen
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "300"
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
  - hosts:
    - docs.example.com
    secretName: api-doc-gen-tls
  rules:
  - host: docs.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-doc-gen-service
            port:
              number: 80
```

#### Persistent Volume

```yaml
# pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: api-doc-gen-output
  namespace: api-doc-gen
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 50Gi
  storageClassName: fast-ssd
```

### Helm Chart

```yaml
# Chart.yaml
apiVersion: v2
name: api-doc-gen
description: API Documentation Generator Helm Chart
type: application
version: 1.0.0
appVersion: "1.0.0"
```

```yaml
# values.yaml
replicaCount: 3

image:
  repository: api-doc-gen/api-documentation-generator
  tag: latest
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: docs.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: api-doc-gen-tls
      hosts:
        - docs.example.com

resources:
  limits:
    cpu: 1000m
    memory: 2Gi
  requests:
    cpu: 500m
    memory: 1Gi

persistence:
  enabled: true
  size: 50Gi
  storageClass: fast-ssd

config:
  ai:
    enabled: true
    provider: openai
    model: gpt-4
  cache:
    enabled: true
  processing:
    maxConcurrency: 4
```

```bash
# Deploy with Helm
helm install api-doc-gen ./chart -f values.yaml
helm upgrade api-doc-gen ./chart -f values.yaml
```

## Cloud Deployments

### AWS Deployment

#### ECS Fargate

```json
{
  "family": "api-doc-gen",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "api-doc-gen",
      "image": "api-doc-gen/api-documentation-generator:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "PORT", "value": "3000"},
        {"name": "CACHE_ENABLED", "value": "true"}
      ],
      "secrets": [
        {
          "name": "OPENAI_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:api-doc-gen/openai-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/api-doc-gen",
          "awslogs-region": "us-west-2",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

#### Lambda Function

```javascript
// lambda/index.js
const { ApiDocumentationGenerator } = require('api-documentation-generator');

exports.handler = async (event) => {
  try {
    const config = JSON.parse(event.body);
    const generator = new ApiDocumentationGenerator(config);
    const result = await generator.generate();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack
      })
    };
  }
};
```

### Google Cloud Platform

#### Cloud Run

```yaml
# cloudrun.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: api-doc-gen
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/maxScale: "10"
        run.googleapis.com/cpu-throttling: "false"
        run.googleapis.com/execution-environment: gen2
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      containers:
      - image: gcr.io/project-id/api-doc-gen:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
        - name: PORT
          value: "3000"
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: openai-api-key
              key: key
        resources:
          limits:
            cpu: "2"
            memory: "4Gi"
          requests:
            cpu: "1"
            memory: "2Gi"
```

```bash
# Deploy to Cloud Run
gcloud run deploy api-doc-gen \
  --image gcr.io/project-id/api-doc-gen:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --max-instances 10 \
  --memory 4Gi \
  --cpu 2 \
  --timeout 300
```

### Azure Deployment

#### Container Instances

```json
{
  "location": "eastus",
  "properties": {
    "containers": [
      {
        "name": "api-doc-gen",
        "properties": {
          "image": "apidocgen.azurecr.io/api-documentation-generator:latest",
          "ports": [
            {
              "protocol": "TCP",
              "port": 3000
            }
          ],
          "environmentVariables": [
            {
              "name": "NODE_ENV",
              "value": "production"
            },
            {
              "name": "PORT",
              "value": "3000"
            }
          ],
          "resources": {
            "requests": {
              "memoryInGB": 2,
              "cpu": 1
            }
          }
        }
      }
    ],
    "osType": "Linux",
    "restartPolicy": "Always",
    "ipAddress": {
      "type": "Public",
      "ports": [
        {
          "protocol": "TCP",
          "port": 3000
        }
      ]
    }
  }
}
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy API Documentation Generator

on:
  push:
    branches: [main]
  release:
    types: [published]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm test
    - run: npm run lint
    - run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: docker/setup-buildx-action@v2
    - uses: docker/login-action@v2
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    - uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: staging
    steps:
    - uses: azure/k8s-set-context@v3
      with:
        method: kubeconfig
        kubeconfig: ${{ secrets.KUBE_CONFIG }}
    - uses: azure/k8s-deploy@v1
      with:
        namespace: api-doc-gen-staging
        manifests: |
          k8s/deployment.yaml
          k8s/service.yaml
          k8s/ingress.yaml
        images: |
          ghcr.io/${{ github.repository }}:${{ github.sha }}

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'release'
    environment: production
    steps:
    - uses: azure/k8s-set-context@v3
      with:
        method: kubeconfig
        kubeconfig: ${{ secrets.KUBE_CONFIG }}
    - uses: azure/k8s-deploy@v1
      with:
        namespace: api-doc-gen
        manifests: |
          k8s/deployment.yaml
          k8s/service.yaml
          k8s/ingress.yaml
        images: |
          ghcr.io/${{ github.repository }}:${{ github.sha }}
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

test:
  stage: test
  image: node:18
  cache:
    paths:
      - node_modules/
  script:
    - npm ci
    - npm test
    - npm run lint
    - npm run type-check
  artifacts:
    reports:
      junit: test-results.xml
      coverage: coverage/cobertura-coverage.xml

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  only:
    - main
    - tags

deploy_staging:
  stage: deploy
  image: alpine/kubectl:latest
  environment:
    name: staging
    url: https://docs-staging.example.com
  script:
    - kubectl config use-context staging
    - kubectl set image deployment/api-doc-gen api-doc-gen=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - kubectl rollout status deployment/api-doc-gen
  only:
    - main

deploy_production:
  stage: deploy
  image: alpine/kubectl:latest
  environment:
    name: production
    url: https://docs.example.com
  script:
    - kubectl config use-context production
    - kubectl set image deployment/api-doc-gen api-doc-gen=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - kubectl rollout status deployment/api-doc-gen
  when: manual
  only:
    - tags
```

## Monitoring and Logging

### Prometheus Metrics

```javascript
// monitoring/metrics.js
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

const generationDuration = new prometheus.Histogram({
  name: 'documentation_generation_duration_seconds',
  help: 'Duration of documentation generation in seconds',
  labelNames: ['format', 'source_type']
});

const activeGenerations = new prometheus.Gauge({
  name: 'active_generations_total',
  help: 'Number of active documentation generations'
});

const aiRequestsTotal = new prometheus.Counter({
  name: 'ai_requests_total',
  help: 'Total number of AI service requests',
  labelNames: ['provider', 'model', 'status']
});

module.exports = {
  httpRequestDuration,
  generationDuration,
  activeGenerations,
  aiRequestsTotal
};
```

### Grafana Dashboard

```json
{
  "dashboard": {
    "title": "API Documentation Generator",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_request_duration_seconds_count[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "title": "Generation Duration",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(documentation_generation_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Active Generations",
        "type": "singlestat",
        "targets": [
          {
            "expr": "active_generations_total"
          }
        ]
      }
    ]
  }
}
```

### ELK Stack Configuration

```yaml
# logstash.conf
input {
  beats {
    port => 5044
  }
}

filter {
  if [fields][service] == "api-doc-gen" {
    json {
      source => "message"
    }
    
    date {
      match => [ "timestamp", "ISO8601" ]
    }
    
    if [level] == "error" {
      mutate {
        add_tag => ["error"]
      }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "api-doc-gen-%{+YYYY.MM.dd}"
  }
}
```

## Security Considerations

### Security Checklist

1. **Container Security**
   - Use non-root user in containers
   - Scan images for vulnerabilities
   - Use minimal base images
   - Keep dependencies updated

2. **Network Security**
   - Use TLS/SSL for all communications
   - Implement proper firewall rules
   - Use private networks where possible
   - Enable rate limiting

3. **Secrets Management**
   - Use external secret management (Vault, AWS Secrets Manager)
   - Never store secrets in images or code
   - Rotate secrets regularly
   - Use least privilege access

4. **Input Validation**
   - Validate all inputs
   - Sanitize file paths
   - Limit file upload sizes
   - Implement CSRF protection

### Security Configuration

```yaml
# security-policy.yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: api-doc-gen-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
```

## Troubleshooting

### Common Issues

1. **Memory Issues**
   ```bash
   # Check memory usage
   kubectl top pods -n api-doc-gen
   
   # Increase memory limits
   kubectl patch deployment api-doc-gen -p '{"spec":{"template":{"spec":{"containers":[{"name":"api-doc-gen","resources":{"limits":{"memory":"4Gi"}}}]}}}}'
   ```

2. **Performance Issues**
   ```bash
   # Check CPU usage
   kubectl top pods -n api-doc-gen
   
   # Scale horizontally
   kubectl scale deployment api-doc-gen --replicas=5
   
   # Check AI service response times
   kubectl logs deployment/api-doc-gen | grep "AI_REQUEST_DURATION"
   ```

3. **Storage Issues**
   ```bash
   # Check disk usage
   kubectl exec deployment/api-doc-gen -- df -h
   
   # Clean cache
   kubectl exec deployment/api-doc-gen -- rm -rf /app/cache/*
   
   # Resize PVC
   kubectl patch pvc api-doc-gen-output -p '{"spec":{"resources":{"requests":{"storage":"100Gi"}}}}'
   ```

### Debug Commands

```bash
# Get pod logs
kubectl logs -f deployment/api-doc-gen -n api-doc-gen

# Access pod shell
kubectl exec -it deployment/api-doc-gen -n api-doc-gen -- /bin/sh

# Check service endpoints
kubectl get endpoints api-doc-gen-service -n api-doc-gen

# Describe pod for events
kubectl describe pod -l app=api-doc-gen -n api-doc-gen

# Port forward for local testing
kubectl port-forward service/api-doc-gen-service 3000:80 -n api-doc-gen
```

### Health Checks

```bash
# Health check endpoint
curl http://localhost:3000/health

# Readiness check
curl http://localhost:3000/ready

# Metrics endpoint
curl http://localhost:3000/metrics

# Version information
curl http://localhost:3000/version
```

---

This deployment guide covers the major deployment scenarios for the API Documentation Generator. Choose the approach that best fits your infrastructure and requirements.