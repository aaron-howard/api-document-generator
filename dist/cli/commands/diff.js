"use strict";
/**
 * Diff Command Implementation
 *
 * Handles the 'diff' command for generating API changelog
 * between two versions of API specifications.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffCommand = void 0;
class DiffCommand {
    /**
     * Execute the diff command
     */
    async execute(oldVersion, newVersion, options = {}) {
        try {
            // Build diff request from CLI arguments
            const request = await this.buildDiffRequest(oldVersion, newVersion, options);
            // Validate request
            this.validateRequest(request);
            // Execute diff generation
            const response = await this.performDiff(request);
            return response;
        }
        catch (error) {
            throw new Error(`Diff generation failed: ${error.message}`);
        }
    }
    /**
     * Build diff request from CLI arguments
     */
    async buildDiffRequest(oldVersion, newVersion, options) {
        return {
            oldVersion: {
                type: this.detectInputType(oldVersion),
                path: oldVersion
            },
            newVersion: {
                type: this.detectInputType(newVersion),
                path: newVersion
            },
            options: {
                includeBreaking: options.includeBreaking ?? true,
                format: options.format ?? 'markdown'
            }
        };
    }
    /**
     * Detect input type from file path
     */
    detectInputType(path) {
        const ext = path.toLowerCase();
        if (ext.includes('openapi') || ext.includes('swagger') || ext.endsWith('.yaml') || ext.endsWith('.yml') || ext.endsWith('.json')) {
            return 'openapi';
        }
        if (ext.endsWith('.js') || ext.endsWith('.ts')) {
            return 'jsdoc';
        }
        if (ext.endsWith('.py')) {
            return 'python-docstring';
        }
        if (ext.endsWith('.go')) {
            return 'go-doc';
        }
        if (ext.includes('graphql') || ext.endsWith('.gql') || ext.endsWith('.graphql')) {
            return 'graphql';
        }
        // Default to OpenAPI
        return 'openapi';
    }
    /**
     * Validate diff request
     */
    validateRequest(request) {
        if (!request.oldVersion?.path || !request.newVersion?.path) {
            throw new Error('Both old and new version paths are required');
        }
        if (request.oldVersion.path === request.newVersion.path) {
            throw new Error('Old and new version paths cannot be the same');
        }
    }
    /**
     * Perform the actual diff generation
     */
    async performDiff(request) {
        // Placeholder - would perform actual diff analysis
        // Mock diff results based on file names
        const changes = [];
        // Simulate some changes
        changes.push({
            type: 'added',
            path: '/users/{id}/preferences',
            description: 'Added new endpoint for user preferences management'
        });
        changes.push({
            type: 'modified',
            path: '/users/{id}',
            description: 'Updated user schema to include additional profile fields'
        });
        if (request.newVersion.path.includes('v2')) {
            changes.push({
                type: 'breaking',
                path: '/auth/login',
                description: 'Changed authentication endpoint response format',
                details: {
                    reason: 'Response structure changed from flat object to nested',
                    impact: 'Clients need to update response parsing logic'
                }
            });
        }
        changes.push({
            type: 'removed',
            path: '/legacy/endpoint',
            description: 'Removed deprecated legacy endpoint'
        });
        // Calculate summary
        const summary = {
            totalChanges: changes.length,
            breakingChanges: changes.filter(c => c.type === 'breaking').length,
            additions: changes.filter(c => c.type === 'added').length,
            removals: changes.filter(c => c.type === 'removed').length,
            modifications: changes.filter(c => c.type === 'modified').length
        };
        return {
            changes,
            summary
        };
    }
    /**
     * Format diff results for display
     */
    static formatResults(response, format = 'markdown') {
        if (format === 'json') {
            return JSON.stringify(response, null, 2);
        }
        // Markdown format
        let output = '# API Changelog\n\n';
        output += '## Summary\n\n';
        output += `- **Total Changes**: ${response.summary.totalChanges}\n`;
        output += `- **Breaking Changes**: ${response.summary.breakingChanges}\n`;
        output += `- **Additions**: ${response.summary.additions}\n`;
        output += `- **Modifications**: ${response.summary.modifications}\n`;
        output += `- **Removals**: ${response.summary.removals}\n\n`;
        if (response.summary.breakingChanges > 0) {
            output += '## ⚠️ Breaking Changes\n\n';
            const breakingChanges = response.changes.filter(c => c.type === 'breaking');
            for (const change of breakingChanges) {
                output += `### ${change.path}\n`;
                output += `${change.description}\n\n`;
                if (change.details) {
                    output += `**Details**: ${JSON.stringify(change.details, null, 2)}\n\n`;
                }
            }
        }
        output += '## 🆕 Additions\n\n';
        const additions = response.changes.filter(c => c.type === 'added');
        for (const change of additions) {
            output += `- **${change.path}**: ${change.description}\n`;
        }
        output += '\n## 🔄 Modifications\n\n';
        const modifications = response.changes.filter(c => c.type === 'modified');
        for (const change of modifications) {
            output += `- **${change.path}**: ${change.description}\n`;
        }
        output += '\n## ❌ Removals\n\n';
        const removals = response.changes.filter(c => c.type === 'removed');
        for (const change of removals) {
            output += `- **${change.path}**: ${change.description}\n`;
        }
        return output;
    }
    /**
     * Get command help text
     */
    static getHelpText() {
        return `
Generate changelog between API versions

USAGE:
  api-doc-gen diff [options] <old-version> <new-version>

ARGUMENTS:
  <old-version>    Path to the old version API specification
  <new-version>    Path to the new version API specification

OPTIONS:
  -o, --output <file>        Output file for changelog
      --format <format>      Output format: markdown, json (default: markdown)
      --include-breaking     Include breaking changes analysis (default: true)
      --no-breaking          Exclude breaking changes analysis
  -p, --profile <name>       Use specific configuration profile
  -v, --verbose              Verbose output
  -q, --quiet                Quiet mode

EXAMPLES:
  api-doc-gen diff v1/api.yaml v2/api.yaml
  api-doc-gen diff --format json --output changelog.json old-api.yaml new-api.yaml
  api-doc-gen diff --no-breaking v1.0.0/openapi.yaml v1.1.0/openapi.yaml
    `;
    }
}
exports.DiffCommand = DiffCommand;
exports.default = DiffCommand;
//# sourceMappingURL=diff.js.map