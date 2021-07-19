import Node from '../Node'
import { splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list'
import type { Node as PMNode, NodeSpec } from "prosemirror-model";

export default class ListItem extends Node {

  get name() {
    return 'listitem';
  }

  get schema(): NodeSpec {
    return {
      content: 'paragraph block*',
      defining: true,  
      draggable: false,
      parseDOM: [{tag: 'li'}],
      toDOM(node: PMNode) { return ['li', {class: "list-item"}, 0]},
    }
  }

  keys({nodeType}) {
    return {
      
      Enter: splitListItem(nodeType),
      Tab: sinkListItem(nodeType),
      'Shift-Tab': liftListItem(nodeType),
      'Shift-Enter': (state, dispatch) => {
        let {$from, $to, node} = state.selection
        if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to)) return false
        let grandParent = $from.node(-1)
        if (grandParent.type != nodeType) return false
        let tr = state.tr.delete($from.pos, $to.pos)
        dispatch(tr.split($from.pos));
        return true;
      },

      "Mod-[": liftListItem(nodeType),
      "Mod-]": sinkListItem(nodeType),


      /*
      "Alt-ArrowUp": (state, dispatch) => {
        let {$from, $to, node, empty} = state.selection
        if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to) || !empty) return false
        let grandParent = $from.node(-1)
        if (grandParent.type != nodeType) return false
        console.log("hi alt arrow up", $from, $to, node, empty, state, state.doc.resolve($from.before(-1)).nodeBefore);
        
        let pos = $from.before(-1), $pos = state.doc.resolve(pos);
        if (!$pos.nodeBefore) { return false; }
        
        let newPos = pos - $pos.nodeBefore.nodeSize;
        dispatch(state.tr.delete(pos, pos + $pos.nodeBefore.nodeSize).insert(newPos, $pos.nodeBefore))

      }
      */


    }
  }
}