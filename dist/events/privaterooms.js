"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leave = exports.Switch = exports.Create = void 0;
const discore_js_1 = require("discore.js");
const PrivateRoomManager_1 = __importDefault(require("../managers/PrivateRoomManager"));
class Create extends discore_js_1.Event {
    get options() {
        return { name: 'voiceChannelJoin' };
    }
    run(_, state) {
        PrivateRoomManager_1.default.onJoin(state);
    }
}
exports.Create = Create;
class Switch extends discore_js_1.Event {
    get options() {
        return { name: 'voiceChannelSwitch' };
    }
    run(oldState, newState) {
        PrivateRoomManager_1.default.onSwitch(oldState, newState);
    }
}
exports.Switch = Switch;
class Leave extends discore_js_1.Event {
    get options() {
        return { name: 'voiceChannelLeave' };
    }
    run(state, _) {
        PrivateRoomManager_1.default.onLeave(state);
    }
}
exports.Leave = Leave;
//# sourceMappingURL=privaterooms.js.map