import Token from 'markdown-it/lib/token';
import { MarkdownSerializerState, ParseSpec } from 'prosemirror-markdown';

import type { Node as PMNode } from 'prosemirror-model';

export const toMarkdown = (state: MarkdownSerializerState, node: PMNode) => {
	state.renderList(node, '  ', () => (node.attrs.bullet || '*') + ' ');
};

function listIsTight(tokens: readonly Token[], i: number) {
	while (++i < tokens.length) if (tokens[i].type != 'list_item_open') return tokens[i].hidden;
	return false;
}

export const fromMarkdown: { [token: string]: ParseSpec } = {
	bullet_list: { block: 'itemlist', getAttrs: (_, tokens, i) => ({ tight: listIsTight(tokens, i) }) },
};
