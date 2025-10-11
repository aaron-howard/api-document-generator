/**
 * Generate Command Implementation
 *
 * Handles the 'generate' command for API documentation generation.
 * Implements the generation workflow with input validation, parsing,
 * AI enhancement, and output generation.
 */
import { GenerationResponse } from '../cli-service';
export interface GenerateCommandOptions {
    config?: string;
    output?: string;
    format?: string | string[];
    docType?: string;
    ai?: boolean;
    validate?: boolean;
    force?: boolean;
    dryRun?: boolean;
    profile?: string;
    concurrency?: number;
    verbose?: boolean;
    quiet?: boolean;
}
export declare class GenerateCommand {
    /**
     * Execute the generate command
     */
    execute(inputs: string[], options?: GenerateCommandOptions): Promise<GenerationResponse>;
    /**
     * Build generation request from CLI arguments
     */
    private buildGenerationRequest;
    /**
     * Detect input type from file path and doc-type option
     */
    private detectInputType;
    /**
     * Check if file looks like an Express.js application
     */
    private looksLikeExpressFile;
    /**
     * Get default file paths for documentation type
     */
    private getDefaultPathsForDocType;
    /**
     * Validate generation request
     */
    private validateRequest;
    /**
     * Load configuration from file
     */
    private loadConfig;
    /**
     * Perform the actual generation
     */
    private performGeneration;
    /**
     * Generate HTML content
     */
    private generateHTMLContent;
    /**
     * Generate Markdown content
     */
    private generateMarkdownContent;
    /**
     * Generate JSON content
     */
    private generateJSONContent;
    /**
     * Generate PDF content (simplified - would need proper PDF library)
     */
    private generatePDFContent;
    /**
     * Generate Developer Guide content
     */
    private generateDeveloperGuideContent;
    /**
     * Generate Changelog content
     */
    private generateChangelogContent;
    /**
     * Generate content based on documentation type
     */
    private generateContentByType;
    /**
     * Get filename for documentation type and format
     */
    private getFilenameForDocType;
    /**
     * Generate Product Overview content
     */
    private generateProductOverviewContent;
    /**
     * Generate Architecture content
     */
    private generateArchitectureContent;
    /**
     * Generate User Guide content
     */
    private generateUserGuideContent;
    /**
     * Generate Security content
     */
    private generateSecurityContent;
    /**
     * Generate Onboarding content
     */
    private generateOnboardingContent;
    /**
     * Generate Monitoring content
     */
    private generateMonitoringContent;
    /**
     * Generate UML content based on documentation type
     */
    private generateUMLContent;
    /**
     * Get command help text
     */
    static getHelpText(): string;
}
export default GenerateCommand;
//# sourceMappingURL=generate.d.ts.map