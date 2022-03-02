"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ManagerBase_1 = __importDefault(require("./ManagerBase"));
const Loveroom_1 = __importDefault(require("../Loveroom"));
class LoveroomManager extends ManagerBase_1.default {
    constructor() {
        super(Loveroom_1.default);
    }
    resolve(id) {
        return this.get(id) || [...this.values()].find(v => v.pair.includes(id));
    }
    create(data) {
        const existing = this.get(data.roomID);
        if (existing)
            return existing;
        return this.save(data.roomID, data);
    }
}
exports.default = LoveroomManager;
//# sourceMappingURL=LoveroomManager.js.map