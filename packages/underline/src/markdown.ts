import { ParseSpec } from 'prosemirror-markdown';

export const toMarkdown = {
	open: '<u>',
	close: '</u>',
	mixable: true,
	expelEnclosingWhitespace: true,
};

export const fromMarkdown: { [token: string]: ParseSpec } = {
	underline: { mark: 'underline' },
};
