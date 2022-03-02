"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ID {
    id;
    static epoch = 1.5778368e12;
    static proc = Math.floor(Math.random() * 0x040) % 0x040;
    constructor(id) {
        if (id)
            this.id = typeof id === 'string' ? id : id.id;
        else
            this.id = ID.generate();
    }
    timestamp() {
        const bitwiseID = parseInt(this.id).toString(2);
        const diff = parseInt(bitwiseID.substr(this.id.length - 7));
        return ID.epoch + diff;
    }
    static generate() {
        const inc = ID.proc;
        const rawid = parseInt(`${(Date.now() - ID.epoch).toString(2)}0000000`, 2);
        const id = String(rawid + inc);
        ID.proc = (ID.proc + 1) % 0x040;
        return id;
    }
}
exports.default = ID;
//# sourceMappingURL=ID.js.map