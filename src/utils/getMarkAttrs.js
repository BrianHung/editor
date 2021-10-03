export function getMarkAttrs(state, type) {
  const { from, to, empty } = state.selection
  let marks = []

  if (empty) {
    marks = state.seleection.$head.marks()
  } else {
    state.doc.nodesBetween(from, to, node => {marks = marks.concat(...node.marks)})
  }

  let mark = marks.find(markItem => markItem.type.name === type.name)
  if (mark) {
    return mark.attrs
  }
  return {}
}
