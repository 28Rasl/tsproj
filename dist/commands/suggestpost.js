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
const config = __importStar(require("../config"));
class default_1 extends Command_1.default {
    get options() {
        return { name: 'предложить новость' };
    }
    async execute(message, args) {
        if (message.channel.type !== 'dm')
            return;
        const typeArg = args.shift() || '';
        const typeKey = typeArg.toLowerCase();
        const channelType = config.postTypes[typeKey];
        if (!channelType)
            return;
        const channelID = config.postChannels[channelType];
        if (!channelID)
            return;
        const channel = main_1.default.channels.cache.get(channelID);
        if (!channel)
            return;
        let url = args.join(' ');
        if (url.length < 1)
            url = null;
        const attachment = message.attachments.first();
        if (!url && !attachment)
            return;
        url = (attachment || { url }).url;
        if (typeof url !== 'string')
            return;
        const filename = `image.${url.endsWith('.gif') ? 'gif' : 'png'}`;
        const embed = new discord_js_1.MessageEmbed({
            files: [{ attachment: url, name: filename }],
            color: 0x2f3136,
            author: {
                name: message.author.username,
                icon_url: message.author.displayAvatarURL({ dynamic: true })
            },
            image: { url: `attachment://${filename}` }
        });
        const msg = await channel.send(embed).catch(() => { });
        if (!msg)
            return;
        message.author
            .send('Ваш пост отправлен на проверку модерации!')
            .catch(() => { });
        // ImgRequest.insertMany([{ msgID: msg.id, channelID: channelID.channelID }])
        await msg.react('698596668769173645').catch(() => { });
        msg.react('698590387002146816').catch(() => { });
    }
}
exports.default = default_1;
//# sourceMappingURL=suggestpost.js.map