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
const discore_js_1 = require("discore.js");
const Util = __importStar(require("../utils/util"));
const config = __importStar(require("../config"));
const db_1 = require("../utils/db");
class default_1 extends discore_js_1.Event {
    get options() {
        return { name: 'guildMemberAdd' };
    }
    run(member) {
        if (member.user.bot)
            return;
        if (!Util.verifyMainGuild(member.guild.id))
            return;
        member.roles.add(config.ids.roles.gender.null).catch(() => { });
        member
            .send({
            embed: {
                color: config.meta.defaultColor,
                title: '●───────❪⠀ВЕРИФИКАЦИЯ⠀❫───────●',
                description: 'Для доступа к серверу нажмите на реакцию ниже!',
                image: { url: 'https://imgur.com/auiGGZN.gif' },
                footer: {
                    text: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Добро пожаловать на сервер ETHΣREAL'
                }
            }
        })
            .then(msg => {
            db_1.VerificationMessage.insertOne({
                userID: member.id,
                messageID: msg.id,
                channelID: msg.channel.id,
                emoji: config.emojis.verification.id
            });
            msg.react(config.emojis.verification.id).catch(() => { });
        })
            .catch(() => { });
    }
}
exports.default = default_1;
//# sourceMappingURL=newmemberrole.js.map