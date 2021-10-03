"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Autocomplete = void 0;
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_view_1 = require("prosemirror-view");
const prosemirror_state_2 = require("prosemirror-state");
function positionMatcher(regexp, pos) {
    const text = pos.doc.textBetween(pos.before(), pos.end(), '\0', '\0');
    let match = regexp.exec(text);
    if (match) {
        let from = pos.start() + match.index, to = from + match[0].length;
        if (from < pos.pos && to >= pos.pos) {
            return { range: { from, to }, query: match[1] || "", text: match[0] };
        }
    }
}
const initialState = { active: false, range: null, query: null, text: null };
function Autocomplete({ regexp, pluginKey, style = '', onEnter, onChange, onLeave, onKeyDown }) {
    const plugin = new prosemirror_state_1.Plugin({
        key: pluginKey,
        view() {
            return {
                update: (view, prevState) => {
                    var _a, _b, _c;
                    const prev = this.key.getState(prevState);
                    const next = this.key.getState(view.state);
                    const started = !prev.active && next.active;
                    const stopped = prev.active && !next.active;
                    const changed = prev.active && next.active && prev.query !== next.query;
                    const props = Object.assign({ view }, next);
                    let plugin = this.key.get(view.state);
                    started && ((_a = plugin.onEnter) === null || _a === void 0 ? void 0 : _a.call(plugin, props));
                    stopped && ((_b = plugin.onLeave) === null || _b === void 0 ? void 0 : _b.call(plugin, props));
                    changed && ((_c = plugin.onChange) === null || _c === void 0 ? void 0 : _c.call(plugin, props));
                },
            };
        },
        state: {
            init: (config, editorState) => initialState,
            apply: (tr, prevState) => {
                let $from = tr.selection.$from;
                if (tr.selection instanceof prosemirror_state_2.TextSelection && tr.selection.empty && !$from.parent.type.spec.code && $from.parent.isTextblock) {
                    let match = positionMatcher(regexp, $from);
                    if (match) {
                        return Object.assign({ active: true }, match);
                    }
                }
                return initialState;
            },
        },
        props: {
            handleKeyDown(view, event) {
                var _a;
                let state = this.getState(view.state);
                if (!state.active)
                    return false;
                let plugin = this;
                return (_a = plugin.onKeyDown) === null || _a === void 0 ? void 0 : _a.call(plugin, Object.assign({ view, event }, state));
            },
            decorations(editorState) {
                let state = this.getState(editorState);
                if (!state.active)
                    return prosemirror_view_1.DecorationSet.empty;
                return prosemirror_view_1.DecorationSet.create(editorState.doc, [
                    prosemirror_view_1.Decoration.inline(state.range.from, state.range.to, {
                        nodeName: 'span', class: `ProseMirror-autocomplete ${style}`
                    })
                ]);
            },
        },
    });
    plugin.onEnter = onEnter;
    plugin.onLeave = onLeave;
    plugin.onChange = onChange;
    plugin.onKeyDown = onKeyDown;
    return plugin;
}
exports.Autocomplete = Autocomplete;
exports.default = Autocomplete;