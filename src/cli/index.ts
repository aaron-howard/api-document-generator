#!/usr/bin/env node
/**
 * CLI Entry Point
 * 
 * Main entry point for the API Documentation Generator CLI tool.
 * Handles command parsing, argument validation, and command execution.
 */

import { CLIService } from './cli-service';
import { GenerateCommand } from './commands/generate';
import { ValidateCommand } from './commands/validate';
import { DiffCommand } from './commands/diff';

const CLI_VERSION = '1.0.0';

/**
 * Simple CLI application implementation
 */
class CLIApp {
  private cliService: CLIService;

  constructor() {
    this.cliService = new CLIService();
  }

  /**
   * Parse and execute CLI commands
   */
  async run(args: string[] = process.argv.slice(2)): Promise<void> {
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
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  /**
   * Execute generate command
   */
  private async executeGenerate(args: string[]): Promise<void> {
    const options = this.parseOptions(args);
    const inputs = this.parseInputs(args);

    if (inputs.length === 0) {
      throw new Error('At least one input file is required for generate command');
    }

    const generateCommand = new GenerateCommand();
    const result = await generateCommand.execute(inputs, options);

    this.displayGenerationResult(result);
  }

  /**
   * Execute validate command
   */
  private async executeValidate(args: string[]): Promise<void> {
    const options = this.parseOptions(args);
    const inputs = this.parseInputs(args);

    if (inputs.length === 0) {
      throw new Error('At least one input file is required for validate command');
    }

    const validateCommand = new ValidateCommand();
    const result = await validateCommand.execute(inputs, options);

    this.displayValidationResult(result);
  }

  /**
   * Execute diff command
   */
  private async executeDiff(args: string[]): Promise<void> {
    const options = this.parseOptions(args);
    const inputs = this.parseInputs(args);

    if (inputs.length < 2) {
      throw new Error('Two input files are required for diff command (old version and new version)');
    }

    const diffCommand = new DiffCommand();
    const oldFile = inputs[0]!; // validated length >= 2
    const newFile = inputs[1]!;
    const result = await diffCommand.execute(oldFile, newFile, options);

    this.displayDiffResult(result, options);
  }

  /**
   * Execute init command
   */
  private async executeInit(args: string[]): Promise<void> {
    const options = this.parseOptions(args);
    const directory = args.find(arg => !arg.startsWith('-')) || '.';

    const result = await this.cliService.init(directory, options);

    if (result.success) {
      console.log('✓', result.message);
    } else {
      console.error('✗', result.message);
      process.exit(result.exitCode);
    }
  }

  /**
   * Execute config command
   */
  private async executeConfig(args: string[]): Promise<void> {
    if (args.length === 0 || args[0] === 'show') {
      const config = this.cliService.getConfig();
      if (config) {
        console.log(JSON.stringify(config, null, 2));
      } else {
        console.log('No configuration file found');
      }
    } else {
      console.error('Config subcommands not yet implemented');
    }
  }

  /**
   * Parse command line options
   */
  private parseOptions(args: string[]): Record<string, any> {
    const options: Record<string, any> = {};
    
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (!arg) continue; // safety
      
      if (arg.startsWith('--')) {
        const key = arg.slice(2);
        const nextArg = args[i + 1];
        
        if (nextArg && !nextArg.startsWith('-')) {
          options[key] = nextArg;
          i++; // Skip next argument
        } else {
          options[key] = true;
        }
      } else if (arg.startsWith('-') && arg.length === 2) {
        const key = arg.slice(1);
        const nextArg = args[i + 1];
        
        if (nextArg && !nextArg.startsWith('-')) {
          options[key] = nextArg;
          i++; // Skip next argument
        } else {
          options[key] = true;
        }
      }
    }
    
    return options;
  }

  /**
   * Parse input file arguments
   */
  private parseInputs(args: string[]): string[] {
    return args.filter(arg => !arg.startsWith('-') && !this.isOptionValue(arg, args));
  }

  /**
   * Check if argument is an option value
   */
  private isOptionValue(arg: string, args: string[]): boolean {
    const index = args.indexOf(arg);
    if (index === 0) return false;
    
    const prevArg = args[index - 1];
    return typeof prevArg === 'string' && prevArg.startsWith('-');
  }

  /**
   * Display generation result
   */
  private displayGenerationResult(result: any): void {
    if (result.status === 'success') {
      console.log('✓ Documentation generated successfully');
      
      if (result.outputPaths) {
        console.log('Output files:');
        result.outputPaths.forEach((path: string) => {
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
        result.warnings.forEach((warning: any) => {
          console.log(`  ⚠ ${warning.message}`);
        });
      }
    } else {
      console.error('✗ Documentation generation failed');
      
      if (result.errors) {
        result.errors.forEach((error: any) => {
          console.error(`  • ${error.message}`);
        });
      }
      
      process.exit(1);
    }
  }

  /**
   * Display validation result
   */
  private displayValidationResult(result: any): void {
    if (result.valid) {
      console.log('✓ All input sources are valid');
    } else {
      console.log('✗ Validation failed');
    }

    if (result.errors && result.errors.length > 0) {
      console.log('Errors:');
      result.errors.forEach((error: any) => {
        const location = error.line ? ` (line ${error.line}${error.column ? `:${error.column}` : ''})` : '';
        console.log(`  • ${error.path}${location}: ${error.message}`);
      });
    }

    if (result.warnings && result.warnings.length > 0) {
      console.log('Warnings:');
      result.warnings.forEach((warning: any) => {
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
  private displayDiffResult(result: any, options: any): void {
    if (options.output) {
      console.log(`✓ Changelog written to ${options.output}`);
    } else {
      const formatted = DiffCommand.formatResults(result, options.format || 'markdown');
      console.log(formatted);
    }
  }

  /**
   * Handle errors
   */
  private handleError(error: Error): void {
    console.error('Error:', error.message);
    process.exit(1);
  }

  /**
   * Show help information
   */
  private showHelp(): void {
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
export default CLIApp;

// Run CLI if this file is executed directly
if (require.main === module) {
  const cli = new CLIApp();
  cli.run().catch((error) => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });
}