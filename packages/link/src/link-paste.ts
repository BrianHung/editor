import type { Node as PMNode } from 'prosemirror-model';
import { Fragment, Slice } from 'prosemirror-model';
import { NodeSelection, Plugin, TextSelection } from 'prosemirror-state';

export function LinkPastePlugin() {
	let shiftKey = false;
	return new Plugin({
		props: {
			// Hack to detect if shift is held down for paste as plain text.
			// See: https://discuss.prosemirror.net/t/change-transformpasted-behaviour-when-shift-key-is-pressed/949
			handleKeyDown(view, event) {
				shiftKey = event.shiftKey;
				return false;
			},

			// Adds a link mark to selected text nodes if the pasted slice is a valid link.
			handlePaste(view, event, slice) {
				let link = linkFromSlice(slice);
				if (link) {
					let { schema, selection, tr } = view.state;
					if (selection.empty) return false;

					// Use relative pathname if internal link in style of wikipedia.
					let internal = link.origin == location.origin;
					let href = internal ? link.pathname : link.href;

					// Add link to all children within current TextSelection.

					if (selection instanceof TextSelection) {
						selection.ranges.forEach(({ $from, $to }) =>
							tr.addMark($from.pos, $to.pos, schema.mark('link', { href, internal }))
						);
					}

					if (selection instanceof NodeSelection) {
						const { node, from } = selection;
						switch (node.type) {
							case schema.nodes.image:
								tr.setNodeMarkup(from, null, node.attrs, [schema.mark('link', { href, internal })]);
						}
					}

					view.dispatch(tr);
					return true;
				}

				// Return if pasted text is not valid URL.
				return false;
			},

			// Adds link mark to text nodes with urls.
			transformPasted(slice: Slice) {
				if (shiftKey) return slice;
				return new Slice(linkify(slice.content), slice.openStart, slice.openEnd);
			},
		},
	});
}

/**
 * Recursively iterate through slice to see if it contains _only_ a valid url.
 */
function linkFromSlice(slice: Slice): URL | null {
	if (slice.content.childCount == 1) {
		// @ts-ignore
		let child = slice.content.content[0];
		if (child.isText) {
			try {
				return new URL(child.text);
			} catch (error) {} // no-op
		} else if (child.isTextblock) {
			return linkFromSlice(child);
		}
	}
	return null;
}

import linkifyIt from 'linkify-it';
const linkifyit = linkifyIt();

/**
 * https://github.com/ProseMirror/prosemirror/issues/90
 */
function linkify(fragment: Fragment): Fragment {
	var linkified: PMNode[] = [];
	fragment.forEach(function findTextLinks(child) {
		if (child.isText) {
			var pos = 0,
				matches = linkifyit.match(child.text) || [];
			matches.forEach(({ index, raw, url }) => {
				var start = index,
					end = start + raw.length;
				var linkType = child.type.schema.marks['link'];
				// copy leading text from before the match
				if (start > 0) {
					linkified.push(child.cut(pos, start));
				}
				linkified.push(child.cut(start, end).mark(linkType.create({ href: url }).addToSet(child.marks)));
				pos = end;
			});
			// copy over trailing text
			if (pos < child.text.length) {
				linkified.push(child.cut(pos));
			}
		} else {
			linkified.push(child.copy(linkify(child.content)));
		}
	});
	return Fragment.fromArray(linkified);
}
