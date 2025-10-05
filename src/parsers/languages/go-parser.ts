/**
 * Go Documentation Parser Implementation
 * 
 * Parses Go documentation comments (godoc format) into standardized AST format.
 * Supports function documentation, struct documentation, and API endpoint extraction.
 */

import { IParser, ParseRequest, ParseResponse, ValidationResponse, ParseError, StandardizedAST } from '../parser-service';
import { ApiSpecification, ApiSpecFormat, ApiEndpoint, HttpMethod } from '../../core/models/api-spec';
import { DataModel, SchemaType } from '../../core/models/schema';

/**
 * Go Documentation Parser class implementing IParser interface
 */
export class GoDocParser implements IParser {
  readonly type = 'go-doc';
  readonly supportedExtensions = ['.go'];

  /**
   * Check if this parser can handle the given request
   */
  canParse(request: ParseRequest): boolean {
    if (request.type !== 'go-doc') {
      return false;
    }

    // Check file extension
    const path = request.path.toLowerCase();
    return this.supportedExtensions.some(ext => path.endsWith(ext));
  }

  /**
   * Parse Go documentation comments into standardized AST format
   */
  async parse(request: ParseRequest): Promise<ParseResponse> {
    const parseId = this.generateParseId();
    const startTime = Date.now();

    try {
      // Load and parse the source file
      const source = await this.loadSource(request);
      
      // Extract Go documentation comments
      const docComments = this.extractDocComments(source);
      
      // Parse comments into structured data
      const parsedDocs = await this.parseDocComments(docComments);

      // Convert to standardized AST
      const ast = await this.convertToAST(parsedDocs, request);

      const endTime = Date.now();
      const parseTime = (endTime - startTime) / 1000;

      return {
        status: 'success',
        parseId,
        ast: {
          endpoints: ast.endpoints,
          schemas: ast.schemas,
          components: ast.components,
          metadata: ast.metadata
        },
        metadata: {
          sourceType: 'go-doc',
          version: '1.0.0',
          endpointCount: ast.endpoints.length,
          schemaCount: ast.schemas.length,
          parseTime,
          fileSize: source.length
        }
      };

    } catch (error) {
      return this.handleParseError(error, parseId);
    }
  }

  /**
   * Validate parsed Go documentation AST
   */
  async validate(ast: any, rules?: string[]): Promise<ValidationResponse> {
    const violations: ValidationResponse['violations'] = [];

    // Standard Go documentation validation rules
    if (!rules || rules.includes('godoc-format')) {
      this.validateGodocFormat(ast, violations);
    }

    if (!rules || rules.includes('function-documentation')) {
      this.validateFunctionDocumentation(ast, violations);
    }

    if (!rules || rules.includes('struct-documentation')) {
      this.validateStructDocumentation(ast, violations);
    }

    return {
      valid: violations.filter(v => v.severity === 'error').length === 0,
      ...(violations.length > 0 && { violations })
    };
  }

  // Private implementation methods

  private async loadSource(request: ParseRequest): Promise<string> {
    switch (request.source) {
      case 'file':
        return await this.loadFromFile(request.path);
      case 'content':
        return request.path;
      default:
        throw new ParseError(
          `Unsupported source type for Go: ${request.source}`,
          'UNSUPPORTED_SOURCE'
        );
    }
  }

  private async loadFromFile(_path: string): Promise<string> {
    // Placeholder for file loading - would use fs.readFileSync or similar
    // For now, return mock Go code with godoc comments
    return `
// Package user provides REST API endpoints for user management operations.
// It supports user creation, retrieval, updating, and deletion with proper
// error handling and validation.
//
// Routes:
//   GET    /api/users     - Get all users
//   POST   /api/users     - Create a new user
//   GET    /api/users/{id} - Get user by ID
//   PUT    /api/users/{id} - Update user
//   DELETE /api/users/{id} - Delete user
//
// Author: API Documentation Generator
// Version: 1.0.0
package user

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

// User represents a user in the system with all necessary fields for
// user management and authentication.
type User struct {
	// ID is the unique identifier for the user
	ID int \`json:"id" db:"id"\`
	
	// Name is the full name of the user (2-100 characters)
	Name string \`json:"name" db:"name" validate:"required,min=2,max=100"\`
	
	// Email is the email address of the user (must be unique)
	Email string \`json:"email" db:"email" validate:"required,email"\`
	
	// PasswordHash is the hashed password for authentication
	PasswordHash string \`json:"-" db:"password_hash"\`
	
	// CreatedAt is the timestamp when user was created
	CreatedAt time.Time \`json:"created_at" db:"created_at"\`
	
	// UpdatedAt is the timestamp when user was last updated
	UpdatedAt time.Time \`json:"updated_at" db:"updated_at"\`
	
	// IsActive indicates whether the user account is active
	IsActive bool \`json:"is_active" db:"is_active"\`
}

// UserCreateRequest contains the necessary fields required to create a new user account.
// All fields are required unless specified otherwise.
type UserCreateRequest struct {
	// Name is the full name of the user (2-100 characters)
	Name string \`json:"name" validate:"required,min=2,max=100"\`
	
	// Email is a valid email address (must be unique)
	Email string \`json:"email" validate:"required,email"\`
	
	// Password is the plain text password (minimum 8 characters)
	Password string \`json:"password" validate:"required,min=8"\`
}

// UserResponse represents the user data returned in API responses.
// Excludes sensitive fields like password hash.
type UserResponse struct {
	ID        int       \`json:"id"\`
	Name      string    \`json:"name"\`
	Email     string    \`json:"email"\`
	CreatedAt time.Time \`json:"created_at"\`
	UpdatedAt time.Time \`json:"updated_at"\`
	IsActive  bool      \`json:"is_active"\`
}

// ErrorResponse represents an error response returned by the API.
type ErrorResponse struct {
	// Error is the error message
	Error string \`json:"error"\`
	
	// Code is the error code for programmatic handling
	Code string \`json:"code,omitempty"\`
	
	// Details provides additional error context
	Details map[string]interface{} \`json:"details,omitempty"\`
}

// GetUsers retrieves a list of all users with optional pagination support.
// Returns active users only by default.
//
// Route: GET /api/users
//
// Query Parameters:
//   limit  - Maximum number of users to return (optional, default: no limit)
//   offset - Number of users to skip for pagination (optional, default: 0)
//
// Returns:
//   200 OK - List of users in JSON format
//   400 Bad Request - Invalid query parameters
//   500 Internal Server Error - Database or server error
//
// Example:
//   GET /api/users?limit=10&offset=0
//   Response: [{"id": 1, "name": "John Doe", "email": "john@example.com", ...}]
func GetUsers(w http.ResponseWriter, r *http.Request) {
	// Parse query parameters
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")
	
	var limit int
	var offset int
	var err error
	
	if limitStr != "" {
		limit, err = strconv.Atoi(limitStr)
		if err != nil || limit < 0 {
			writeErrorResponse(w, http.StatusBadRequest, "invalid_limit", "Limit must be a non-negative integer")
			return
		}
	}
	
	if offsetStr != "" {
		offset, err = strconv.Atoi(offsetStr)
		if err != nil || offset < 0 {
			writeErrorResponse(w, http.StatusBadRequest, "invalid_offset", "Offset must be a non-negative integer")
			return
		}
	}
	
	// Implementation placeholder - would fetch from database
	users := []UserResponse{
		{
			ID:        1,
			Name:      "John Doe",
			Email:     "john@example.com",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
			IsActive:  true,
		},
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

// CreateUser creates a new user account with validation and duplicate email checking.
// Validates the input data, hashes the password, and creates a new user record.
//
// Route: POST /api/users
//
// Request Body:
//   JSON object containing name, email, and password fields
//
// Returns:
//   201 Created - User successfully created, returns user data (excluding password)
//   400 Bad Request - Validation error or malformed JSON
//   409 Conflict - Email already exists in the system
//   500 Internal Server Error - Database or server error
//
// Example:
//   POST /api/users
//   Body: {"name": "Alice Johnson", "email": "alice@example.com", "password": "my_password"}
//   Response: {"id": 123, "name": "Alice Johnson", "email": "alice@example.com", ...}
func CreateUser(w http.ResponseWriter, r *http.Request) {
	var req UserCreateRequest
	
	// Parse JSON request body
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErrorResponse(w, http.StatusBadRequest, "invalid_json", "Invalid JSON in request body")
		return
	}
	
	// Validate required fields
	if req.Name == "" {
		writeErrorResponse(w, http.StatusBadRequest, "missing_name", "Name is required")
		return
	}
	
	if req.Email == "" {
		writeErrorResponse(w, http.StatusBadRequest, "missing_email", "Email is required")
		return
	}
	
	if req.Password == "" {
		writeErrorResponse(w, http.StatusBadRequest, "missing_password", "Password is required")
		return
	}
	
	// Implementation placeholder - would create user in database
	user := UserResponse{
		ID:        123,
		Name:      req.Name,
		Email:     req.Email,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		IsActive:  true,
	}
	
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

// GetUserByID retrieves a specific user by their ID.
// Searches for a user with the given ID and returns user data if found.
//
// Route: GET /api/users/{id}
//
// Path Parameters:
//   id - The unique identifier of the user (must be positive integer)
//
// Returns:
//   200 OK - User found and returned in JSON format
//   400 Bad Request - Invalid user ID format
//   404 Not Found - User not found or inactive
//   500 Internal Server Error - Database or server error
//
// Example:
//   GET /api/users/123
//   Response: {"id": 123, "name": "John Doe", "email": "john@example.com", ...}
func GetUserByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	
	// Parse user ID
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		writeErrorResponse(w, http.StatusBadRequest, "invalid_user_id", "User ID must be a positive integer")
		return
	}
	
	// Implementation placeholder - would fetch from database
	if id == 123 {
		user := UserResponse{
			ID:        123,
			Name:      "John Doe",
			Email:     "john@example.com",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
			IsActive:  true,
		}
		
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(user)
		return
	}
	
	writeErrorResponse(w, http.StatusNotFound, "user_not_found", "User not found")
}

// UpdateUser updates an existing user's information with partial update support.
// Updates the specified user with the provided data. Only provided fields will be updated.
//
// Route: PUT /api/users/{id}
//
// Path Parameters:
//   id - The unique identifier of the user to update (must be positive integer)
//
// Request Body:
//   JSON object containing fields to update (name, email, is_active supported)
//
// Returns:
//   200 OK - User updated successfully, returns updated user data
//   400 Bad Request - Invalid user ID or request data
//   404 Not Found - User not found
//   409 Conflict - Email already exists (if email being updated)
//   500 Internal Server Error - Database or server error
//
// Example:
//   PUT /api/users/123
//   Body: {"name": "John Smith"}
//   Response: {"id": 123, "name": "John Smith", "email": "john@example.com", ...}
func UpdateUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	
	// Parse user ID
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		writeErrorResponse(w, http.StatusBadRequest, "invalid_user_id", "User ID must be a positive integer")
		return
	}
	
	var updateData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		writeErrorResponse(w, http.StatusBadRequest, "invalid_json", "Invalid JSON in request body")
		return
	}
	
	// Implementation placeholder - would update user in database
	user := UserResponse{
		ID:        id,
		Name:      "Updated Name",
		Email:     "updated@example.com",
		CreatedAt: time.Now().Add(-24 * time.Hour),
		UpdatedAt: time.Now(),
		IsActive:  true,
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// DeleteUser deletes a user account by marking them as inactive.
// Performs soft delete by setting is_active to false rather than removing the record.
//
// Route: DELETE /api/users/{id}
//
// Path Parameters:
//   id - The unique identifier of the user to delete (must be positive integer)
//
// Returns:
//   200 OK - User deleted successfully
//   400 Bad Request - Invalid user ID format
//   404 Not Found - User not found or already inactive
//   500 Internal Server Error - Database or server error
//
// Example:
//   DELETE /api/users/123
//   Response: {"message": "User deleted successfully"}
func DeleteUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	
	// Parse user ID
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		writeErrorResponse(w, http.StatusBadRequest, "invalid_user_id", "User ID must be a positive integer")
		return
	}
	
	// Implementation placeholder - would soft delete user in database
	response := map[string]string{
		"message": "User deleted successfully",
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// writeErrorResponse is a helper function to write consistent error responses.
func writeErrorResponse(w http.ResponseWriter, statusCode int, code, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	
	errorResp := ErrorResponse{
		Error: message,
		Code:  code,
	}
	
	json.NewEncoder(w).Encode(errorResp)
}
`;
  }

  private extractDocComments(source: string): any[] {
    const comments: any[] = [];
    
    // Patterns for different Go constructs with comments
    const patterns = [
      // Package comment
      { type: 'package', regex: /\/\/\s*Package\s+(\w+)[\s\S]*?(?=package\s+\w+)/g },
      // Type (struct) comment
      { type: 'type', regex: /\/\/\s*(\w+)\s+[\s\S]*?(?=type\s+\w+\s+struct)/g },
      // Function comment
      { type: 'function', regex: /\/\/\s*(\w+)\s+[\s\S]*?(?=func\s+\w+)/g }
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.regex.exec(source)) !== null) {
        const commentText = match[0];
        const name = this.extractNameFromComment(commentText, pattern.type);
        
        comments.push({
          type: pattern.type,
          name: name || 'unknown',
          comment: commentText,
          location: this.getLineColumn(source, match.index)
        });
      }
    }

    return comments;
  }

  private extractNameFromComment(comment: string, type: string): string {
    const lines = comment.split('\n').map(line => line.trim());
    
    for (const line of lines) {
      if (type === 'package' && line.includes('Package ')) {
        const match = line.match(/Package\s+(\w+)/);
        return match?.[1] || '';
      }
      
      if (type === 'function' && !line.startsWith('//')) {
        const match = line.match(/func\s+(\w+)/);
        return match?.[1] || '';
      }
      
      if (type === 'type' && !line.startsWith('//')) {
        const match = line.match(/type\s+(\w+)/);
        return match?.[1] || '';
      }
    }

    return '';
  }

  private getLineColumn(source: string, index: number): { line: number; column: number } {
    const lines = source.substring(0, index).split('\n');
    return {
      line: lines.length,
      column: (lines[lines.length - 1] || '').length + 1
    };
  }

  private async parseDocComments(comments: any[]): Promise<any[]> {
    const parsedComments: any[] = [];

    for (const comment of comments) {
      try {
        const parsed = this.parseComment(comment);
        if (parsed) {
          parsedComments.push(parsed);
        }
      } catch (error) {
        // Log error but continue parsing other comments
        // console.warn(`Failed to parse Go comment: ${error}`);
      }
    }

    return parsedComments;
  }

  private parseComment(comment: any): any | null {
    const { type, name, comment: content, location } = comment;
    
    if (!content?.trim()) {
      return null;
    }

    const parsed: any = {
      type,
      name,
      location,
      description: '',
      summary: '',
      sections: {}
    };

    // Parse Go-style comments
    const lines = content
      .split('\n')
      .map((line: string) => line.replace(/^\/\/\s?/, '').trim())
      .filter((line: string) => line);

    if (lines.length === 0) {
      return null;
    }

    // First line is typically the summary
    parsed.summary = lines[0];
    
    // Parse different sections
    let currentSection = 'description';
    let sectionContent: string[] = [];

    for (const line of lines) {
      // Check for section headers
      if (this.isSectionHeader(line)) {
        // Save previous section
        if (sectionContent.length > 0) {
          this.saveSection(parsed, currentSection, sectionContent);
          sectionContent = [];
        }

        currentSection = this.getSectionName(line);
      } else {
        sectionContent.push(line);
      }
    }

    // Save last section
    if (sectionContent.length > 0) {
      this.saveSection(parsed, currentSection, sectionContent);
    }

    parsed.description = (parsed.sections.description || []).join(' ').trim();

    return parsed;
  }

  private isSectionHeader(line: string): boolean {
    const sectionHeaders = [
      'Route:', 'Routes:', 'Endpoint:', 'Endpoints:',
      'Parameters:', 'Params:', 'Args:', 'Arguments:',
      'Returns:', 'Return:', 'Response:', 'Responses:',
      'Example:', 'Examples:', 'Usage:',
      'Errors:', 'Error:', 'Panics:', 'Panic:',
      'Query Parameters:', 'Path Parameters:', 'Request Body:',
      'HTTP Status Codes:'
    ];

    return sectionHeaders.some(header => 
      line.toLowerCase().includes(header.toLowerCase())
    );
  }

  private getSectionName(line: string): string {
    if (line.toLowerCase().includes('route')) return 'route';
    if (line.toLowerCase().includes('param')) return 'parameters';
    if (line.toLowerCase().includes('return')) return 'returns';
    if (line.toLowerCase().includes('response')) return 'responses';
    if (line.toLowerCase().includes('example')) return 'examples';
    if (line.toLowerCase().includes('error')) return 'errors';
    if (line.toLowerCase().includes('query')) return 'query_parameters';
    if (line.toLowerCase().includes('path')) return 'path_parameters';
    if (line.toLowerCase().includes('request body')) return 'request_body';
    if (line.toLowerCase().includes('status')) return 'status_codes';
    
    return 'description';
  }

  private saveSection(parsed: any, sectionName: string, content: string[]): void {
    const cleanContent = content.filter(line => line.trim());
    
    if (cleanContent.length === 0) {
      return;
    }

    switch (sectionName) {
      case 'route':
        parsed.sections.route = this.parseRouteSection(cleanContent);
        break;
      case 'parameters':
      case 'query_parameters':
      case 'path_parameters':
        parsed.sections.parameters = this.parseParametersSection(cleanContent);
        break;
      case 'returns':
      case 'responses':
      case 'status_codes':
        parsed.sections.responses = this.parseResponsesSection(cleanContent);
        break;
      case 'examples':
        parsed.sections.examples = cleanContent;
        break;
      default:
        parsed.sections[sectionName] = cleanContent;
        break;
    }
  }

  private parseRouteSection(lines: string[]): any {
    for (const line of lines) {
      const routeMatch = line.match(/(\w+)\s+([\/\w{}-]+)/);
      if (routeMatch) {
        const [, method, path] = routeMatch;
        return {
          method: (method || '').toUpperCase(),
          path
        };
      }
    }
    
    return null;
  }

  private parseParametersSection(lines: string[]): any[] {
    const parameters: any[] = [];
    
    for (const line of lines) {
      // Parse parameter definitions like "id - The unique identifier"
      const paramMatch = line.match(/^(\w+)\s*-\s*(.*)$/);
      if (paramMatch) {
        const [, name, description] = paramMatch;
        parameters.push({
          name,
          description: (description || '').trim(),
          required: !(description || '').toLowerCase().includes('optional'),
          type: 'string' // Default type, could be enhanced with more parsing
        });
      }
    }
    
    return parameters;
  }

  private parseResponsesSection(lines: string[]): any[] {
    const responses: any[] = [];
    
    for (const line of lines) {
      // Parse response definitions like "200 OK - Success response"
      const responseMatch = line.match(/^(\d+)\s+([^-]+)\s*-\s*(.*)$/);
      if (responseMatch) {
        const [, statusCode, statusText, description] = responseMatch;
        responses.push({
          statusCode,
          statusText: (statusText || '').trim(),
          description: (description || '').trim()
        });
      }
    }
    
    return responses;
  }

  private async convertToAST(parsedDocs: any[], request: ParseRequest): Promise<StandardizedAST> {
    const endpoints = this.extractEndpoints(parsedDocs);
    const schemas = this.extractSchemas(parsedDocs);
    const components = this.extractComponents(parsedDocs);
    const metadata = this.extractMetadata(parsedDocs, request);

    // Create ApiSpecification
    const spec: ApiSpecification = {
      id: this.generateSpecId(),
      format: ApiSpecFormat.GO_GODOC,
      version: '1.0.0',
      metadata: {
        title: 'Go API',
        description: 'API documentation extracted from Go documentation comments',
        version: '1.0.0'
      },
      endpoints,
      dataModels: schemas,
      security: [],
      servers: [],
      tags: []
    };

    return {
      spec,
      endpoints: endpoints.map(e => this.endpointToPlainObject(e)),
      schemas,
      components,
      metadata
    };
  }

  private extractEndpoints(parsedDocs: any[]): ApiEndpoint[] {
    const endpoints: ApiEndpoint[] = [];

    for (const doc of parsedDocs) {
      if (doc.type !== 'function') {
        continue;
      }

      // Look for route information in comment
      const routeInfo = doc.sections?.route || this.inferRouteFromFunction(doc.name);
      if (!routeInfo) {
        continue;
      }

      const endpoint: ApiEndpoint = {
        id: `${routeInfo.method}_${doc.name}`,
        path: routeInfo.path,
        method: this.parseHttpMethod(routeInfo.method),
        summary: doc.summary,
        description: doc.description,
        tags: [],
        parameters: this.extractParameters(doc),
        responses: this.extractResponses(doc),
        deprecated: false
      };

      endpoints.push(endpoint);
    }

    return endpoints;
  }

  private inferRouteFromFunction(functionName: string): any | null {
    const name = functionName.toLowerCase();
    
    if (name.startsWith('get') && name.includes('byid')) {
      return {
        method: 'GET',
        path: `/api/${name.replace('get', '').replace('byid', '').toLowerCase()}/{id}`
      };
    }
    
    if (name.startsWith('get')) {
      return {
        method: 'GET',
        path: `/api/${name.replace('get', '').toLowerCase()}`
      };
    }
    
    if (name.startsWith('create')) {
      return {
        method: 'POST',
        path: `/api/${name.replace('create', '').toLowerCase()}`
      };
    }
    
    if (name.startsWith('update')) {
      return {
        method: 'PUT',
        path: `/api/${name.replace('update', '').toLowerCase()}/{id}`
      };
    }
    
    if (name.startsWith('delete')) {
      return {
        method: 'DELETE',
        path: `/api/${name.replace('delete', '').toLowerCase()}/{id}`
      };
    }

    return null;
  }

  private extractSchemas(parsedDocs: any[]): DataModel[] {
    const schemas: DataModel[] = [];

    for (const doc of parsedDocs) {
      if (doc.type !== 'type') {
        continue;
      }

      // For Go structs, we would need to parse the actual struct definition
      // For now, create a basic schema based on the comment
      const schema: DataModel = {
        name: doc.name,
        schema: {
          type: SchemaType.OBJECT,
          description: doc.description,
          properties: {} // Would be populated by parsing struct tags
        },
        description: doc.description
      };

      schemas.push(schema);
    }

    return schemas;
  }

  private extractComponents(_parsedDocs: any[]): any[] {
    return [];
  }

  private extractMetadata(parsedDocs: any[], request: ParseRequest): Record<string, any> {
    const packageDoc = parsedDocs.find(doc => doc.type === 'package');

    return {
      sourceFile: request.path,
      package: packageDoc?.name || 'main',
      packageDescription: packageDoc?.description || '',
      commentCount: parsedDocs.length,
      functions: parsedDocs.filter(doc => doc.type === 'function').length,
      types: parsedDocs.filter(doc => doc.type === 'type').length
    };
  }

  private extractParameters(doc: any): any[] {
    const parameters: any[] = [];
    
    if (doc.sections?.parameters) {
      for (const param of doc.sections.parameters) {
        parameters.push({
          name: param.name,
          in: this.determineParameterLocation(param.name, doc.name),
          description: param.description,
          required: param.required,
          schema: {
            type: param.type || 'string'
          }
        });
      }
    }

    return parameters;
  }

  private extractResponses(doc: any): any[] {
    const responses: any[] = [];

    if (doc.sections?.responses) {
      for (const response of doc.sections.responses) {
        responses.push({
          statusCode: response.statusCode,
          description: response.description,
          content: {
            'application/json': {
              schema: { type: 'object' }
            }
          }
        });
      }
    } else {
      // Default success response
      responses.push({
        statusCode: '200',
        description: 'Successful response',
        content: {
          'application/json': {
            schema: { type: 'object' }
          }
        }
      });
    }

    return responses;
  }

  private parseHttpMethod(method: string): HttpMethod {
    const upperMethod = method.toUpperCase();
    switch (upperMethod) {
      case 'GET': return HttpMethod.GET;
      case 'POST': return HttpMethod.POST;
      case 'PUT': return HttpMethod.PUT;
      case 'PATCH': return HttpMethod.PATCH;
      case 'DELETE': return HttpMethod.DELETE;
      case 'HEAD': return HttpMethod.HEAD;
      case 'OPTIONS': return HttpMethod.OPTIONS;
      case 'TRACE': return HttpMethod.TRACE;
      default: return HttpMethod.GET;
    }
  }

  private determineParameterLocation(paramName: string, functionName: string): string {
    if (paramName === 'id' && functionName.toLowerCase().includes('byid')) {
      return 'path';
    }
    if (paramName.includes('limit') || paramName.includes('offset')) {
      return 'query';
    }
    return 'query';
  }

  private endpointToPlainObject(endpoint: ApiEndpoint): any {
    return {
      id: endpoint.id,
      path: endpoint.path,
      method: endpoint.method,
      summary: endpoint.summary,
      description: endpoint.description,
      tags: endpoint.tags,
      parameters: endpoint.parameters,
      responses: endpoint.responses,
      deprecated: endpoint.deprecated
    };
  }

  private generateParseId(): string {
    return `go_parse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSpecId(): string {
    return `go_spec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleParseError(error: any, parseId: string): ParseResponse {
    if (error instanceof ParseError) {
      return {
        status: 'failed',
        parseId,
        errors: [{
          status: 'error',
          code: error.code,
          message: error.message,
          details: error.details || {}
        }]
      };
    }

    return {
      status: 'failed',
      parseId,
      errors: [{
        status: 'error',
        code: 'PARSE_ERROR',
        message: (error as Error).message,
        details: {}
      }]
    };
  }

  // Validation methods

  private validateGodocFormat(ast: any, violations: ValidationResponse['violations']): void {
    if (!ast.metadata) {
      violations!.push({
        rule: 'godoc-format',
        message: 'Missing metadata in Go documentation AST',
        severity: 'error'
      });
    }

    if (ast.endpoints && Array.isArray(ast.endpoints)) {
      ast.endpoints.forEach((endpoint: any, index: number) => {
        if (!endpoint.summary && !endpoint.description) {
          violations!.push({
            rule: 'godoc-format',
            message: `Function at index ${index} missing documentation comment`,
            severity: 'warning'
          });
        }
      });
    }
  }

  private validateFunctionDocumentation(ast: any, violations: ValidationResponse['violations']): void {
    if (ast.endpoints && Array.isArray(ast.endpoints)) {
      ast.endpoints.forEach((endpoint: any) => {
        if (!endpoint.summary || endpoint.summary.length < 10) {
          violations!.push({
            rule: 'function-documentation',
            message: `Function ${endpoint.id} should have a descriptive summary`,
            severity: 'warning'
          });
        }

        if (!endpoint.responses || endpoint.responses.length === 0) {
          violations!.push({
            rule: 'function-documentation',
            message: `Function ${endpoint.id} should document return values`,
            severity: 'warning'
          });
        }
      });
    }
  }

  private validateStructDocumentation(ast: any, violations: ValidationResponse['violations']): void {
    if (ast.schemas && Array.isArray(ast.schemas)) {
      ast.schemas.forEach((schema: any) => {
        if (!schema.description || schema.description.length < 10) {
          violations!.push({
            rule: 'struct-documentation',
            message: `Type '${schema.name}' should have a descriptive comment`,
            severity: 'warning'
          });
        }
      });
    }
  }
}

export default GoDocParser;