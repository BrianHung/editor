"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Extension_1 = __importDefault(require("./Extension"));
const FocusMode_1 = require("../plugins/FocusMode");
class FocusMode extends Extension_1.default {
    get name() {
        return 'FocusMode';
    }
    keys() {
        return {
            "Shift-Ctrl-f": FocusMode_1.toggleFocusMode
        };
    }
    commands() {
        return () => FocusMode_1.toggleFocusMode;
    }
    get plugins() {
        return [
            FocusMode_1.FocusMode()
        ];
    }
}
exports.default = FocusMode;
