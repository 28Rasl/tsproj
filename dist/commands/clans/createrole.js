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
const clan_1 = __importDefault(require("../../managers/clan"));
const Util = __importStar(require("../../utils/util"));
const config = __importStar(require("../../config"));
const db_1 = require("../../utils/db");
const Command_1 = __importDefault(require("../../structures/Command"));
class ClanDescriptionCommand extends Command_1.default {
    get options() {
        return { name: 'гильдия создатьроль' };
    }
    get cOptions() {
        return { prefix: '/' };
    }
    async execute(message, args, { guild }) {
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
        const colorArg = args.length < 2 ? '' : args.slice(-1)[0];
        const hexColor = Util.resolveHex(colorArg);
        const color = hexColor ? parseInt(hexColor, 16) : undefined;
        const name = args.slice(...(hexColor ? [0, -1] : [0])).join(' ');
        const clansrole = guild.roles.cache.get(config.ids.roles.clans);
        if (name.trim().length < 1) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Укажите корректное название роли'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        if (!hexColor) {
            const confirmMsg = await message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Вы не указали цвет роли. Вы уверены?'
                }
            })
                .catch(() => { });
            if (!confirmMsg)
                return;
            const confirmRes = await Util.confirm(confirmMsg, message.author, config.meta.temproleNoColorConfirmLimit);
            confirmMsg.delete().catch(() => { });
            if (!confirmRes)
                return;
        }
        const role = await guild.roles.create({
            data: {
                color,
                name,
                hoist: false,
                mentionable: true,
                permissions: [],
                position: (clansrole || {}).position
            }
        });
        clan.edit({ roleID: role.id, color });
        message.channel
            .send({
            embed: {
                color: config.meta.defaultColor,
                description: 'Роль гильдии создана.',
                image: { url: 'https://i.imgur.com/bykHG7j.gif' }
            }
        })
            .then(msg => msg.delete({ timeout: config.meta.msgDeletion }))
            .catch(() => { });
    }
}
exports.default = ClanDescriptionCommand;
//# sourceMappingURL=createrole.js.map