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
const db_1 = require("../utils/db");
class VoiceActivityManager {
    static onJoin(state) {
        const { member, guild } = state;
        if (!member)
            return;
        if (!Util.verifyGuild(guild.id))
            return;
        db_1.User.getOne({ userID: member.id }).then(userDoc => {
            const lastActivity = userDoc.voiceActivity.slice(-1)[0];
            if (lastActivity && lastActivity.length < 2)
                return;
            userDoc.voiceActivity = [
                ...userDoc.voiceActivity,
                [Date.now()]
            ];
            userDoc.save();
        });
    }
    static onLeave(state) {
        const { member, guild } = state;
        if (!member)
            return;
        if (!Util.verifyGuild(guild.id))
            return;
        db_1.User.getOne({ userID: member.id }).then(userDoc => {
            const lastActivityIndex = userDoc.voiceActivity.length - 1;
            const lastVoiceActivity = userDoc.voiceActivity[lastActivityIndex];
            if (!lastVoiceActivity || lastVoiceActivity.length > 1)
                return;
            if (Date.now() - lastVoiceActivity[0] < 1e3) {
                userDoc.voiceActivity = userDoc.voiceActivity.slice(0, -1);
            }
            else {
                userDoc.voiceActivity[lastActivityIndex].push(Date.now());
                const outOfWeekActivity = Util.filterOutOfWeekActivity(userDoc.voiceActivity);
                const outOfWeekTime = Util.parseVoiceActivity(outOfWeekActivity);
                if (outOfWeekTime >= 1e3) {
                    userDoc.voiceActivity = Util.filterWeekActivity(userDoc.voiceActivity);
                    userDoc.voiceTime += outOfWeekTime;
                }
                Util.calculateActivityRewards(member, userDoc);
            }
            userDoc.save();
        });
    }
}
exports.default = VoiceActivityManager;
//# sourceMappingURL=VoiceActivityManager.js.map