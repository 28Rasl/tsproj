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
class BrCommand extends Command_1.default {
    execute(message, args) {
        db_1.User.getOne({ userID: message.author.id }).then(userDoc => {
            const bet = parseInt(args.join('').replace(/\D/g, ''));
            if (!Number.isInteger(bet)) {
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
            const minbet = config.meta.minbrBet;
            const maxbet = config.meta.maxbrBet;
            if (bet < minbet) {
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
            if (bet > maxbet) {
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
            if (userDoc.gold < bet) {
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
            const rmin = config.meta.brMinRandomres;
            const rmax = config.meta.brMaxRandomres;
            const randres = Math.floor(Math.random() * (rmax - rmin + 1)) + rmin;
            const coef = (Object.entries(config.meta.brCoef)
                .sort((b, a) => Number(a[0]) - Number(b[0]))
                .find(([r]) => Number(r) < randres) || [])[1] || 0;
            const winAmount = Math.floor(bet * (coef - 1));
            userDoc.gold += winAmount;
            userDoc.save();
            message.channel.send({
                embed: {
                    color: coef < 1 ? config.meta.brLoseColor : config.meta.brWinColor,
                    author: {
                        name: message.author.tag,
                        icon_url: message.author.displayAvatarURL({ dynamic: true })
                    },
                    description: (coef < 1
                        ? [
                            `Выпадает **${randres}**, ты проиграл!`,
                            '> не расстраивайся, повезет в следующий раз'
                        ]
                        : [
                            `Выпадает **${randres}**, поздравляю тебя!`,
                            `> ты получаешь ${Util.pluralNoun(winAmount, '', 'свои', 'свои')} ${winAmount.toLocaleString('ru-RU')}${Util.resolveEmoji(config.meta.emojis.cy).trim()} ${Util.pluralNoun(winAmount, 'чеканную монету', 'чеканные монеты', 'чеканных монет')}!`
                        ]).join('\n')
                }
            });
        });
    }
}
exports.default = BrCommand;
//# sourceMappingURL=br.js.map