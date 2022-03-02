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
const goods_1 = __importDefault(require("../../goods"));
const main_1 = __importDefault(require("../../main"));
const Util = __importStar(require("../../utils/util"));
const config = __importStar(require("../../config"));
const db_1 = require("../../utils/db");
const Command_1 = __importDefault(require("../../structures/Command"));
class CreateTemproleCommand extends Command_1.default {
    get options() {
        return { name: 'личнаяроль создать' };
    }
    async execute(message, args, { guild, member }) {
        const { temprole1d, temprole3d, temprole7d } = config.ids.goods;
        const temproleGoods = [temprole1d, temprole3d, temprole7d];
        const existingTemprole = await db_1.Temprole.findOne(d => {
            if (typeof d.itemID !== 'number')
                return false;
            return d.userID === message.author.id && temproleGoods.includes(d.itemID);
        });
        if (existingTemprole) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'У вас уже имеется личная роль'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const userDoc = await db_1.User.getOne({ userID: message.author.id });
        const invTemproles = temproleGoods
            .map(id => ({
            id,
            name: goods_1.default[id].name,
            emoji: goods_1.default[id].emoji,
            count: userDoc.inventory[id] || 0,
            duration: goods_1.default[id].duration
        }))
            .filter(item => item.count > 0);
        if (invTemproles.length < 1) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'В инвентаре отсутствуют личные роли!'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const colorArg = args.length < 2 ? '' : args.slice(-1)[0];
        const hexColor = Util.resolveHex(colorArg);
        const color = hexColor ? parseInt(hexColor, 16) : undefined;
        const name = args.slice(...(hexColor ? [0, -1] : [0])).join(' ');
        const temproles = guild.roles.cache.get(config.ids.roles.temproles);
        if (name.trim().length < 1) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Укажите корректное название роли'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        if (!hexColor) {
            const confirmMsg = await message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Вы не указали цвет роли. Вы уверены?'
                }
            })
                .catch(() => { });
            if (!confirmMsg)
                return;
            const confirmRes = await Util.confirm(confirmMsg, message.author, config.meta.temproleNoColorConfirmLimit);
            confirmMsg.delete().catch(() => { });
            if (!confirmRes)
                return;
        }
        let temprole = invTemproles[0];
        if (invTemproles.length > 1) {
            const msg = await message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: [
                        'У вас имеются следующие активации в инвентаре. Выберите то, которое хотели бы использовать',
                        '',
                        invTemproles
                            .map(item => {
                            const emoji = main_1.default.emojis.cache.get(item.emoji) ||
                                main_1.default.emojis.cache.get(config.emojis.empty) ||
                                '';
                            return `${`${emoji} `.trimLeft()}${item.name}`;
                        })
                            .join('\n')
                    ].join('\n')
                }
            })
                .catch(() => { });
            if (!msg)
                return;
            const emojis = invTemproles.map(i => i.emoji);
            const reaction = await Util.getReaction(msg, emojis, [message.author]);
            msg.delete().catch(() => { });
            if (!reaction)
                return;
            const emojiID = reaction.emoji.id || reaction.emoji.name;
            const chosenitem = invTemproles.find(item => item.emoji === emojiID);
            if (!chosenitem)
                return;
            temprole = chosenitem;
        }
        userDoc.inventory = {
            ...userDoc.inventory,
            [temprole.id]: temprole.count - 1
        };
        userDoc.save();
        guild.roles
            .create({
            data: {
                color,
                name,
                hoist: false,
                mentionable: true,
                permissions: [],
                position: (temproles || {}).position
            }
        })
            .then(role => {
            member.roles.add(role.id);
            db_1.Temprole.insertOne({
                userID: member.id,
                itemID: temprole.id,
                roleID: role.id,
                endTick: typeof temprole.duration === 'number'
                    ? Date.now() + temprole.duration
                    : undefined
            });
            return message.channel.send({
                embed: {
                    color: config.meta.defaultColor,
                    title: `${Util.resolveEmoji(config.emojis.roles)}Поздравляю!`,
                    thumbnail: { url: 'https://i.imgur.com/9clO0NV.gif' },
                    description: [
                        'Ты успешно создал(-а) личную роль!',
                        `> <@&${role.id}>`
                    ].join('\n'),
                    footer: {
                        text: message.author.tag,
                        icon_url: `${guild.iconURL({ dynamic: true })}`
                    },
                    timestamp: Date.now()
                }
            });
        })
            .then(msg => msg.delete({ timeout: config.meta.msgDeletion }))
            .catch(() => { });
    }
}
exports.default = CreateTemproleCommand;
//# sourceMappingURL=create.js.map