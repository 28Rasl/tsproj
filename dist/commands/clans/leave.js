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
const Command_1 = __importDefault(require("../../structures/Command"));
const clan_1 = __importDefault(require("../../managers/clan"));
const config = __importStar(require("../../config"));
const db_1 = require("../../utils/db");
class ClanLeaveCommand extends Command_1.default {
    get options() {
        return { name: 'покинутьгильдию' };
    }
    get cOptions() {
        return { prefix: '/' };
    }
    async execute(message) {
        const userDoc = await db_1.User.getOne({ userID: message.author.id });
        if (typeof userDoc.clanID !== 'string') {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Вы не состоите в гильдии',
                    image: { url: 'https://i.imgur.com/bykHG7j.gif' }
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const clan = clan_1.default.get(userDoc.clanID);
        if (!clan) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Внутренняя ошибка: Гильдия не найдена. Обратитесь к тех. администрации сервера',
                    image: { url: 'https://i.imgur.com/bykHG7j.gif' }
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const clanMember = clan.members.get(message.author.id);
        if (clanMember) {
            if (clanMember.owner) {
                message.channel
                    .send({
                    embed: {
                        color: config.meta.defaultColor,
                        description: 'Нельзя выйти из своей гильдии',
                        image: { url: 'https://i.imgur.com/bykHG7j.gif' }
                    }
                })
                    .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                    .catch(() => { });
                return;
            }
            clanMember.kick();
        }
    }
}
exports.default = ClanLeaveCommand;
//# sourceMappingURL=leave.js.map