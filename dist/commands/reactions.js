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
const Command_1 = __importDefault(require("../structures/Command"));
const Util = __importStar(require("../utils/util"));
const config = __importStar(require("../config"));
const db_1 = require("../utils/db");
const reactions_1 = __importDefault(require("../reactions"));
const minPrice = config.meta.minReactionPrice;
const maxPrice = config.meta.maxReactionPrice;
const priceDiff = maxPrice - minPrice;
function formatReplyTemplate(reply, author, target) {
    return reply
        .replace(/{author}/g, String(author))
        .replace(/{target}/g, String(target || 'Неизвестный'));
}
function reactionCommand(info) {
    return class ReactionCommand extends Command_1.default {
        get options() {
            return { name: info.name, aliases: info.aliases };
        }
        get cOptions() {
            return { guildOnly: true };
        }
        async execute(message, args) {
            const guild = message.guild;
            const userDoc = await db_1.User.getOne({ userID: message.author.id });
            if (userDoc.gold < maxPrice) {
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
            const targetMember = (await Util.resolveMember(args[0], guild));
            if (!info.singleReplies && !targetMember) {
                message.channel
                    .send({
                    embed: {
                        color: config.meta.defaultColor,
                        description: 'Укажите участника'
                    }
                })
                    .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                    .catch(() => { });
                return;
            }
            let confirmMsg;
            const isDouble = info.doubleReplies && targetMember;
            if (isDouble) {
                if (message.author.id === targetMember.id) {
                    message.channel
                        .send({
                        embed: {
                            color: config.meta.defaultColor,
                            description: 'Делай это с другими, а не с самим собой!'
                        }
                    })
                        .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                        .catch(() => { });
                    return;
                }
                if (info.confirmReplies && info.confirmReplies.length > 0) {
                    const confirmReplies = info.confirmReplies.length;
                    const confirmReplyIndex = Math.floor(Math.random() * confirmReplies);
                    const confirmReplyTemplate = info.confirmReplies[confirmReplyIndex];
                    const confirmReply = formatReplyTemplate(confirmReplyTemplate, message.author, (targetMember || {}).user);
                    confirmMsg = await message.channel
                        .send(String(targetMember), {
                        embed: {
                            color: config.meta.defaultColor,
                            title: `Реакция: ${info.name.toLowerCase()}`,
                            description: [
                                confirmReply,
                                '',
                                '**Внимательно подумай над предложением!**'
                            ].join('\n'),
                            footer: {
                                text: message.author.username,
                                icon_url: message.author.displayAvatarURL({ dynamic: true })
                            },
                            timestamp: Date.now()
                        }
                    })
                        .catch(() => { });
                    if (!confirmMsg)
                        return;
                    const reaction = await Util.confirm(confirmMsg, targetMember.user, 3e5);
                    confirmMsg.reactions.removeAll().catch(() => { });
                    if (!reaction) {
                        confirmMsg
                            .edit('', {
                            embed: {
                                color: config.meta.defaultColor,
                                title: `Реакция: ${info.name}`,
                                description: `${targetMember} проигнорировал(-а) тебя`,
                                footer: {
                                    text: message.author.username,
                                    icon_url: message.author.displayAvatarURL({ dynamic: true })
                                },
                                timestamp: Date.now()
                            }
                        })
                            .catch(() => { });
                        return;
                    }
                }
            }
            const price = Math.floor(Math.random() * (priceDiff + 1)) + minPrice;
            userDoc.gold -= price;
            userDoc.save();
            const replies = (isDouble
                ? info.doubleReplies
                : info.singleReplies);
            const image = info.images[Math.floor(Math.random() * info.images.length)];
            const replyTemplate = replies[Math.floor(Math.random() * replies.length)];
            const reply = formatReplyTemplate(replyTemplate, message.author, (targetMember || {}).user);
            const embed = {
                color: config.meta.defaultColor,
                title: `Реакция: ${info.name.toLowerCase()}`,
                description: reply,
                footer: {
                    text: `${message.author.tag} • стоимость ${price.toLocaleString('ru-RU')} ${Util.pluralNoun(price, 'золото', 'золота', 'золота')}`,
                    icon_url: message.author.displayAvatarURL({ dynamic: true })
                },
                timestamp: Date.now()
            };
            if (image)
                embed.image = { url: image };
            if (confirmMsg)
                confirmMsg.edit('', { embed }).catch(() => { });
            else
                message.channel.send({ embed }).catch(() => { });
        }
    };
}
const commands = reactions_1.default.map(info => reactionCommand(info));
class ReactionsCommand extends Command_1.default {
    get options() {
        return { name: 'реакции' };
    }
    execute(message) {
        message.author
            .send({
            embed: {
                color: config.meta.defaultColor,
                title: '              Все доступные реакции',
                description: '```fix\nРеакция на одного              Реакция для двоих\n```\n```diff\n!смущаюсь — Смущаться    ╏  !погладить @user — приголубить\n!радуюсь — Радоваться    ╏  !кусь @user — укусить \n!сплю — Спать            ╏  !ласкать @user — приласкать\n!курю — Курить           ╏  !любовь @user — пристрастие\n!плачу — Плакать         ╏  !обнять @user — облапить\n!смеюсь — Смееятся       ╏  !поцеловать @user — коснуться\n!пью чай — Пить чай      ╏  !тык @user — дотронуться\n!танец — Танцевать       ╏  !ударить @user — задеть\n!грусть — Грустить       ╏  !выстрелить @user — нажать курок\n!шок — Потрясение        ╏  !лизнуть @user — облизать\n!еда - Кушать еду        ╏  !секс @user — половая активность \n!бежать — Убегать        ╏  !пощечина @user — удар\n```'
            }
        })
            .catch(() => { });
    }
}
module.exports = [...commands, ReactionsCommand];
//# sourceMappingURL=reactions.js.map