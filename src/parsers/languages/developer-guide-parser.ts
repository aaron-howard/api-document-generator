/**
 * Developer Guide Parser Implementation
 * 
 * Parses developer documentation files (CONTRIBUTING.md, DEVELOPMENT.md, etc.)
 * into standardized AST format. Extracts setup instructions, project structure,
 * code conventions, testing guidelines, and CI/CD configuration.
 */

import { IParser, ParseRequest, ParseResponse, ValidationResponse, StandardizedAST } from '../parser-service';
import { ApiSpecification, HttpMethod } from '../../core/models/api-spec';

/**
 * Developer Guide Parser class implementing IParser interface
 */
export class DeveloperGuideParser implements IParser {
  readonly type = 'developer-guide';
  readonly supportedExtensions = ['.md', '.txt', '.rst'];

  /**
   * Check if this parser can handle the given request
   */
  canParse(request: ParseRequest): boolean {
    if (request.type !== 'developer-guide') {
      return false;
    }

    // Check file extension
    const path = request.path.toLowerCase();
    const hasValidExtension = this.supportedExtensions.some(ext => path.endsWith(ext));
    
    // Check for developer guide indicators in filename
    const hasValidName = path.includes('contributing') || 
                        path.includes('development') || 
                        path.includes('dev-guide') ||
                        path.includes('setup') ||
                        path.includes('install') ||
                        hasValidExtension;

    return hasValidExtension || hasValidName;
  }

  /**
   * Parse developer guide documentation into standardized AST format
   */
  async parse(request: ParseRequest): Promise<ParseResponse> {
    const parseId = this.generateParseId();
    
    try {
      // Read file content
      const fs = require('fs');
      
      let content: string;
      if (request.source === 'file') {
        content = fs.readFileSync(request.path, 'utf8');
      } else if (request.source === 'content') {
        content = request.path; // path contains content when source is 'content'
      } else {
        throw new Error(`Unsupported source type: ${request.source}`);
      }

      // Parse the content
      const ast = this.parseDeveloperGuideContent(content, request.path);

      return {
        status: 'success',
        parseId,
        ast,
        metadata: {
          sourceType: 'developer-guide',
          version: '1.0.0',
          endpointCount: ast.endpoints?.length || 0,
          schemaCount: ast.schemas?.length || 0,
          parseTime: Date.now(),
          fileSize: content.length
        }
      };

    } catch (error) {
      return {
        status: 'failed',
        parseId,
        errors: [{
          status: 'error',
          code: 'PARSE_ERROR',
          message: `Failed to parse developer guide: ${(error as Error).message}`,
          details: { file: request.path, error: (error as Error).stack }
        }]
      };
    }
  }

  /**
   * Parse developer guide content into structured sections
   */
  private parseDeveloperGuideContent(content: string, filePath: string): StandardizedAST {
    const sections = this.extractSections(content);
    const setupInstructions = this.extractSetupInstructions(content);
    const projectStructure = this.extractProjectStructure(content);
    const codeConventions = this.extractCodeConventions(content);
    const testingGuidelines = this.extractTestingGuidelines(content);
    const cicdConfig = this.extractCICDConfiguration(content);

    // Create API specification for developer guide
    const spec: ApiSpecification = {
      id: 'developer-guide',
      format: 'jsdoc' as any, // Using JSDOC format as placeholder
      version: '1.0.0',
      metadata: {
        title: 'Developer Guide',
        version: '1.0.0',
        description: 'Developer documentation and guidelines'
      },
      endpoints: [],
      dataModels: [],
      security: [],
      servers: [],
      tags: []
    };

    // Create endpoints for different sections
    const endpoints = [
      {
        path: '/setup',
        method: 'GET' as HttpMethod,
        summary: 'Setup Instructions',
        description: setupInstructions,
        tags: ['Setup']
      },
      {
        path: '/project-structure',
        method: 'GET' as HttpMethod,
        summary: 'Project Structure',
        description: projectStructure,
        tags: ['Structure']
      },
      {
        path: '/code-conventions',
        method: 'GET' as HttpMethod,
        summary: 'Code Conventions',
        description: codeConventions,
        tags: ['Conventions']
      },
      {
        path: '/testing',
        method: 'GET' as HttpMethod,
        summary: 'Testing Guidelines',
        description: testingGuidelines,
        tags: ['Testing']
      },
      {
        path: '/cicd',
        method: 'GET' as HttpMethod,
        summary: 'CI/CD Configuration',
        description: cicdConfig,
        tags: ['CI/CD']
      }
    ];

    return {
      spec,
      endpoints,
      schemas: [],
      components: [],
      metadata: {
        filePath,
        sections,
        setupInstructions,
        projectStructure,
        codeConventions,
        testingGuidelines,
        cicdConfig,
        parsedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Extract sections from markdown content
   */
  private extractSections(content: string): any[] {
    const sections: any[] = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      
      // Match markdown headers
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch && headerMatch[1] && headerMatch[2]) {
        const level = headerMatch[1].length;
        const title = headerMatch[2].trim();
        
        // Extract content until next header of same or higher level
        let content = '';
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j];
          if (!nextLine) continue;
          if (nextLine.match(/^#{1,6}\s+/)) {
            const nextLevelMatch = nextLine.match(/^(#{1,6})/);
            const nextLevel = nextLevelMatch?.[1]?.length || 0;
            if (nextLevel <= level) {
              break;
            }
          }
          content += nextLine + '\n';
        }
        
        sections.push({
          level,
          title,
          content: content.trim(),
          lineNumber: i + 1
        });
      }
    }
    
    return sections;
  }

  /**
   * Extract setup instructions
   */
  private extractSetupInstructions(content: string): string {
    const setupKeywords = ['setup', 'install', 'installation', 'getting started', 'prerequisites'];
    return this.extractSectionByKeywords(content, setupKeywords);
  }

  /**
   * Extract project structure information
   */
  private extractProjectStructure(content: string): string {
    const structureKeywords = ['structure', 'directory', 'folder', 'layout', 'organization'];
    return this.extractSectionByKeywords(content, structureKeywords);
  }

  /**
   * Extract code conventions
   */
  private extractCodeConventions(content: string): string {
    const conventionKeywords = ['convention', 'style', 'format', 'coding', 'standard', 'guideline'];
    return this.extractSectionByKeywords(content, conventionKeywords);
  }

  /**
   * Extract testing guidelines
   */
  private extractTestingGuidelines(content: string): string {
    const testingKeywords = ['test', 'testing', 'spec', 'specification', 'unit test', 'integration'];
    return this.extractSectionByKeywords(content, testingKeywords);
  }

  /**
   * Extract CI/CD configuration
   */
  private extractCICDConfiguration(content: string): string {
    const cicdKeywords = ['ci', 'cd', 'pipeline', 'workflow', 'github actions', 'jenkins', 'travis'];
    return this.extractSectionByKeywords(content, cicdKeywords);
  }

  /**
   * Extract section content by keywords
   */
  private extractSectionByKeywords(content: string, keywords: string[]): string {
    const lines = content.split('\n');
    let inRelevantSection = false;
    let sectionContent = '';
    
    for (const line of lines) {
      if (!line) continue;
      // Check if this line is a header
      const headerMatch = line.match(/^#{1,6}\s+(.+)$/);
      if (headerMatch && headerMatch[1]) {
        const title = headerMatch[1].toLowerCase();
        inRelevantSection = keywords.some(keyword => title.includes(keyword));
      }
      
      if (inRelevantSection) {
        sectionContent += line + '\n';
      }
    }
    
    return sectionContent.trim();
  }

  /**
   * Validate parsed content
   */
  async validate(ast: any): Promise<ValidationResponse> {
    const violations: Array<{
      rule: string;
      message: string;
      severity: 'error' | 'warning' | 'info';
    }> = [];

    // Check if essential sections are present
    if (!ast.metadata?.setupInstructions) {
      violations.push({
        rule: 'setup_instructions',
        message: 'No setup instructions found',
        severity: 'warning'
      });
    }

    if (!ast.metadata?.projectStructure) {
      violations.push({
        rule: 'project_structure',
        message: 'No project structure information found',
        severity: 'warning'
      });
    }

    if (!ast.metadata?.codeConventions) {
      violations.push({
        rule: 'code_conventions',
        message: 'No code conventions found',
        severity: 'warning'
      });
    }

    // Check if sections are not empty
    if (ast.metadata?.sections && ast.metadata.sections.length === 0) {
      violations.push({
        rule: 'sections',
        message: 'No sections found in the document',
        severity: 'error'
      });
    }

    const hasErrors = violations.some(v => v.severity === 'error');

    return {
      valid: !hasErrors,
      violations
    };
  }

  /**
   * Generate unique parse ID
   */
  private generateParseId(): string {
    return `dev_guide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default DeveloperGuideParser;
