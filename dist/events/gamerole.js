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
exports.GameRole = void 0;
const discore_js_1 = require("discore.js");
const Util = __importStar(require("../utils/util"));
const config = __importStar(require("../config"));
const db_1 = require("../utils/db");
class GameRole extends discore_js_1.Event {
    get options() {
        return { name: 'presenceUpdate' };
    }
    run(_, presence) {
        if (!presence)
            return;
        const { guild, member } = presence;
        if (!guild)
            return;
        if (!member)
            return;
        if (!Util.verifyMainGuild(guild.id))
            return;
        db_1.User.getOne({ userID: presence.userID }).then(userDoc => {
            if (!userDoc.gameroles)
                return;
            const activity = presence.activities.find(a => {
                return a.type === 'PLAYING';
            });
            if (!activity)
                return;
            const { games } = config.ids.roles;
            const gameName = activity.name;
            const roleID = games[gameName];
            if (!roleID)
                return;
            if (member.roles.cache.has(roleID))
                return;
            member.roles.add(roleID).catch(() => { });
        });
    }
}
exports.GameRole = GameRole;
//# sourceMappingURL=gamerole.js.map