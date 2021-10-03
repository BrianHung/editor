
/**
 * https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js
 */
function markApplies(doc, ranges, type) {
  for (let i = 0; i < ranges.length; i++) {
    let {$from, $to} = ranges[i]
    let can = $from.depth == 0 ? doc.type.allowsMarkType(type) : false
    doc.nodesBetween($from.pos, $to.pos, node => {
      if (can) return false
      can = node.inlineContent && node.type.allowsMarkType(type)
    })
    if (can) return true
  }
  return false
}