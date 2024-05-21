import { ParseSpec } from 'prosemirror-markdown';

export const toMarkdown = {
	open: '**',
	close: '**',
	mixable: true,
	expelEnclosingWhitespace: true,
};

export const fromMarkdown: { [token: string]: ParseSpec } = {
	strong: { mark: 'bold' },
};
