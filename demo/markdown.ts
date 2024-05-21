import MarkdownIt from 'markdown-it';

import { MarkdownParser, MarkdownSerializer } from 'prosemirror-markdown';

import * as blockquote from '@brianhung/editor-blockquote';
import * as codeblock from '@brianhung/editor-codeblock';
import * as doc from '@brianhung/editor-doc';
import * as enumList from '@brianhung/editor-enum-list';
import * as hardBreak from '@brianhung/editor-hardbreak';
import * as heading from '@brianhung/editor-heading';
import * as horizontalRule from '@brianhung/editor-horizontal-rule';
import * as image from '@brianhung/editor-image';
import * as itemList from '@brianhung/editor-item-list';
import * as listItem from '@brianhung/editor-list-item';
import * as paragraph from '@brianhung/editor-paragraph';
import * as text from '@brianhung/editor-text';

import { schemaFromExtensions } from '@brianhung/editor';
import * as bold from '@brianhung/editor-bold';
import * as code from '@brianhung/editor-code';
import * as italic from '@brianhung/editor-italic';
import * as link from '@brianhung/editor-link';
import * as underline from '@brianhung/editor-underline';

const imports = [
	doc,
	blockquote,
	codeblock,
	heading,
	horizontalRule,
	itemList,
	enumList,
	listItem,
	paragraph,
	image,
	hardBreak,
	text,
	bold,
	italic,
	link,
	code,
	underline,
];

const schema = schemaFromExtensions(
	imports.map(i => i.default()),
	'doc'
);

export const defaultMarkdownSerializer = new MarkdownSerializer(
	{
		blockquote: blockquote.toMarkdown,
		codeblock: codeblock.toMarkdown,
		heading: heading.toMarkdown,
		horizontalrule: horizontalRule.toMarkdown,
		itemlist: itemList.toMarkdown,
		enumlist: enumList.toMarkdown,
		listitem: listItem.toMarkdown,
		paragraph: paragraph.toMarkdown,
		image: image.toMarkdown,
		hardbreak: hardBreak.toMarkdown,
		text: text.toMarkdown,
	},
	{
		bold: bold.toMarkdown,
		italic: italic.toMarkdown,
		link: link.toMarkdown,
		code: code.toMarkdown,
		underline: underline.toMarkdown,
	},
	{
		strict: false,
	}
);

const tokensList = [
	blockquote.fromMarkdown,
	codeblock.fromMarkdown,
	heading.fromMarkdown,
	horizontalRule.fromMarkdown,
	itemList.fromMarkdown,
	enumList.fromMarkdown,
	listItem.fromMarkdown,
	paragraph.fromMarkdown,
	image.fromMarkdown,
	hardBreak.fromMarkdown,
	bold.fromMarkdown,
	italic.fromMarkdown,
	link.fromMarkdown,
	code.fromMarkdown,
	underline.fromMarkdown,
];

const tokens = tokensList.reduce((tokens, token) => ({ ...tokens, ...token }), {});
const tokenizer = MarkdownIt('commonmark', { html: false });

export const defaultMarkdownParser = new MarkdownParser(schema, tokenizer, tokens);
export const createMarkdownParser = (schema: any) => new MarkdownParser(schema, tokenizer, tokens);
