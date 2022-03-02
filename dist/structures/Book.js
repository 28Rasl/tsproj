"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Util = __importStar(require("../utils/util"));
const config = __importStar(require("../config"));
class Book {
    pages;
    page = 1;
    idle;
    dispose;
    customFilter;
    customActions;
    onEnd;
    constructor(pages, options = {}) {
        this.pages = pages;
        this.idle = options.idle || 1.5e4;
        this.dispose = options.dispose || true;
        this.customFilter = options.filter || (() => true);
        this.customActions = options.actions || {};
        this.onEnd = options.onEnd || (msg => msg.delete());
    }
    get beforeEmojis() {
        const customEntries = Object.entries(this.customActions);
        const before = customEntries.filter(e => e[1].position === 'before');
        return before.map(e => e[0]);
    }
    get afterEmojis() {
        const customEntries = Object.entries(this.customActions);
        const after = customEntries.filter(e => e[1].position !== 'before');
        return after.map(e => e[0]);
    }
    get emojis() {
        return [
            ...this.beforeEmojis,
            ...config.meta.emojis.pageControl,
            ...this.afterEmojis
        ];
    }
    get actions() {
        return {
            [config.meta.emojis.pageControl[0]]: {
                exec: (message) => {
                    this.page = Math.max(1, Math.min(this.pages.length, this.page - 1));
                    message.edit(this.pages);
                }
            },
            [config.meta.emojis.pageControl[1]]: {
                exec: (message) => {
                    this.page = Math.max(1, Math.min(this.pages.length, this.page + 1));
                    message.edit(this.pages);
                }
            },
            ...this.customActions
        };
    }
    filter(reaction, user) {
        if (!this.customFilter(reaction, user))
            return false;
        const emojiID = reaction.emoji.id || reaction.emoji.name;
        if (!this.emojis.includes(emojiID))
            return false;
        return true;
    }
    send(channel) {
        return channel.send(newFunction()).then(async (msg) => {
            const collector = msg.createReactionCollector(this.filter.bind(this), {
                dispose: this.dispose,
                idle: this.idle
            });
            collector.on('collect', reaction => {
                const emojiID = reaction.emoji.id || reaction.emoji.name;
                if (!this.emojis.includes(emojiID))
                    return;
                const action = this.actions[emojiID];
                action.exec(msg);
            });
            collector.on('end', this.onEnd.bind(this, msg));
            try {
                for (const emoji of this.emojis)
                    await Util.react(msg, emoji);
            }
            catch (e) {
                Promise.reject(e);
            }
        });
        function newFunction() {
            return this.pages[0];
        }
    }
}
exports.default = Book;
//# sourceMappingURL=Book.js.map