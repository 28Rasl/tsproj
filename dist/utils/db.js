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
exports.VerificationMessage = exports.PrivateRoom = exports.Temproom = exports.Temprole = exports.Event = exports.Close = exports.Plant = exports.Clan = exports.Pair = exports.User = void 0;
const discore_js_1 = require("discore.js");
const config = __importStar(require("../config"));
const db = new discore_js_1.Mongo(config.internal.mongoURI);
db.addModel('users', {
    userID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    clanID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    status: { type: discore_js_1.Mongo.Types.String, default: undefined },
    gameroles: { type: discore_js_1.Mongo.Types.Boolean, default: true },
    reputation: { type: discore_js_1.Mongo.Types.Number, default: 0 },
    inventory: { type: discore_js_1.Mongo.Types.Object, default: {} },
    xp: { type: discore_js_1.Mongo.Types.Number, default: 0 },
    lvl: { type: discore_js_1.Mongo.Types.Number, default: 0 },
    lvlXp: { type: discore_js_1.Mongo.Types.Number, default: 0 },
    background: { type: discore_js_1.Mongo.Types.String, default: '0' },
    backgrounds: { type: discore_js_1.Mongo.Types.String, default: '0' },
    goldChests: { type: discore_js_1.Mongo.Types.Number, default: 0 },
    itemChests: { type: discore_js_1.Mongo.Types.Number, default: 0 },
    lastChest: { type: discore_js_1.Mongo.Types.Number, default: -1 },
    gold: { type: discore_js_1.Mongo.Types.Number, default: 0 },
    crystals: { type: discore_js_1.Mongo.Types.Number, default: 0 },
    messageCount: { type: discore_js_1.Mongo.Types.Number, default: 0 },
    voiceTime: { type: discore_js_1.Mongo.Types.Number, default: 0 },
    voiceActivity: { type: discore_js_1.Mongo.Types.Array, default: [] },
    leaveTick: { type: discore_js_1.Mongo.Types.Number, default: undefined },
    lastRepTick: { type: discore_js_1.Mongo.Types.Number, default: undefined },
    lastMsgXpTick: { type: discore_js_1.Mongo.Types.Number, default: undefined },
    lastTimelyTick: { type: discore_js_1.Mongo.Types.Number, default: undefined }
});
db.addModel('pairs', {
    roomID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    pair: { type: discore_js_1.Mongo.Types.Array, default: [] }
});
db.addModel('clans', {
    clanID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    officers: { type: discore_js_1.Mongo.Types.Array, default: [] },
    members: { type: discore_js_1.Mongo.Types.Array, default: [] },
    name: { type: discore_js_1.Mongo.Types.String, default: undefined },
    ownerID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    description: { type: discore_js_1.Mongo.Types.String, default: undefined },
    flag: { type: discore_js_1.Mongo.Types.String, default: undefined },
    color: { type: discore_js_1.Mongo.Types.Number, default: undefined },
    roleID: { type: discore_js_1.Mongo.Types.String, default: undefined }
});
db.addModel('closes', {
    roomID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    chatID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    ownerID: { type: discore_js_1.Mongo.Types.String, default: undefined }
});
db.addModel('events', {
    roomID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    chatID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    ownerID: { type: discore_js_1.Mongo.Types.String, default: undefined }
});
db.addModel('privaterooms', {
    roomID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    ownerID: { type: discore_js_1.Mongo.Types.String, default: undefined }
});
db.addModel('plants', {
    userID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    amount: { type: discore_js_1.Mongo.Types.Number, default: undefined },
    tick: { type: discore_js_1.Mongo.Types.Number, default: undefined }
});
db.addModel('temproles', {
    userID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    roleID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    itemID: { type: discore_js_1.Mongo.Types.Number, default: undefined },
    endTick: { type: discore_js_1.Mongo.Types.Number, default: undefined }
});
db.addModel('temprooms', {
    userID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    roomID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    itemID: { type: discore_js_1.Mongo.Types.Number, default: undefined },
    slots: { type: discore_js_1.Mongo.Types.Number, default: config.meta.temproomSlots },
    endTick: { type: discore_js_1.Mongo.Types.Number, default: undefined }
});
db.addModel('verificationmessages', {
    userID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    messageID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    channelID: { type: discore_js_1.Mongo.Types.String, default: undefined },
    emoji: { type: discore_js_1.Mongo.Types.String, default: undefined }
});
exports.User = db.getCollection('users');
exports.Pair = db.getCollection('pairs');
exports.Clan = db.getCollection('clans');
exports.Plant = db.getCollection('plants');
exports.Close = db.getCollection('closes');
exports.Event = db.getCollection('events');
exports.Temprole = db.getCollection('temproles');
exports.Temproom = db.getCollection('temprooms');
exports.PrivateRoom = db.getCollection('privaterooms');
exports.VerificationMessage = db.getCollection('verificationmessages');
exports.default = db;
//# sourceMappingURL=db.js.map