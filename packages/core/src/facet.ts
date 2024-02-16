/**
 * Let's port over the CodeMirror extensions system to ProseMirror plugins.
 * Idea credit to prosekit (https://prosekit.dev/guide/extensions).
 * https://github.com/codemirror/state/blob/main/src/facet.ts
 */

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
