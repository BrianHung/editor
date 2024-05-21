import type { InputRule } from 'prosemirror-inputrules';
import type { Node as PMNode, NodeSpec, NodeType, Schema } from 'prosemirror-model';
import type { Command, Plugin } from 'prosemirror-state';
import type { Decoration, DecorationSource, EditorView, NodeView } from 'prosemirror-view';
import type { Keymap } from './types';
export interface Node extends NodeSpec {
	type: 'node';
	name: string;
	nodeView?: (props: NodeViewProps) => NodeView;
	plugins?: (props?: { schema: Schema; nodeType: NodeType }) => Plugin[];
	inputRules?: (props?: { schema: Schema; nodeType: NodeType }) => InputRule[];
	commands?: (props?: { schema: Schema; nodeType: NodeType }) => Record<string, (...props: any) => Command>;
	keymap?: (props?: { schema: Schema; nodeType: NodeType; mac: boolean }) => Keymap;
	[key: string]: any;
}

/**
 * parameters of NodeViewConstructor as arguments object
 *
 * No way of converting Parameters<NodeViewConstructor> to an object.
 * https://stackoverflow.com/questions/69085499/typescript-convert-tuple-type-to-object
 */
export interface NodeViewProps {
	node: PMNode;
	view: EditorView;
	getPos: () => number | undefined;
	decorations: readonly Decoration[];
	innerDecorations: DecorationSource;
}

/**
 * Utility function for implementing a NodeSpec, which the editor turns into a PMNode.
 * https://prosemirror.net/docs/ref/#model.NodeSpec
 * https://prosemirror.net/docs/ref/#model.Node
 */
export const Node = (options: Partial<Node>): Node => ({
	type: 'node',
	name: options.name,
	get extension() {
		return this;
	},
	...options,
});
