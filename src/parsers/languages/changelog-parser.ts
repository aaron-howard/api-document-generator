/**
 * Changelog Parser Implementation
 * 
 * Parses changelog files (CHANGELOG.md, HISTORY.md, etc.) into standardized AST format.
 * Extracts version numbers, release dates, added features, fixed bugs, breaking changes, and deprecations.
 */

import { IParser, ParseRequest, ParseResponse, ValidationResponse, StandardizedAST } from '../parser-service';
import { ApiSpecification, HttpMethod } from '../../core/models/api-spec';

/**
 * Changelog Parser class implementing IParser interface
 */
export class ChangelogParser implements IParser {
  readonly type = 'changelog';
  readonly supportedExtensions = ['.md', '.txt', '.rst'];

  /**
   * Check if this parser can handle the given request
   */
  canParse(request: ParseRequest): boolean {
    if (request.type !== 'changelog') {
      return false;
    }

    // Check file extension
    const path = request.path.toLowerCase();
    const hasValidExtension = this.supportedExtensions.some(ext => path.endsWith(ext));
    
    // Check for changelog indicators in filename
    const hasValidName = path.includes('changelog') || 
                        path.includes('history') || 
                        path.includes('releases') ||
                        path.includes('version') ||
                        path.includes('news') ||
                        hasValidExtension;

    return hasValidExtension || hasValidName;
  }

  /**
   * Parse changelog documentation into standardized AST format
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
      const ast = this.parseChangelogContent(content, request.path);

      return {
        status: 'success',
        parseId,
        ast,
        metadata: {
          sourceType: 'changelog',
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
          message: `Failed to parse changelog: ${(error as Error).message}`,
          details: { file: request.path, error: (error as Error).stack }
        }]
      };
    }
  }

  /**
   * Parse changelog content into structured versions
   */
  private parseChangelogContent(content: string, filePath: string): StandardizedAST {
    const versions = this.extractVersions(content);
    const latestVersion = versions.length > 0 ? versions[0] : null;
    const unreleasedChanges = this.extractUnreleasedChanges(content);

    // Create API specification for changelog
    const spec: ApiSpecification = {
      id: 'changelog',
      format: 'jsdoc' as any, // Using JSDOC format as placeholder
      version: latestVersion?.version || '1.0.0',
      metadata: {
        title: 'Changelog',
        version: latestVersion?.version || '1.0.0',
        description: 'Version history and release notes'
      },
      endpoints: [],
      dataModels: [],
      security: [],
      servers: [],
      tags: []
    };

    // Create endpoints for different version information
    const endpoints = versions.map(version => ({
      path: `/version/${version.version}`,
      method: 'GET' as HttpMethod,
      summary: `Version ${version.version}`,
      description: this.formatVersionDescription(version),
      tags: ['Versions']
    }));

    // Add unreleased endpoint if exists
    if (unreleasedChanges) {
      endpoints.unshift({
        path: '/unreleased',
        method: 'GET' as HttpMethod,
        summary: 'Unreleased Changes',
        description: unreleasedChanges,
        tags: ['Unreleased']
      });
    }

    return {
      spec,
      endpoints,
      schemas: [],
      components: [],
      metadata: {
        filePath,
        versions,
        latestVersion,
        unreleasedChanges,
        totalVersions: versions.length,
        parsedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Extract version information from changelog content
   */
  private extractVersions(content: string): any[] {
    const versions: any[] = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      
      // Match version headers (v1.0.0, 1.0.0, [1.0.0], etc.)
      const versionMatch = line.match(/^(#{1,6}\s+)?(?:v)?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?(?:\+[a-zA-Z0-9.-]+)?)(?:\s*-\s*(.+))?$/i);
      if (versionMatch && versionMatch[2]) {
        const version = versionMatch[2];
        const date = versionMatch[3];
        
        // Extract content until next version or end of file
        let versionContent = '';
        let addedFeatures: string[] = [];
        let fixedBugs: string[] = [];
        let breakingChanges: string[] = [];
        let deprecations: string[] = [];
        
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j];
          if (!nextLine) continue;
          
          // Check if this is another version header
          if (nextLine.match(/^(#{1,6}\s+)?(?:v)?(\d+\.\d+\.\d+)/)) {
            break;
          }
          
          versionContent += nextLine + '\n';
          
          // Categorize changes
          const changeType = this.categorizeChange(nextLine);
          if (changeType === 'added') {
            addedFeatures.push(nextLine.trim());
          } else if (changeType === 'fixed') {
            fixedBugs.push(nextLine.trim());
          } else if (changeType === 'breaking') {
            breakingChanges.push(nextLine.trim());
          } else if (changeType === 'deprecated') {
            deprecations.push(nextLine.trim());
          }
        }
        
        versions.push({
          version,
          date: date ? this.parseDate(date) : null,
          content: versionContent.trim(),
          addedFeatures,
          fixedBugs,
          breakingChanges,
          deprecations,
          lineNumber: i + 1
        });
      }
    }
    
    return versions;
  }

  /**
   * Extract unreleased changes
   */
  private extractUnreleasedChanges(content: string): string | null {
    const unreleasedKeywords = ['unreleased', 'unreleased changes', 'upcoming', 'next release'];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      const lowerLine = line.toLowerCase();
      
      if (unreleasedKeywords.some(keyword => lowerLine.includes(keyword))) {
        let unreleasedContent = '';
        
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j];
          if (!nextLine) continue;
          
          // Stop at next version header
          if (nextLine.match(/^(#{1,6}\s+)?(?:v)?(\d+\.\d+\.\d+)/)) {
            break;
          }
          
          unreleasedContent += nextLine + '\n';
        }
        
        return unreleasedContent.trim();
      }
    }
    
    return null;
  }

  /**
   * Categorize a change line
   */
  private categorizeChange(line: string): string | null {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('added') || lowerLine.includes('new') || lowerLine.includes('feat')) {
      return 'added';
    } else if (lowerLine.includes('fixed') || lowerLine.includes('bug') || lowerLine.includes('fix')) {
      return 'fixed';
    } else if (lowerLine.includes('breaking') || lowerLine.includes('!')) {
      return 'breaking';
    } else if (lowerLine.includes('deprecated') || lowerLine.includes('deprecate')) {
      return 'deprecated';
    }
    
    return null;
  }

  /**
   * Parse date string
   */
  private parseDate(dateStr: string): Date | null {
    try {
      // Try various date formats
      const formats = [
        /(\d{4}-\d{2}-\d{2})/,  // YYYY-MM-DD
        /(\d{2}\/\d{2}\/\d{4})/, // MM/DD/YYYY
        /(\d{2}-\d{2}-\d{4})/,   // MM-DD-YYYY
        /(\w+ \d{1,2}, \d{4})/   // Month DD, YYYY
      ];
      
      for (const format of formats) {
        const match = dateStr.match(format);
        if (match && match[1]) {
          return new Date(match[1]);
        }
      }
      
      return new Date(dateStr);
    } catch {
      return null;
    }
  }

  /**
   * Format version description
   */
  private formatVersionDescription(version: any): string {
    let description = `Version ${version.version}`;
    
    if (version.date) {
      description += ` (${version.date.toLocaleDateString()})`;
    }
    
    if (version.addedFeatures.length > 0) {
      description += `\n\nAdded Features:\n${version.addedFeatures.map((f: string) => `- ${f}`).join('\n')}`;
    }
    
    if (version.fixedBugs.length > 0) {
      description += `\n\nFixed Bugs:\n${version.fixedBugs.map((f: string) => `- ${f}`).join('\n')}`;
    }
    
    if (version.breakingChanges.length > 0) {
      description += `\n\nBreaking Changes:\n${version.breakingChanges.map((f: string) => `- ${f}`).join('\n')}`;
    }
    
    if (version.deprecations.length > 0) {
      description += `\n\nDeprecations:\n${version.deprecations.map((f: string) => `- ${f}`).join('\n')}`;
    }
    
    return description;
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

    // Check if versions are present
    if (!ast.metadata?.versions || ast.metadata.versions.length === 0) {
      violations.push({
        rule: 'versions',
        message: 'No versions found in changelog',
        severity: 'error'
      });
    }

    // Check version format
    if (ast.metadata?.versions) {
      for (const version of ast.metadata.versions) {
        if (!version.version.match(/^\d+\.\d+\.\d+/)) {
          violations.push({
            rule: 'version_format',
            message: `Invalid version format: ${version.version}`,
            severity: 'warning'
          });
        }
      }
    }

    // Check if latest version has content
    if (ast.metadata?.latestVersion && !ast.metadata.latestVersion.content) {
      violations.push({
        rule: 'latest_version_content',
        message: 'Latest version has no content',
        severity: 'warning'
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
    return `changelog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default ChangelogParser;
