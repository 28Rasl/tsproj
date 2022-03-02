"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../utils/db");
class ClanMember {
    _manager;
    get manager() {
        return this._manager;
    }
    set manager(value) {
        this._manager = value;
    }
    id;
    joinTick;
    constructor(_manager, member) {
        this._manager = _manager;
        this.id = member.id;
        this.joinTick = 0;
        this.patch(member);
    }
    clan = this.manager.clan;
    get owner() {
        return this.clan.ownerID === this.id;
    }
    get officer() {
        return this.officerSince > -1;
    }
    get officerSince() {
        const rawOfficer = this.clan.rawOfficers.find(o => o.id === this.id);
        if (!rawOfficer)
            return -1;
        return rawOfficer.tick;
    }
    setOfficer(officer) {
        let officers = [...this.clan.rawOfficers.map(o => ({ ...o }))];
        if (officer)
            officers.push({ id: this.id, tick: Date.now() });
        else
            officers = officers.filter(o => o.id !== this.id);
        this.clan.edit({ officers });
    }
    makeOfficer() {
        return this.setOfficer(true);
    }
    toggleOfficer() {
        return this.setOfficer(!this.officer);
    }
    unOfficer() {
        return this.setOfficer(false);
    }
    edit(data) {
        if ('officer' in data)
            this.setOfficer(Boolean(data.officer));
    }
    kick() {
        db_1.User.getOne({ userID: this.id }).then(userDoc => {
            userDoc.clanID = undefined;
            userDoc.save();
        });
        this.clan.edit({
            members: [...this.manager.raw().filter(m => m.id !== this.id)],
            officers: [...this.clan.rawOfficers.filter(m => m.id !== this.id)]
        });
    }
    patch(data) {
        this.joinTick = data.tick;
    }
}
exports.default = ClanMember;
//# sourceMappingURL=ClanMember.js.map