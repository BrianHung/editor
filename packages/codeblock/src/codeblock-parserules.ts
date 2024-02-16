import type { ParseRule } from 'prosemirror-model';

export const GitLabCodeBlockParseRules: ParseRule[] = [
	{
		tag: 'pre.code.highlight',
		preserveWhitespace: 'full',
		getAttrs(dom: HTMLPreElement) {
			const lang = dom.getAttribute('lang');
			return { lang };
		},
	},
];

export const GitHubCodeBlockParseRules: ParseRule[] = [
	{
		tag: 'div.highlight',
		preserveWhitespace: 'full',
		getAttrs(dom: HTMLDivElement) {
			const [match, lang] = /highlight highlight-source-([a-z\/+#-.]*)/.exec(dom.className) || [];
			return match ? { lang } : {};
		},
		contentElement: 'pre',
	},
];

/**
 * Matches any code block that has a language class.
 */
const LANG_CONTENT_SELECTOR = '[class*=lang-], [class*=language-]';
export const LanguageCodeBlockParseRules: ParseRule[] = [
	{
		tag: 'pre',
		preserveWhitespace: 'full',
		getAttrs(dom: HTMLPreElement) {
			const code = dom.querySelector(LANG_CONTENT_SELECTOR);
			if (code === null) return false;
			const [match, lang] = /(?:lang-|language-)([a-z\/+#-.]*)/.exec(code.className) || [];
			return match ? { lang } : false;
		},
		contentElement: LANG_CONTENT_SELECTOR,
	},
];

export const codeblockParseRules: ParseRule[] = [
	...GitLabCodeBlockParseRules,
	...GitHubCodeBlockParseRules,
	...LanguageCodeBlockParseRules,
	{
		tag: 'pre',
		preserveWhitespace: 'full',
	},
];
