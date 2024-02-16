/**
 * WIP: highlighting advanced search terms.
 * e.g. site:google.com
 * from @user, mentions @user, has, before, after, during, in, ""
 */

import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { ReplaceAroundStep, ReplaceStep } from 'prosemirror-transform';
import { Decoration, DecorationSet } from 'prosemirror-view';

export const SearchTermPluginKey = new PluginKey('SearchTerm');

export const SearchTermSyntaxHighlight = (options?) => {
	const regexArray = [
		{
			regex: /".*?"/g,
			style: 'st-exact',
		},
	];

	const getDecorations = (state): Decoration[] => {
		const decorations = [];
		const { $from, $to, from, to, $cursor, empty } = state.selection;
		let textAround =
			$from.parent.textBetween(
				Math.max(0, $from.parentOffset - 128),
				Math.min($from.parentOffset + 128, $from.parent.nodeSize - 2),
				null,
				'\ufffc'
			) + '';

		regexArray.forEach(({ regex, style }) => {
			let match;
			while ((match = regex.exec(textAround))) {
				decorations.push(Decoration.inline(0, 0, { class: style }));
			}
		});

		return decorations;
	};

	return new Plugin({
		props: {
			decorations(state): DecorationSet {
				return this.getState(state);
			},
		},
		state: {
			init: (config, state: EditorState): DecorationSet => {
				return DecorationSet.create(state.doc, getDecorations(state));
			},
			apply: (tr: Transaction, decorationSet: DecorationSet): DecorationSet => {
				// Keep prev decorations if no text change in document.

				let textChange = tr.steps.some(step => step instanceof ReplaceStep || step instanceof ReplaceAroundStep);
				if (textChange == false) return decorationSet;

				// Map previous decorationSet through this transaction.
				decorationSet = decorationSet.map(tr.mapping, tr.doc);

				// Diff decorationSet with old and new decorations.
				const decorationsNew = []; // getDecorations(tr.state);
				const decorationsOld = []; // decorationsNew.map(({node, pos}) => decorationSet.find(pos, pos + node.nodeSize)).flat();

				decorationSet = decorationSet.remove(decorationsOld);
				decorationSet = decorationSet.add(tr.doc, decorationsNew);
				return decorationSet;
			},
		},
		key: SearchTermPluginKey,
	});
};

export default SearchTermSyntaxHighlight;
