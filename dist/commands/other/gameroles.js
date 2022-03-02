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
const config = __importStar(require("../../config"));
const db_1 = require("../../utils/db");
const Command_1 = __importDefault(require("../../structures/Command"));
class EventroleCommand extends Command_1.default {
    get options() {
        return { name: 'игровыероли' };
    }
    execute(message, _, { guild, member }) {
        db_1.User.getOne({ userID: member.id }).then(userDoc => {
            userDoc.gameroles = !userDoc.gameroles;
            userDoc.save();
            if (!userDoc.gameroles) {
                const roles = Object.values(config.ids.roles.games).filter(id => {
                    return member.roles.cache.has(id);
                });
                if (roles.length > 0)
                    member.roles.remove(roles).catch(() => { });
            }
            message.channel
                .send({
                embed: {
                    color: config.meta.defaultColor,
                    author: {
                        name: message.author.tag,
                        icon_url: message.author.displayAvatarURL({ dynamic: true })
                    },
                    title: `Игровые роли | ${guild.name}`,
                    description: `Вы ${userDoc.gameroles ? 'включили' : 'отключили'} выдачу игровых ролей`
                }
            })
                .then(msg => msg.delete({ timeout: config.meta.msgDeletion }))
                .catch(() => { });
        });
    }
}
exports.default = EventroleCommand;
//# sourceMappingURL=gameroles.js.map