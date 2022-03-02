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
const ID_1 = __importDefault(require("../ID"));
const main_1 = __importDefault(require("../../main"));
const clan_1 = __importDefault(require("../../managers/clan"));
const ClanMemberManager_1 = __importDefault(require("../managers/clan/ClanMemberManager"));
const Util = __importStar(require("../../utils/util"));
const db_1 = require("../../utils/db");
class Clan {
    manager = clan_1.default;
    id;
    roleID;
    ownerID;
    name;
    flag;
    color;
    members;
    description;
    rawOfficers;
    create = Clan.create;
    constructor(clan) {
        this.id = clan.clanID;
        this.name = clan.name;
        this.roleID = clan.roleID;
        this.ownerID = clan.ownerID;
        this.members = new ClanMemberManager_1.default(this, clan.members);
        this.rawOfficers = [];
        this.patch(clan);
    }
    get owner() {
        return this.members.get(this.ownerID);
    }
    get officers() {
        return this.members.filter(m => m.officer);
    }
    patch(data) {
        if ('ownerID' in data)
            this.ownerID = data.ownerID;
        if ('flag' in data)
            this.flag = data.flag;
        if ('color' in data)
            this.color = data.color;
        if ('description' in data)
            this.description = data.description;
        if ('officers' in data)
            this.rawOfficers = data.officers || [];
        if ('members' in data)
            this.members.patch(data.members || []);
    }
    edit(data) {
        const guild = Util.getMainGuild();
        const clientUser = main_1.default.user;
        if ('color' in data && !('roleID' in data)) {
            if (this.roleID) {
                const requestUrl = `guilds/${guild.id}/roles/${this.roleID}`;
                const requestOptions = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `${clientUser.bot ? 'Bot ' : ''}${main_1.default.token}`
                    },
                    body: JSON.stringify({ color: data.color })
                };
                Util.discordRetryHandler(requestUrl, requestOptions).catch(() => { });
            }
        }
        if ('roleID' in data) {
            if (data.roleID === 'string') {
                const requestOptions = {
                    method: 'PUT',
                    headers: {
                        authorization: `${clientUser.bot ? 'Bot ' : ''}${main_1.default.token}`
                    }
                };
                const functions = [...this.members.values()].map(m => {
                    const requestUrl = `guilds/${guild.id}/members/${m.id}/roles/${data.roleID}`;
                    return Util.discordRetryHandler.bind(Util, requestUrl, requestOptions);
                });
                if (this.roleID !== data.roleID) {
                    const requestOptions = {
                        method: 'DELETE',
                        headers: {
                            authorization: `${clientUser.bot ? 'Bot ' : ''}${main_1.default.token}`
                        }
                    };
                    const promises = [...this.members.values()].map(m => {
                        const requestUrl = `guilds/${guild.id}/members/${m.id}/roles/${data.roleID}`;
                        return Util.discordRetryHandler(requestUrl, requestOptions);
                    });
                    Promise.all(promises).then(() => {
                        return Promise.all(functions.map(f => f().catch(() => { })));
                    });
                }
            }
            else if (data.roleID === null) {
                const guild = Util.getMainGuild();
                const clientUser = main_1.default.user;
                const promises = [...this.members.values()].map(m => {
                    return Util.discordRetryHandler(`guilds/${guild.id}/members/${m.id}/roles/${this.roleID}`, {
                        method: 'DELETE',
                        headers: {
                            authorization: `${clientUser.bot ? 'Bot ' : ''}${main_1.default.token}`
                        }
                    }).catch(() => { });
                });
                Promise.all(promises);
            }
        }
        return Clan.update(this.id, data);
    }
    delete() {
        return Clan.delete(this.id);
    }
    static async update(id, data) {
        const res = await db_1.Clan.updateOne({ clanID: id }, data);
        return res || null;
    }
    static create(options) {
        const id = new ID_1.default();
        const clanID = id.id;
        const { name, ownerID } = options;
        const clanData = {
            clanID,
            name,
            ownerID,
            description: options.description,
            flag: options.flag,
            color: options.color,
            roleID: options.roleID,
            officers: options.officers || [],
            members: options.members || [{ id: ownerID, tick: id.timestamp() }]
        };
        db_1.User.getOne({ userID: ownerID }).then(userDoc => {
            userDoc.clanID = clanID;
            userDoc.save();
        });
        db_1.Clan.insertOne(clanData);
        return clanData;
    }
    static delete(id) {
        db_1.User.updateMany({ clanID: id }, { clanID: undefined });
        db_1.Clan.deleteOne({ clanID: id });
        clan_1.default.delete(id);
    }
}
exports.default = Clan;
//# sourceMappingURL=Clan.js.map