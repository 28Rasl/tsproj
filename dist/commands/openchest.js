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
const goods_1 = __importDefault(require("../goods"));
const Command_1 = __importDefault(require("../structures/Command"));
const Util = __importStar(require("../utils/util"));
const config = __importStar(require("../config"));
const db_1 = require("../utils/db");
class OpenChest extends Command_1.default {
    get options() {
        return { name: 'open chest', aliases: ['открыть сундук'] };
    }
    execute(message) {
        db_1.User.getOne({ userID: message.author.id }).then(userDoc => {
            const chest = userDoc.itemChests > userDoc.goldChests
                ? config.ids.chests.item
                : config.ids.chests.gold;
            const chestKey = chest === config.ids.chests.item ? 'itemChest' : 'goldChest';
            if (userDoc[`${chestKey}s`] < 1) {
                message.channel
                    .send({
                    embed: {
                        color: config.meta.defaultColor,
                        description: 'У вас нет сундуков'
                    }
                })
                    .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                    .catch(() => { });
                return;
            }
            const chancesKey = `${chestKey}Chances`;
            const imagesKey = `${chestKey}Images`;
            const chances = config.meta[chancesKey];
            const images = config.meta[imagesKey];
            const chanceEntries = Object.entries(chances);
            const maxVal = chanceEntries.reduce((p, c) => p + c[1], 0);
            let minChance = 0;
            for (let i = 0; i < chanceEntries.length; i++) {
                const entryChance = chanceEntries[i][1];
                chanceEntries[i][1] = minChance;
                minChance += entryChance;
            }
            const randres = Math.floor(Math.random() * (maxVal + 1));
            const res = chanceEntries.reverse().find(e => e[1] < randres);
            if (!res)
                return;
            const reskey = res[0];
            const image = images[reskey];
            userDoc[`${chestKey}s`] -= 1;
            if (chest === config.ids.chests.gold) {
                const win = Number(reskey);
                if (Number.isInteger(win))
                    userDoc.gold += win;
            }
            else if (Object.values(config.ids.goods).includes(Number(reskey))) {
                userDoc.inventory = {
                    ...userDoc.inventory,
                    [reskey]: ((userDoc.inventory || {})[reskey] || 0) + 1
                };
            }
            userDoc.save();
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    image: image ? { url: image } : undefined
                }
            })
                .then(msg => {
                return new Promise(resolve => {
                    setTimeout(() => resolve(msg), 5e3);
                });
            })
                .then(msg => {
                return msg.edit({
                    embed: {
                        color: config.meta.defaultColor,
                        title: '<a:heart:718612246485401727> Ты открыл(-а) сундук!',
                        thumbnail: { url: 'https://imgur.com/U6eh9cg.gif' },
                        description: [
                            'Тебе сегодня знатно везёт.',
                            `> ты выиграл(-а) ${chest === config.ids.chests.item
                                ? `${Util.resolveEmoji(goods_1.default[reskey].emoji)}**${goods_1.default[reskey].name || 'Неизвестно'}**`
                                : `${Number(reskey).toLocaleString('ru-RU')}${Util.resolveEmoji(config.meta.emojis.cy).trim()}`}`
                        ].join('\n'),
                        footer: {
                            text: message.author.tag,
                            icon_url: message.author.displayAvatarURL({ dynamic: true })
                        },
                        timestamp: Date.now()
                    }
                });
            })
                .catch(() => { });
        });
    }
}
exports.default = OpenChest;
//# sourceMappingURL=openchest.js.map