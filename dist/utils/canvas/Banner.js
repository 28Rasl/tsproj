"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("canvas");
const canvas_2 = __importDefault(require("./canvas"));
const util_1 = require("../util");
class CanvasBanner {
    constructor() {
        return canvas_2.default.images.then(images => {
            const guild = (0, util_1.getMainGuild)();
            const voiceSize = guild.voiceStates.cache
                .array()
                .filter(v => Boolean(v.channelID)).length;
            const memberCount = guild.memberCount;
            const bg = images.banner.background;
            const canvas = (0, canvas_1.createCanvas)(bg.width, bg.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bg, 0, 0);
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '40px banner';
            ctx.fillText(voiceSize.toLocaleString('ru-RU'), 65, 510, 90);
            ctx.font = '44px banner';
            ctx.fillText(memberCount.toLocaleString('ru-RU'), 855, 500, 180);
            return canvas.toBuffer();
        });
    }
}
exports.default = CanvasBanner;
//# sourceMappingURL=Banner.js.map