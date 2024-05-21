import { Extension } from '@brianhung/editor';

const FONT_FAMILY_ATTRIBUTE = 'data-font-family';

const normalizeFontFamily = (fontFamily: string) =>
	fontFamily
		.split(',')
		.map((fontFamily: string) => CSS.escape(fontFamily.trim()))
		.join(', ');

export const FontFamily = (options?: Partial<Extension>) =>
	Extension({
		name: 'fontFamily',
		schemaAttrs: {
			fontFamily: {
				default: null,
				types: ['textStyle'],
				getFromDOM: dom =>
					dom.getAttribute(FONT_FAMILY_ATTRIBUTE) || dom.style.fontFamily?.replace(/['"]+/g, '') || null,
				setDOMAttr(value, attrs) {
					if (value) {
						attrs[FONT_FAMILY_ATTRIBUTE] = value;
						attrs.style = (attrs.style || '') + `font-family: ${normalizeFontFamily(value)};`;
					}
				},
			},
		},
		...options,
	});
