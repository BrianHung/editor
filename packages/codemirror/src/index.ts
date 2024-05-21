import { classToFunction, defineNodeViews } from '@brianhung/editor';
import { keymap as pmKeymap } from 'prosemirror-keymap';
import { NodeSpec } from 'prosemirror-model';
import { Command, Plugin, PluginKey, Selection } from 'prosemirror-state';

import { CodeMirrorNodeView } from './CodeMirrorNodeView';
export {
	language,
	lineNumber,
	lineWrapping,
	setLanguage,
	setLineNumbers,
	setLineWrapping,
	viewExtensions,
} from './CodeMirror';
export { CodeMirrorNodeView } from './CodeMirrorNodeView';
export { CodeMirrorView } from './CodeMirrorView';

/**
 * Utility function for updating codeblock node spec to work with CodeMirror node view.
 * Example usage: schema.spec.nodes.update('codeblock', updateNodeSpec(schema.spec.nodes.get('codeblock')))
 * @param spec
 * @returns
 */
export const updateNodeSpec = (spec: NodeSpec): NodeSpec => ({
	...spec,
	attrs: {
		...spec.attrs,
		language: { default: '' },
		lineNumbers: { default: false },
		lineWrapping: { default: false },
	},
	isolating: true, // allow for gap cursor
});

/**
 * CodeMirror extensions that should be extensible via node attrs.
 */
export type attrs = {
	language: string;
	lineNumbers: boolean;
	lineWrapping: boolean;
};

/**
 *
 * @param dir
 * @returns
 */
function arrowHandler(dir: 'left' | 'right' | 'up' | 'down'): Command {
	return (state, dispatch, view) => {
		if (state.selection.empty && view!.endOfTextblock(dir)) {
			let side = dir == 'left' || dir == 'up' ? -1 : 1;
			let $head = state.selection.$head;
			if ($head.depth == 0) return false; // selection can have zero depth if node or gap selection
			let nextPos = Selection.near(state.doc.resolve(side > 0 ? $head.after() : $head.before()), side);
			// codeblock name should be configurable
			if (nextPos.$head && nextPos.$head.parent.type.name == 'codeblock') {
				dispatch!(state.tr.setSelection(nextPos));
				return true;
			}
		}
		return false;
	};
}

export const arrowHandlers = pmKeymap({
	ArrowLeft: arrowHandler('left'),
	ArrowRight: arrowHandler('right'),
	ArrowUp: arrowHandler('up'),
	ArrowDown: arrowHandler('down'),
});

export const CodeMirrorNodeViewPlugin = defineNodeViews({
	codeblock: classToFunction(CodeMirrorNodeView),
});

// 'aria-live' needs to be set on ProseMirror for some modal UI to work properly with CodeMirror.
export function AriaLivePlugin(options = { ariaLive: 'polite' }) {
	return new Plugin({
		key: new PluginKey('AriaLiveEditorAttribute'),
		props: {
			attributes: {
				'aria-live': options.ariaLive,
			},
		},
	});
}

export const CodeMirrorNodeViewPlugins = [
	arrowHandlers,
	defineNodeViews({
		codeblock: classToFunction(CodeMirrorNodeView),
	}),
	AriaLivePlugin(),
];
