"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Collection extends Map {
    clear() {
        const deletedKeys = [];
        for (const key of [...this.keys()]) {
            this.delete(key);
            deletedKeys.push(key);
        }
        return deletedKeys;
    }
    filter(func) {
        const col = new Collection();
        for (const [key, val] of this.entries()) {
            if (func(val, key, this))
                col.set(key, val);
        }
        return col;
    }
}
exports.default = Collection;
//# sourceMappingURL=Collection.js.map