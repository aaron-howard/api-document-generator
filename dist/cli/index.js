#!/usr/bin/env node
"use strict";
/**
 * CLI Entry Point
 *
 * Main entry point for the API Documentation Generator CLI tool.
 * Handles command parsing, argument validation, and command execution.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const cli_service_1 = require("./cli-service");
const generate_1 = require("./commands/generate");
const validate_1 = require("./commands/validate");
const diff_1 = require("./commands/diff");
const CLI_VERSION = '1.0.0';
/**
 * Simple CLI application implementation
 */
class CLIApp {
    constructor() {
        this.cliService = new cli_service_1.CLIService();
    }
    /**
     * Parse and execute CLI commands
     */
    async run(args = process.argv.slice(2)) {
        try {
            if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
                this.showHelp();
                return;
            }
            if (args[0] === '--version' || args[0] === '-v') {
                console.log(`api-doc-gen v${CLI_VERSION}`);
                return;
            }
            const command = args[0];
            const commandArgs = args.slice(1);
            switch (command) {
                case 'generate':
                case 'gen':
                    await this.executeGenerate(commandArgs);
                    break;
                case 'validate':
                case 'val':
                    await this.executeValidate(commandArgs);
                    break;
                case 'diff':
                    await this.executeDiff(commandArgs);
                    break;
                case 'init':
                    await this.executeInit(commandArgs);
                    break;
                case 'config':
                    await this.executeConfig(commandArgs);
                    break;
                default:
                    console.error(`Unknown command: ${command}`);
                    console.error('Run "api-doc-gen --help" for usage information');
                    process.exit(1);
            }
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Execute generate command
     */
    async executeGenerate(args) {
        const options = this.parseOptions(args);
        const inputs = this.parseInputs(args);
        if (inputs.length === 0) {
            throw new Error('At least one input file is required for generate command');
        }
        const generateCommand = new generate_1.GenerateCommand();
        const result = await generateCommand.execute(inputs, options);
        this.displayGenerationResult(result);
    }
    /**
     * Execute validate command
     */
    async executeValidate(args) {
        const options = this.parseOptions(args);
        const inputs = this.parseInputs(args);
        if (inputs.length === 0) {
            throw new Error('At least one input file is required for validate command');
        }
        const validateCommand = new validate_1.ValidateCommand();
        const result = await validateCommand.execute(inputs, options);
        this.displayValidationResult(result);
    }
    /**
     * Execute diff command
     */
    async executeDiff(args) {
        const options = this.parseOptions(args);
        const inputs = this.parseInputs(args);
        if (inputs.length < 2) {
            throw new Error('Two input files are required for diff command (old version and new version)');
        }
        const diffCommand = new diff_1.DiffCommand();
        const result = await diffCommand.execute(inputs[0], inputs[1], options);
        this.displayDiffResult(result, options);
    }
    /**
     * Execute init command
     */
    async executeInit(args) {
        const options = this.parseOptions(args);
        const directory = args.find(arg => !arg.startsWith('-')) || '.';
        const result = await this.cliService.init(directory, options);
        if (result.success) {
            console.log('✓', result.message);
        }
        else {
            console.error('✗', result.message);
            process.exit(result.exitCode);
        }
    }
    /**
     * Execute config command
     */
    async executeConfig(args) {
        if (args.length === 0 || args[0] === 'show') {
            const config = this.cliService.getConfig();
            if (config) {
                console.log(JSON.stringify(config, null, 2));
            }
            else {
                console.log('No configuration file found');
            }
        }
        else {
            console.error('Config subcommands not yet implemented');
        }
    }
    /**
     * Parse command line options
     */
    parseOptions(args) {
        const options = {};
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (arg.startsWith('--')) {
                const key = arg.slice(2);
                const nextArg = args[i + 1];
                if (nextArg && !nextArg.startsWith('-')) {
                    options[key] = nextArg;
                    i++; // Skip next argument
                }
                else {
                    options[key] = true;
                }
            }
            else if (arg.startsWith('-') && arg.length === 2) {
                const key = arg.slice(1);
                const nextArg = args[i + 1];
                if (nextArg && !nextArg.startsWith('-')) {
                    options[key] = nextArg;
                    i++; // Skip next argument
                }
                else {
                    options[key] = true;
                }
            }
        }
        return options;
    }
    /**
     * Parse input file arguments
     */
    parseInputs(args) {
        return args.filter(arg => !arg.startsWith('-') && !this.isOptionValue(arg, args));
    }
    /**
     * Check if argument is an option value
     */
    isOptionValue(arg, args) {
        const index = args.indexOf(arg);
        if (index === 0)
            return false;
        const prevArg = args[index - 1];
        return prevArg.startsWith('-');
    }
    /**
     * Display generation result
     */
    displayGenerationResult(result) {
        if (result.status === 'success') {
            console.log('✓ Documentation generated successfully');
            if (result.outputPaths) {
                console.log('Output files:');
                result.outputPaths.forEach((path) => {
                    console.log(`  → ${path}`);
                });
            }
            if (result.metrics) {
                console.log('Metrics:');
                console.log(`  • Processed endpoints: ${result.metrics.processedEndpoints}`);
                console.log(`  • Generation time: ${result.metrics.generationTime}s`);
                console.log(`  • AI summaries: ${result.metrics.aiSummariesGenerated}`);
                console.log(`  • Cache hit rate: ${(result.metrics.cacheHitRate * 100).toFixed(1)}%`);
            }
            if (result.warnings && result.warnings.length > 0) {
                console.log('Warnings:');
                result.warnings.forEach((warning) => {
                    console.log(`  ⚠ ${warning.message}`);
                });
            }
        }
        else {
            console.error('✗ Documentation generation failed');
            if (result.errors) {
                result.errors.forEach((error) => {
                    console.error(`  • ${error.message}`);
                });
            }
            process.exit(1);
        }
    }
    /**
     * Display validation result
     */
    displayValidationResult(result) {
        if (result.valid) {
            console.log('✓ All input sources are valid');
        }
        else {
            console.log('✗ Validation failed');
        }
        if (result.errors && result.errors.length > 0) {
            console.log('Errors:');
            result.errors.forEach((error) => {
                const location = error.line ? ` (line ${error.line}${error.column ? `:${error.column}` : ''})` : '';
                console.log(`  • ${error.path}${location}: ${error.message}`);
            });
        }
        if (result.warnings && result.warnings.length > 0) {
            console.log('Warnings:');
            result.warnings.forEach((warning) => {
                console.log(`  ⚠ ${warning.path || 'General'}: ${warning.message}`);
            });
        }
        if (!result.valid) {
            process.exit(1);
        }
    }
    /**
     * Display diff result
     */
    displayDiffResult(result, options) {
        if (options.output) {
            console.log(`✓ Changelog written to ${options.output}`);
        }
        else {
            const formatted = diff_1.DiffCommand.formatResults(result, options.format || 'markdown');
            console.log(formatted);
        }
    }
    /**
     * Handle errors
     */
    handleError(error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
    /**
     * Show help information
     */
    showHelp() {
        console.log(`
API Documentation Generator v${CLI_VERSION}

USAGE:
  api-doc-gen <command> [options] [arguments]

COMMANDS:
  generate, gen     Generate API documentation from source files
  validate, val     Validate API specifications and source files
  diff              Generate changelog between API versions
  init              Initialize configuration file
  config            Configuration management utilities

GLOBAL OPTIONS:
  -c, --config <file>   Configuration file path
  -v, --verbose         Verbose output
  -q, --quiet           Quiet mode
  -h, --help            Show help
      --version         Show version

EXAMPLES:
  api-doc-gen generate openapi.yaml
  api-doc-gen validate --strict api.yaml
  api-doc-gen diff v1/api.yaml v2/api.yaml
  api-doc-gen init --force

For detailed command help, use:
  api-doc-gen <command> --help
    `);
    }
}
// Export the CLI app
exports.default = CLIApp;
// Run CLI if this file is executed directly
if (require.main === module) {
    const cli = new CLIApp();
    cli.run().catch((error) => {
        console.error('Fatal error:', error.message);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map