import type { InputRule } from 'prosemirror-inputrules';
import type { Mark as PMMark, MarkSpec, MarkType, Schema } from 'prosemirror-model';
import type { Command, Plugin } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import type { Keymap, MarkView } from './types';
export interface Mark extends MarkSpec {
	type: 'mark';
	name: string;
	markView?: (props: MarkViewProps) => MarkView;
	plugins?: (props?: { schema: Schema; markType: MarkType }) => Plugin[];
	inputRules?: (props?: { schema: Schema; markType: MarkType }) => InputRule[];
	commands?: (props?: { schema: Schema; markType: MarkType }) => Record<string, (...props: any) => Command>;
	keymap?: (props?: { schema: Schema; markType: MarkType; mac: boolean }) => Keymap;
	[key: string]: any;
}

/**
 * parameters of NodeViewConstructor as arguments object
 *
 * No way of converting Parameters<MarkViewConstructor> to an object.
 * https://stackoverflow.com/questions/69085499/typescript-convert-tuple-type-to-object
 */

export interface MarkViewProps {
	mark: PMMark;
	view: EditorView;
	inline: boolean;
}

/**
 * Utility function for implementing a MarkSpec, which the editor turns into a PMMark.
 * https://prosemirror.net/docs/ref/#model.MarkSpec
 * https://prosemirror.net/docs/ref/#model.Mark
 */
export const Mark = (options: Partial<Mark>): Mark => ({
	type: 'mark',
	name: options.name,
	get extension() {
		return this;
	},
	...options,
});
