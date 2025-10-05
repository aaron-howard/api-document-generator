/**
 * Validate Command Implementation
 *
 * Handles the 'validate' command for validating API specifications
 * and source files without generating documentation.
 */
import { ValidationResponse } from '../cli-service';
export interface ValidateCommandOptions {
    config?: string;
    format?: string;
    strict?: boolean;
    warnings?: boolean;
    profile?: string;
    verbose?: boolean;
    quiet?: boolean;
}
export declare class ValidateCommand {
    /**
     * Execute the validate command
     */
    execute(inputs: string[], options?: ValidateCommandOptions): Promise<ValidationResponse>;
    /**
     * Build validation request from CLI arguments
     */
    private buildValidationRequest;
    /**
     * Detect input type from file path
     */
    private detectInputType;
    /**
     * Validate validation request
     */
    private validateRequest;
    /**
     * Perform the actual validation
     */
    private performValidation;
    /**
     * Get command help text
     */
    static getHelpText(): string;
}
export default ValidateCommand;
//# sourceMappingURL=validate.d.ts.map