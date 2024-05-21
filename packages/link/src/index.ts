import { Mark } from '@brianhung/editor';
import { toggleMark } from 'prosemirror-commands';
import { InputRule } from 'prosemirror-inputrules';
import type { Mark as PMMark } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { LinkPastePlugin } from './link-paste.js';
import { defaultOnClick } from './utils.js';
export * from './markdown';

export const Link = (options?: Partial<Mark>) =>
	Mark({
		name: 'link',

		onClick: defaultOnClick,

		attrs: {
			href: {},
			title: { default: null },
		},
		inclusive: false,
		group: 'inline block',
		parseDOM: [
			{
				tag: 'a[href]',
				getAttrs(dom: HTMLElement) {
					return { href: dom.getAttribute('href'), title: dom.getAttribute('title') };
				},
			},
		],
		toDOM(mark: PMMark) {
			const { href, title } = mark.attrs;
			return [
				'a',
				{
					...mark.attrs,
					href,
					title,
					rel: 'noopener noreferrer nofollow',
				},
				0,
			];
		},

		commands({ markType }) {
			return {
				link: ({ attrs }) => toggleMark(markType, attrs),
			};
		},

		keymap({ markType }) {
			return {
				'Mod-k': toggleMark(markType, { href: '/' }),
				'Mod-K': toggleMark(markType, { href: '/' }),
				'Alt-k': openLinksAcrossSelection,
			};
		},

		inputRules({ markType }) {
			return [
				// Markdown link
				new InputRule(/\[(.+|:?)]\((\S+)\)/, (state, match, start, end) => {
					const tr = state.tr;
					const [okay, text, href] = match;
					if (okay) {
						const slice = state.doc.slice(start + okay.indexOf(text), start + okay.indexOf(text) + text.length);
						tr.replace(start, end, slice);
						tr.addMark(start, start + text.length, markType.create({ href }));
						tr.removeStoredMark(markType);
					}
					return tr;
				}),
				// Wikipedia+Mediawiki
				new InputRule(/\[\[([\w\s]+)(?:\|([\w\s]+))?\]\]$/, (state, match, start, end) => {
					const tr = state.tr;
					const [okay, link, text] = match;
					if (okay) {
						tr.replaceWith(start, end, state.schema.text(text || link));
						tr.addMark(
							start,
							start + (text || link).length,
							markType.create({
								href: `/p/${link.replace(/ /g, '-')}`,
								internal: true,
							})
						);
					}
					return tr;
				}),
			];
		},

		plugins() {
			return [
				LinkPastePlugin(),
				new Plugin({
					props: {
						// Register mouseover and click event handlers for onHover and onClick.
						handleDOMEvents: {
							mouseover: (view, event) => {
								if (!(event.target instanceof HTMLAnchorElement)) return false; // Escape if target is not a link.
								return this.onHover?.(event, view);
							},
							click: (view, event) => {
								if (!(event.target instanceof HTMLAnchorElement)) return false; // Escape if target is not a link.
								return this.onClick?.(event, view);
							},
						},
						// Disable default ProseMirror meta/ctrl+leftclick NodeSelection behavior when target is a link.
						// See: https://discuss.prosemirror.net/t/disable-ctrl-click/995
						handleClick: (view, pos, event) => {
							if (!(event.target instanceof HTMLAnchorElement)) return false; // Escape if target is not a link.
							return event.button == 0
								? /Mac/.test(navigator.platform)
									? event.metaKey
									: event.ctrlKey
								: this.onClick?.(event, view);
						},
					},
				}),
			];
		},

		...options,
	});

export default Link;

import type { EditorState } from 'prosemirror-state';

function openLinksAcrossSelection(state: EditorState) {
	let { selection, doc, schema } = state;
	let links = [];
	doc.nodesBetween(selection.from, selection.to, node => {
		links.push(
			...node.marks.reduce(
				(links, mark) => (mark.type === schema.marks.link ? links.concat([mark.attrs.href]) : links),
				[]
			)
		);
	});
	Array.from(new Set(links)).forEach(link => window.open(link, '_blank'));
	return false;
}
