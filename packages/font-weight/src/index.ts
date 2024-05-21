import { Extension } from '@brianhung/editor';

const FONT_WEIGHT_ATTRIBUTE = 'data-font-weight';

export const FontWeight = (options?: Partial<Extension>) =>
	Extension({
		name: 'fontWeight',
		schemaAttrs: {
			fontWeight: {
				default: null,
				types: ['textStyle'],
				getFromDOM: dom => dom.getAttribute(FONT_WEIGHT_ATTRIBUTE) || dom.style.fontWeight,
				setDOMAttr(value, attrs) {
					if (value) {
						attrs[FONT_WEIGHT_ATTRIBUTE] = value;
						attrs.style = (attrs.style || '') + `font-weight: ${value};`;
					}
				},
			},
		},
		...options,
	});
