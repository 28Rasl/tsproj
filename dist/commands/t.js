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
const main_1 = __importDefault(require("../main"));
const Command_1 = __importDefault(require("../structures/Command"));
const clan_1 = __importDefault(require("../managers/clan"));
const loveroom_1 = __importDefault(require("../managers/loveroom"));
const logger = __importStar(require("../utils/logger"));
class TestCommand extends Command_1.default {
    get cOptions() {
        return {
            allowedUsers: [
                '481427622560137230',
            ]
        };
    }
    execute() {
        logger.info([...clan_1.default.values()].map(clan => clan.name));
        logger.info([...loveroom_1.default.values()].map(loveroom => {
            return (main_1.default.channels.cache.get(loveroom.id) || {})
                .name;
        }));
    }
}
exports.default = TestCommand;
//# sourceMappingURL=t.js.map