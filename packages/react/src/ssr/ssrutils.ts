import reactNames from './possibleSharedNames';

// Map dom attributes to react prop equivalent.
export function DOMAttributesToReactProps(attrs: Record<string, string>) {
	let props: Record<string, string> = {};
	for (let attr in attrs) {
		let prop = reactNames[attr] || attr;
		props[prop] = attrs[attr];
	}
	return props;
}

// Shim document with jsdom on server-side.
if (typeof globalThis.document == 'undefined') {
	const { JSDOM } = require('jsdom');
	globalThis.document = new JSDOM().window.document;
}
