import { Extension } from '@brianhung/editor';
import { Command } from 'prosemirror-state';

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/text-align
 */
export const TEXT_ALIGN_VALUES = ['left', 'right', 'center', 'justify'] as const;
type TextAlign = (typeof TEXT_ALIGN_VALUES)[number];

export const TextAlign = (options?: Partial<Extension>) =>
	Extension({
		name: 'textAlign',
		schemaAttrs: {
			textAlign: {
				default: undefined,
				types: ['paragraph', 'heading'],
				getFromDOM(dom) {
					return dom.style.textAlign || undefined;
				},
				setDOMAttr(value, attrs) {
					if (value) attrs.style = (attrs.style || '') + `text-align: ${value};`;
				},
			},
		},
		keymap() {
			return {
				'Mod-Shift-l': setTextAlign('left'),
				'Mod-Shift-e': setTextAlign('center'),
				'Mod-Shift-r': setTextAlign('right'),
				'Mod-Shift-j': setTextAlign('justify'),
			};
		},
		...options,
	});

export function setTextAlign(value: TextAlign): Command {
	return (state, dispatch) => {
		let { from, to } = state.selection;
		let tr = state.tr;
		state.doc.nodesBetween(from, to, (node, pos) => {
			if (node.attrs.textAlign !== undefined) {
				tr.setNodeMarkup(pos, undefined, { ...node.attrs, textAlign: value });
			}
		});
		if (dispatch) dispatch(tr.scrollIntoView());
		return true;
	};
}
