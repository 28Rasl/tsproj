"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ManagerBase_1 = __importDefault(require("../ManagerBase"));
const Clan_1 = __importDefault(require("../../clan/Clan"));
class ClanManager extends ManagerBase_1.default {
    constructor() {
        super(Clan_1.default);
    }
    create(data) {
        const existing = this.get(data.clanID);
        if (existing) {
            existing.patch(data);
            return existing;
        }
        return this.save(data.clanID, data);
    }
}
exports.default = ClanManager;
//# sourceMappingURL=ClanManager.js.map