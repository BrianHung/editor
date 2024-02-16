import { Extension } from '@brianhung/editor';

const COLOR_ATTRIBUTE = 'data-color';
const DEFAULT_COLOR_ATTRIBUTE = 'rgb(0, 0, 0)';

export const TextColor = (options?: Partial<Extension>) =>
	Extension({
		name: 'textColor',
		schemaAttrs: {
			color: {
				default: null,
				types: ['textStyle'],
				getFromDOM: dom => dom.style.color?.replace(/['"]+/g, ''),
				setDOMAttr(value, attrs) {
					if (value) attrs.style = (attrs.style || '') + `color: ${value};`;
				},
			},
		},
		...options,
	});
