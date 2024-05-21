import { MarkdownSerializerState, ParseSpec } from 'prosemirror-markdown';
import type { Node as PMNode } from 'prosemirror-model';

export const toMarkdown = (state: MarkdownSerializerState, node: PMNode) => {
	state.write(state.repeat('#', node.attrs.level) + ' ');
	state.renderInline(node, false);
	state.closeBlock(node);
};

export const fromMarkdown: { [token: string]: ParseSpec } = {
	heading: { block: 'heading', getAttrs: tok => ({ level: +tok.tag.slice(1) }) },
};
