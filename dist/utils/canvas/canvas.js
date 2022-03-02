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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const path = __importStar(require("path"));
const fs_1 = require("fs");
const canvas_1 = require("canvas");
const node_canvas_with_twemoji_and_discord_emoji_1 = require("node-canvas-with-twemoji-and-discord-emoji");
const fs_2 = __importDefault(require("../fs"));
const object_1 = __importDefault(require("../object"));
const emojiRegex_1 = __importDefault(require("../emojiRegex"));
const Banner_1 = __importDefault(require("./Banner"));
const Profile_1 = __importDefault(require("./Profile"));
const fonts = [
    { path: './assets/banner/font.ttf', family: 'banner' },
    { path: './assets/profile/font.ttf', family: 'profile' },
    { path: './assets/profile/font_bold.ttf', family: 'profile_bold' },
    { path: './assets/profile/font_black.ttf', family: 'profile_black' },
    { path: './assets/profile/font_extrabold.ttf', family: 'profile_extrabold' }
];
fonts.forEach(font => {
    (0, canvas_1.registerFont)(path.resolve(process.cwd(), font.path), { family: font.family });
});
class CanvasUtil {
    static imagePaths = {
        banner: { background: './assets/banner/background.png' },
        profile: {
            static: './assets/profile/static.png',
            dynamic: {
                xp: './assets/profile/dynamic/xp.png',
                rep: './assets/profile/dynamic/rep.png',
                pair: './assets/profile/dynamic/pair.png',
                repLow: './assets/profile/dynamic/rep_low.png',
                clanName: './assets/profile/dynamic/clan_name.png',
                clanIcon: './assets/profile/dynamic/clan_icon.png'
            },
            overlays: {
                avatar: './assets/profile/overlays/avatar.png',
                clanIcon: './assets/profile/overlays/clan_icon.png'
            },
            backgrounds: fs_2.default
                .readdir('./assets/profile/backgrounds')
                .map(f => `./assets/profile/backgrounds/${f}`)
        }
    };
    static _images = {
        banner: {
            background: CanvasUtil.loadImage(CanvasUtil.imagePaths.banner.background)
        },
        profile: {
            static: CanvasUtil.loadImage(CanvasUtil.imagePaths.profile.static),
            dynamic: {
                xp: CanvasUtil.loadImage(CanvasUtil.imagePaths.profile.dynamic.xp),
                rep: CanvasUtil.loadImage(CanvasUtil.imagePaths.profile.dynamic.rep),
                pair: CanvasUtil.loadImage(CanvasUtil.imagePaths.profile.dynamic.pair),
                repLow: CanvasUtil.loadImage(CanvasUtil.imagePaths.profile.dynamic.repLow),
                clanName: CanvasUtil.loadImage(CanvasUtil.imagePaths.profile.dynamic.clanName),
                clanIcon: CanvasUtil.loadImage(CanvasUtil.imagePaths.profile.dynamic.clanIcon)
            },
            overlays: {
                avatar: CanvasUtil.loadImage(CanvasUtil.imagePaths.profile.overlays.avatar)
            },
            backgrounds: Promise.all(CanvasUtil.imagePaths.profile.backgrounds.map(p => {
                return CanvasUtil.loadImage(p);
            }))
        }
    };
    static images = object_1.default.promiseAll(CanvasUtil._images);
    static readImage(src) {
        return (0, fs_1.readFileSync)(path.join(process.cwd(), src));
    }
    static loadImage(src) {
        return new Promise(async (resolve, reject) => {
            if (typeof src === 'string') {
                if (src.startsWith('http')) {
                    src = await (0, node_fetch_1.default)(src).then(res => res.buffer());
                }
                else {
                    src = this.readImage(src);
                }
            }
            const img = new canvas_1.Image();
            img.onload = () => resolve(img);
            img.onerror = e => reject(e);
            img.src = src;
        });
    }
    static parseFont(font) {
        const match = font.match(/^(\d+)px\s(.+)$/);
        if (!match)
            return null;
        return {
            size: Number(match[1]),
            family: match[2]
        };
    }
    static font(font) {
        return `${font.size}px ${font.family}`;
    }
    static fillText(ctx, text, w, h, maxWidth) {
        return new Promise(resolve => {
            if (maxWidth) {
                let font = this.parseFont(ctx.font);
                if (font) {
                    let measure = this.measureText(ctx, text);
                    while (measure.width > maxWidth) {
                        font.size -= 1;
                        ctx.font = this.font(font);
                        measure = this.measureText(ctx, text);
                    }
                }
            }
            if (emojiRegex_1.default.test(text))
                resolve((0, node_canvas_with_twemoji_and_discord_emoji_1.fillTextWithTwemoji)(ctx, text, w, h));
            else
                resolve(ctx.fillText(text, w, h));
        });
    }
    static strokeText(ctx, text, w, h) {
        return (0, node_canvas_with_twemoji_and_discord_emoji_1.strokeTextWithTwemoji)(ctx, text, w, h);
    }
    static measureText(ctx, text) {
        return (0, node_canvas_with_twemoji_and_discord_emoji_1.measureText)(ctx, text);
    }
    static shadow(ctx, options = {}) {
        const blur = options.blur || 0;
        const color = options.color || '#000';
        const angle = (options.angle || 0) - 90;
        const distance = options.distance || 0;
        const x = Math.sin(Math.PI * (angle / 180)) * distance;
        const y = Math.cos(Math.PI * (angle / 180)) * distance;
        ctx.shadowBlur = blur / 4;
        ctx.shadowColor = color;
        ctx.shadowOffsetX = x;
        ctx.shadowOffsetY = y;
    }
    static makeBanner() {
        return new Banner_1.default();
    }
    static makeProfile(member) {
        return new Profile_1.default(member);
    }
}
exports.default = CanvasUtil;
//# sourceMappingURL=canvas.js.map