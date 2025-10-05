/**
 * CLI Commands Index
 * 
 * Central export point for all CLI command implementations.
 */

export { GenerateCommand, GenerateCommandOptions } from './generate';
export { ValidateCommand, ValidateCommandOptions } from './validate';
export { DiffCommand, DiffCommandOptions } from './diff';

// Command registry for dynamic command loading
export const CommandRegistry = {
  generate: () => import('./generate').then(m => m.GenerateCommand),
  validate: () => import('./validate').then(m => m.ValidateCommand),
  diff: () => import('./diff').then(m => m.DiffCommand),
} as const;

export type CommandName = keyof typeof CommandRegistry;