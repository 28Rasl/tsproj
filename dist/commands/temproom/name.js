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
class DeleteTemproomCommand extends Command_1.default {
    get options() {
        return { name: 'личнаякомната изменить' };
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
        const price = config.meta.temproomNamePrice;
        const userDoc = await db_1.User.getOne({ userID: message.author.id });
        if (userDoc.gold < price) {
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
        const name = args.join(' ');
        if (name.trim().length < 1) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Укажите корректное название'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const confirmMsg = await message.channel
            .send({
            embed: {
                color: config.meta.defaultColor,
                description: [
                    `С вашего счета будет снято ${price.toLocaleString('ru-RU')}${Util.resolveEmoji(config.meta.emojis.cy).trim()}`,
                    '',
                    'Подтвердите свое действие'
                ].join('\n')
            }
        })
            .catch(() => { });
        if (!confirmMsg)
            return;
        const confirmRes = await Util.confirm(confirmMsg, message.author, config.meta.temproomNameConfirmLimit);
        confirmMsg.delete().catch(() => { });
        if (!confirmRes)
            return;
        userDoc.gold -= price;
        userDoc.save();
        const room = guild.channels.cache.get(roomDoc.roomID);
        if (room)
            room.edit({ name }).catch(() => { });
        message.channel
            .send({
            embed: {
                color: config.meta.defaultColor,
                description: 'Вы изменили название личной комнаты.'
            }
        })
            .then(msg => msg.delete({ timeout: config.meta.msgDeletion }))
            .catch(() => { });
    }
}
exports.default = DeleteTemproomCommand;
//# sourceMappingURL=name.js.map