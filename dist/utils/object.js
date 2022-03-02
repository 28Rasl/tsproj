"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ObjectUtil {
    static isObject(o) {
        return typeof o === 'object' && {}.toString.call(o) === '[object Object]';
    }
    static pathify(o) {
        const toPath = (obj, path = '') => {
            const pathPrefix = `${path}${path.length > 0 ? '.' : ''}`;
            const paths = {};
            for (const rawKey in obj) {
                const key = rawKey.replace(/\./g, '\\.');
                const val = obj[key];
                const locPath = `${pathPrefix}${key}`;
                if (this.isObject(val))
                    Object.assign(paths, toPath(val, locPath));
                else
                    paths[locPath] = val;
            }
            return paths;
        };
        return toPath(o);
    }
    static hasPath(o, path) {
        const keyArr = path.split(/(?<!\\)\./).map(k => k.replace(/\\\./g, '.'));
        let val = o[keyArr.shift()];
        for (const key of keyArr) {
            if (!this.isObject(val))
                return false;
            else
                val = val[key];
        }
        return true;
    }
    static getPathValue(o, path) {
        if (!this.hasPath(o, path))
            return undefined;
        const keyArr = path.split(/(?<!\\)\./).map(k => k.replace(/\\\./g, '.'));
        let val = o[keyArr.shift()];
        for (const key of keyArr) {
            if (this.isObject(val))
                val = val[key];
            else
                val = undefined;
        }
        return val;
    }
    static assignPathValue(o, path, val) {
        const keyArr = path.split(/(?<!\\)\./).map(k => k.replace(/\\\./g, '.'));
        const lastKey = keyArr.splice(keyArr.length - 1, 1)[0];
        let obj = o;
        for (const key of keyArr) {
            if (!this.isObject(obj[key]))
                obj[key] = {};
            obj = obj[key];
        }
        obj[lastKey] = val;
    }
    static unPathify(o) {
        const newObj = {};
        for (const path in o)
            this.assignPathValue(newObj, path, o[path]);
        return newObj;
    }
    static fromEntries(entries) {
        const o = {};
        for (const entry of entries)
            o[entry[0]] = entry[1];
        return o;
    }
    static promiseAll(o) {
        const paths = this.pathify(o);
        const pathEntries = Object.entries(paths);
        return Promise.all(pathEntries.map(e => e[1])).then(vals => {
            for (const i in vals)
                pathEntries[i][1] = vals[i];
            return this.unPathify(this.fromEntries(pathEntries));
        });
    }
}
exports.default = ObjectUtil;
//# sourceMappingURL=object.js.map