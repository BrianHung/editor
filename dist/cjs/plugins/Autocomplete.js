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
const initialPluginState = { active: false, range: null, query: null, text: null };
function Autocomplete({ regexp, style = '', pluginKey = new prosemirror_state_1.PluginKey('Autocomplete'), onEnter, onChange, onLeave, onKeyDown }) {
    return new prosemirror_state_1.Plugin({
        key: pluginKey,
        view() {
            return {
                update: (view, prevState) => {
                    const prev = this.key.getState(prevState);
                    const next = this.key.getState(view.state);
                    const started = !prev.active && next.active;
                    const stopped = prev.active && !next.active;
                    const changed = prev.active && next.active && prev.query !== next.query;
                    let plugin = this.key.get(view.state);
                    onEnter = onEnter || plugin.onEnter;
                    onLeave = onLeave || plugin.onLeave;
                    onChange = onChange || plugin.onChange;
                    const props = { view, range: next.range, query: next.query, text: next.text };
                    started && onEnter && onEnter(props);
                    stopped && onLeave && onLeave(props);
                    changed && onChange && onChange(props);
                },
            };
        },
        state: {
            init: (config, editorState) => initialPluginState,
            apply: (tr, prevState) => {
                const $from = tr.selection.$from;
                if (tr.selection instanceof prosemirror_state_2.TextSelection && !$from.parent.type.spec.code && $from.parent.isTextblock) {
                    let match = positionMatcher(regexp, $from);
                    if (match) {
                        return Object.assign({ active: true }, match);
                    }
                }
                return initialPluginState;
            },
        },
        props: {
            handleKeyDown(view, event) {
                const state = this.getState(view.state);
                if (!state.active) {
                    return false;
                }
                onKeyDown = this.onKeyDown || onKeyDown;
                return onKeyDown && onKeyDown(Object.assign({ view, event }, state));
            },
            decorations(editorState) {
                const state = this.getState(editorState);
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
}
exports.Autocomplete = Autocomplete;
exports.default = Autocomplete;
