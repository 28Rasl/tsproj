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
const loveroom_1 = __importDefault(require("../../managers/loveroom"));
const Util = __importStar(require("../../utils/util"));
const config = __importStar(require("../../config"));
const db_1 = require("../../utils/db");
const Command_1 = __importDefault(require("../../structures/Command"));
const main_1 = __importStar(require("../../main"));
function resolveRoomName(member, targetMember) {
    const replacers = {
        nickname(member) {
            return member.displayName;
        }
    };
    let roomname = config.meta.pairroomName;
    Object.entries(replacers).forEach(([name, func]) => {
        const regex = new RegExp(`{${name}\\.([12])}`, '');
        roomname = roomname.replace(new RegExp(regex.source, 'g'), m => {
            const match = m.match(regex);
            if (!match)
                return m;
            const mem = match[1] === '1' ? member : targetMember;
            return func(mem);
        });
    });
    return roomname;
}
function resolveOverwrites(guild, members) {
    const metaPerms = config.meta.permissions.loveroom;
    const overwrites = [
        ...metaPerms.default,
        {
            id: guild.id,
            allow: metaPerms.everyone.allow || 0,
            deny: metaPerms.everyone.deny || 0
        }
    ];
    members.forEach(m => {
        overwrites.push({
            id: m.id,
            allow: metaPerms.member.allow || 0,
            deny: metaPerms.member.deny || 0
        });
    });
    return overwrites;
}
class PairCommand extends Command_1.default {
    get options() {
        return { name: 'пара' };
    }
    get cOptions() {
        return { guildOnly: true };
    }
    async execute(message, args, { guild, member }) {
        const existing = await db_1.Pair.findOne(d => {
            return (d.pair || []).includes(message.author.id);
        });
        if (existing) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'У тебя уже имеется пара'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        if (main_1.activePairOffers.has(message.author.id)) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'У тебя уже есть активный запрос!'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const targetMember = await Util.resolveMember(args.join(' '));
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
        if (main_1.activePairOffers.has(targetMember.id)) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'У данного пользователя уже есть активный запрос!'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const targetPair = await db_1.Pair.findOne(d => {
            return (d.pair || []).includes(targetMember.id);
        });
        if (targetPair) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'У данного участника уже есть пара'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        const userDoc = await db_1.User.getOne({ userID: message.author.id });
        if (userDoc.gold < config.meta.pairCost) {
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
        const confirmMsg = await message.channel
            .send({
            embed: {
                color: config.meta.defaultColor,
                title: 'ПРЕДЛОЖЕНИЕ',
                description: [
                    'Я жизни без тебя не представляю, хочу идти с тобой по жизненном пути. Тебя люблю, тебя я обожаю, и делаю тебе я предложения сердца и руки!',
                    '',
                    `${message.author} отправляет предложение стать парой ${targetMember}, мы в предвкушении новой пары...`
                ].join('\n'),
                image: {
                    url: 'https://trello-attachments.s3.amazonaws.com/5f2d182cbb42e72dbfdd927c/800x369/4c291b6172fca9677bbdf37e1562a42c/predli.gif'
                }
            }
        })
            .catch(() => { });
        if (!confirmMsg)
            return;
        main_1.activePairOffers.add(message.author.id);
        main_1.activePairOffers.add(targetMember.id);
        const confirm = await Util.confirm(confirmMsg, targetMember.user);
        main_1.activePairOffers.delete(message.author.id);
        main_1.activePairOffers.delete(targetMember.id);
        confirmMsg.delete().catch(() => { });
        if (!confirm)
            return;
        const room = await guild.channels
            .create(resolveRoomName(member, targetMember), {
            parent: config.ids.categories.loverooms,
            permissionOverwrites: resolveOverwrites(guild, [member, targetMember]),
            type: 'voice',
            userLimit: 2
        })
            .catch(() => { });
        if (!room)
            return;
        userDoc.gold -= config.meta.pairCost;
        userDoc.save();
        const docData = {
            roomID: room.id,
            pair: [message.author.id, targetMember.id]
        };
        db_1.Pair.insertOne(docData);
        loveroom_1.default.save(docData.roomID, docData);
        const channel = (main_1.default.channels.cache.get(config.ids.channels.text.mainChat) || message.channel);
        channel
            .send({
            embed: {
                color: config.meta.defaultColor,
                title: 'НОВЕНЬКАЯ ПАРА ВЛЮБЛЁННЫХ',
                description: [
                    `Дорогие участники сервера, я объявляю, ${message.author} и ${targetMember}, официальной парой этого сервера!`,
                    '',
                    'Поздравляю вас с созданием собственного любовного домика, долголетия желаю вашей любви, вам – влюбленной паре! Такого долголетия, которое согласно превратиться в вечность.'
                ].join('\n'),
                image: {
                    url: 'https://trello-attachments.s3.amazonaws.com/5f2d182cbb42e72dbfdd927c/800x369/d12729a55b4edf5dcd300f6011d074bd/novaya.gif'
                }
            }
        })
            .then(msg => msg.delete({ timeout: config.meta.msgDeletion }))
            .catch(() => { });
    }
}
exports.default = PairCommand;
//# sourceMappingURL=pair.js.map