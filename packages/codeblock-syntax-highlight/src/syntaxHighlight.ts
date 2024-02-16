import type { LanguageSupport } from '@codemirror/language';
import { highlightTree } from '@lezer/highlight';
import { highlightStyle } from './highlightStyle.js';

/**
 * Replicates functionality and api of CodeMirror 5 runmode:
 * https://github.com/codemirror/CodeMirror/blob/master/addon/runmode/runmode.js
 */
export function syntaxHighlight(
	text: string,
	support: LanguageSupport,
	callback: (token: { text: string; style: string; from: number; to: number }) => void,
	options = { match: highlightStyle }
) {
	let pos = 0;
	let tree = support.language.parser.parse(text);
	highlightTree(tree, options.match, (from, to, classes) => {
		from > pos &&
			callback({
				text: text.slice(pos, from),
				style: null,
				from: pos,
				to: from,
			});
		callback({ text: text.slice(from, to), style: classes, from, to });
		pos = to;
	});
	pos != tree.length &&
		callback({
			text: text.slice(pos, tree.length),
			style: null,
			from: pos,
			to: tree.length,
		});
}
