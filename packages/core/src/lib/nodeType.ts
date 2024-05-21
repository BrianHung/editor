import { MarkType, NodeType, Schema } from 'prosemirror-model';

/**
 * Utility exists in prosemirror-model but is internal.
 * @param schema
 * @param type
 * @returns
 */
export function nodeType(schema: Schema, type: string | NodeType) {
	if (type instanceof NodeType) return type;
	let found = schema.nodes[type];
	if (!found) throw new RangeError('Unknown node type: ' + type);
	return found;
}

/**
 * Utility exists in prosemirror-model but is internal.
 * @param schema
 * @param type
 * @returns
 */
export function markType(schema: Schema, type: string | MarkType) {
	if (type instanceof MarkType) return type;
	let found = schema.marks[type];
	if (!found) throw new RangeError('Unknown mark type: ' + type);
	return found;
}
