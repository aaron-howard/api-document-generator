# Data Model: API Document Generator

## Core Entities

### DocumentationProject
Represents a complete documentation generation project with all its configuration and metadata.

**Attributes**:
- `id`: Unique identifier for the project
- `name`: Human-readable project name
- `version`: Semantic version of the current documentation
- `description`: Brief description of the API being documented
- `baseUrl`: Base URL for the API (if applicable)
- `inputSources`: Array of input source configurations
- `outputFormats`: Array of enabled output format configurations
- `configuration`: Project-specific settings and overrides
- `metadata`: Additional metadata (tags, authors, last updated)

**Relationships**:
- Has many InputSources
- Has many OutputFormats
- Has one Configuration
- Has many GenerationSessions

**Validation Rules**:
- Name must be non-empty and unique within workspace
- Version must follow semantic versioning format
- At least one input source must be configured
- At least one output format must be enabled

### InputSource
Represents a source of API information that can be parsed and processed.

**Attributes**:
- `id`: Unique identifier for the input source
- `type`: Source type (openapi, jsdoc, python-docstring, go-doc, etc.)
- `path`: File path or directory containing the source
- `include`: Glob patterns for files to include
- `exclude`: Glob patterns for files to exclude
- `parserConfig`: Parser-specific configuration options
- `priority`: Processing priority for conflicting information
- `enabled`: Whether this source is currently active

**Relationships**:
- Belongs to DocumentationProject
- Has many ParsedEndpoints
- Has many ParsedSchemas

**State Transitions**:
- inactive → parsing → parsed → error
- Supports incremental updates when source files change

### ParsedEndpoint
Represents a single API endpoint extracted from source code or specifications.

**Attributes**:
- `id`: Unique identifier for the endpoint
- `method`: HTTP method (GET, POST, PUT, DELETE, etc.)
- `path`: URL path with parameter placeholders
- `summary`: Brief description of the endpoint purpose
- `description`: Detailed description of endpoint behavior
- `parameters`: Array of parameter definitions
- `requestBody`: Request body schema and examples
- `responses`: Map of response codes to schema definitions
- `tags`: Categorization tags for grouping
- `deprecated`: Whether the endpoint is deprecated
- `security`: Security requirements for the endpoint
- `examples`: Request/response examples
- `sourceLocation`: Reference to source code location

**Relationships**:
- Belongs to InputSource
- Has many Parameters
- Has many ResponseDefinitions
- Has one or more AISummaries
- References ParsedSchemas

**Validation Rules**:
- Method must be valid HTTP method
- Path must be valid URL pattern
- At least one response definition required
- Security requirements must reference valid schemes

### Parameter
Represents a parameter for an API endpoint (query, path, header, etc.).

**Attributes**:
- `id`: Unique identifier
- `name`: Parameter name
- `in`: Parameter location (query, path, header, cookie)
- `description`: Parameter description
- `required`: Whether the parameter is required
- `schema`: Data type and validation rules
- `example`: Example value
- `deprecated`: Whether the parameter is deprecated

**Relationships**:
- Belongs to ParsedEndpoint

### ResponseDefinition
Represents a possible response from an API endpoint.

**Attributes**:
- `statusCode`: HTTP status code
- `description`: Response description
- `schema`: Response body schema
- `headers`: Response headers definition
- `examples`: Example response bodies

**Relationships**:
- Belongs to ParsedEndpoint
- References ParsedSchemas

### ParsedSchema
Represents a data schema (object, array, primitive) used in API definitions.

**Attributes**:
- `id`: Unique identifier
- `name`: Schema name (if named)
- `type`: Schema type (object, array, string, number, etc.)
- `properties`: Object properties (for object types)
- `items`: Item schema (for array types)
- `required`: Required property names (for objects)
- `description`: Schema description
- `example`: Example data conforming to schema
- `validation`: Validation rules (min/max, pattern, etc.)

**Relationships**:
- Used by ParsedEndpoints
- Used by Parameters
- Used by ResponseDefinitions
- Can reference other ParsedSchemas

### AISummary
Represents AI-generated content for documentation enhancement.

**Attributes**:
- `id`: Unique identifier
- `targetType`: Type of content being summarized (endpoint, schema, module)
- `targetId`: ID of the target entity
- `summaryType`: Type of summary (overview, usage, examples)
- `content`: Generated summary content
- `accuracy`: Accuracy score from validation
- `humanReviewed`: Whether human has reviewed/approved
- `generatedAt`: Timestamp of generation
- `model`: AI model used for generation
- `prompt`: Prompt used for generation

**Relationships**:
- Belongs to ParsedEndpoint or ParsedSchema
- Has one HumanReview (optional)

### HumanReview
Represents human review and override of AI-generated content.

**Attributes**:
- `id`: Unique identifier
- `reviewerId`: ID of the reviewer
- `status`: Review status (pending, approved, rejected, modified)
- `feedback`: Reviewer feedback and comments
- `modifiedContent`: Human-modified content (if applicable)
- `reviewedAt`: Timestamp of review

**Relationships**:
- Belongs to AISummary

### GenerationSession
Represents a single documentation generation run.

**Attributes**:
- `id`: Unique identifier
- `startTime`: Generation start timestamp
- `endTime`: Generation completion timestamp
- `status`: Generation status (running, completed, failed)
- `inputHash`: Hash of input sources for change detection
- `outputPath`: Path where documentation was generated
- `format`: Output format used
- `errors`: Array of errors encountered
- `warnings`: Array of warnings generated
- `metrics`: Performance metrics (processing time, endpoint count, etc.)

**Relationships**:
- Belongs to DocumentationProject
- Has many GenerationLogs

### GenerationLog
Represents individual log entries from documentation generation.

**Attributes**:
- `id`: Unique identifier
- `level`: Log level (debug, info, warn, error)
- `timestamp`: Log entry timestamp
- `message`: Log message
- `context`: Additional context data
- `component`: Component that generated the log

**Relationships**:
- Belongs to GenerationSession

### Configuration
Represents project-wide configuration settings.

**Attributes**:
- `themes`: Theme and styling configuration
- `aiSettings`: AI summarization configuration
- `outputSettings`: Output format specific settings
- `parserSettings`: Parser-specific configurations
- `securitySettings`: Access control and privacy settings
- `performanceSettings`: Caching and performance tuning
- `integrationSettings`: CI/CD and external tool configuration

**Relationships**:
- Belongs to DocumentationProject

### ChangelogEntry
Represents a detected change between API versions.

**Attributes**:
- `id`: Unique identifier
- `changeType`: Type of change (added, modified, removed, deprecated)
- `severity`: Change severity (major, minor, patch)
- `category`: Change category (endpoint, schema, parameter)
- `targetPath`: Path/identifier of changed element
- `oldValue`: Previous value (if applicable)
- `newValue`: New value (if applicable)
- `description`: Human-readable change description
- `breakingChange`: Whether this is a breaking change
- `detectedAt`: Timestamp of change detection

**Relationships**:
- References previous and current ParsedEndpoints or ParsedSchemas

### Plugin
Represents an installed plugin for extending functionality.

**Attributes**:
- `id`: Unique identifier
- `name`: Plugin name
- `version`: Plugin version
- `type`: Plugin type (parser, generator, processor, theme)
- `enabled`: Whether plugin is active
- `configuration`: Plugin-specific configuration
- `dependencies`: Required plugin dependencies

**Relationships**:
- Can extend InputSource types
- Can extend OutputFormat types
- Can extend processing pipeline

## Entity Relationships Diagram

```
DocumentationProject
├── InputSources[]
│   ├── ParsedEndpoints[]
│   │   ├── Parameters[]
│   │   ├── ResponseDefinitions[]
│   │   └── AISummaries[]
│   │       └── HumanReview?
│   └── ParsedSchemas[]
├── Configuration
├── GenerationSessions[]
│   └── GenerationLogs[]
├── ChangelogEntries[]
└── Plugins[]
```

## Data Flow and Lifecycle

### Parsing Phase
1. InputSources are processed by appropriate parsers
2. ParsedEndpoints and ParsedSchemas are extracted
3. Validation rules are applied to ensure data integrity
4. Cross-references between entities are established

### Enhancement Phase
1. AI summaries are generated for endpoints and schemas
2. Human review workflow is initiated (if configured)
3. Content is validated for accuracy and completeness

### Generation Phase
1. GenerationSession is created with current input hash
2. Templates are applied to generate output formats
3. GenerationLogs capture detailed processing information
4. Output files are written to specified locations

### Change Detection Phase
1. Input hash comparison identifies potential changes
2. Semantic comparison generates ChangelogEntries
3. Breaking changes are flagged for special attention
4. Change notifications are sent (if configured)

## Validation and Integrity Rules

### Cross-Entity Validation
- All schema references must point to valid ParsedSchema entities
- Parameter and response schemas must be internally consistent
- AI summaries must reference existing endpoints or schemas

### Business Rules
- Each endpoint must have at least one response definition
- Required parameters cannot be marked as deprecated
- Breaking changes must include migration guidance
- Human reviews override AI-generated content

### Performance Considerations
- Lazy loading of large schema definitions
- Incremental parsing for changed files only
- Caching of expensive AI generation operations
- Batch processing for bulk operations