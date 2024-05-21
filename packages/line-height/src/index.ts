import { Extension } from '@brianhung/editor';

const LINE_HEIGHT_ATTRIBUTE = 'data-line-height';

export const LineHeight = (options?: Partial<Extension>) =>
	Extension({
		name: 'line-height',
		schemaAttrs: {
			lineHeight: {
				default: null,
				types: ['paragraph'],
				getFromDOM(dom) {
					return dom.getAttribute(LINE_HEIGHT_ATTRIBUTE) || dom.style.lineHeight || null;
				},
				setDOMAttr(value, attrs) {
					if (value) {
						attrs[LINE_HEIGHT_ATTRIBUTE] = value;
						attrs.style = (attrs.style || '') + `line-height: ${value};`;
					}
				},
			},
		},
		...options,
	});
