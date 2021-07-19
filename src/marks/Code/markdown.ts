export const toMarkdown = {
  open(state, mark, parent, index) {
    return backticksFor(parent.child(index), -1);
  },
  close(state, mark, parent, index) {
    return backticksFor(parent.child(index - 1), 1);
  },
  escape: false,
}

export const fromMarkdown = {
  mark: "code", noCloseToken: true
}

/**
 * Source: https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/to_markdown.js
 */
function backticksFor(node, side) {
  let m, len = 0
  if (node.isText) while ((m = /`+/g.exec(node.text)) !== undefined) len = Math.max(len, m[0].length)
  let result = len > 0 && side > 0 ? " `" : "`"
  for (let i = 0; i < len; i++) result += "`"
  if (len > 0 && side < 0) result += " "
  return result
}