/**
 * Diff Command Implementation
 *
 * Handles the 'diff' command for generating API changelog
 * between two versions of API specifications.
 */
import { DiffResponse } from '../cli-service';
export interface DiffCommandOptions {
    format?: 'markdown' | 'json';
    output?: string;
    includeBreaking?: boolean;
    profile?: string;
    verbose?: boolean;
    quiet?: boolean;
}
export declare class DiffCommand {
    /**
     * Execute the diff command
     */
    execute(oldVersion: string, newVersion: string, options?: DiffCommandOptions): Promise<DiffResponse>;
    /**
     * Build diff request from CLI arguments
     */
    private buildDiffRequest;
    /**
     * Detect input type from file path
     */
    private detectInputType;
    /**
     * Validate diff request
     */
    private validateRequest;
    /**
     * Perform the actual diff generation
     */
    private performDiff;
    /**
     * Format diff results for display
     */
    static formatResults(response: DiffResponse, format?: 'markdown' | 'json'): string;
    /**
     * Get command help text
     */
    static getHelpText(): string;
}
export default DiffCommand;
//# sourceMappingURL=diff.d.ts.map