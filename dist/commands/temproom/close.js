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
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../structures/Command"));
const config = __importStar(require("../../config"));
const db_1 = require("../../utils/db");
class CloseTemproomCommand extends Command_1.default {
    get options() {
        return { name: 'личнаякомната закрыть' };
    }
    async execute(message) {
        const guild = message.guild;
        const roomDoc = await db_1.Temproom.findOne({ userID: message.author.id });
        if (!roomDoc) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Личная комната не найдена'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const room = guild.channels.cache.get(roomDoc.roomID);
        if (room) {
            const overwrites = new discord_js_1.Collection();
            for (const overwrite of room.permissionOverwrites.array().map(o => ({
                id: o.id,
                allow: o.allow.bitfield,
                deny: o.deny.bitfield
            }))) {
                overwrites.set(overwrite.id, overwrite);
            }
            const everyonePerms = overwrites.get(guild.id) || { allow: 0, deny: 0 };
            const flags = discord_js_1.Permissions.FLAGS.CONNECT;
            const referredAllow = everyonePerms.allow & flags;
            overwrites.set(guild.id, {
                id: guild.id,
                allow: everyonePerms.allow ^ referredAllow,
                deny: everyonePerms.deny | flags
            });
            room
                .edit({ permissionOverwrites: overwrites, userLimit: 0 })
                .catch(() => { });
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Очень жаль, что вы закрыли для всех доступ к личной комнате.'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.msgDeletion }))
                .catch(() => { });
        }
    }
}
exports.default = CloseTemproomCommand;
//# sourceMappingURL=close.js.map