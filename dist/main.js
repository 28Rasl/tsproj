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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeClanDeletions = exports.activePairOffers = exports.privaterooms = exports.closes = exports.events = void 0;
const db_1 = __importDefault(require("./utils/db"));
const Collection_1 = __importDefault(require("./structures/Collection"));
const Util = __importStar(require("./utils/util"));
const config = __importStar(require("./config"));
const discore_js_1 = require("discore.js");
require('events').EventEmitter.defaultMaxListeners = 0;
const client = new discore_js_1.Core({
    db: db_1.default,
    ws: { intents: config.intents },
    token: config.internal.token,
    prefix: '.',
    commandOptions: {
        argsSeparator: ' ',
        ignoreBots: true,
        ignoreCase: true,
        ignoreSelf: true
    }
});
exports.default = client;
exports.events = new Collection_1.default();
exports.closes = new Collection_1.default();
exports.privaterooms = new Collection_1.default();
exports.activePairOffers = new Set();
exports.activeClanDeletions = new Set();
Util.disableEvents();
Util.patchManagers();
Util.processPrefixes();
Util.fetchPrivaterooms();
console.log('Ready!');
//# sourceMappingURL=main.js.map