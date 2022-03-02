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
const discore_js_1 = require("discore.js");
const Util = __importStar(require("../utils/util"));
const config = __importStar(require("../config"));
class Command extends discore_js_1.Command {
    async run(message, args) {
        const params = {
            message,
            args,
            params: await this.parseParams({ message, args })
        };
        this.middleware(params);
        if (!this.validate(params))
            return;
        const commandArgs = [
            params.message,
            params.args,
            params.params
        ];
        if (!this.validateAccess(params))
            return this.noPerms(...commandArgs);
        message.delete({ timeout: 1e3 }).catch(() => { });
        this.execute(...commandArgs);
    }
    async parseParams(params) {
        const commandParams = {
            guild: params.message.guild,
            member: params.message.member
        };
        const guild = commandParams.guild || this.getGuild();
        if (!commandParams.guild)
            commandParams.guild = guild;
        if (!commandParams.member) {
            commandParams.member = await guild.members.fetch(params.message.author.id);
        }
        return commandParams;
    }
    getGuild() {
        return this.client.guilds.cache.get(config.ids.guilds.main);
    }
    validate(params) {
        const { custom } = this;
        const guildID = (params.message.guild || {}).id;
        if (custom.guildOnly && !guildID)
            return false;
        if (guildID && !Util.verifyGuild(guildID))
            return false;
        return true;
    }
    validateUserAccess(params) {
        const { custom } = this;
        const allowedUsers = custom.allowedUsers || [];
        return allowedUsers.includes(params.message.author.id);
    }
    validateRoleAccess(params) {
        const { custom } = this;
        const allowedRoles = custom.allowedRoles || [];
        const commandParams = params.params;
        if (allowedRoles.length < 1)
            return false;
        const hasrole = (id) => commandParams.member.roles.cache.has(id);
        if (allowedRoles.every(id => !hasrole(id)))
            return false;
        return true;
    }
    validatePermsAccess(params) {
        const { custom } = this;
        const allowedPerms = custom.allowedPerms || 0;
        const commandParams = params.params;
        if (allowedPerms < 1)
            return false;
        if (!commandParams.member.hasPermission(allowedPerms))
            return false;
        return true;
    }
    validateAccess(params) {
        const { custom } = this;
        const allowedChats = custom.allowedChats || [];
        const channelID = params.message.channel.id;
        if (allowedChats.length > 0 && !allowedChats.includes(channelID)) {
            return false;
        }
        const allowedRoles = custom.allowedRoles || [];
        const allowedUsers = custom.allowedUsers || [];
        const allowedPerms = custom.allowedPerms || 0;
        if ([allowedRoles, allowedUsers].every(e => e.length < 1) &&
            allowedPerms < 1) {
            return true;
        }
        const permsAccess = this.validatePermsAccess(params);
        const roleAccess = this.validateRoleAccess(params);
        const userAccess = this.validateUserAccess(params);
        return userAccess || roleAccess || permsAccess;
    }
    middleware(params) {
        const { custom } = this;
        if (custom.suppressArgs)
            params.args = this.suppressArgs(params.args);
    }
    suppressArgs(args) {
        return args.filter(a => a.length > 0);
    }
    noPerms(_message, _args, _params) { }
}
exports.default = Command;
//# sourceMappingURL=Command.js.map