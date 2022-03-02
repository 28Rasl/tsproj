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
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const canvas_1 = require("canvas");
const main_1 = __importDefault(require("../../main"));
const canvas_2 = __importDefault(require("./canvas"));
const Util = __importStar(require("../../utils/util"));
const config = __importStar(require("../../config"));
const db_1 = require("../db");
const clan_1 = __importDefault(require("../../managers/clan"));
class CanvasProfile {
    constructor(member) {
        return canvas_2.default.images.then(async (images) => {
            const bg = images.profile.backgrounds[0];
            const canvas = (0, canvas_1.createCanvas)(bg.width, bg.height);
            const ctx = canvas.getContext('2d');
            const fillText = canvas_2.default.fillText.bind(canvas_2.default, ctx);
            const [profile, pair] = await Promise.all([
                db_1.User.getOne({ userID: member.id }),
                db_1.Pair.findOne(p => (p.pair || []).includes(member.id))
            ]);
            // Background
            ctx.drawImage(bg, 0, 0);
            //#region Avatar
            const avatarURL = member.user.displayAvatarURL({
                size: 256,
                format: 'png',
                dynamic: false
            });
            const avatarImage = await canvas_2.default.loadImage(avatarURL).catch(() => { });
            if (avatarImage) {
                const avatar = await CanvasProfile.makeAvatar(avatarImage);
                ctx.drawImage(avatar, 0, 0);
            }
            //#endregion
            // Static
            ctx.drawImage(images.profile.static, 0, 0);
            //#region Global
            ctx.textBaseline = 'middle';
            //#endregion
            //#region Tag
            ctx.font = '24px profile_bold, serif';
            ctx.textAlign = 'start';
            ctx.fillStyle = '#ebebeb';
            canvas_2.default.shadow(ctx, {
                blur: 8,
                color: 'rgba(0,0,0,0.4)',
                angle: 135,
                distance: 4
            });
            await fillText(member.user.tag, 168, 258, 300);
            //#endregion
            //#region Join date
            const tz = config.meta.defaultTimezone;
            const joinMoment = (0, moment_timezone_1.default)(member.joinedTimestamp).tz(tz);
            const joinString = joinMoment.locale('ru-RU').format('L');
            ctx.font = '22px profile_bold, serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#e7e7e7';
            canvas_2.default.shadow(ctx);
            await fillText(joinString, 140, 65, 150);
            //#endregion
            //#region Voice Time
            const voiceActivity = Util.parseVoiceActivity(profile.voiceActivity);
            const voiceTime = profile.voiceTime + voiceActivity;
            const timeString = Util.parseFilteredTimeString(voiceTime);
            ctx.font = '22px profile_bold, serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#e7e7e7';
            canvas_2.default.shadow(ctx);
            await fillText(timeString, 150, 104, 120);
            //#endregion
            //#region Pair
            if (pair) {
                const pairID = pair.pair.find(id => id !== member.id);
                const pairUser = pairID ? await main_1.default.users.fetch(pairID) : null;
                if (pairUser) {
                    ctx.drawImage(images.profile.dynamic.pair, 0, 0);
                    ctx.font = '24px profile_bold, serif';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = '#ebebeb';
                    canvas_2.default.shadow(ctx, {
                        blur: 8,
                        color: 'rgba(0,0,0,0.4)',
                        angle: 120,
                        distance: 2
                    });
                    await fillText(pairUser.username, 170, 402, 140);
                }
            }
            //#endregion
            //#region Voice Position
            const profilesPromise = db_1.User.getData();
            const profiles = await profilesPromise;
            const voiceIndex = await profilesPromise
                .then(data => [...data.values()])
                .then(docs => {
                return docs.map(d => {
                    return {
                        ...d,
                        voiceTime: d.voiceTime + Util.parseVoiceActivity(d.voiceActivity)
                    };
                });
            })
                .then(docs => docs.sort((b, a) => a.voiceTime - b.voiceTime))
                .then(docs => docs.findIndex(d => d.userID === member.id));
            const voicePos = voiceIndex + 1 || profiles.array().length + 1;
            const voicePosString = voicePos.toLocaleString('ru-RU');
            ctx.font = '22px profile_bold, serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#e7e7e7';
            canvas_2.default.shadow(ctx);
            await fillText(voicePosString, 495, 402, 90);
            //#endregion
            //#region Level
            ctx.font = '54px profile_bold, serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#e7e7e7';
            canvas_2.default.shadow(ctx);
            await fillText('0', 523, 77, 70);
            //#endregion
            //#region Reputation
            ctx.drawImage(images.profile.dynamic.rep, 0, 0);
            ctx.font = '22px profile_bold, serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#e7e7e7';
            canvas_2.default.shadow(ctx);
            await fillText('0', 495, 348, 100);
            //#endregion
            //#region Xp
            ctx.drawImage(images.profile.dynamic.xp, 0, 0);
            //#endregion
            //#region Clan
            const clanID = profile.clanID;
            if (typeof clanID === 'string') {
                const clan = clan_1.default.get(clanID);
                if (clan) {
                    const clanIconURL = clan.flag;
                    if (clanIconURL) {
                        const clanIconImage = await canvas_2.default.loadImage(clanIconURL).catch(() => { });
                        if (clanIconImage) {
                            const clanIcon = await CanvasProfile.makeClanIcon(clanIconImage);
                            ctx.drawImage(clanIcon, 0, 0);
                        }
                    }
                    ctx.drawImage(images.profile.dynamic.clanName, 0, 0);
                    ctx.font = '24px profile_extrabold, serif';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = '#ebebeb';
                    canvas_2.default.shadow(ctx, {
                        blur: 8,
                        color: 'rgba(0,0,0,0.7)',
                        angle: 120,
                        distance: 4
                    });
                    fillText(clan.name, 325, 213, 200);
                }
            }
            //#endregion
            return canvas.toBuffer();
        });
    }
    static makeAvatar(avatar) {
        return new this.Avatar(avatar);
    }
    static makeClanIcon(icon) {
        return new this.ClanIcon(icon);
    }
    static get ClanIcon() {
        return class CanvasClanIcon {
            constructor(icon) {
                return canvas_2.default.images.then(images => {
                    const overlay = images.profile.overlays.clanIcon;
                    const canvas = (0, canvas_1.createCanvas)(overlay.width, overlay.height);
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(overlay, 0, 0);
                    ctx.globalCompositeOperation = 'source-in';
                    ctx.drawImage(icon, 170, 192, 40, 40);
                    return canvas;
                });
            }
        };
    }
    static get Avatar() {
        return class CanvasAvatar {
            constructor(avatar) {
                return canvas_2.default.images.then(images => {
                    const overlay = images.profile.overlays.avatar;
                    const canvas = (0, canvas_1.createCanvas)(overlay.width, overlay.height);
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(overlay, 0, 0);
                    ctx.globalCompositeOperation = 'source-in';
                    ctx.drawImage(avatar, 58, 184, 100, 100);
                    return canvas;
                });
            }
        };
    }
}
exports.default = CanvasProfile;
//# sourceMappingURL=Profile.js.map