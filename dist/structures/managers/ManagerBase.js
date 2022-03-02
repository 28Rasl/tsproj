"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Collection_1 = __importDefault(require("../Collection"));
class ManagerBase extends Collection_1.default {
    Class;
    constructor(Class) {
        super();
        this.Class = Class;
    }
    save(id, data) {
        const instance = new this.Class(data, this);
        this.set(id, instance);
        return instance;
    }
}
exports.default = ManagerBase;
//# sourceMappingURL=ManagerBase.js.map