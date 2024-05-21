import typography from '@tailwindcss/typography';
import ariaAttributes from '@thoughtbot/tailwindcss-aria-attributes';
import colors from 'tailwindcss/colors';

export default {
	content: ['./index.html', './**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			mono: [
				'SFMono-Regular',
				'ui-monospace',
				'Menlo',
				'Consolas',
				'PT Mono',
				'Liberation Mono',
				'Courier',
				'monospace',
			],
		},
		extend: {
			boxShadow: {
				menu: 'rgba(0, 0, 0, 0.12) 0px 0px 0.5px 0px, rgba(0, 0, 0, 0.12) 0px 10px 16px 0px, rgba(0, 0, 0, 0.15) 0px 2px 5px 0px',
				'dropdown-menu':
					'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px',
			},
			colors: {
				gray: colors.neutral,
			},
		},
	},
	plugins: [ariaAttributes, typography],
};
