/**
 * CLI Module Export
 *
 * Main export point for the CLI service and related components.
 * This module provides programmatic access to CLI functionality.
 */
export { CLIService } from './cli-service';
export { GenerateCommand, GenerateCommandOptions } from './commands/generate';
export { ValidateCommand, ValidateCommandOptions } from './commands/validate';
export { DiffCommand, DiffCommandOptions } from './commands/diff';
export { CommandRegistry, CommandName } from './commands';
export type { GenerationRequest, GenerationResponse, ValidationRequest, ValidationResponse, DiffRequest, DiffResponse, CLICommand, CLIOptions, CLIResult, CLIConfig } from './cli-service';
export { CLIService as default } from './cli-service';
//# sourceMappingURL=cli.d.ts.map