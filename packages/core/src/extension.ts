import type { InputRule } from 'prosemirror-inputrules';
import type { Schema } from 'prosemirror-model';
import type { Command, Plugin } from 'prosemirror-state';
import { SchemaAttributeSpec } from './schema';
import type { Keymap } from './types';

export interface ExtensionSpec {
	name?: string;
	plugins?: (props?: { schema: Schema }) => Plugin[];
	inputRules?: (props?: { schema: Schema }) => InputRule[];
	commands?: (props?: { schema: Schema }) => Record<string, (...props: any) => Command>;
	keymap?: (props?: { schema: Schema; mac: boolean }) => Keymap;
	/**
	 * Additional attributes to add to the schema. Type must be specified
	 * to know which node or mark type to add extend.
	 *
	 * Extends attributes of multiple nodes or marks by overriding
	 * schema with `schemaFromExtensions`.
	 *
	 * Equivalent to `addGlobalAttributes` in tiptap and `createSchemaAttributes` in remirror.
	 */
	schemaAttrs?: { [name: string]: SchemaAttributeSpec };
}

export interface Extension extends ExtensionSpec {
	type: 'extension';
}

/**
 * Utility function for implementing an Extension.
 */
export const Extension = (options: ExtensionSpec): Extension => ({
	type: 'extension',
	get extension() {
		return this;
	},
	...options,
});
