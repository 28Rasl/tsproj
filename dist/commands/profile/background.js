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
const Book_1 = __importDefault(require("../../structures/Book"));
const Command_1 = __importDefault(require("../../structures/Command"));
const config = __importStar(require("../../config"));
const db_1 = require("../../utils/db");
class default_1 extends Command_1.default {
    async execute(message) {
        await db_1.User.getOne({ userID: message.author.id });
        const pages = [{}];
        const book = new Book_1.default(pages, {
            actions: {
                [config.meta.emojis.deleteMessage]: {
                    position: 'before',
                    exec: _message => { }
                },
                [config.meta.emojis.buy]: { position: 'after', exec: _message => { } }
            }
        });
        book.send(message.channel);
    }
}
exports.default = default_1;
//# sourceMappingURL=background.js.map