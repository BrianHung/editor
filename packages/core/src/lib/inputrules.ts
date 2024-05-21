/**
 * This is a modified `inputRules` plugin from prosemirror-inputrules to trigger on 'enter' key.
 * The logic for that is contained within handleKeyDown.
 * https://github.com/ProseMirror/prosemirror-inputrules/blob/master/src/inputrules.js
 */
import { InputRule } from 'prosemirror-inputrules';
import { Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

const MAX_MATCH = 500;
export const inputRulesKey = new PluginKey('InputRules');

export function inputRules({ rules }: { rules: InputRule[] }) {
	let plugin = new Plugin({
		state: {
			init() {
				return null;
			},
			apply(tr, prev) {
				let stored = tr.getMeta(this);
				if (stored) return stored;
				return tr.selectionSet || tr.docChanged ? null : prev;
			},
		},
		props: {
			handleTextInput(view, from, to, text) {
				return run(view, from, to, text, rules, plugin);
			},
			handleDOMEvents: {
				// https://discuss.prosemirror.net/t/settimeout-in-inputrule-compositionend/3238
				compositionend: view => {
					setTimeout(() => {
						let { $cursor } = view.state.selection as TextSelection;
						if ($cursor) return run(view, $cursor.pos, $cursor.pos, '', rules, plugin);
					});
					return false;
				},
			},
			handleKeyDown(view, event) {
				if (event.key === 'Enter') {
					let { $cursor } = view.state.selection as TextSelection;
					if ($cursor) return run(view, $cursor.pos, $cursor.pos, '\n', rules, plugin);
					return false;
				}
			},
		},
		// @ts-ignore
		isInputRules: true,
		key: inputRulesKey,
	});
	return plugin;
}

/**
 * @internal
 */
function run(view: EditorView, from: number, to: number, text: string, rules: InputRule[], plugin: Plugin) {
	if (view.composing) return false;
	let state = view.state,
		$from = state.doc.resolve(from);
	if ($from.parent.type.spec.code) return false;
	let textBefore =
		$from.parent.textBetween(Math.max(0, $from.parentOffset - MAX_MATCH), $from.parentOffset, null, '\ufffc') + text;
	for (let i = 0; i < rules.length; i++) {
		let match = (rules[i] as any).match.exec(textBefore);
		let tr = match && (rules[i] as any).handler(state, match, from - (match[0].length - text.length), to);
		if (!tr) continue;
		view.dispatch(tr.setMeta(plugin, { transform: tr, from, to, text }));
		return true;
	}
	return false;
}
