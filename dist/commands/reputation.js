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
const Util = __importStar(require("../utils/util"));
const config = __importStar(require("../config"));
const db_1 = require("../utils/db");
const repTypes = { '+1': 1, '-1': -1 };
class ReputationCommand extends Command_1.default {
    get options() {
        return { name: 'репутация' };
    }
    async execute(message, args) {
        const authorDoc = await db_1.User.getOne({ userID: message.author.id });
        if (authorDoc.lastRepTick &&
            authorDoc.lastRepTick + config.meta.reputationInterval > Date.now()) {
            return;
        }
        const guild = message.guild;
        const targetMember = await Util.resolveMember(args[0], guild);
        if (!targetMember) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Участник не найден'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const repType = repTypes[args[1]];
        if (typeof repType !== 'number')
            return;
        const userDoc = await db_1.User.getOne({ userID: targetMember.id });
        userDoc.reputation += repType;
        userDoc.save();
    }
}
exports.default = ReputationCommand;
//# sourceMappingURL=reputation.js.map