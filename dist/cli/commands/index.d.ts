/**
 * CLI Commands Index
 *
 * Central export point for all CLI command implementations.
 */
export { GenerateCommand, GenerateCommandOptions } from './generate';
export { ValidateCommand, ValidateCommandOptions } from './validate';
export { DiffCommand, DiffCommandOptions } from './diff';
export declare const CommandRegistry: {
    readonly generate: () => Promise<typeof import("./generate").GenerateCommand>;
    readonly validate: () => Promise<typeof import("./validate").ValidateCommand>;
    readonly diff: () => Promise<typeof import("./diff").DiffCommand>;
};
export type CommandName = keyof typeof CommandRegistry;
//# sourceMappingURL=index.d.ts.map