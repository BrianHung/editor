import { ParseSpec } from 'prosemirror-markdown';

export const toMarkdown = {
	open: '<sub>',
	close: '</sub>',
	mixable: true,
	expelEnclosingWhitespace: true,
};

export const fromMarkdown: { [token: string]: ParseSpec } = {
	subscript: { mark: 'subscript' },
};
