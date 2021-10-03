"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindReplaceKey = void 0;
const prosemirror_state_1 = require("prosemirror-state");
exports.FindReplaceKey = new prosemirror_state_1.PluginKey("FindReplace");
function FindReplace() {
    return new prosemirror_state_1.Plugin({
        state: {
            init(configs, state) {
                return new FindReplaceState(state);
            },
            apply(tr, pluginState, prevState, nextState) {
                return pluginState.applyTransaction(tr);
            }
        },
        props: {
            decorations(state) {
                return this.getState(state).decorations;
            },
        },
        key: exports.FindReplaceKey,
    });
}
exports.default = FindReplace;
class FindReplaceState {
    constructor(state) {
    }
}
