import { ParseSpec } from 'prosemirror-markdown';

export const toMarkdown = {
	open: '$',
	close: '$',
	mixable: false,
	expelEnclosingWhitespace: true,
};

export const fromMarkdown: { [token: string]: ParseSpec } = {
	math: { mark: 'math' },
};
