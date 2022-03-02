"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delete = exports.Leave = exports.Switch = exports.Create = void 0;
const discore_js_1 = require("discore.js");
const CloseManager_1 = __importDefault(require("../managers/CloseManager"));
class Create extends discore_js_1.Event {
    get options() {
        return { name: 'voiceChannelJoin' };
    }
    run(_, state) {
        CloseManager_1.default.onJoin(state);
    }
}
exports.Create = Create;
class Switch extends discore_js_1.Event {
    get options() {
        return { name: 'voiceChannelSwitch' };
    }
    run(oldState, newState) {
        CloseManager_1.default.onSwitch(oldState, newState);
    }
}
exports.Switch = Switch;
class Leave extends discore_js_1.Event {
    get options() {
        return { name: 'voiceChannelLeave' };
    }
    run(state, _) {
        CloseManager_1.default.onLeave(state);
    }
}
exports.Leave = Leave;
class Delete extends discore_js_1.Event {
    get options() {
        return { name: 'channelDelete' };
    }
    run(channel) {
        CloseManager_1.default.onDelete(channel);
    }
}
exports.Delete = Delete;
//# sourceMappingURL=closes.js.map