"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFocusMode = exports.FocusMode = exports.FocusModeKey = void 0;
const prosemirror_state_1 = require("prosemirror-state");
exports.FocusModeKey = new prosemirror_state_1.PluginKey('FocusMode');
function FocusMode(options = { initState: false }) {
    return new prosemirror_state_1.Plugin({
        key: exports.FocusModeKey,
        props: {
            attributes(state) {
                return this.getState(state) ? { class: "ProseMirror-focusmode" } : null;
            }
        },
        state: {
            init: (config, state) => options.initState,
            apply(tr, prevState) {
                let focus = tr.getMeta(exports.FocusModeKey);
                if (focus === undefined)
                    return prevState;
                return typeof focus === 'boolean' ? focus : !prevState;
            }
        },
    });
}
exports.FocusMode = FocusMode;
exports.default = FocusMode;
function toggleFocusMode(focus = null) {
    return (state, dispatch) => {
        dispatch(state.tr.setMeta(exports.FocusModeKey, focus));
        return true;
    };
}
exports.toggleFocusMode = toggleFocusMode;
