import { MarkdownSerializerState, ParseSpec } from 'prosemirror-markdown';
import type { Node as PMNode } from 'prosemirror-model';

export const toMarkdown = (state: MarkdownSerializerState, node: PMNode) => {
	// Make sure the front matter fences are longer than any dash sequence within it
	const backticks = node.textContent.match(/`{3,}/gm);
	const fence = backticks ? backticks.sort().slice(-1)[0] + '`' : '```';

	state.write(fence + (node.attrs.lang || '') + '\n');
	state.text(node.textContent, false);
	// Add a newline to the current content before adding closing marker
	state.write('\n');
	state.write(fence);
	state.closeBlock(node);
};

export const fromMarkdown: { [token: string]: ParseSpec } = {
	code_block: { block: 'codeblock', noCloseToken: true },
	fence: { block: 'codeblock', getAttrs: tok => ({ language: tok.info || '' }), noCloseToken: true },
};
