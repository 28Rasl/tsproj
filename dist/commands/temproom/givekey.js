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
const Util = __importStar(require("../../utils/util"));
const config = __importStar(require("../../config"));
const db_1 = require("../../utils/db");
class TemproomGivekeyCommand extends Command_1.default {
    get options() {
        return { name: 'выдать ключ' };
    }
    async execute(message, args) {
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
        const room = guild.channels.cache.get(roomDoc.roomID);
        if (room) {
            const flags = discord_js_1.Permissions.FLAGS.CONNECT;
            const targetPerms = room.permissionOverwrites.get(targetMember.id) || {
                allow: { bitfield: 0 },
                deny: { bitfield: 0 }
            };
            if (targetPerms.allow.bitfield & flags) {
                message.channel
                    .send({
                    embed: {
                        color: config.meta.defaultColor,
                        description: 'У участника уже имеется ключ к вашей комнате'
                    }
                })
                    .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                    .catch(() => { });
                return;
            }
            const keycount = room.permissionOverwrites.array().filter(o => {
                return (o.type === 'member' &&
                    o.id !== roomDoc.userID &&
                    (o.allow.bitfield & flags) > 0);
            }).length;
            if (keycount >= roomDoc.slots) {
                message.channel
                    .send({
                    embed: {
                        color: config.meta.defaultColor,
                        description: 'Вы превысили ограничение по слотам'
                    }
                })
                    .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                    .catch(() => { });
                return;
            }
            room.updateOverwrite(targetMember.id, { CONNECT: true }).catch(() => { });
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: `Вы дали доступ к личной комнате ${targetMember}.`
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.msgDeletion }))
                .catch(() => { });
        }
    }
}
exports.default = TemproomGivekeyCommand;
//# sourceMappingURL=givekey.js.map