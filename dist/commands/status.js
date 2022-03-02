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
const Command_1 = __importDefault(require("../structures/Command"));
const config = __importStar(require("../config"));
const db_1 = require("../utils/db");
class TestCommand extends Command_1.default {
    get cOptions() {
        return { suppressArgs: false };
    }
    execute(message, args) {
        const status = args.join(' ');
        if (status.length > config.meta.statusLimit) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Ваш статус превышает лимит символов'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        db_1.User.getOne({ userID: message.author.id }).then(userDoc => {
            userDoc.status = status.length < 1 ? undefined : status;
            userDoc.save();
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Статус обновлен!'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.msgDeletion }))
                .catch(() => { });
        });
    }
}
exports.default = TestCommand;
//# sourceMappingURL=status.js.map