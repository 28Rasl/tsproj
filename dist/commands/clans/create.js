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
const Clan_1 = __importDefault(require("../../structures/clan/Clan"));
const Command_1 = __importDefault(require("../../structures/Command"));
const config = __importStar(require("../../config"));
const db_1 = require("../../utils/db");
class CreateClanCommand extends Command_1.default {
    get options() {
        return { name: 'гильдия создать' };
    }
    get cOptions() {
        return { prefix: '/' };
    }
    async execute(message, args) {
        const userDoc = await db_1.User.getOne({ userID: message.author.id });
        if (typeof userDoc.clanID === 'string') {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Вы состоите в гильдии',
                    image: { url: 'https://i.imgur.com/bykHG7j.gif' }
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const name = args.join(' ');
        if (name.length < 1) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Укажите название гильдии',
                    image: { url: 'https://i.imgur.com/bykHG7j.gif' }
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        if (name.length > config.meta.clanNameLimit) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Название гильдии превышает лимит по символам',
                    image: { url: 'https://i.imgur.com/bykHG7j.gif' }
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        if (userDoc.gold < config.meta.clanCost) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'У вас недостаточно средств. Кажется, придется еще немного поработать..',
                    image: { url: 'https://i.imgur.com/bykHG7j.gif' }
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const existing = await db_1.Clan.findOne({ name });
        if (existing) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Гильдия с таким названием уже существует. Мы против плагиата.',
                    image: { url: 'https://i.imgur.com/bykHG7j.gif' }
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const clan = Clan_1.default.create({ name, ownerID: message.author.id });
        userDoc.gold -= config.meta.clanCost;
        userDoc.clanID = clan.clanID;
        userDoc.save();
        message.channel
            .send({
            embed: {
                color: config.meta.defaultColor,
                description: `Поздравляю тебя, ${message.author}, теперь у тебя есть собственная **гильдия.**\nТеперь осталось только пригласить туда своих друзей и ты сможешь весело проводить свое время.`,
                image: { url: 'https://i.imgur.com/bykHG7j.gif' }
            }
        })
            .then(msg => msg.delete({ timeout: config.meta.msgDeletion }))
            .catch(() => { });
    }
}
exports.default = CreateClanCommand;
//# sourceMappingURL=create.js.map