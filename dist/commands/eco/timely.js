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
class default_1 extends Command_1.default {
    get options() {
        return { aliases: ['награда'] };
    }
    execute(message) {
        const targetUser = message.author;
        db_1.User.getOne({ userID: targetUser.id }).then(doc => {
            const now = Date.now();
            const difference = doc.lastTimelyTick + config.meta.timelyInterval - now;
            if (difference > 0) {
                message.channel
                    .send({
                    embed: {
                        color: 0x2f3136,
                        title: '**Ещё не время, потерпи немного!**',
                        thumbnail: { url: 'https://imgur.com/8RNzOR2.gif' },
                        description: [
                            `${message.author}, ты часто используешь ежедневную награду 〒﹏〒`,
                            '',
                            `Приходи через **${Util.parseFilteredFullTimeArray(difference)[0]}**, чтобы получить ${Util.resolveEmoji(config.meta.emojis.cy).trim()}`
                        ].join('\n')
                    }
                })
                    .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                    .catch(() => { });
                return;
            }
            doc.gold += config.meta.timelyAmount;
            doc.lastTimelyTick = now;
            doc.save();
            message.channel
                .send({
                embed: {
                    color: 0x2f3136,
                    title: '**Начисление денег!**',
                    thumbnail: { url: 'https://imgur.com/8RNzOR2.gif' },
                    description: [
                        `${message.author}, ежедневные бесплатные ${config.meta.timelyAmount.toLocaleString('ru-RU')} ${Util.resolveEmoji(config.meta.emojis.cy).trim()} золото!`,
                        '',
                        `Через **${Util.parseFilteredFullTimeArray(config.meta.timelyInterval)[0]}** приходи ещё, я буду ждать ヽ(♡‿♡)ノ`
                    ].join('\n')
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.msgDeletion }))
                .catch(() => { });
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=timely.js.map