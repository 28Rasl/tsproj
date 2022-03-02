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
const discord_js_1 = require("discord.js");
const main_1 = __importDefault(require("../main"));
const Command_1 = __importDefault(require("../structures/Command"));
const PreviewMessage_1 = __importDefault(require("../structures/PreviewMessage"));
const config = __importStar(require("../config"));
class EditCommand extends Command_1.default {
    get cOptions() {
        return {
            suppressArgs: true,
            allowedPerms: discord_js_1.Permissions.FLAGS.ADMINISTRATOR
        };
    }
    async execute(message, args) {
        const sendError = (content) => {
            message.channel
                .send(content)
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
        };
        const messageLink = args[0] || '';
        const regex = /https:\/\/(canary\.)?discord(?:app)?\.com\/channels\/\d+\/(?<channel>\d+)\/(?<message>\d+)/;
        const linkMatch = messageLink.match(regex);
        if (!linkMatch) {
            sendError({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Укажите корректную ссылку к сообщению'
                }
            });
            return;
        }
        const groups = linkMatch.groups;
        const channel = main_1.default.channels.cache.get(groups.channel);
        if (!channel) {
            sendError({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Канал не найден'
                }
            });
            return;
        }
        if (!('messages' in channel)) {
            sendError({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Укажите корректную ссылку к сообщению'
                }
            });
            return;
        }
        const textChannel = channel;
        const msg = await textChannel.messages.fetch(groups.message).catch(() => { });
        if (!msg) {
            sendError({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Сообщение не найдено'
                }
            });
            return;
        }
        const msgEmbed = msg.embeds[0] || {};
        delete msgEmbed.type;
        if (msgEmbed.author)
            delete msgEmbed.author.proxy_icon_url;
        if (msgEmbed.footer)
            delete msgEmbed.footer.proxy_icon_url;
        if (msgEmbed.image) {
            delete msgEmbed.image.width;
            delete msgEmbed.image.height;
            delete msgEmbed.image.proxy_url;
        }
        if (msgEmbed.thumbnail) {
            delete msgEmbed.thumbnail.width;
            delete msgEmbed.thumbnail.height;
            delete msgEmbed.thumbnail.proxy_url;
        }
        const embedCode = {
            content: msg.content || '',
            ...(msg.embeds[0] || {}),
            title: msgEmbed.title || undefined,
            description: msgEmbed.description || undefined,
            url: msgEmbed.url || undefined,
            color: msgEmbed.color || undefined,
            author: msgEmbed.author || undefined,
            thumbnail: msgEmbed.thumbnail || undefined,
            image: msgEmbed.image || undefined,
            video: msgEmbed.video || undefined,
            footer: msgEmbed.footer || undefined,
            timestamp: msgEmbed.timestamp || undefined
        };
        const previewMsg = new PreviewMessage_1.default(embedCode, message.author);
        if (!(await previewMsg.send(message.channel))) {
            sendError({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'Не удалось отобразить превью'
                }
            });
            return;
        }
        await previewMsg.ask();
        if (previewMsg.returned)
            return;
        const embed = { ...previewMsg.code };
        const content = embed.content || '';
        delete embed.content;
        msg.edit(content, { embed }).catch(() => { });
    }
}
exports.default = EditCommand;
//# sourceMappingURL=edit.js.map