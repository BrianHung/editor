import sizes from '@atomico/rollup-plugin-sizes';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import autoExternal from 'rollup-plugin-auto-external';
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

const prosemirror = [
	'prosemirror-state',
	'prosemirror-view',
	'prosemirror-model',
	'prosemirror-transform',
	'prosemirror-utils',
	'prosemirror-schema-basic',
	'prosemirror-dropcursor',
	'prosemirror-gapcursor',
	'prosemirror-keymap',
	'prosemirror-commands',
	'prosemirror-inputrules',
	'prosemirror-schema-list',
];

export default {
	external: [/node_modules/],
	input: './src/index.ts',
	output: [
		{
			name: pkg.name,
			file: pkg.umd,
			format: 'umd',
			sourcemap: true,
			globals: Object.fromEntries(prosemirror.map(p => [p, p])),
		},
		{
			name: pkg.name,
			file: pkg.main,
			format: 'cjs',
			sourcemap: true,
			exports: 'auto',
		},
		{
			name: pkg.name,
			file: pkg.module,
			format: 'esm',
			sourcemap: true,
		},
	],
	plugins: [
		autoExternal({
			packagePath: './package.json',
		}),
		sourcemaps(),
		resolve(),
		commonjs(),
		babel({
			babelHelpers: 'bundled',
			exclude: '../../node_modules/**',
		}),
		sizes(),
		typescript({
			tsconfig: '../../tsconfig.json',
			tsconfigOverride: {
				compilerOptions: {
					declaration: true,
					paths: {
						'@brianhung/editor-*': ['packages/*/src'],
					},
					outDir: './dist',
				},
			},
			abortOnError: false,
		}),
	],
};
