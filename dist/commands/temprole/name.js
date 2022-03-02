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
class DeleteTemproleCommand extends Command_1.default {
    get options() {
        return { name: 'личнаяроль изменить' };
    }
    async execute(message, args) {
        const guild = message.guild;
        const { temprole1d, temprole3d, temprole7d } = config.ids.goods;
        const temproleGoods = [temprole1d, temprole3d, temprole7d];
        const roleDoc = await db_1.Temprole.findOne(d => {
            if (typeof d.itemID !== 'number')
                return false;
            return d.userID === message.author.id && temproleGoods.includes(d.itemID);
        });
        if (!roleDoc) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Личная роль не найдена'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const price = config.meta.temproleNamePrice;
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
        const confirmRes = await Util.confirm(confirmMsg, message.author, config.meta.temproleNameConfirmLimit);
        confirmMsg.delete().catch(() => { });
        if (!confirmRes)
            return;
        userDoc.gold -= price;
        userDoc.save();
        const role = guild.roles.cache.get(roleDoc.roleID);
        if (role)
            role.edit({ name }).catch(() => { });
        message.channel
            .send({
            embed: {
                color: config.meta.defaultColor,
                title: `${Util.resolveEmoji(config.emojis.roles)}Личная роль!`,
                thumbnail: { url: 'https://i.imgur.com/9clO0NV.gif' },
                description: [
                    'Ты успешно изменил(-а) название личной роли',
                    '⠀⠀теперь твоя роль стала ещё прекрасней.',
                    `> <@&${roleDoc.roleID}>`
                ].join('\n'),
                footer: {
                    text: `${message.author.tag} • стоимость ${price.toLocaleString('ru-RU')} ${Util.pluralNoun(price, 'золото', 'золота', 'золота')}`,
                    icon_url: `${guild.iconURL({ dynamic: true })}`
                },
                timestamp: Date.now()
            }
        })
            .then(msg => msg.delete({ timeout: config.meta.msgDeletion }))
            .catch(() => { });
    }
}
exports.default = DeleteTemproleCommand;
//# sourceMappingURL=name.js.map