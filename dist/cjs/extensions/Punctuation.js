"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Extension_1 = __importDefault(require("./Extension"));
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
class Punctuation extends Extension_1.default {
    get name() {
        return 'punctuation';
    }
    inputRules() {
        return [
            new prosemirror_inputrules_1.InputRule(/(?:^)(--)(?:[\w\s])/, punctuationHandler("–")),
            new prosemirror_inputrules_1.InputRule(/(?:^)(---)(?:[\w\s])/, punctuationHandler("—")),
            new prosemirror_inputrules_1.InputRule(/(?:[\w\s])(--)/, punctuationHandler("–")),
            new prosemirror_inputrules_1.InputRule(/(?:[\w\s])(–-)/, punctuationHandler("—")),
            new prosemirror_inputrules_1.InputRule(/-->$/, "⟶"),
            new prosemirror_inputrules_1.InputRule(/->$/, "→"),
            new prosemirror_inputrules_1.InputRule(/<--$/, "⟵"),
            new prosemirror_inputrules_1.InputRule(/<-$/, "←"),
            new prosemirror_inputrules_1.InputRule(/–>$/, "⟶"),
            new prosemirror_inputrules_1.InputRule(/←-$/, "⟵"),
            new prosemirror_inputrules_1.InputRule(/[0-9]+(x)[0-9]+$/, punctuationHandler("×")),
            new prosemirror_inputrules_1.InputRule(/\.\.\.$/, "…"),
        ];
    }
}
exports.default = Punctuation;
function punctuationHandler(string) {
    return (state, match, start, end) => {
        const insert = match[0].replace(new RegExp(`${match[1]}`, 'g'), string);
        return state.tr.insertText(insert, start, end);
    };
}
