import Token from 'markdown-it/lib/token';
import { MarkdownSerializerState, ParseSpec } from 'prosemirror-markdown';
import type { Node as PMNode } from 'prosemirror-model';

export const toMarkdown = (state: MarkdownSerializerState, node: PMNode) => {
	let start = node.attrs.start || 1;
	let maxW = String(start + node.childCount - 1).length;
	let space = state.repeat(' ', maxW + 2);
	state.renderList(node, space, i => {
		let nStr = String(start + i);
		return state.repeat(' ', maxW - nStr.length) + nStr + '. ';
	});
};

function listIsTight(tokens: readonly Token[], i: number) {
	while (++i < tokens.length) if (tokens[i].type != 'list_item_open') return tokens[i].hidden;
	return false;
}

export const fromMarkdown: { [token: string]: ParseSpec } = {
	ordered_list: {
		block: 'enumlist',
		getAttrs: (tok, tokens, i) => ({
			order: +tok.attrGet('start')! || 1,
			tight: listIsTight(tokens, i),
		}),
	},
};
