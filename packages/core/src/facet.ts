/**
 * Let's port over the CodeMirror extensions system to ProseMirror plugins.
 * Idea credit to prosekit (https://prosekit.dev/guide/extensions).
 *
 * For a brief introduction, read https://marijnhaverbeke.nl/blog/facets.html.
 * https://github.com/codemirror/state/blob/main/src/facet.ts
 */

import { Command, EditorStateConfig, Plugin } from 'prosemirror-state';

/// Extensions can be nested in arrays
/// arbitrarily deep—they will be flattened when processed.
export type Extension = { extension: Extension } | readonly Extension[];

const Prec_ = { lowest: 4, low: 3, default: 2, high: 1, highest: 0 };

function prec(value: number) {
	return (ext: Extension) => new PrecExtension(ext, value) as Extension;
}

export const Prec = {
	highest: prec(Prec_.highest),
	high: prec(Prec_.high),
	default: prec(Prec_.default),
	low: prec(Prec_.low),
	lowest: prec(Prec_.lowest),
};

class PrecExtension {
	constructor(
		readonly inner: Extension,
		readonly prec: number
	) {}
	extension!: Extension;
}

function flatten(extension: Extension) {
	let result: Extension[][] = [[], [], [], [], []];
	function inner(ext: Extension, prec: number) {
		if (Array.isArray(ext)) {
			for (let e of ext) inner(e, prec);
		} else if (ext instanceof PrecExtension) {
			inner(ext.inner, ext.prec);
		} else {
			result[prec].push(ext);
		}
	}
	inner(extension, Prec_.default);
	return result.reduce((a, b) => a.concat(b));
}

export function definePlugin(plugin: Plugin | Plugin[] | ((config: EditorStateConfig) => Plugin | Plugin[])) {
	if (plugin instanceof Plugin) {
		return [() => [plugin]];
	}

	if (Array.isArray(plugin) && plugin.every(p => p instanceof Plugin)) {
		return [() => plugin];
	}

	if (typeof plugin === 'function') {
		return [plugin];
	}

	throw new TypeError('Invalid plugin');
}

import { toggleMark } from 'prosemirror-commands';
import { Schema } from 'prosemirror-model';

// export function buildKeymap(plugin: Plugin | Plugin[] | ((config: EditorStateConfig) => Plugin | Plugin[]) {
// 	plugin = definePlugin(plugin)
// 	return (config: EditorStateConfig) => {
// 		let keys: {[key: string]: Command} = {}

// 		return keymap(keys)
// 	}
// }

/**
 * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/keymap.ts#L38
 */
export interface Keymap {
	[key: string]: Command;
}

export function defineKeymap(keymap: Keymap | (({ schema }: { schema: Schema }) => Keymap)) {}

export const defineBoldKeymap = defineKeymap(({ schema, markType = 'bold' }) => ({
	'Mod-b': toggleMark(schema.marks[markType]),
}));
