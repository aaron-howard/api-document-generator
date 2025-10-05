"use strict";
/**
 * CLI Commands Index
 *
 * Central export point for all CLI command implementations.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandRegistry = exports.DiffCommand = exports.ValidateCommand = exports.GenerateCommand = void 0;
var generate_1 = require("./generate");
Object.defineProperty(exports, "GenerateCommand", { enumerable: true, get: function () { return generate_1.GenerateCommand; } });
var validate_1 = require("./validate");
Object.defineProperty(exports, "ValidateCommand", { enumerable: true, get: function () { return validate_1.ValidateCommand; } });
var diff_1 = require("./diff");
Object.defineProperty(exports, "DiffCommand", { enumerable: true, get: function () { return diff_1.DiffCommand; } });
// Command registry for dynamic command loading
exports.CommandRegistry = {
    generate: () => Promise.resolve().then(() => __importStar(require('./generate'))).then(m => m.GenerateCommand),
    validate: () => Promise.resolve().then(() => __importStar(require('./validate'))).then(m => m.ValidateCommand),
    diff: () => Promise.resolve().then(() => __importStar(require('./diff'))).then(m => m.DiffCommand),
};
//# sourceMappingURL=index.js.map