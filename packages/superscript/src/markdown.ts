import { ParseSpec } from 'prosemirror-markdown';

export const toMarkdown = {
	open: '<sup>',
	close: '</sup>',
	mixable: true,
	expelEnclosingWhitespace: true,
};

export const fromMarkdown: { [token: string]: ParseSpec } = {
	superscript: { mark: 'superscript' },
};
