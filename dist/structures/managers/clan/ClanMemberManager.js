"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ManagerBase_1 = __importDefault(require("../ManagerBase"));
const db_1 = require("../../../utils/db");
const ClanMember_1 = __importDefault(require("../../clan/ClanMember"));
class ClanMemberManager extends ManagerBase_1.default {
    clan;
    constructor(clan, members) {
        super(ClanMember_1.default);
        this.clan = clan;
        if (members)
            this.patch(members);
    }
    raw() {
        return [...this.values()].map(v => ({ id: v.id, tick: v.joinTick }));
    }
    add(id) {
        const existing = this.get(id);
        if (existing)
            return existing;
        db_1.User.updateOne({ userID: id }, { clanID: this.clan.id });
        const data = { id, tick: Date.now() };
        this.clan.edit({ members: [...this.raw(), data] });
        return this.save(id, data);
    }
    patch(data) {
        this.clear();
        for (const officer of data) {
            const existing = this.get(officer.id);
            if (existing)
                existing.patch(officer);
            else
                this.set(officer.id, new ClanMember_1.default(this, officer));
        }
    }
}
exports.default = ClanMemberManager;
//# sourceMappingURL=ClanMemberManager.js.map