import { baseKeymap } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { InputRule, undoInputRule } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { DOMParser, DOMSerializer, Mark as PMMark, Node as PMNode, Schema } from 'prosemirror-model';
import { Command, EditorState, Plugin, Selection } from 'prosemirror-state';
import { DirectEditorProps, EditorView } from 'prosemirror-view';

// Internal fork of 'prosemirror-inputrules' to handle matches on enter key / return
import { inputRules } from './lib/inputrules.js';

import { browser } from './utils';

import type { Extension } from './extension.js';
import type { Mark } from './mark.js';
import type { Node } from './node.js';

import { schemaFromExtensions } from './schema.js';
import type { JSONContent } from './types';

type DOMNode = globalThis.Node;
type Extensions = (Extension | Mark | Node | Plugin)[];

export type EditorProps = DirectEditorProps & {
	place?: DOMNode | ((editor: HTMLElement) => void) | { mount: HTMLElement };
	editable?: boolean | Function;

	topNode?: string;
	extensions?: Extensions;

	content?: JSONContent;

	state?: EditorState;
	schema?: Schema;
	doc?: PMNode;
	selection?: JSON | Selection;
	storedMarks?: PMMark[];

	plugins?: Plugin[];
};

/**
 * Minimal wrapper around ProseMirror EditorView to initialize an editor from extensions.
 * Some static methods are exposed to allow for more end-user flexibility.
 *
 * Library architecture mainly based on making the example setup more modular and extensible.
 * https://github.com/ProseMirror/prosemirror-example-setup.
 */

export class Editor extends EditorView {
	commands: Record<string, Command>;
	constructor(options: Partial<EditorProps> = {}) {
		options = editorPropsToViewProps(options);
		super(options.place, {
			state: options.state,
			nodeViews: options.nodeViews || NodeViews(options.extensions),
			markViews: options.markViews || MarkViews(options.extensions),
			dispatchTransaction: options.dispatchTransaction,
		});
		this.commands = Commands(options.extensions, schema, this);
	}
}

export function editorPropsToViewProps(options: Partial<EditorProps> = {}) {
	options = {
		extensions: [],
		attributes: state => ({
			class: `ProseMirror-${state.doc.type.name}`,
			role: 'textbox',
			'aria-multiline': 'true',
		}),
		...options,
	};

	const schema = (options.schema =
		options.schema || options.state?.schema || schemaFromExtensions(options.extensions, options.topNode));

	const doc =
		options.doc || (options.content && schema.nodeFromJSON(options.content)) || schema.topNodeType.createAndFill();

	const selection =
		options.selection && (!('toJSON' in options.selection) ? Selection.fromJSON(doc, options.selection) : undefined);
	const plugins = options.plugins || defaultPlugins(options.extensions, schema);

	options.state =
		options.state ||
		EditorState.create({
			schema,
			doc,
			selection,
			plugins: plugins,
			storedMarks: options.storedMarks || [],
		});

	return options;
}

/**
 * Utility method to separate view plugins from state plugins.
 * `checkStateComponent` but returns boolean instead of throwing error.
 *
 * https://github.com/ProseMirror/prosemirror-view/blob/master/src/index.js
 */
export function isStatePlugin(plugin: Plugin) {
	return plugin.spec.state || plugin.spec.filterTransaction || plugin.spec.appendTransaction;
}

/**
 * Gather array of ProseMirror plugins.
 */
export function Plugins(extensions: Extensions, schema: Schema): Plugin[] {
	return extensions.reduce((plugins, extension) => {
		if (extension instanceof Plugin) {
			return plugins.concat([extension as Plugin]);
		}
		if (extension.plugins) {
			return plugins.concat(
				extension.plugins({
					schema,
					nodeType: extension.type === 'node' ? schema.nodes[extension.name] : undefined,
					markType: extension.type === 'mark' ? schema.marks[extension.name] : undefined,
				})
			);
		}
		return plugins;
	}, []);
}

/**
 * Prioritize inputRules over plugin keymaps over baseKeymap.
 * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/index.js
 */
export function defaultPlugins(extensions: Extensions, schema: Schema): Plugin[] {
	return [
		dropCursor({ class: 'ProseMirror-dropcursor', color: 'currentColor' }),
		gapCursor(),
		inputRules({ rules: InputRules(extensions, schema) }),
		keymap({ Backspace: undoInputRule }),
		...Plugins(extensions, schema),
		...Keymaps(extensions, schema),
		keymap(baseKeymap),
	];
}

/**
 * https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js
 * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/keymap.js
 */

export function Keymaps(extensions: Extensions, schema: Schema): Plugin[] {
	return extensions.reduce(
		(keymaps, extension) =>
			extension instanceof Plugin || !extension.keymap
				? keymaps
				: keymaps.concat(
						keymap(
							extension.keymap({
								schema,
								nodeType: extension.type === 'node' ? schema.nodes[extension.name] : undefined,
								markType: extension.type === 'mark' ? schema.marks[extension.name] : undefined,
								mac: browser.mac,
							})
						)
					),
		[]
	);
}

export function InputRules(extensions: Extensions, schema: Schema): InputRule[] {
	return extensions.reduce(
		(inputRules, extension) =>
			extension instanceof Plugin || !extension.inputRules
				? inputRules
				: inputRules.concat(
						...extension.inputRules({
							schema,
							nodeType: extension.type === 'node' ? schema.nodes[extension.name] : undefined,
							markType: extension.type === 'mark' ? schema.marks[extension.name] : undefined,
						})
					),
		[]
	);
}

/**
 * Creates a record of commands from extensions bounded to the given view.
 */
export function Commands(extensions: Extensions, schema: Schema, view: EditorView): Record<string, Command> {
	return extensions.reduce((commands, extension) => {
		if (extension instanceof Plugin || !extension.commands) return commands;

		/**
		 * Pass options to a higher-order function which returns a command,
		 * and call that command on the given view state and dispatch.
		 * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/menu.js
		 */
		function apply(callback, args) {
			callback.apply(null, args)(view.state, view.dispatch, view);
			view.focus();
		}

		/**
		 * Utility function to bind multiple commands to same return object.
		 * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/keymap.js
		 */
		function bind(key, command) {
			commands[key] = (...args) => apply(command, args);
		}

		Object.entries(
			extension.commands({
				schema,
				nodeType: extension.type === 'node' ? schema.nodes[extension.name] : undefined,
				markType: extension.type === 'mark' ? schema.marks[extension.name] : undefined,
			})
		).forEach(([name, command]) => bind(name, command));

		return commands;
	}, Object.create(null));
}

// https://prosemirror.net/docs/ref/#view.EditorProps.nodeViews
export function NodeViews(extensions: Extensions): EditorProps['nodeViews'] {
	const nodeViews: EditorProps['nodeViews'] = Object.create(null);
	return extensions.reduce((nodeViews, extension) => {
		if (extension instanceof Plugin) return nodeViews;
		if (extension.type === 'node' && extension.nodeView) {
			nodeViews[extension.name] = (node, view, getPos, decorations, innerDecorations) =>
				extension.nodeView({
					node,
					view,
					getPos,
					decorations,
					innerDecorations,
				});
		}
		return nodeViews;
	}, nodeViews);
}

// https://prosemirror.net/docs/ref/#view.EditorProps.markViews
export function MarkViews(extensions: Extensions): EditorProps['markViews'] {
	const markViews: EditorProps['markViews'] = Object.create(null);
	return extensions.reduce((markViews, extension) => {
		if (extension instanceof Plugin) return markViews;
		if (extension.type === 'mark' && extension.markView) {
			markViews[extension.name] = (mark, view, inline) => extension.markView({ mark, view, inline });
		}
		return markViews;
	}, markViews);
}

export function Text(state: EditorState): string {
	let doc = state.doc;
	return doc.textBetween(0, doc.content.size, '\n');
}

export function HTML(state: EditorState): string {
	let div = document.createElement('div');
	div.appendChild(DOMSerializer.fromSchema(state.schema).serializeFragment(state.doc.content));
	return div.innerHTML;
}

export function fromHTML(schema: Schema, html: string | HTMLElement, parseOptions) {
	let div;
	if (typeof html === 'string') {
		div = document.createElement('div');
		div.innerHTML = html;
	} else {
		div = html;
	}
	return DOMParser.fromSchema(schema).parse(div, parseOptions);
}

export function JSON(state: EditorState) {
	return state.doc.toJSON();
}
