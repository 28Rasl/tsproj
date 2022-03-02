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
const Util = __importStar(require("../utils/util"));
const config = __importStar(require("../config"));
const db_1 = require("../utils/db");
const main_1 = __importStar(require("../main"));
const { createPrivate: createPrivateID } = config.ids.channels.voice;
class PrivateRoomManager {
    static resolveName(state) {
        const { member } = state;
        const displayName = (member || {}).displayName || 'unknown';
        return config.meta.privateRoomName.replace(/{nickname}/g, displayName);
    }
    static resolvePerms(state) {
        const metaPerms = config.meta.permissions.privateroom;
        const overwrites = [
            ...metaPerms.default,
            {
                id: state.guild.id,
                allow: metaPerms.everyone.allow || 0,
                deny: metaPerms.everyone.deny || 0
            }
        ];
        if (state.member) {
            overwrites.push({
                id: state.member.id,
                allow: metaPerms.creator.allow || 0,
                deny: metaPerms.creator.deny || 0
            });
        }
        return overwrites;
    }
    static create(state) {
        const { channelID, channel, guild, member } = state;
        if (!member)
            return;
        if (!channelID)
            return;
        if (channelID !== createPrivateID)
            return;
        if (channel) {
            channel.updateOverwrite(member.id, { CONNECT: false }).catch(() => { });
            setTimeout(() => {
                const newOverwrites = channel.permissionOverwrites.filter((_, k) => {
                    return k !== member.id;
                });
                channel.overwritePermissions(newOverwrites).catch(() => { });
            }, 3e4);
        }
        guild.channels
            .create(this.resolveName(state), {
            type: 'voice',
            parent: config.ids.categories.privaterooms,
            userLimit: 2,
            permissionOverwrites: this.resolvePerms(state)
        })
            .then(channel => {
            db_1.PrivateRoom.insertOne({ roomID: channel.id, ownerID: member.id });
            main_1.privaterooms.set(channel.id, { roomID: channel.id, ownerID: member.id });
            member.voice.setChannel(channel.id).catch(() => { });
        })
            .catch(() => member.voice.setChannel(null).catch(() => { }));
    }
    static clean(state) {
        const { channelID, member } = state;
        if (!member)
            return;
        if (!channelID)
            return;
        if (!main_1.privaterooms.has(channelID))
            return;
        const channel = main_1.default.channels.cache.get(channelID);
        if (!channel)
            return;
        if (channel.members.size > 0)
            return;
        db_1.PrivateRoom.deleteOne({ roomID: channelID });
        main_1.privaterooms.delete(channelID);
        channel.delete().catch(() => { });
    }
    static onJoin(state) {
        if (!Util.verifyGuild(state.guild.id))
            return;
        PrivateRoomManager.create(state);
    }
    static onSwitch(oldState, newState) {
        if (!Util.verifyGuild(newState.guild.id))
            return;
        const member = newState.member;
        if (!member)
            return;
        const partialOlds = {};
        partialOlds.channelID = oldState.channelID;
        partialOlds.channel = partialOlds.channelID
            ? main_1.default.channels.cache.get(partialOlds.channelID)
            : null;
        partialOlds.privateroom = partialOlds.channelID
            ? main_1.privaterooms.get(partialOlds.channelID)
            : null;
        partialOlds.isCreateroom = Boolean(partialOlds.channelID && partialOlds.channelID === createPrivateID);
        const partialNews = {};
        partialNews.channelID = newState.channelID;
        partialNews.channel = partialNews.channelID
            ? main_1.default.channels.cache.get(partialNews.channelID)
            : null;
        partialNews.privateroom = partialNews.channelID
            ? main_1.privaterooms.get(partialNews.channelID)
            : null;
        partialNews.isCreateroom = Boolean(partialNews.channelID && partialNews.channelID === createPrivateID);
        const olds = partialOlds;
        const news = partialNews;
        const oldChannelSize = olds.channel ? olds.channel.members.size : 1;
        if (olds.privateroom && news.isCreateroom && oldChannelSize < 1) {
            newState.setChannel(olds.channelID).catch(() => { });
            if (olds.privateroom.ownerID !== member.id) {
                db_1.PrivateRoom.updateOne({ roomID: olds.channelID }, { ownerID: member.id });
                main_1.privaterooms.set(olds.channelID, {
                    roomID: olds.channelID,
                    ownerID: member.id
                });
                olds.channel
                    .edit({
                    name: PrivateRoomManager.resolveName(newState),
                    permissionOverwrites: PrivateRoomManager.resolvePerms(oldState)
                })
                    .catch(() => { });
            }
            return;
        }
        PrivateRoomManager.create(newState);
        PrivateRoomManager.clean(oldState);
    }
    static onLeave(state) {
        if (!Util.verifyGuild(state.guild.id))
            return;
        PrivateRoomManager.clean(state);
    }
}
exports.default = PrivateRoomManager;
//# sourceMappingURL=PrivateRoomManager.js.map