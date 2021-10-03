import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import type { Selection } from "prosemirror-state";
import { TextSelection } from "prosemirror-state";
import type { Node as PMNode } from "prosemirror-model";

export default function Placeholder(options?): Plugin {
  let cachedEmptyTopNode: PMNode;
  return new Plugin({
    props: {

      decorations: ({doc, selection}: {doc: PMNode, selection: Selection}): DecorationSet => {
        const decorations: Decoration[] = [];

        // Source: https://github.com/PierBover/prosemirror-cookbook#decorations

        if (selection instanceof TextSelection && selection.$cursor) {
          let pos = doc.resolve(selection.$cursor.pos); // `before` and `after` results in error when cursor is at depth=0
          pos.depth && decorations.push(Decoration.node(pos.before(), pos.after(), {class: 'ProseMirror-cursornode'}))
        }
        
        doc.nodesBetween(selection.from, selection.to, (node, pos) => {
          if (node.isTextblock || (node.isAtom && !node.isText)) {
            decorations.push(Decoration.node(pos, pos + node.nodeSize, {class: 'ProseMirror-activenode'}))
          }
          return node.isBlock;
        })

        doc.descendants((node: PMNode, pos: number) => {
          // Apply only if directly has text, or is atom and not a text node.
          if (node.isTextblock || (node.isAtom && !node.isText)) {
            const isEmpty = node.isTextblock && node.content.size === 0;
            isEmpty && decorations.push(Decoration.node(pos, pos + node.nodeSize, {class: 'ProseMirror-emptynode'}))
          }
          return node.isBlock
        });
        
        return DecorationSet.create(doc, decorations)
      },

      attributes(state) {
        cachedEmptyTopNode = cachedEmptyTopNode || state.doc.type.createAndFill()
        let diff = cachedEmptyTopNode.content.findDiffStart(state.doc.content)
        if (diff == null) {
          return {class: "ProseMirror-emptydoc"} 
        }
      }
    },
  })
};