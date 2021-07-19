import { Selection } from "prosemirror-state"

export const deleteMath = (state, dispatch, view) => {
  const { tr, selection: {$from: from, $to: to, $cursor}} = state;
  if (!from.sameParent(to))
    return false;

  // Handle deletion of right $.
  const rborder = from.parent.type !== state.schema.nodes.math
    && from.doc.resolve(from.pos - 1).parent.type === state.schema.nodes.math;
  if (rborder) {
    const mathNode = from.doc.resolve(from.pos - 1).parent;
    const startPos = from.pos;
    tr.replaceRangeWith(startPos - mathNode.nodeSize, startPos,
      state.schema.text("$" + mathNode.textContent));
    const selection = Selection.near(tr.doc.resolve(startPos), -1);
    tr.setSelection(selection).scrollIntoView()
    dispatch(tr);
    return true;
  }

  // Handle deletion of left  $.
  const lborder = from.parent.type === state.schema.nodes.math
    && from.doc.resolve(from.pos - 1).parent.type !== state.schema.nodes.math;
  if (lborder) {
    const mathNode = from.parent;
    const startPos = from.pos - 1;
    tr.replaceRangeWith(startPos, startPos + mathNode.nodeSize,
      state.schema.text(mathNode.textContent + "$"));
    const selection = Selection.near(tr.doc.resolve(startPos),  1);
    tr.setSelection(selection).scrollIntoView()
    dispatch(tr);
    return true;
  }

  // Prevent default behavior of partial node-deletion of katex editor.
  const textLength = $cursor ? $cursor.node().textContent.length : 0;
  if (textLength == 1)
    {
      tr.delete($cursor.pos - 1, $cursor.pos);
      dispatch(tr);
      return true;
    }

  // Allow default ProseMirror behavior of character- or node-deletion.
  return false;
}

function isSelectionEntirelyInsideMath(state) {
  return state.selection.$from.sameParent(state.selection.$to) &&
    state.selection.$from.parent.type === state.schema.nodes.math;
}

