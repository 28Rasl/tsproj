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
class Pages {
    pages;
    page = 1;
    message;
    constructor(pages) {
        this.pages = pages;
    }
    switchPage(newpage) {
        newpage = Math.max(1, Math.min(this.pages.length, newpage));
        if (this.page === newpage)
            return;
        this.page = newpage;
        if (!this.message)
            return;
        return this.message.edit(this.pages[this.page - 1]).catch(() => { });
    }
    prevPage() {
        return this.switchPage(this.page - 1);
    }
    nextPage() {
        return this.switchPage(this.page + 1);
    }
    awaitReaction(user) {
        const msg = this.message;
        if (!msg)
            return;
        const emojis = [
            config.emojis.wastebasket,
            ...config.meta.emojis.pageControl
        ];
        Util.getReactionStatic(msg, emojis, [user], 1.5e4).then(reaction => {
            if (!reaction)
                return;
            reaction.users.remove(user.id);
            const emojiID = reaction.emoji.id || reaction.emoji.name;
            const func = {
                [emojis[0]]: () => msg.delete().catch(() => { }),
                [emojis[1]]: () => {
                    this.prevPage();
                    this.awaitReaction(user);
                },
                [emojis[2]]: () => {
                    this.nextPage();
                    this.awaitReaction(user);
                }
            }[emojiID];
            if (!func)
                return;
            func();
        });
        return emojis;
    }
    send(channel, user) {
        return channel.send(this.pages[this.page - 1]).then(async (msg) => {
            this.message = msg;
            if (this.pages.length === 1)
                return msg;
            const emojis = this.awaitReaction(user);
            if (!emojis)
                return;
            try {
                for (const emoji of emojis)
                    await Util.react(msg, emoji);
            }
            catch (_) { }
            return msg;
        });
    }
}
exports.default = Pages;
//# sourceMappingURL=Pages.js.map