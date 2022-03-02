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
const { createEvent: createEventID } = config.ids.channels.voice;
class EventManager {
    static resolveName(state) {
        const { member } = state;
        const displayName = (member || {}).displayName || 'unknown';
        return config.meta.eventRoomName.replace(/{nickname}/g, displayName);
    }
    static resolvePerms(state) {
        const metaPerms = config.meta.permissions.event;
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
    static async create(state) {
        const { channelID, channel, guild, member } = state;
        if (!member)
            return;
        if (!channelID)
            return;
        if (channelID !== createEventID)
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
        const name = this.resolveName(state);
        const perms = this.resolvePerms(state);
        const [room, chat] = await Promise.all([
            guild.channels.create(name, {
                type: 'voice',
                parent: config.ids.categories.events,
                userLimit: 2,
                permissionOverwrites: perms
            }),
            guild.channels.create(name, {
                type: 'text',
                parent: config.ids.categories.events,
                permissionOverwrites: perms
            })
        ]).catch(() => {
            return [];
        });
        if (!room || !chat) {
            if (room)
                room.delete().catch(() => { });
            if (chat)
                chat.delete().catch(() => { });
            member.voice.setChannel(null).catch(() => { });
            return;
        }
        const closeData = {
            roomID: room.id,
            chatID: chat.id,
            ownerID: member.id
        };
        db_1.Event.insertOne(closeData);
        main_1.events.set(room.id, closeData);
        member.voice.setChannel(room.id).catch(() => { });
    }
    static clean(state) {
        const { channelID, member } = state;
        if (!member)
            return;
        if (!channelID)
            return;
        if (!main_1.events.has(channelID))
            return;
        const channel = main_1.default.channels.cache.get(channelID);
        if (!channel)
            return;
        if (channel.members.size > 0)
            return;
        channel.delete().catch(() => { });
    }
    static onJoin(state) {
        if (!Util.verifyGuild(state.guild.id))
            return;
        EventManager.create(state);
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
        partialOlds.close = partialOlds.channelID
            ? main_1.events.get(partialOlds.channelID)
            : null;
        partialOlds.isCreateroom = Boolean(partialOlds.channelID && partialOlds.channelID === createEventID);
        const partialNews = {};
        partialNews.channelID = newState.channelID;
        partialNews.channel = partialNews.channelID
            ? main_1.default.channels.cache.get(partialNews.channelID)
            : null;
        partialNews.close = partialNews.channelID
            ? main_1.events.get(partialNews.channelID)
            : null;
        partialNews.isCreateroom = Boolean(partialNews.channelID && partialNews.channelID === createEventID);
        const olds = partialOlds;
        const news = partialNews;
        const oldChannelSize = olds.channel ? olds.channel.members.size : 1;
        if (olds.close && news.isCreateroom && oldChannelSize < 1) {
            newState.setChannel(olds.channelID).catch(() => { });
            if (olds.close.ownerID !== member.id) {
                const newData = {
                    roomID: olds.close.roomID,
                    chatID: olds.close.chatID,
                    ownerID: member.id
                };
                db_1.Event.updateOne({ roomID: olds.channelID }, newData);
                main_1.events.set(olds.channelID, newData);
                const newName = EventManager.resolveName(newState);
                const newPerms = EventManager.resolvePerms(oldState);
                olds.channel
                    .edit({
                    name: newName,
                    permissionOverwrites: newPerms
                })
                    .catch(() => { });
                const chat = main_1.default.channels.cache.get(olds.close.chatID);
                if (chat) {
                    chat
                        .edit({ name: newName, permissionOverwrites: newPerms })
                        .catch(() => { });
                }
            }
            return;
        }
        EventManager.create(newState);
        EventManager.clean(oldState);
    }
    static onLeave(state) {
        if (!Util.verifyGuild(state.guild.id))
            return;
        EventManager.clean(state);
    }
    static onDelete(channel) {
        const eventData = main_1.events.get(channel.id) ||
            [...main_1.events.values()].find(c => c.chatID === channel.id);
        if (!eventData)
            return;
        const room = main_1.default.channels.cache.get(eventData.roomID);
        const chat = main_1.default.channels.cache.get(eventData.chatID);
        if (room)
            room.delete().catch(() => { });
        if (chat)
            chat.delete().catch(() => { });
        db_1.Event.deleteOne({ roomID: eventData.roomID });
        main_1.events.delete(eventData.roomID);
    }
}
exports.default = EventManager;
//# sourceMappingURL=EventManager.js.map