"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = exports.error = exports.warn = exports.info = exports.log = void 0;
const chalk = __importStar(require("chalk"));
const config = __importStar(require("../config"));
function log(...args) {
    console.log(chalk.green.bold('➜ '), ...args);
}
exports.log = log;
function info(...args) {
    console.log(chalk.yellow.bold('➜ '), ...args);
}
exports.info = info;
function warn(...args) {
    console.log(chalk.yellow.bold('✗ '), ...args);
}
exports.warn = warn;
function error(...args) {
    console.log(chalk.red.bold('✗ '), ...args);
}
exports.error = error;
function debug(...args) {
    if (!config.debug)
        return;
    console.log(chalk.cyan.bold('➜ '), ...args);
}
exports.debug = debug;
exports.default = {
    log,
    info,
    warn,
    error,
    debug
};
//# sourceMappingURL=logger.js.map