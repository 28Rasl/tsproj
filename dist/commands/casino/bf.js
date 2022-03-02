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
class BfCommand extends Command_1.default {
    execute(message, args) {
        db_1.User.getOne({ userID: message.author.id }).then(userDoc => {
            const betAmount = parseInt((args[0] || '').replace(/\D/g, ''));
            if (!Number.isInteger(betAmount)) {
                message.channel
                    .send({
                    embed: {
                        color: config.meta.defaultColor,
                        description: 'Укажите корректную ставку'
                    }
                })
                    .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                    .catch(() => { });
                return;
            }
            const betSubject = (args[1] || '').toLowerCase();
            if (!['t', 'h'].includes(betSubject))
                return;
            const minbet = config.meta.minbfBet;
            const maxbet = config.meta.maxbfBet;
            if (betAmount < minbet) {
                message.channel
                    .send({
                    embed: {
                        color: config.meta.defaultColor,
                        description: `Минимальная ставка – ${minbet.toLocaleString('ru-RU')}`
                    }
                })
                    .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                    .catch(() => { });
                return;
            }
            if (betAmount > maxbet) {
                message.channel
                    .send({
                    embed: {
                        color: config.meta.defaultColor,
                        description: `Максимальная ставка – ${maxbet.toLocaleString('ru-RU')}`
                    }
                })
                    .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                    .catch(() => { });
                return;
            }
            if (userDoc.gold < betAmount) {
                message.channel
                    .send({
                    embed: {
                        color: config.meta.defaultColor,
                        description: 'Недостаточно средств'
                    }
                })
                    .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                    .catch(() => { });
                return;
            }
            const randres = Math.floor(Math.random() * 2);
            const correctSubj = randres === 0 ? 't' : 'h';
            const win = correctSubj === betSubject;
            const winAmount = Math.floor(betAmount * (win ? 1 : -1));
            userDoc.gold += winAmount;
            userDoc.save();
            message.channel.send({
                embed: {
                    color: win ? config.meta.bfWinColor : config.meta.bfLoseColor,
                    author: {
                        name: message.author.tag,
                        icon_url: message.author.displayAvatarURL({ dynamic: true })
                    },
                    thumbnail: {
                        url: correctSubj === 't'
                            ? 'https://imgur.com/By8B5TY.png'
                            : 'https://i.imgur.com/0ibdq9g.png'
                    },
                    description: (win
                        ? [
                            '**угадал сторону монетки**',
                            `> ты получаешь ${Util.pluralNoun(winAmount, '', 'свои', 'свои')} ${winAmount.toLocaleString('ru-RU')}${Util.resolveEmoji(config.meta.emojis.cy).trim()} ${Util.pluralNoun(winAmount, 'чеканную монету', 'чеканные монеты', 'чеканных монет')}!`
                        ]
                        : ['**ты проиграл :(**', '> удача не на твоей стороне....']).join('\n')
                }
            });
        });
    }
}
exports.default = BfCommand;
//# sourceMappingURL=bf.js.map