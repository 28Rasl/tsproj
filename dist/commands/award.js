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
const Util = __importStar(require("../utils/util"));
const config = __importStar(require("../config"));
const db_1 = require("../utils/db");
const Command_1 = __importDefault(require("../structures/Command"));
class AwardCommand extends Command_1.default {
    get cOptions() {
        return {
            prefix: '/',
            suppressArgs: true,
            allowedPerms: discord_js_1.Permissions.FLAGS.ADMINISTRATOR,
            allowedRoles: config.access.commands.award
        };
    }
    async execute(message, args, { guild }) {
        const sendError = (content) => {
            message.channel
                .send({
                embed: { color: config.meta.defaultColor, description: content }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
        };
        const targetMember = await Util.resolveMember(args[0], guild);
        if (!targetMember) {
            sendError('Участник не найден');
            return;
        }
        const amount = Number(args.slice(1).join('').replace(/\D/g, ''));
        if (!Number.isInteger(amount) || amount < 1) {
            sendError('Укажите корректную сумму');
            return;
        }
        let type;
        if (amount > config.meta.maxAwardGold) {
            sendError(`Максимальное кол-во — ${config.meta.maxAwardGold}${Util.resolveEmoji(config.meta.emojis.cy).trim()}`);
            return;
        }
        if (amount < config.meta.maxAwardCrystals) {
            const confirmMsg = await message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: `Сумма для выдачи: **${amount.toLocaleString('ru-RU')}**\nУкажите валюту, которую хотите выдать, нажав на одну из реакций ниже`
                }
            })
                .catch(() => { });
            if (!confirmMsg)
                return;
            const reaction = await Util.getReaction(confirmMsg, [config.meta.emojis.cy, config.meta.emojis.donateCy], message.author);
            confirmMsg.delete().catch(() => { });
            if (!reaction)
                return;
            const resEmojiID = reaction.emoji.id || reaction.emoji.name;
            type = resEmojiID === config.meta.emojis.donateCy ? 'crystals' : 'gold';
        }
        else {
            type = 'gold';
        }
        const userDoc = await db_1.User.getOne({ userID: targetMember.id });
        userDoc[type] += amount;
        userDoc.save();
        const embed = {
            color: config.meta.defaultColor,
            description: `${targetMember} выдано **${amount.toLocaleString('ru-RU')}${Util.resolveEmoji(config.meta.emojis[type === 'gold' ? 'cy' : 'donateCy']).trim()}**`
        };
        message.channel
            .send({ embed })
            .then(msg => msg.delete({ timeout: config.meta.msgDeletion }))
            .catch(() => { });
    }
}
exports.default = AwardCommand;
//# sourceMappingURL=award.js.map