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
const Util = __importStar(require("../../utils/util"));
const config = __importStar(require("../../config"));
const db_1 = require("../../utils/db");
const util_1 = require("../../utils/util");
class default_1 extends Command_1.default {
    get options() {
        return { name: 'give', aliases: ['передать'] };
    }
    async execute(message, args) {
        const mentionString = args[0];
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
        const targetMember = await (0, util_1.resolveMember)(args[0]);
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
        const amountString = args.slice(1).join('').replace(/\D/g, '');
        if (amountString.length < 1) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Укажите кол-во золота для перевода'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const amount = parseInt(amountString);
        if (!Number.isFinite(amount)) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Укажите корректное кол-во золота для перевода'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const promises = [message.author.id, targetMember.id].map(id => {
            return db_1.User.getOne({ userID: id });
        });
        const [authorDoc, targetDoc] = await Promise.all(promises);
        if (authorDoc.gold < amount) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Недостаточно золота на счету'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        authorDoc.gold -= amount;
        targetDoc.gold += amount;
        authorDoc.save();
        targetDoc.save();
        message.channel
            .send({
            embed: {
                color: config.meta.defaultColor,
                title: '**Перевод средств!**',
                description: [
                    `${message.author}, начисляет **${amount.toLocaleString('ru-RU')}**${Util.resolveEmoji(config.meta.emojis.cy).trim()} на счет ${targetMember}`,
                    'Видимо, у нас появился новый миллионер! ʕ ᵔᴥᵔ ʔ'
                ].join('\n')
            }
        })
            .then(msg => msg.delete({ timeout: config.meta.msgDeletion }))
            .catch(() => { });
    }
}
exports.default = default_1;
//# sourceMappingURL=transfer.js.map