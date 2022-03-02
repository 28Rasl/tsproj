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
const main_1 = __importDefault(require("../../main"));
const Command_1 = __importDefault(require("../../structures/Command"));
const loveroom_1 = __importDefault(require("../../managers/loveroom"));
const config = __importStar(require("../../config"));
class LeaveCommand extends Command_1.default {
    get options() {
        return { name: 'бросить' };
    }
    get cOptions() {
        return { guildOnly: true };
    }
    async execute(message, _) {
        const loveroom = loveroom_1.default.resolve(message.author.id);
        if (!loveroom) {
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    description: 'У вас нет пары'
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.errorMsgDeletion }))
                .catch(() => { });
            return;
        }
        loveroom.delete();
        const channel = (main_1.default.channels.cache.get(config.ids.channels.text.mainChat) || message.channel);
        channel
            .send({
            embed: {
                color: config.meta.defaultColor,
                title: 'РАССТАВАНИЕ',
                thumbnail: {
                    url: 'https://trello-attachments.s3.amazonaws.com/5f2c64227f1bad69a9378622/5f2d182cbb42e72dbfdd927c/7d8f1cb87ee6b8d9f4e32bbcf16e4efd/ras.gif'
                },
                description: [
                    `<@${loveroom.pair[0]}> и <@${loveroom.pair[1]}>, Расставание — великая штука. Кажется, что оно всегда дает больше, чем забирает. Комната была удалена.`,
                    '',
                    'И такое в жизни случается, ничто не вечно в этом мире, тем более любовь. Встретите еще тех самых любимых людей.'
                ].join('\n')
            }
        })
            .then(msg => msg.delete({ timeout: config.meta.msgDeletion }))
            .catch(() => { });
    }
}
exports.default = LeaveCommand;
//# sourceMappingURL=leave.js.map