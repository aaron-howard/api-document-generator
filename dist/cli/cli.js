"use strict";
/**
 * CLI Module Export
 *
 * Main export point for the CLI service and related components.
 * This module provides programmatic access to CLI functionality.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.CommandRegistry = exports.DiffCommand = exports.ValidateCommand = exports.GenerateCommand = exports.CLIService = void 0;
var cli_service_1 = require("./cli-service");
Object.defineProperty(exports, "CLIService", { enumerable: true, get: function () { return cli_service_1.CLIService; } });
var generate_1 = require("./commands/generate");
Object.defineProperty(exports, "GenerateCommand", { enumerable: true, get: function () { return generate_1.GenerateCommand; } });
var validate_1 = require("./commands/validate");
Object.defineProperty(exports, "ValidateCommand", { enumerable: true, get: function () { return validate_1.ValidateCommand; } });
var diff_1 = require("./commands/diff");
Object.defineProperty(exports, "DiffCommand", { enumerable: true, get: function () { return diff_1.DiffCommand; } });
var commands_1 = require("./commands");
Object.defineProperty(exports, "CommandRegistry", { enumerable: true, get: function () { return commands_1.CommandRegistry; } });
// Default export
var cli_service_2 = require("./cli-service");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return cli_service_2.CLIService; } });
//# sourceMappingURL=cli.js.map