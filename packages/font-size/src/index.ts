import { Extension } from '@brianhung/editor';

const FONT_SIZE_ATTRIBUTE = 'data-font-size';

export const FontSize = (options?: Partial<Extension>) =>
	Extension({
		name: 'fontSize',
		schemaAttrs: {
			fontSize: {
				default: null,
				types: ['textStyle'],
				getFromDOM: dom => dom.getAttribute(FONT_SIZE_ATTRIBUTE) || dom.style.fontSize,
				setDOMAttr(value, attrs) {
					if (value) {
						attrs[FONT_SIZE_ATTRIBUTE] = value;
						attrs.style = (attrs.style || '') + `font-size: ${value};`;
					}
				},
			},
		},
		...options,
	});
