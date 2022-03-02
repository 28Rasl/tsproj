"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = __importDefault(require("../main"));
const loveroom_1 = __importDefault(require("../managers/loveroom"));
const db_1 = require("../utils/db");
class Loveroom {
    manager = loveroom_1.default;
    id;
    pair;
    constructor(loveroom) {
        this.id = loveroom.roomID;
        this.pair = loveroom.pair;
    }
    patch() { }
    delete() {
        const room = main_1.default.channels.cache.get(this.id);
        if (room)
            room.delete();
        db_1.Pair.deleteOne({ roomID: this.id });
        this.manager.delete(this.id);
    }
}
exports.default = Loveroom;
//# sourceMappingURL=Loveroom.js.map