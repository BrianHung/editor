import { MarkdownSerializerState } from 'prosemirror-markdown';
import type { Node as PMNode } from 'prosemirror-model';

export const toMarkdown = (state: MarkdownSerializerState, node: PMNode) => {
	state.renderList(node, '  ', () => (node.attrs.checked ? '[x] ' : '[ ] '));
};

export const fromMarkdown = () => {
	return {
		block: 'checkbox_list',
		getAttrs: (tok, tokens, i) => ({ tight: listIsTight(tokens, i) }),
	};
};

function listIsTight(tokens, i) {
	while (++i < tokens.length) if (tokens[i].type != 'list_item_open') return tokens[i].hidden;
	return false;
}
