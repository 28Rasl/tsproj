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
const Command_1 = __importDefault(require("../structures/Command"));
const config = __importStar(require("../config"));
const util_1 = require("../utils/util");
class SayCommand extends Command_1.default {
    get cOptions() {
        return {
            suppressArgs: false,
            allowedRoles: config.access.commands.say
        };
    }
    async execute(message, args) {
        const attachment = message.attachments.first();
        const rawJson = args.join(' ') || (await (0, util_1.getEmbedCode)(attachment)) || '';
        let json;
        try {
            json = JSON.parse(rawJson);
        }
        catch (err) {
            message
                .reply(`Ошибка обработки: ${err}`)
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
        }
        if (!json)
            return;
        const content = json.content || json.text || json.plainText || '';
        if (typeof json.thumbnail === 'string') {
            json.thumbnail = { url: json.thumbnail };
        }
        if (typeof json.image === 'string') {
            json.image = { url: json.image };
        }
        message.channel.send(content, { embed: json }).catch(err => {
            message
                .reply(`Ошибка отправки: ${err}`)
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
        });
    }
}
exports.default = SayCommand;
//# sourceMappingURL=say.js.map