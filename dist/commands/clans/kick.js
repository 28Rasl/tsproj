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
const Util = __importStar(require("../../utils/util"));
const config = __importStar(require("../../config"));
const db_1 = require("../../utils/db");
class ClanKickCommand extends Command_1.default {
    get options() {
        return { name: 'гильдия выгнать' };
    }
    get cOptions() {
        return { prefix: '/' };
    }
    async execute(message, args) {
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
        if (message.author.id !== clan.ownerID) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Вы не являетесь владельцем гильдии',
                    image: { url: 'https://i.imgur.com/bykHG7j.gif' }
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const targetMention = args[0];
        const targetMember = await Util.resolveMember(targetMention);
        if (!targetMember) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Участник не найден',
                    image: { url: 'https://i.imgur.com/bykHG7j.gif' }
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const targetClanMember = clan.members.get(targetMember.id);
        if (!targetClanMember) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Вы не можете выгнать человека, который не состоит в вашей гильдии.',
                    image: { url: 'https://i.imgur.com/bykHG7j.gif' }
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        if (targetClanMember.owner) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Вы сейчас пытались выгнать лидера? Какая наглость..',
                    image: { url: 'https://i.imgur.com/bykHG7j.gif' }
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        targetClanMember.kick();
        message.channel
            .send({
            embed: {
                color: config.meta.defaultColor,
                description: `Вы выгнали ${targetMember} из своей гильдии. Обойдемся без нахлебников. `,
                image: { url: 'https://i.imgur.com/bykHG7j.gif' }
            }
        })
            .then(msg => msg.delete({ timeout: config.meta.msgDeletion }))
            .catch(() => { });
    }
}
exports.default = ClanKickCommand;
//# sourceMappingURL=kick.js.map