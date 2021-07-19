"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Extension_1 = __importDefault(require("./Extension"));
const prosemirror_history_1 = require("prosemirror-history");
class History extends Extension_1.default {
    get name() {
        return "history";
    }
    keys() {
        return {
            "Mod-z": prosemirror_history_1.undo,
            "Shift-Mod-z": prosemirror_history_1.redo,
        };
    }
    get plugins() {
        return [prosemirror_history_1.history()];
    }
}
exports.default = History;
