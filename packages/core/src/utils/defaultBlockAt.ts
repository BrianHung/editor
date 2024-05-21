import type { ContentMatch, NodeType } from 'prosemirror-model';
/**
 * https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js
 */
export function defaultBlockAt(match: ContentMatch): NodeType | null {
	for (let i = 0; i < match.edgeCount; i++) {
		let { type } = match.edge(i);
		if (type.isTextblock && !type.hasRequiredAttrs()) return type;
	}
	return null;
}
