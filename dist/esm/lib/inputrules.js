import { Plugin, PluginKey } from "prosemirror-state";
const MAX_MATCH = 500;
export const inputRulesKey = new PluginKey("InputRules");
export function inputRules({ rules }) {
    let plugin = new Plugin({
        state: {
            init() { return null; },
            apply(tr, prev) {
                let stored = tr.getMeta(this);
                if (stored)
                    return stored;
                return tr.selectionSet || tr.docChanged ? null : prev;
            }
        },
        props: {
            handleTextInput(view, from, to, text) {
                return run(view, from, to, text, rules, plugin);
            },
            handleDOMEvents: {
                compositionend: (view) => {
                    setTimeout(() => {
                        let { $cursor } = view.state.selection;
                        if ($cursor)
                            return run(view, $cursor.pos, $cursor.pos, "", rules, plugin);
                    });
                    return false;
                }
            },
            handleKeyDown(view, event) {
                if (event.key === "Enter") {
                    let { $cursor } = view.state.selection;
                    if ($cursor)
                        return run(view, $cursor.pos, $cursor.pos, "\n", rules, plugin);
                    return false;
                }
            }
        },
        isInputRules: true,
        key: inputRulesKey,
    });
    return plugin;
}
function run(view, from, to, text, rules, plugin) {
    if (view.composing)
        return false;
    let state = view.state, $from = state.doc.resolve(from);
    if ($from.parent.type.spec.code)
        return false;
    let textBefore = $from.parent.textBetween(Math.max(0, $from.parentOffset - MAX_MATCH), $from.parentOffset, null, "\ufffc") + text;
    for (let i = 0; i < rules.length; i++) {
        let match = rules[i].match.exec(textBefore);
        let tr = match && rules[i].handler(state, match, from - (match[0].length - text.length), to);
        if (!tr)
            continue;
        view.dispatch(tr.setMeta(plugin, { transform: tr, from, to, text }));
        return true;
    }
    return false;
}
