"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leave = exports.VoiceStateUpdate = exports.Join = void 0;
const discore_js_1 = require("discore.js");
const VoiceActivityManager_1 = __importDefault(require("../managers/VoiceActivityManager"));
class Join extends discore_js_1.Event {
    get options() {
        return { name: 'voiceChannelJoin' };
    }
    run(_, state) {
        VoiceActivityManager_1.default.onJoin(state);
    }
}
exports.Join = Join;
class VoiceStateUpdate extends discore_js_1.Event {
    get options() {
        return { name: 'voiceStateUpdate' };
    }
    run(oldState, newState) {
        if (!oldState.channel || !newState.channel)
            return;
        const filteredMembers = newState.channel.members
            .array()
            .filter(m => !m.voice.mute);
        if (newState.mute || filteredMembers.length < 2) {
            filteredMembers.forEach(m => VoiceActivityManager_1.default.onLeave(m.voice));
            if (!filteredMembers.map(m => m.id).includes(oldState.id)) {
                VoiceActivityManager_1.default.onLeave(oldState);
            }
        }
        else {
            filteredMembers.forEach(m => VoiceActivityManager_1.default.onJoin(m.voice));
            if (!filteredMembers.map(m => m.id).includes(newState.id)) {
                VoiceActivityManager_1.default.onJoin(newState);
            }
        }
    }
}
exports.VoiceStateUpdate = VoiceStateUpdate;
class Leave extends discore_js_1.Event {
    get options() {
        return { name: 'voiceChannelLeave' };
    }
    run(state, _) {
        VoiceActivityManager_1.default.onLeave(state);
        if (state.channel) {
            const filteredMembers = state.channel.members
                .array()
                .filter(m => !m.voice.mute);
            if (filteredMembers.length < 2) {
                filteredMembers.forEach(m => VoiceActivityManager_1.default.onLeave(m.voice));
            }
        }
    }
}
exports.Leave = Leave;
//# sourceMappingURL=voiceactivity.js.map