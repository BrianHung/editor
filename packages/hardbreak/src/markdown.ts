import { MarkdownSerializerState, ParseSpec } from 'prosemirror-markdown';
import type { Node as PMNode } from 'prosemirror-model';

export const toMarkdown = (state: MarkdownSerializerState, node: PMNode, parent, index) => {
	for (let i = index + 1; i < parent.childCount; i++)
		if (parent.child(i).type != node.type) {
			state.write('\\\n');
			return;
		}
};

export const fromMarkdown: { [token: string]: ParseSpec } = {
	hardbreak: { node: 'hardbreak' },
};
