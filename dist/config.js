"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meta = exports.lvls = exports.postChannels = exports.postTypes = exports.access = exports.swapCoefs = exports.repRanks = exports.timezones = exports.colors = exports.emojis = exports.flags = exports.ids = exports.intents = exports.internal = exports.debug = void 0;
const discord_js_1 = require("discord.js");
exports.debug = false;
exports.internal = {
    token: 'ODc5NzgwOTcyOTQ4NzgzMTU1.YSUt4Q.xRWZFJ6qPJgF6rXOQfghbT9wxUA',
    prefix: '.',
    mongoURI: 'mongodb+srv://rasl:rasl@cluster0.jijur.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    prefixes: {
        clans: '/'
    }
};
exports.intents = discord_js_1.Intents.FLAGS.GUILD_MEMBERS |
    discord_js_1.Intents.FLAGS.GUILD_PRESENCES;
exports.ids = {
    guilds: {
        main: '815991314835308564',
        administration: '818470322331320340'
    },
    messages: { verification: '935903666328723517' },
    channels: {
        text: {
            mainChat: '935903666328723517'
        },
        voice: {
            createEvent: '931939444334948352',
            createClose: '817452022806347826',
            createPrivate: '929773635172990986'
        }
    },
    categories: {
        events: '815991315648741447',
        closes: '815991315648741447',
        loverooms: '815991315648741447',
        temprooms: '815991315648741447',
        privaterooms: '815991315648741447'
    },
    roles: {
        button: '942841423869382746',
        hero: '942841423869382746',
        mute: '942841423869382746',
        event: '942841423869382746',
        textmute: '942841423869382746',
        jumpmute: '942841423869382746',
        onenitro: '942841423869382746',
        clans: '942841423869382746',
        temproles: '942841423869382746',
        immortalSponsor: '942841423869382746',
        legendarySponsor: '942841423869382746',
        diamondSponsor: '942841423869382746',
        owner: '942841423869382746',
        orion: '942841423869382746',
        sirius: '942841423869382746',
        astral: '942841423869382746',
        ghost: '942841423869382746',
        phoenix: '942841423869382746',
        elderEvent: '942841423869382746',
        keeperEvent: '942841423869382746',
        eventMod: '942841423869382746',
        eventElemental: '942841423869382746',
        eventBan: '942841423869382746',
        warns: ['942841423869382746', '942841423869382746'],
        gender: {
            null: '942841423869382746'
        },
        games: {
            'Valorant': '942841423869382746',
            'Minecraft': '942841423869382746',
            'Overwatch': '942841423869382746',
            'Osu!': '942841423869382746',
            'Dota 2': '942841423869382746',
            'League of Legends': '942841423869382746',
            "PLAYERUNKNOWN'S BATTLEGROUNDS": '942841423869382746',
            'Counter-Strike: Global Offensive': '942841423869382746'
        }
    },
    chests: {
        gold: 1 << 0,
        item: 1 << 1
    },
    goods: {
        ticket: 1 << 0,
        temprole1d: 1 << 1,
        temprole3d: 1 << 2,
        temprole7d: 1 << 3,
        hero7d: 1 << 4,
        temproom7d: 1 << 5
    },
    postTypes: {
        aesthetic: 0,
        erotic: 1
    }
};
exports.flags = {
    backgrounds: [1n << 0n, 1n << 1n, 1n << 2n, 1n << 3n]
};
exports.emojis = {
    check: '✅',
    cross: '❌',
    pencil: '📝',
    question: '❔',
    arrowLeft: '⬅️',
    arrowRight: '➡️',
    wastebasket: '🗑️',
    arrowBackward: '◀️',
    arrowForward: '▶️',
    empty: '941804123320381522',
    roles: '941804123320381522',
    verification: {
        id: '941804123320381522',
        display: '<:bar_empty:941804123320381522>'
    },
    fail: {
        id: '941804123320381522',
        display: '<:bar_empty:941804123320381522>'
    },
    gold: '941804123320381522',
    crystal: '941804123320381522',
    medal: {
        id: '941804123320381522',
        display: '<:bar_empty:941804123320381522>'
    },
    places: {
        first: {
            id: '941804123320381522',
            display: '<:bar_empty:941804123320381522>'
        },
        second: {
            id: '941804123320381522',
            display: '<:bar_empty:941804123320381522>'
        },
        third: {
            id: '941804123320381522',
            display: '<:bar_empty:941804123320381522>'
        }
    }
};
exports.colors = {
    embed: 0x2f3136
};
exports.timezones = {
    moscow: 'Europe/Moscow'
};
exports.repRanks = {
    '0': 'Неизвестный',
    '-1': 'Недоверие',
    '-10': 'Настороженность',
    '-20': 'Неуверенность',
    '-30': 'Неприязнь',
    '-40': 'Враждебность',
    '-50': 'Ненависть',
    '5': 'Симпатия',
    '15': 'Доверие',
    '30': 'Превознесение',
    '50': 'Почтение',
    '65': 'Уважение',
    '80': 'Дружелюбие',
    '90': 'Сверхразум',
    '130': 'Благородный|Благородная',
    '160': 'Хранитель мудрости',
    '200': 'Превозносимый'
};
exports.swapCoefs = {
    '1': 24,
    '300': 27,
    '500': 28,
    '700': 30,
    '1000': 32
};
exports.access = {
    commands: {
        award: [exports.ids.roles.owner, exports.ids.roles.orion, exports.ids.roles.sirius],
        take: [exports.ids.roles.owner, exports.ids.roles.orion, exports.ids.roles.sirius],
        say: [
            exports.ids.roles.owner,
            exports.ids.roles.orion,
            exports.ids.roles.sirius,
            exports.ids.roles.astral,
            exports.ids.roles.ghost,
            exports.ids.roles.phoenix,
            exports.ids.roles.elderEvent,
            exports.ids.roles.keeperEvent
        ]
    }
};
exports.postTypes = {
    'эстетика': exports.ids.postTypes.aesthetic,
    'красные фонари': exports.ids.postTypes.erotic
};
exports.postChannels = {
    [exports.ids.postTypes.aesthetic]: '938884838415564810',
    [exports.ids.postTypes.erotic]: '938884838415564810'
};
exports.lvls = {
    '0': 0,
    '1': 2000,
    '2': 6000,
    '3': 10000,
    '4': 15000,
    '5': 25000,
    '6': 34600,
    '7': 46000,
    '8': 55000,
    '9': 65000,
    '10': 70000,
    '11': 72000,
    '12': 78000,
    '13': 83000,
    '14': 87000,
    '15': 93000,
    '16': 98000,
    '17': 102000,
    '18': 105000,
    '19': 109000,
    '20': 113000,
    '21': 117000,
    '22': 121000,
    '23': 125000,
    '24': 129000,
    '25': 130000,
    '26': 140000,
    '27': 150000,
    '28': 170000,
    '29': 180000,
    '30': 190000
};
exports.meta = {
    privateRoomName: "{nickname}'s room",
    closeRoomName: "{nickname}'s close",
    eventRoomName: "{nickname}'s event",
    allowedGuilds: [exports.ids.guilds.main, exports.ids.guilds.administration],
    joinRoleID: exports.ids.roles.gender.null,
    defaultColor: exports.colors.embed,
    brLoseColor: 0xe97171,
    brWinColor: 0xa0c1b8,
    bfLoseColor: 0xe97171,
    bfWinColor: 0xa0c1b8,
    defaultTimezone: exports.timezones.moscow,
    welcomeChannelID: exports.ids.channels.text.mainChat,
    errorMsgDeletion: 1.5e4,
    msgDeletion: 3e4,
    timelyAmount: 50,
    timelyInterval: 4.32e7,
    maxAwardGold: 25000,
    maxAwardCrystals: 10000,
    pairCost: 5000,
    clanCost: 1000,
    clanNameLimit: 32,
    clanDescLimit: 200,
    reputationInterval: 6.048e8,
    leaveClearInterval: 6.048e8,
    minbfBet: 5,
    maxbfBet: 100,
    minbrBet: 5,
    maxbrBet: 200,
    statusLimit: 200,
    minReactionPrice: 20,
    maxReactionPrice: 30,
    temproomSlots: 3,
    temproomNamePrice: 350,
    temproomNameConfirmLimit: 3e5,
    temproomDeleteConfirmLimit: 3e5,
    temproleNamePrice: 350,
    temproleColorPrice: 300,
    temproleNameConfirmLimit: 3e5,
    temproleColorConfirmLimit: 3e5,
    temproleDeleteConfirmLimit: 3e5,
    temproleNoColorConfirmLimit: 3e5,
    checkInterval: 3.6e6,
    pairroomName: '{nickname.1} 🖤 {nickname.2}',
    confirmEmojis: [exports.emojis.verification.id, exports.emojis.fail.id],
    brMinRandomres: 0,
    brMaxRandomres: 120,
    goldDoublerRoles: [exports.ids.roles.onenitro],
    goldChestChances: {
        150: 35,
        300: 30,
        650: 20,
        850: 10,
        1050: 5
    },
    goldChestImages: {
        150: 'https://i.imgur.com/OLDyzIp.gif',
        300: 'https://i.imgur.com/f9xbNTp.gif',
        650: 'https://i.imgur.com/qdLp9Sg.gif',
        850: 'https://i.imgur.com/gH7wXxe.gif',
        1050: 'https://i.imgur.com/szQrM4d.gif'
    },
    itemChestChances: {
        [exports.ids.goods.ticket]: 30,
        [exports.ids.goods.temprole1d]: 20,
        [exports.ids.goods.temprole3d]: 25,
        [exports.ids.goods.temprole7d]: 5,
        [exports.ids.goods.temproom7d]: 10,
        [exports.ids.goods.hero7d]: 10
    },
    itemChestImages: {
        [exports.ids.goods.ticket]: 'https://i.imgur.com/nUNo0RD.gif',
        [exports.ids.goods.temprole1d]: 'https://i.imgur.com/Z6AbljU.gif',
        [exports.ids.goods.temprole3d]: 'https://i.imgur.com/MnvVhaN.gif',
        [exports.ids.goods.temprole7d]: 'https://i.imgur.com/bLvnKVn.gif',
        [exports.ids.goods.temproom7d]: 'https://i.imgur.com/qaxhF2j.gif',
        [exports.ids.goods.hero7d]: 'https://i.imgur.com/smHgCoh.gif'
    },
    brCoef: {
        0: 0,
        44: 1.25,
        70: 2,
        120: 10
    },
    emojis: {
        cy: exports.emojis.gold,
        buy: exports.emojis.check,
        donateCy: exports.emojis.crystal,
        deleteMessage: exports.emojis.wastebasket,
        status: [exports.emojis.fail.display, exports.emojis.verification.display],
        pageControl: [exports.emojis.arrowBackward, exports.emojis.arrowForward],
        previewMsg: {
            return: exports.emojis.cross,
            getCode: exports.emojis.question,
            newCode: exports.emojis.pencil,
            editMessage: exports.emojis.check
        }
    },
    chestDrops: {
        [exports.ids.goods.ticket]: { id: exports.ids.goods.ticket, chance: 30 },
        [exports.ids.goods.temprole1d]: { id: exports.ids.goods.temprole1d, chance: 25 },
        [exports.ids.goods.temprole3d]: { id: exports.ids.goods.temprole3d, chance: 20 },
        [exports.ids.goods.temprole7d]: { id: exports.ids.goods.temprole7d, chance: 15 },
        [exports.ids.goods.hero7d]: { id: exports.ids.goods.hero7d, chance: 5 },
        [exports.ids.goods.temproom7d]: { id: exports.ids.goods.temproom7d, chance: 5 }
    },
    timeSpelling: {
        w: 'н',
        d: 'д',
        h: 'ч',
        m: 'м',
        s: 'с'
    },
    permissions: {
        privateroom: {
            default: [
                {
                    id: exports.ids.roles.gender.null,
                    allow: 0,
                    deny: discord_js_1.Permissions.FLAGS.CONNECT | discord_js_1.Permissions.FLAGS.VIEW_CHANNEL
                },
                {
                    id: exports.ids.roles.jumpmute,
                    allow: 0,
                    deny: discord_js_1.Permissions.FLAGS.CONNECT
                },
                {
                    id: exports.ids.roles.mute,
                    allow: 0,
                    deny: discord_js_1.Permissions.FLAGS.SPEAK
                }
            ],
            creator: {
                allow: discord_js_1.Permissions.FLAGS.CREATE_INSTANT_INVITE |
                    discord_js_1.Permissions.FLAGS.MANAGE_CHANNELS |
                    discord_js_1.Permissions.FLAGS.VIEW_CHANNEL |
                    discord_js_1.Permissions.FLAGS.CONNECT |
                    discord_js_1.Permissions.FLAGS.SPEAK |
                    discord_js_1.Permissions.FLAGS.STREAM |
                    discord_js_1.Permissions.FLAGS.MUTE_MEMBERS |
                    discord_js_1.Permissions.FLAGS.DEAFEN_MEMBERS |
                    discord_js_1.Permissions.FLAGS.USE_VAD |
                    discord_js_1.Permissions.FLAGS.PRIORITY_SPEAKER,
                deny: discord_js_1.Permissions.FLAGS.MANAGE_ROLES |
                    discord_js_1.Permissions.FLAGS.MANAGE_WEBHOOKS |
                    discord_js_1.Permissions.FLAGS.MOVE_MEMBERS
            },
            everyone: {
                allow: discord_js_1.Permissions.FLAGS.STREAM,
                deny: 0
            }
        },
        event: {
            default: [
                {
                    id: exports.ids.roles.gender.null,
                    allow: 0,
                    deny: discord_js_1.Permissions.FLAGS.CONNECT | discord_js_1.Permissions.FLAGS.VIEW_CHANNEL
                },
                {
                    id: exports.ids.roles.jumpmute,
                    allow: 0,
                    deny: discord_js_1.Permissions.FLAGS.CONNECT
                },
                {
                    id: exports.ids.roles.mute,
                    allow: 0,
                    deny: discord_js_1.Permissions.FLAGS.SPEAK
                }
            ],
            creator: {
                allow: discord_js_1.Permissions.FLAGS.CREATE_INSTANT_INVITE |
                    discord_js_1.Permissions.FLAGS.MANAGE_CHANNELS |
                    discord_js_1.Permissions.FLAGS.MANAGE_ROLES |
                    discord_js_1.Permissions.FLAGS.VIEW_CHANNEL |
                    discord_js_1.Permissions.FLAGS.CONNECT |
                    discord_js_1.Permissions.FLAGS.SPEAK |
                    discord_js_1.Permissions.FLAGS.STREAM |
                    discord_js_1.Permissions.FLAGS.MUTE_MEMBERS |
                    discord_js_1.Permissions.FLAGS.DEAFEN_MEMBERS |
                    discord_js_1.Permissions.FLAGS.USE_VAD |
                    discord_js_1.Permissions.FLAGS.PRIORITY_SPEAKER,
                deny: discord_js_1.Permissions.FLAGS.MANAGE_ROLES |
                    discord_js_1.Permissions.FLAGS.MANAGE_WEBHOOKS |
                    discord_js_1.Permissions.FLAGS.MOVE_MEMBERS
            },
            everyone: {
                allow: discord_js_1.Permissions.FLAGS.STREAM,
                deny: 0
            }
        },
        loveroom: {
            default: [],
            member: {
                allow: discord_js_1.Permissions.FLAGS.VIEW_CHANNEL | discord_js_1.Permissions.FLAGS.CONNECT,
                deny: 0
            },
            everyone: {
                allow: 0,
                deny: discord_js_1.Permissions.FLAGS.VIEW_CHANNEL | discord_js_1.Permissions.FLAGS.CONNECT
            }
        },
        temproom: {
            default: [
                {
                    id: exports.ids.roles.gender.null,
                    allow: 0,
                    deny: discord_js_1.Permissions.FLAGS.CONNECT | discord_js_1.Permissions.FLAGS.VIEW_CHANNEL
                },
                {
                    id: exports.ids.roles.jumpmute,
                    allow: 0,
                    deny: discord_js_1.Permissions.FLAGS.CONNECT
                },
                {
                    id: exports.ids.roles.mute,
                    allow: 0,
                    deny: discord_js_1.Permissions.FLAGS.SPEAK
                }
            ],
            member: {
                allow: discord_js_1.Permissions.FLAGS.VIEW_CHANNEL |
                    discord_js_1.Permissions.FLAGS.CONNECT |
                    discord_js_1.Permissions.FLAGS.SPEAK |
                    discord_js_1.Permissions.FLAGS.STREAM |
                    discord_js_1.Permissions.FLAGS.MUTE_MEMBERS |
                    discord_js_1.Permissions.FLAGS.DEAFEN_MEMBERS |
                    discord_js_1.Permissions.FLAGS.USE_VAD |
                    discord_js_1.Permissions.FLAGS.PRIORITY_SPEAKER,
                deny: 0
            },
            everyone: {
                allow: 0,
                deny: discord_js_1.Permissions.FLAGS.CONNECT
            }
        }
    }
};
//# sourceMappingURL=config.js.map