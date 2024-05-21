import sizes from '@atomico/rollup-plugin-sizes';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import autoExternal from 'rollup-plugin-auto-external';
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';

import * as fs from 'fs';
import path from 'path';

const PACKAGE_ROOT = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf-8'));

export default {
	external: [/node_modules/, /@editor\/.*/],
	input: './src/index.ts',
	output: [
		{
			name: pkg.name,
			format: 'cjs',
			sourcemap: true,
			exports: 'auto',
			dir: path.join(PACKAGE_ROOT, './dist'),
			entryFileNames: '[name].cjs',
		},
		{
			name: pkg.name,
			format: 'esm',
			sourcemap: true,
			dir: path.join(PACKAGE_ROOT, './dist'),
			entryFileNames: '[name].js',
		},
	],
	plugins: [
		autoExternal({
			packagePath: path.join(PACKAGE_ROOT, './package.json'),
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
			tsconfig: path.join(PACKAGE_ROOT, '../../tsconfig.json'),
			tsconfigOverride: {
				compilerOptions: {
					baseUrl: path.join(PACKAGE_ROOT, './src'),
					rootDir: path.join(PACKAGE_ROOT, './src'),
					declaration: true,
					paths: {
						'@brianhung/editor': ['packages/core/src'],
						'@brianhung/editor-*': ['packages/*/src'],
					},
				},
				include: ['./src/**/*.d.ts', './src/**/*.ts', './src/**/*.tsx', './src/**/*.vue'].map(pattern =>
					path.join(PACKAGE_ROOT, pattern)
				),
			},
			// Compile even if type errors.
			abortOnError: false,
		}),
	],
};
