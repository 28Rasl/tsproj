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
exports.Leave = exports.Switch = exports.Join = void 0;
const discore_js_1 = require("discore.js");
const discord_js_1 = require("discord.js");
const Util = __importStar(require("../utils/util"));
const db_1 = require("../utils/db");
async function unvanish(state) {
    const { channel, channelID, guild } = state;
    if (!guild)
        return;
    if (!channel)
        return;
    if (!Util.verifyGuild(guild.id))
        return;
    const pairDoc = await db_1.Pair.findOne({ roomID: channelID });
    if (!pairDoc)
        return;
    const everyonePerms = channel.permissionOverwrites.get(guild.id);
    if (everyonePerms &&
        everyonePerms.allow.has(discord_js_1.Permissions.FLAGS.VIEW_CHANNEL)) {
        return;
    }
    channel.updateOverwrite(guild.id, { VIEW_CHANNEL: true }).catch(() => { });
}
async function vanish(state) {
    const { channelID, guild } = state;
    if (!guild)
        return;
    if (!channelID)
        return;
    if (!Util.verifyGuild(guild.id))
        return;
    const channel = guild.channels.cache.get(channelID);
    if (!channel)
        return;
    const pairDoc = await db_1.Pair.findOne({ roomID: channelID });
    if (!pairDoc)
        return;
    if (channel.members.size > 0)
        return;
    const everyonePerms = channel.permissionOverwrites.get(guild.id);
    if (everyonePerms && everyonePerms.deny.has(discord_js_1.Permissions.FLAGS.VIEW_CHANNEL)) {
        return;
    }
    channel.updateOverwrite(guild.id, { VIEW_CHANNEL: false }).catch(() => { });
}
class Join extends discore_js_1.Event {
    get options() {
        return { name: 'voiceChannelJoin' };
    }
    async run(_, state) {
        unvanish(state);
    }
}
exports.Join = Join;
class Switch extends discore_js_1.Event {
    get options() {
        return { name: 'voiceChannelSwitch' };
    }
    async run(oldState, newState) {
        unvanish(newState);
        vanish(oldState);
    }
}
exports.Switch = Switch;
class Leave extends discore_js_1.Event {
    get options() {
        return { name: 'voiceChannelLeave' };
    }
    async run(state, _) {
        vanish(state);
    }
}
exports.Leave = Leave;
//# sourceMappingURL=loveroomvisibility.js.map