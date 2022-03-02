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
exports.getReputationRank = exports.patchManagers = exports.resolveEmoji = exports.discordRetryHandler = exports.splitMessage = exports.genInventoryMsg = exports.genActivationsMsg = exports.repeat = exports.checkTemproles = exports.checkTemprooms = exports.checkTemps = exports.resolveHex = exports.getReactionStatic = exports.getReaction = exports.pluralNoun = exports.getNounPluralForm = exports.processPrefixes = exports.react = exports.confirm = exports.verifyMainGuild = exports.verifyGuild = exports.fetchPrivaterooms = exports.cleanupPrivaterooms = exports.openCreateroom = exports.cleanupVoiceActivity = exports.fetchVoiceMembers = exports.checkMainGuildExistance = exports.readyMessage = exports.enableEvents = exports.disableEvents = exports.parseVoiceActivity = exports.filterOutOfWeekActivity = exports.filterWeekActivity = exports.resolveUserID = exports.resolveMentionUserID = exports.validatePrivateroom = exports.resolveMember = exports.parseFilteredTimeString = exports.parseTimeString = exports.parseFilteredTimeArray = exports.parseTimeArray = exports.parseFilteredFullTimeString = exports.parseFullTimeString = exports.parseFilteredFullTimeArray = exports.parseFullTimeArray = exports.parseFullTime = exports.parseTime = exports.getMainGuild = exports.eventStates = exports.runTick = void 0;
exports.setStatus = exports.setBanner = exports.getEmbedCode = exports.calculateActivityRewards = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const chalk = __importStar(require("chalk"));
const moment = require("moment-timezone");
const discord_js_1 = require("discord.js");
const goods_1 = __importDefault(require("../goods"));
const main_1 = __importDefault(require("../main"));
const emojiRegex_1 = __importDefault(require("./emojiRegex"));
const Collection_1 = __importDefault(require("../structures/Collection"));
const clan_1 = __importDefault(require("../managers/clan"));
const loveroom_1 = __importDefault(require("../managers/loveroom"));
const config = __importStar(require("../config"));
const logger = __importStar(require("../utils/logger"));
const main_2 = require("../main");
const db_1 = require("./db");
const canvas_1 = __importDefault(require("./canvas/canvas"));
exports.runTick = Date.now();
exports.eventStates = new Collection_1.default();
function getMainGuild() {
    console.log('zdd');
    //return client.guilds.cache.get(config.ids.guilds.main)
    return main_1.default.guilds.cache.get(config.ids.guilds.main);
    //return client.guilds.cache.get('815991314835308564')
}
exports.getMainGuild = getMainGuild;
function parseTime(time) {
    const parsed = {
        h: Math.floor(time / 3.6e6),
        m: Math.floor(time / 6e4) % 60,
        s: Math.ceil(time / 1e3) % 60
    };
    return parsed;
}
exports.parseTime = parseTime;
function parseFullTime(time) {
    const parsed = {
        w: Math.floor(time / 6.048e8),
        d: Math.floor(time / 8.64e7) % 7,
        h: Math.floor(time / 3.6e6) % 24,
        m: Math.floor(time / 6e4) % 60,
        s: Math.ceil(time / 1e3) % 60
    };
    return parsed;
}
exports.parseFullTime = parseFullTime;
function parseFullTimeArray(time) {
    const parsed = parseFullTime(time);
    return Object.entries(parsed).map(([k, v]) => {
        return `${v}${config.meta.timeSpelling[k]}`;
    });
}
exports.parseFullTimeArray = parseFullTimeArray;
function parseFilteredFullTimeArray(time) {
    const parsed = parseFullTime(time);
    const res = Object.entries(parsed)
        .filter(([_, v]) => v > 0)
        .map(([k, v]) => {
        return `${v}${config.meta.timeSpelling[k]}`;
    });
    return res.length === 0 ? [`0${config.meta.timeSpelling['s']}`] : res;
}
exports.parseFilteredFullTimeArray = parseFilteredFullTimeArray;
function parseFullTimeString(time) {
    return parseFullTimeArray(time).join(' ');
}
exports.parseFullTimeString = parseFullTimeString;
function parseFilteredFullTimeString(time) {
    return parseFilteredFullTimeArray(time).join(' ');
}
exports.parseFilteredFullTimeString = parseFilteredFullTimeString;
function parseTimeArray(time) {
    const parsed = parseTime(time);
    return Object.entries(parsed).map(([k, v]) => {
        return `${v}${config.meta.timeSpelling[k]}.`;
    });
}
exports.parseTimeArray = parseTimeArray;
function parseFilteredTimeArray(time) {
    const parsed = parseTime(time);
    const res = Object.entries(parsed)
        .filter(([_, v]) => v > 0)
        .map(([k, v]) => {
        return `${v}${config.meta.timeSpelling[k]}.`;
    });
    return res.length === 0 ? [`0${config.meta.timeSpelling['s']}`] : res;
}
exports.parseFilteredTimeArray = parseFilteredTimeArray;
function parseTimeString(time) {
    return parseTimeArray(time).join(' ');
}
exports.parseTimeString = parseTimeString;
function parseFilteredTimeString(time) {
    return parseFilteredTimeArray(time).join(' ');
}
exports.parseFilteredTimeString = parseFilteredTimeString;
async function resolveMember(mention, guild = getMainGuild()) {
    return new Promise(resolve => {
        if (!guild)
            return resolve(null);
        const targetID = resolveUserID(mention) || mention;
        if (!targetID)
            return resolve(null);
        resolve(guild.members.fetch(targetID).catch(() => null));
    });
}
exports.resolveMember = resolveMember;
function validatePrivateroom(member, channel) {
    if (!channel)
        return false;
    if (!main_2.privaterooms.has(channel.id))
        return false;
    const permissionOverwrites = channel.permissionOverwrites.get(member.id);
    if (!permissionOverwrites)
        return false;
    const flags = discord_js_1.Permissions.FLAGS.MANAGE_CHANNELS;
    if (!permissionOverwrites.allow.has(flags))
        return false;
    return true;
}
exports.validatePrivateroom = validatePrivateroom;
function resolveMentionUserID(mention = '') {
    const regex = /^<@!?(\d+)>$/;
    const match = mention.match(regex);
    if (!match)
        return null;
    return match[1];
}
exports.resolveMentionUserID = resolveMentionUserID;
function resolveUserID(mention) {
    if (/^\d+$/.test(mention))
        return mention;
    return resolveMentionUserID(mention);
}
exports.resolveUserID = resolveUserID;
function filterWeekActivity(voiceActivity) {
    const weekMs = 6.048e8;
    const va = [...voiceActivity.map(a => [...a])];
    const weekActivity = va.filter(a => {
        return a[1] ? a[1] > Date.now() - weekMs : true;
    });
    if (weekActivity[0]) {
        weekActivity[0][0] = Math.max(weekActivity[0][0], Date.now() - weekMs);
    }
    return weekActivity;
}
exports.filterWeekActivity = filterWeekActivity;
function filterOutOfWeekActivity(voiceActivity) {
    const weekMs = 6.048e8;
    const va = [...voiceActivity.map(a => [...a])].filter(a => {
        return a[0] < Date.now() - weekMs;
    });
    const lastActivityIndex = va.length - 1;
    if (lastActivityIndex > -1) {
        va[lastActivityIndex][1] = Math.min(va[lastActivityIndex][1], Date.now() - weekMs);
    }
    return va;
}
exports.filterOutOfWeekActivity = filterOutOfWeekActivity;
function parseVoiceActivity(voiceActivity) {
    const va = [...voiceActivity.map(a => [...a])];
    const lastActivity = va.slice(-1)[0];
    if (lastActivity && typeof lastActivity[1] !== 'number') {
        va[va.length - 1][1] = Date.now();
    }
    return va.map(a => a[1] - a[0]).reduce((p, c) => p + c, 0);
}
exports.parseVoiceActivity = parseVoiceActivity;
function disableEvents() {
    main_1.default.events
        .filter(e => e.name !== 'ready')
        .forEach(e => {
        exports.eventStates.set(e._id, { enabled: e.enabled });
        e.disable();
    });
}
exports.disableEvents = disableEvents;
function enableEvents() {
    ;
    [...exports.eventStates.entries()]
        .filter(([_, info]) => info.enabled)
        .map(([id]) => main_1.default.events.get(id))
        .forEach(e => e.enable());
}
exports.enableEvents = enableEvents;
function readyMessage() {
    const { tag } = main_1.default.user;
    logger.log(chalk.cyan.bold('[BOT]'), 'Started:', chalk.green(tag), 'in', `${chalk.yellow(Date.now() - exports.runTick)}ms`);
}
exports.readyMessage = readyMessage;
function checkMainGuildExistance() {
    const guild = getMainGuild();
    if (!guild) {
        logger.error(chalk.cyan.bold('[BOT]'), 'Main guild not found.', chalk.red.bold('Exiting..'));
        process.exit(1);
    }
}
exports.checkMainGuildExistance = checkMainGuildExistance;
function fetchVoiceMembers() {
    return new Promise(resolve => {
        const guild = getMainGuild();
        if (!guild)
            return resolve();
        const voiceMembers = guild.voiceStates.cache
            .filter(v => {
            if (!v.channel)
                return false;
            if (v.mute)
                return false;
            const filteredMembers = v.channel.members
                .filter(m => !m.voice.mute)
                .array();
            return Boolean(v.member && filteredMembers.length > 0);
        })
            .map(v => v.member);
        Promise.all(voiceMembers.map(m => db_1.User.getOne({ userID: m.id })))
            .then(docs => {
            const promises = [];
            for (const doc of docs) {
                doc.voiceActivity = [
                    ...doc.voiceActivity,
                    [Date.now()]
                ];
                promises.push(doc.save());
            }
            return Promise.all(promises);
        })
            .then(() => resolve())
            .catch(() => resolve());
    });
}
exports.fetchVoiceMembers = fetchVoiceMembers;
function cleanupVoiceActivity() {
    return db_1.User.getData()
        .then(data => [...data.values()])
        .then(docs => {
        const promises = [];
        for (const doc of docs) {
            const lastVoiceActivity = doc.voiceActivity.slice(-1)[0];
            if (lastVoiceActivity && lastVoiceActivity.length < 2) {
                doc.voiceActivity = doc.voiceActivity.slice(0, -1);
                promises.push(doc.save());
            }
        }
        return Promise.all(promises);
    })
        .then(() => { });
}
exports.cleanupVoiceActivity = cleanupVoiceActivity;
function openCreateroom() {
    const channel = main_1.default.channels.cache.get(config.ids.channels.voice.createPrivate);
    if (!channel)
        return;
    const permissionOverwrites = channel.permissionOverwrites
        .array()
        .filter(p => p.type !== 'member');
    channel.edit({ permissionOverwrites });
}
exports.openCreateroom = openCreateroom;
function cleanupPrivaterooms() {
    return db_1.PrivateRoom.getData().then(() => {
        for (const pr of [...main_2.privaterooms.values()]) {
            const channel = main_1.default.channels.cache.get(pr.roomID);
            if (!channel || channel.members.size < 1) {
                db_1.PrivateRoom.deleteOne({ roomID: channel.id });
                main_2.privaterooms.delete(channel.id);
                if (channel)
                    channel.delete().catch(() => { });
            }
        }
    });
}
exports.cleanupPrivaterooms = cleanupPrivaterooms;
function fetchPrivaterooms() {
    db_1.PrivateRoom.getData()
        .then(data => [...data.values()])
        .then(docs => {
        for (const doc of docs) {
            const { roomID, ownerID } = doc;
            main_2.privaterooms.set(roomID, { roomID, ownerID });
        }
    });
}
exports.fetchPrivaterooms = fetchPrivaterooms;
function verifyGuild(id) {
    return config.meta.allowedGuilds.includes(id);
}
exports.verifyGuild = verifyGuild;
function verifyMainGuild(id) {
    return config.ids.guilds.main === id;
}
exports.verifyMainGuild = verifyMainGuild;
function confirm(message, user, time = 7.2e6) {
    const emojis = config.meta.confirmEmojis;
    (async () => {
        try {
            for (const emoji of emojis)
                await react(message, emoji);
        }
        catch (_) { }
    })();
    return message
        .awaitReactions((r, u) => {
        return u.id === user.id && emojis.includes(r.emoji.id || r.emoji.name);
    }, { max: 1, time, errors: ['time'] })
        .then(collected => collected.first())
        .then(r => {
        if (!r)
            return null;
        return (r.emoji.id || r.emoji.name) === emojis[0];
    })
        .catch(() => {
        message.reactions.removeAll().catch(() => { });
        return null;
    });
}
exports.confirm = confirm;
function react(message, emojiID) {
    return new Promise((resolve, reject) => {
        const emoji = main_1.default.emojis.cache.get(emojiID) || emojiID;
        (0, node_fetch_1.default)(`https://discord.com/api/v7/channels/${message.channel.id}/messages/${message.id}/reactions/${encodeURIComponent(typeof emoji === 'string' ? emoji : `${emoji.name}:${emoji.id}`)}/@me`, { method: 'PUT', headers: { Authorization: `Bot ${main_1.default.token}` } })
            .then(res => {
            if (res.headers.get('content-type') === 'application/json') {
                return res.json();
            }
            else {
                return { retry_after: undefined };
            }
        })
            .then(res => {
            if (typeof res.retry_after === 'number') {
                setTimeout(() => resolve(react(message, emojiID)), res.retry_after);
            }
            else {
                resolve(res);
            }
        })
            .catch(reject);
    });
}
exports.react = react;
function processPrefixes() {
    main_1.default.commands.forEach(c => {
        if (typeof c.aliases === 'string')
            c.aliases = [c.aliases];
        const prefix = c.custom.prefix || config.internal.prefix;
        c.name = `${prefix}${c.name}`;
        c.aliases = c.aliases.map(a => `${prefix}${a}`);
    });
}
exports.processPrefixes = processPrefixes;
function getNounPluralForm(a) {
    if (a % 10 === 1 && a % 100 !== 11) {
        return 0;
    }
    else if (a % 10 >= 2 && a % 10 <= 4 && (a % 100 < 10 || a % 100 >= 20)) {
        return 1;
    }
    return 2;
}
exports.getNounPluralForm = getNounPluralForm;
function pluralNoun(num, ...forms) {
    if (forms.length === 1)
        throw new Error('Not enough forms');
    if (forms.length === 2)
        return num > 1 ? forms[1] : forms[0];
    return forms[getNounPluralForm(num)];
}
exports.pluralNoun = pluralNoun;
function getReaction(message, emojis, users, time = 7.2e6) {
    if (!Array.isArray(users))
        users = [users];
    if (!Array.isArray(emojis))
        emojis = [emojis];
    (async () => {
        try {
            for (const emoji of emojis)
                await react(message, emoji);
        }
        catch (_) { }
    })();
    return getReactionStatic(message, emojis, users, time);
}
exports.getReaction = getReaction;
function getReactionStatic(message, emojis, users, time = 7.2e6) {
    if (!Array.isArray(users))
        users = [users];
    if (!Array.isArray(emojis))
        emojis = [emojis];
    return message
        .awaitReactions((r, u) => {
        if (!emojis.includes(r.emoji.id || r.emoji.name))
            return false;
        const ids = users.map(u => u.id);
        if (!ids.includes(u.id))
            return false;
        return true;
    }, { max: 1, time, errors: ['time'] })
        .then(collected => collected.first())
        .then(r => {
        if (!r)
            return null;
        return r;
    })
        .catch(() => {
        message.reactions.removeAll().catch(() => { });
        return null;
    });
}
exports.getReactionStatic = getReactionStatic;
function resolveHex(hex) {
    const match = hex.match(/^#((?:[0-f]{3}){1,2})$/);
    if (!match)
        return null;
    hex = match[1];
    return hex.length === 3
        ? hex
            .split('')
            .map(c => c.repeat(2))
            .join('')
        : hex;
}
exports.resolveHex = resolveHex;
function checkTemps() {
    const interval = config.meta.checkInterval;
    checkTemproles(interval);
    checkTemprooms(interval);
    setTimeout(() => checkTemps(), interval);
}
exports.checkTemps = checkTemps;
function checkTemprooms(interval) {
    db_1.Temproom.getData()
        .then(data => [...data.values()])
        .then(docs => {
        return docs.filter(d => d.endTick && d.endTick - Date.now() < interval);
    })
        .then(docs => {
        const guild = getMainGuild();
        for (const doc of docs) {
            const until = doc.endTick - Date.now();
            setTimeout(() => {
                const channel = guild.channels.cache.get(doc.roomID);
                if (channel)
                    channel.delete().catch(() => { });
                db_1.Temproom.deleteOne({ roomID: doc.roomID });
            }, until);
        }
    });
}
exports.checkTemprooms = checkTemprooms;
function checkTemproles(interval) {
    db_1.Temprole.filter(d => d.endTick && d.endTick - Date.now() < interval)
        .then(data => [...data.values()])
        .then(docs => {
        const guild = getMainGuild();
        for (const doc of docs) {
            const until = doc.endTick - Date.now();
            setTimeout(() => {
                const { temprole1d, temprole3d, temprole7d } = config.ids.goods;
                if ([temprole1d, temprole3d, temprole7d].includes(doc.itemID)) {
                    const role = guild.roles.cache.get(doc.roleID);
                    if (role)
                        role.delete().catch(() => { });
                }
                else {
                    guild.members
                        .fetch(doc.userID)
                        .then(member => member.roles.remove(doc.roleID).catch(() => { }))
                        .catch(() => { });
                }
                db_1.Temprole.deleteOne({ roleID: doc.roleID });
            }, until);
        }
    });
}
exports.checkTemproles = checkTemproles;
function repeat(e, count) {
    const arr = [];
    for (let i = 0; i < count; i++)
        arr.push(e);
    return arr;
}
exports.repeat = repeat;
async function genActivationsMsg(user) {
    const [temproleData, temproomData] = await Promise.all([
        db_1.Temprole.filter({ userID: user.id }),
        db_1.Temproom.filter({ userID: user.id })
    ]);
    const temproleDocs = [...temproleData.values()].map(doc => ({
        ...doc,
        mention: `<@&${doc.roleID}>`
    }));
    const temproomDocs = [...temproomData.values()].map(doc => ({
        ...doc,
        mention: `<#${doc.roomID}>`
    }));
    const docs = [...temproleDocs, ...temproomDocs];
    return {
        embed: {
            color: config.meta.defaultColor,
            author: {
                name: user.tag,
                icon_url: user.displayAvatarURL({ dynamic: true })
            },
            title: 'Инвентарь пользователя',
            description: [
                'Предмет / Дата окончания',
                docs.length < 1
                    ? 'Пусто'
                    : docs
                        .map(doc => ({
                        id: doc.itemID,
                        emoji: main_1.default.emojis.cache.get(goods_1.default[doc.itemID]?.emoji) ||
                            main_1.default.emojis.cache.get(config.emojis.empty) ||
                            '',
                        mention: doc.mention,
                        endDate: doc.endTick
                            ? moment(doc.endTick)
                                .tz(config.meta.defaultTimezone)
                                .locale('ru-RU')
                                .format('lll')
                            : undefined
                    }))
                        .map(item => {
                        return `${`${item.emoji} `.trimLeft()}${item.mention} [ **${item.endDate || 'Неизвестно'}** ]`;
                    })
                        .join('\n')
            ].join('\n')
        }
    };
}
exports.genActivationsMsg = genActivationsMsg;
async function genInventoryMsg(user) {
    const userDoc = await db_1.User.getOne({ userID: user.id });
    const inv = Object.entries(userDoc.inventory);
    return {
        embed: {
            color: config.meta.defaultColor,
            author: {
                name: user.tag,
                icon_url: user.displayAvatarURL({ dynamic: true })
            },
            title: 'Инвентарь пользователя',
            description: inv.length < 1
                ? 'Пусто'
                : inv
                    .map(([id, count]) => ({
                    id,
                    name: goods_1.default[id].name,
                    emoji: main_1.default.emojis.cache.get(goods_1.default[id].emoji) ||
                        main_1.default.emojis.cache.get(config.emojis.empty) ||
                        '',
                    count
                }))
                    .filter(item => item.count > 0)
                    .map(item => {
                    return repeat(`${`${item.emoji} `.trimLeft()}${item.name}`, item.count).join('\n');
                })
                    .join('\n')
        }
    };
}
exports.genInventoryMsg = genInventoryMsg;
function splitMessage(text, { maxLength = 2000, char = '\n', prepend = '', append = '' } = {}) {
    if (Array.isArray(text))
        text = text.join('\n');
    if (text.length <= maxLength)
        return [text];
    const splitText = text.split(char);
    if (splitText.some(chunk => chunk.length > maxLength)) {
        throw new RangeError('SPLIT_MAX_LEN');
    }
    const messages = [];
    let msg = '';
    for (const chunk of splitText) {
        if (msg && (msg + char + chunk + append).length > maxLength) {
            messages.push(msg + append);
            msg = prepend;
        }
        msg += (msg && msg !== prepend ? char : '') + chunk;
    }
    return messages.concat(msg).filter(m => m);
}
exports.splitMessage = splitMessage;
function discordRetryHandler(input, init, tries = 0) {
    return new Promise((resolve, reject) => {
        (0, node_fetch_1.default)(`https://discord.com/api/v8/${input}`, init)
            .then(res => {
            if (res.headers.get('content-type') === 'application/json') {
                return res.json();
            }
            else {
                return { retry_after: undefined };
            }
        })
            .then(res => {
            if (typeof res.retry_after === 'number') {
                if (tries + 1 > 1)
                    return reject(new Error('Too many tries'));
                setTimeout(() => resolve(discordRetryHandler(input, init, tries + 1)), res.retry_after);
            }
            else {
                resolve(res);
            }
        })
            .catch(reject);
    });
}
exports.discordRetryHandler = discordRetryHandler;
function resolveEmoji(emojiID) {
    if (emojiRegex_1.default.test(emojiID))
        return emojiID;
    const emoji = main_1.default.emojis.cache.get(emojiID) ||
        main_1.default.emojis.cache.get(config.emojis.empty) ||
        '';
    return `${emoji} `.trimLeft();
}
exports.resolveEmoji = resolveEmoji;
function patchManagers() {
    db_1.Clan.getData().then(clans => {
        clans.forEach(clan => clan_1.default.save(clan.clanID, clan));
    });
    db_1.Pair.getData().then(pairs => {
        pairs.forEach(pair => {
            loveroom_1.default.save(pair.roomID, pair);
        });
    });
}
exports.patchManagers = patchManagers;
function getReputationRank(reputation) {
    const entries = Object.entries(config.repRanks).map(([k, v]) => [
        Number(k),
        v
    ]);
    const positiveEntries = entries
        .filter(([r]) => r > 0)
        .sort((b, a) => a[0] - b[0]);
    const negativeEntries = entries
        .filter(([r]) => r < 0)
        .sort((a, b) => a[0] - b[0]);
    const positiveEntry = positiveEntries.find(([r]) => r <= reputation);
    const negativeEntry = negativeEntries.find(([r]) => r >= reputation);
    return (positiveEntry ||
        negativeEntry || [0, config.repRanks['0']])[1];
}
exports.getReputationRank = getReputationRank;
async function calculateActivityRewards(member, doc) {
    const lastActivityTime = parseVoiceActivity(doc.voiceActivity.slice(0, -1));
    const activityTime = parseVoiceActivity([doc.voiceActivity.slice(-1)[0]]);
    doc.gold +=
        Math.floor((activityTime + (lastActivityTime % 3e5)) / 3e5) *
            (config.meta.goldDoublerRoles.some(id => member.roles.cache.has(id))
                ? 2
                : 1);
    doc.xp += Math.floor(((activityTime + (lastActivityTime % 3e5)) / 3e5) *
        (Math.random() * (15 - 5 + 1) + 5));
    const receivedChestCount = Math.floor((activityTime + (lastActivityTime % 4.32e7)) / 4.32e7);
    for (let i = 0; i < receivedChestCount; i++) {
        if (doc.lastChest === config.ids.chests.item) {
            doc.goldChests += 1;
            doc.lastChest = config.ids.chests.gold;
        }
        else {
            doc.itemChests += 1;
            doc.lastChest = config.ids.chests.item;
        }
    }
}
exports.calculateActivityRewards = calculateActivityRewards;
function getEmbedCode(attachment) {
    if (!attachment)
        return null;
    if (!attachment.attachment)
        return null;
    const url = (attachment.attachment || { toString() { } }).toString() || '';
    const regex = /^https:\/\/cdn\.discordapp\.com\/attachments\/\d+\/\d+\/.+\.txt/;
    if (!regex.test(url))
        return null;
    return (0, node_fetch_1.default)(url).then(res => res.text());
}
exports.getEmbedCode = getEmbedCode;
async function setBanner() {
    const banner = await canvas_1.default.makeBanner();
    const guild = getMainGuild();
    const clientUser = main_1.default.user;
    discordRetryHandler(`guilds/${guild.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            banner: `data:image/jpg;base64,${banner.toString('base64')}`
        }),
        headers: {
            authorization: `${clientUser.bot ? 'Bot ' : ''}${main_1.default.token}`,
            'content-type': 'application/json'
        }
    })
        .then(() => setTimeout(() => setBanner(), 6e4))
        .catch(() => { });
}
exports.setBanner = setBanner;
function setStatus() {
    console.log('32');
    try {
        const guild = getMainGuild();
        const clientUser = main_1.default.user;
        console.log('zxc');
        clientUser
            .setActivity({
            name: `на ${guild.memberCount.toLocaleString('ru-RU')} участников`,
            type: 'WATCHING'
        })
            .catch((e) => { console.log(e); });
    }
    catch (e) {
        console.log(e);
    }
}
exports.setStatus = setStatus;
//# sourceMappingURL=util.js.map