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
exports.PUnbanCommand = exports.PBanCommand = exports.PKickCommand = void 0;
const discord_js_1 = require("discord.js");
const Util = __importStar(require("../utils/util"));
const config = __importStar(require("../config"));
const Command_1 = __importDefault(require("../structures/Command"));
class PKickCommand extends Command_1.default {
    get options() {
        return { name: 'pkick' };
    }
    get cOptions() {
        return { guildOnly: true };
    }
    async execute(message, args, { member }) {
        const channel = member.voice.channel;
        if (!Util.validatePrivateroom(member, channel))
            return;
        const guild = message.guild;
        const mentionString = args.join(' ');
        if (mentionString.length < 1) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Укажите участника'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const targetMember = await Util.resolveMember(mentionString, guild);
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
        if (targetMember.id === member.id)
            return;
        const sameVoice = targetMember.voice.channelID === member.voice.channelID;
        if (!sameVoice) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Участник не находится в вашем голосовом канале'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        targetMember.voice.setChannel(null).catch(() => { });
    }
}
exports.PKickCommand = PKickCommand;
class PBanCommand extends Command_1.default {
    get options() {
        return { name: 'pban' };
    }
    get cOptions() {
        return { guildOnly: true };
    }
    async execute(message, args, { member }) {
        const channel = member.voice.channel;
        if (!Util.validatePrivateroom(member, channel))
            return;
        const guild = message.guild;
        const mentionString = args.join(' ');
        if (mentionString.length < 1) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Укажите участника'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const targetMember = await Util.resolveMember(mentionString, guild);
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
        if (targetMember.id === member.id)
            return;
        const perms = channel.permissionOverwrites.get(member.id);
        const flags = discord_js_1.Permissions.FLAGS.CONNECT;
        const permsBlocked = perms && perms.deny.has(flags);
        const sameVoice = targetMember.voice.channelID === member.voice.channelID;
        if (permsBlocked && !sameVoice) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Участник заблокирован в вашем голосовом канале'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        if (sameVoice)
            targetMember.voice.setChannel(null).catch(() => { });
        if (!permsBlocked) {
            channel
                .updateOverwrite(targetMember.id, { CONNECT: false })
                .catch(() => { });
        }
    }
}
exports.PBanCommand = PBanCommand;
class PUnbanCommand extends Command_1.default {
    get options() {
        return { name: 'punban' };
    }
    get cOptions() {
        return { guildOnly: true };
    }
    async execute(message, args, { member }) {
        const channel = member.voice.channel;
        if (!Util.validatePrivateroom(member, channel))
            return;
        const guild = message.guild;
        const mentionString = args.join(' ');
        if (mentionString.length < 1) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Укажите участника'
                }
            })
                .catch(() => { });
            return;
        }
        const targetMember = await Util.resolveMember(mentionString, guild);
        if (!targetMember) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Участник не найден'
                }
            })
                .catch(() => { });
            return;
        }
        if (targetMember.id === member.id)
            return;
        const perms = channel.permissionOverwrites.get(targetMember.id);
        const flags = discord_js_1.Permissions.FLAGS.CONNECT;
        const permsBlocked = perms && perms.deny.has(flags);
        if (!permsBlocked) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Участник не заблокирован в вашем голосовом канале'
                }
            })
                .catch(() => { });
            return;
        }
        if (perms.allow.bitfield === 0 && (perms.deny.bitfield ^ flags) === 0) {
            channel.edit({
                permissionOverwrites: channel.permissionOverwrites
                    .array()
                    .filter(p => p.id !== targetMember.id)
            });
        }
        else {
            channel
                .updateOverwrite(targetMember.id, { CONNECT: null })
                .catch(() => { });
        }
    }
}
exports.PUnbanCommand = PUnbanCommand;
//# sourceMappingURL=privaterooms.js.map