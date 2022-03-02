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
const node_fetch_1 = __importDefault(require("node-fetch"));
const discore_js_1 = require("discore.js");
const main_1 = __importDefault(require("../main"));
const Util = __importStar(require("../utils/util"));
const config = __importStar(require("../config"));
const db_1 = require("../utils/db");
class default_1 extends discore_js_1.Event {
    get options() {
        return { name: 'raw' };
    }
    async run(packet) {
        if (!packet)
            return;
        if (!packet.d)
            return;
        if (packet.t !== 'MESSAGE_REACTION_ADD')
            return;
        const clientUser = main_1.default.user;
        if (packet.d.user_id === clientUser.id)
            return;
        let verification = (await db_1.VerificationMessage.findOne({
            messageID: packet.d.message_id
        }).catch(() => { })) || {
            userID: undefined,
            messageID: undefined,
            channelID: undefined,
            emoji: undefined
        };
        if (verification.messageID !== packet.d.message_id) {
            verification.emoji = config.emojis.verification.id;
            verification.messageID = config.ids.messages.verification;
        }
        const emoji = packet.d.emoji || {};
        const emojiID = emoji.id || emoji.name;
        if (verification.emoji !== emojiID)
            return;
        const guild = Util.getMainGuild();
        const member = await guild.members.fetch(packet.d.user_id);
        if (!member)
            return;
        if (!member.roles.cache.has(config.ids.roles.gender.null))
            return;
        await member.roles.remove(config.ids.roles.gender.null).catch(() => { });
        member.roles.add('730204767426707467').catch(() => { });
        const dmVerification = verification.userID !== packet.d.user_id
            ? await db_1.VerificationMessage.findOne({
                userID: packet.d.user_id
            }).catch(() => { })
            : verification;
        if (dmVerification && dmVerification.channelID) {
            const url = `https://discord.com/api/v8/channels/${dmVerification.channelID}/messages/${dmVerification.messageID}`;
            (0, node_fetch_1.default)(url, {
                method: 'DELETE',
                headers: {
                    Authorization: `${clientUser.bot ? 'Bot ' : ''}${main_1.default.token}`
                }
            }).catch(() => { });
        }
        db_1.VerificationMessage.deleteMany({ userID: packet.d.user_id }).catch(() => { });
        const channel = this.client.channels.cache.get(config.meta.welcomeChannelID);
        if (!channel)
            return;
        channel
            .send(String(member), {
            embed: {
                color: 0x2f3136,
                title: '╸                          Добро пожаловать                          ╺',
                description: 'Мы очень рады, что ты заглянул именно к нам, в данный сервер вложена частичка души и любви каждого из создателей и мы надеемся, что вам у нас понравится!',
                image: { url: 'https://imgur.com/pfCUNBI.gif' }
            }
        })
            .then(msg => msg.delete({ timeout: 3e4 }))
            .catch(() => { });
    }
}
exports.default = default_1;
//# sourceMappingURL=verification.js.map