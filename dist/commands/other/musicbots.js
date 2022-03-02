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
const musicbots_1 = __importDefault(require("../../musicbots"));
const Util = __importStar(require("../../utils/util"));
const config = __importStar(require("../../config"));
class MusicbotsCommand extends Command_1.default {
    get options() {
        return { name: 'музыкальные боты' };
    }
    async execute(message) {
        const guild = message.guild;
        const promises = musicbots_1.default.map(i => {
            return Util.resolveMember(i.id, guild).then(m => ({ member: m, info: i }));
        });
        Promise.all(promises)
            .then(res => res.filter(r => r.member))
            .then(res => {
            message.channel.send({
                embed: {
                    color: config.meta.defaultColor,
                    fields: res.map(r => {
                        const member = r.member;
                        const statusCode = member.voice.channelID ? 0 : 1;
                        return {
                            name: `> ${r.info.emoji} ${member.user.username}`,
                            value: [
                                `> Префикс: \`${r.info.prefix}\``,
                                `> Состояние: ${config.meta.emojis.status[statusCode]}`
                            ].join('\n'),
                            inline: true
                        };
                    })
                }
            });
        });
    }
}
exports.default = MusicbotsCommand;
//# sourceMappingURL=musicbots.js.map