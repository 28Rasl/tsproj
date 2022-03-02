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
Object.defineProperty(exports, "__esModule", { value: true });
exports.goods = exports.positionEmojis = void 0;
const Util = __importStar(require("./utils/util"));
const config = __importStar(require("./config"));
const db_1 = require("./utils/db");
exports.positionEmojis = [
    '941804123320381522',
    '941804123320381522',
    '941804123320381522',
    '941804123320381522',
    '941804123320381522',
    '941804123320381522'
];
exports.goods = {
    [config.ids.goods.ticket]: {
        id: config.ids.goods.ticket,
        name: 'Лотерейный билет',
        emoji: '941804123320381522',
        price: 250
    },
    [config.ids.goods.temprole1d]: {
        id: config.ids.goods.temprole1d,
        name: 'Роль на 1 день',
        emoji: '941804123320381522',
        price: 700,
        duration: 8.64e7
    },
    [config.ids.goods.temprole3d]: {
        id: config.ids.goods.temprole3d,
        name: 'Роль на 3 дня',
        emoji: '941804123320381522',
        price: 1500,
        duration: 2.592e8
    },
    [config.ids.goods.temprole7d]: {
        id: config.ids.goods.temprole7d,
        name: 'Роль на неделю',
        emoji: '941804123320381522',
        price: 2500,
        duration: 6.048e8
    },
    [config.ids.goods.hero7d]: {
        id: config.ids.goods.hero7d,
        name: 'Hero на неделю',
        emoji: '941804123320381522',
        price: 1500,
        duration: 6.048e8,
        async activate(user) {
            const roleID = config.ids.roles.hero;
            const existing = await db_1.Temprole.findOne({
                userID: user.id,
                itemID: this.id
            });
            if (existing) {
                return { ok: false, reason: 'У вас уже имеется данная роль' };
            }
            const guild = Util.getMainGuild();
            guild.members
                .fetch(user.id)
                .then(member => {
                member.roles.add(roleID).catch(() => { });
                db_1.Temprole.insertOne({
                    userID: user.id,
                    itemID: this.id,
                    roleID,
                    endTick: this.duration ? Date.now() + this.duration : undefined
                });
            })
                .catch(() => { });
            return { ok: true };
        }
    },
    [config.ids.goods.temproom7d]: {
        id: config.ids.goods.temproom7d,
        name: 'Канал на неделю',
        emoji: '941804123320381522',
        price: 2500,
        duration: 6.048e8,
        async activate(user, args = []) {
            const existing = await db_1.Temproom.findOne({
                userID: user.id,
                itemID: this.id
            });
            if (existing) {
                return { ok: false, reason: 'У вас уже имеется личная комната' };
            }
            const name = args.join(' ');
            if (name.trim().length < 1) {
                return { ok: false, reason: 'Укажите корректное название канала' };
            }
            const guild = Util.getMainGuild();
            const categoryID = config.ids.categories.temprooms;
            const configPerms = config.meta.permissions.temproom;
            return guild.channels
                .create(name, {
                type: 'voice',
                parent: categoryID,
                permissionOverwrites: [
                    ...configPerms.default,
                    {
                        id: guild.id,
                        allow: configPerms.everyone.allow || 0,
                        deny: configPerms.everyone.deny || 0
                    },
                    {
                        id: user.id,
                        allow: configPerms.member.allow || 0,
                        deny: configPerms.member.deny || 0
                    }
                ]
            })
                .then(channel => {
                db_1.Temproom.insertOne({
                    userID: user.id,
                    itemID: this.id,
                    roomID: channel.id,
                    slots: config.meta.temproomSlots,
                    endTick: this.duration ? Date.now() + this.duration : undefined
                });
                return { ok: true };
            })
                .catch(() => ({ ok: false, reason: 'Ошибка создания комнаты' }));
        }
    }
};
exports.default = exports.goods;
//# sourceMappingURL=goods.js.map