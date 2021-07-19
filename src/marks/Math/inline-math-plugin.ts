import { Plugin, PluginKey } from "prosemirror-state"
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view'
import type { Node as PMNode } from "prosemirror-model";
import type { Transaction } from "prosemirror-state"
import { ReplaceStep, ReplaceAroundStep } from "prosemirror-transform"
import { renderToString } from "katex"

const INLINE_MATH_REGEX = /(?:\$)([^$]+)(?:\$)$/g

type Match = { match: string; from: number; to: number }
type NodePos = { node: PMNode; pos: number }

function reduceMatches(matches: Match[], nodePos: NodePos): Match[] {
  const { node, pos } = nodePos
  if (node.isTextblock === false || node.type.spec.code) return matches
  let match = null
  while (match = INLINE_MATH_REGEX.exec(node.textContent))
    matches.push({"match": match[1], from: pos + match.index, to: pos + match.index + match[0].length})
  return matches
}

function reduceMathDecorations(decorations: Decoration[], match: Match): Decoration[] {
  try {
    const html = renderToString(match.match)
    const toDOM = () => { const span = document.createElement("span"); span.innerHTML = html; return span; }
    decorations.push(Decoration.widget(match.from + 1, toDOM))
  } catch (error) {
  }
  decorations.push(Decoration.inline(match.from + 1, match.to + 1, {class: "math-content"}))
  return decorations
}

function modifiedTextblocks(tr: Transaction): {node: PMNode, pos:number}[] {

  // Map each step to the current doc through any subsequent step.
  let positions: number[] = []
  tr.mapping.maps.forEach(stepMap => {
    positions = positions.map(r => stepMap.map(r));
    stepMap.forEach((oldStart, oldEnd, newStart, newEnd) => positions.push(newStart, newEnd))
  })

  // Use node as key since a single node can be modified more than once.
  const textblocks: Map<PMNode, {node: PMNode, pos: number}> = new Map()
  const reduce = (node, pos) => { node.isTextblock && !node.type.spec.code && textblocks.set(pos, {node, pos}); return node.isBlock && !node.isTextblock }

  for (let i = 0; i < positions.length; i+= 2) {
    let from = positions[i], to = positions[i + 1]
    tr.doc.nodesBetween(from + 1, to, reduce);
  }

  return Array.from(textblocks.values())
}

export default function InlineMathDecorationsPlugin() {
  const pluginKey = new PluginKey("InlineMathPlugin")
  return new Plugin({
    key: pluginKey,
    state: {
      init(config, state) { 
        // Use node as key since a single node can be modified more than once.
        const textblocks: Map<PMNode, {node: PMNode, pos: number}> = new Map()
        const reduce = (node, pos) => { node.isTextblock && !node.type.spec.code && textblocks.set(pos, {node, pos}); return node.isBlock && !node.isTextblock }
        state.doc.descendants(reduce)
        const uniqueTextblocks = Array.from(textblocks.values())
        const matches = uniqueTextblocks.reduce(reduceMatches, [])
        const decorations = matches.reduce(reduceMathDecorations, [])
        return {modified: [], decorations: DecorationSet.create(state.doc, decorations), lastTransaction: null}
      },
      apply(tr, prevState) { 
        const prevTr = prevState.lastTransaction
        prevState.lastTransaction = tr
        if (tr.docChanged === false) return {...prevState, modified: []}
        let prevDecorations = prevState.decorations.map(tr.mapping, tr.doc)
        const modified: {node: PMNode, pos:number}[] = modifiedTextblocks(tr)
        if (modified.length === 0) return {...prevState, modified: [], decorations: prevDecorations}
        const matches = modified.reduce(reduceMatches, [])
        const newDecorations = matches.reduce(reduceMathDecorations, [])
        // Cache decorations in unmodified nodes and update decorations in modified nodes.
        const oldDecorations = modified.map(nodePos => prevDecorations.find(nodePos.pos, nodePos.pos + nodePos.node.nodeSize)).flat();
        prevDecorations = prevDecorations.remove(oldDecorations)
        prevDecorations = prevDecorations.add(tr.doc, newDecorations);
        return {modified, decorations: prevDecorations}
      }
    },
    props: {
      decorations(state) { return this.getState(state).decorations }
    },
    appendTransaction(transactions, oldState, newState) {
      // Do nothing if document has not changed or no modified textblocks to apply mark to.
      const docChanged = transactions.reduce((docChanged, tr) => docChanged || tr.docChanged, false);
      const textInsert = transactions.some(({ steps }) => steps.some((step) => step instanceof ReplaceStep || step instanceof ReplaceAroundStep));
      if (docChanged === false && textInsert === false) return
      const modified = pluginKey.getState(newState).modified
      if (modified.length === 0) return
      const matches = modified.reduce(reduceMatches, [])
      let tr = newState.tr
      // Replace old marks at modified node positions with new marks.
      modified.forEach(m => (tr = tr.removeMark(m.pos, m.pos + m.node.nodeSize, newState.schema.marks.math)))
      matches.forEach(m => (tr = tr.addMark(m.from + 1, m.to + 1, newState.schema.marks.math.create())))
      return tr
    }
  })
}