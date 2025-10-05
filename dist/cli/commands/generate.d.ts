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
    format?: string[];
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
     * Detect input type from file path
     */
    private detectInputType;
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
     * Get command help text
     */
    static getHelpText(): string;
}
export default GenerateCommand;
//# sourceMappingURL=generate.d.ts.map