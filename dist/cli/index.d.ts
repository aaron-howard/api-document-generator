#!/usr/bin/env node
/**
 * CLI Entry Point
 *
 * Main entry point for the API Documentation Generator CLI tool.
 * Handles command parsing, argument validation, and command execution.
 */
/**
 * Simple CLI application implementation
 */
declare class CLIApp {
    private cliService;
    constructor();
    /**
     * Parse and execute CLI commands
     */
    run(args?: string[]): Promise<void>;
    /**
     * Execute generate command
     */
    private executeGenerate;
    /**
     * Execute validate command
     */
    private executeValidate;
    /**
     * Execute diff command
     */
    private executeDiff;
    /**
     * Execute init command
     */
    private executeInit;
    /**
     * Execute config command
     */
    private executeConfig;
    /**
     * Parse command line options
     */
    private parseOptions;
    /**
     * Parse input file arguments
     */
    private parseInputs;
    /**
     * Check if argument is an option value
     */
    private isOptionValue;
    /**
     * Display generation result
     */
    private displayGenerationResult;
    /**
     * Display validation result
     */
    private displayValidationResult;
    /**
     * Display diff result
     */
    private displayDiffResult;
    /**
     * Handle errors
     */
    private handleError;
    /**
     * Show help information
     */
    private showHelp;
}
export default CLIApp;
//# sourceMappingURL=index.d.ts.map