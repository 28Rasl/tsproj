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
exports.Leave = exports.Join = void 0;
const discore_js_1 = require("discore.js");
const Util = __importStar(require("../utils/util"));
const config = __importStar(require("../config"));
const db_1 = require("../utils/db");
class Join extends discore_js_1.Event {
    get options() {
        return { name: 'guildMemberAdd' };
    }
    run(member) {
        if (!Util.verifyMainGuild(member.guild.id))
            return;
        const condition = { userID: member.id };
        db_1.User.findOne(condition).then(userDoc => {
            if (!userDoc)
                return;
            if (userDoc.leaveTick &&
                userDoc.leaveTick + config.meta.leaveClearInterval) {
                db_1.User.deleteOne(condition);
            }
        });
    }
}
exports.Join = Join;
class Leave extends discore_js_1.Event {
    get options() {
        return { name: 'guildMemberRemove' };
    }
    run(member) {
        if (!Util.verifyMainGuild(member.guild.id))
            return;
        db_1.User.getOne({ userID: member.id }).then(userDoc => {
            userDoc.leaveTick = Date.now();
            userDoc.save();
        });
    }
}
exports.Leave = Leave;
//# sourceMappingURL=returnerclear.js.map