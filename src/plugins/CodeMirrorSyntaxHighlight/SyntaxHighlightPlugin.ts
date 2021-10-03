import { EditorState, Plugin, PluginKey } from "prosemirror-state"
import type { Transaction } from "prosemirror-state"
import type { Node as PMNode } from "prosemirror-model"
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view'
import type { LanguageDescription } from "@codemirror/language"
import { findLanguage } from "./findLanguage.js"

export const SyntaxHighlightKey = new PluginKey("syntaxHighlight")

export function SyntaxHighlightPlugin(options?) {
  return new Plugin({
    key: SyntaxHighlightKey,
    props: {
      // Return decorations stored in SyntaxHighlightState.
      decorations(state) { 
        return (this.getState(state) as SyntaxHighlightState).decorations 
      },
    },
    state: {
      init: (config, state: EditorState) => {
        return new SyntaxHighlightState(config, state)
      },
      apply: (tr: Transaction, pluginState: SyntaxHighlightState) => {
        return pluginState.applyTransaction(tr)
      },
    },
    // Use plugin view to dispatch transaction once languages have been imported.
    view(editorView) { 
      return new SyntaxHighlightView(editorView)
    },
  })
}

export default SyntaxHighlightPlugin

// Dynamically import this method on syntaxHighlight and keep alive.
export var syntaxHighlight: typeof import("./syntaxHighlight").syntaxHighlight | null

/**
 * Use plugin view to dynamically import CodeMirror languages and dispatch transactions
 * to editorView and plugin state to re-apply syntax highlighting.
 */
export class SyntaxHighlightView {

  view: EditorView

  constructor(view: EditorView) {
    this.update(view)
  }

  /**
   * "Rather, it starts in a state that indicates something has to be asynchronously loaded, 
   *  which the plugin view recognizes. It then does the loading and creates a transaction that
   *  allows the state to update further."
   *  https://discuss.prosemirror.net/t/asynchronous-initialization-of-plugin-state/2645/4
   */
  update(view: EditorView) { 
    this.view = view 
    let pluginState = SyntaxHighlightKey.getState(this.view.state) as SyntaxHighlightState
    let languagesToImport = pluginState.languagesToImport
    if (languagesToImport.size) {
      // Update state fields after languages has been imported.
      this.importLanguages(Array.from(languagesToImport))
      pluginState.languages = new Set<LanguageDescription>([...pluginState.languages, ...languagesToImport])
      pluginState.languagesToImport = new Set<LanguageDescription>()
    }
  }

  /**
   * Bundle syntaxHighlight with language imports as its not needed until a codeblock with
   * language attrs is encountered in applyTransaction.
   */
  async importLanguages(langs: LanguageDescription[]) {
    await Promise.all(langs.map(language => language.load()).concat(
      // @ts-ignore
      syntaxHighlight ? [] : [
        import("./syntaxHighlight").then(module => {
          syntaxHighlight = module.syntaxHighlight
        })
      ]
    )) 
    // Dispatch transaction to apply syntax highlighting after imports resolve.
    this.view.dispatch(this.view.state.tr.setMeta(SyntaxHighlightKey, langs))
  }
}

export class CodeBlockState {
  node: PMNode
  pos: number
}

/**
 * Use plugin state to keep known imported languages upon on EditorState reconfig,
 * as plugin views are destroyed and reinitialized on a reconfig.
 */
export class SyntaxHighlightState {

  // Use these fields to communicate to SyntaxHighlightView to import languages.
  languagesToImport: Set<LanguageDescription>
  languages: Set<LanguageDescription>

  /**
   * "The general idea is that you keep your decorations in a plugin state field, and 
   *  have your decorations method just read it from there, rather than rebuild it on 
   *  every transaction. The field’s apply method maps the old decoration set when 
   *  there are any changes, and updates the regions touched by the transaction’s steps 
   *  (which you can get by iterating over their step maps, as found in tr.mapping)."
   *  https://discuss.prosemirror.net/t/decorations-performance/2381/5
   */

  codeblocks: Array<number>
  decorations: DecorationSet

  constructor(config, state) {
    this.languagesToImport = new Set<LanguageDescription>()
    this.languages = new Set<LanguageDescription>()

    /**
     * "What you do is track the position of the element you are interested in, and on each transaction, 
     *  map to its new position (possibly tracking both the start and end so that it’s easier to 
     *  determine whether any of the step maps in the transaction touch it)."
     *  https://discuss.prosemirror.net/t/how-to-update-multiple-inline-decorations-on-node-change/1493/2
     */

    const codeblocks = []
    state.doc.descendants((node: PMNode, pos: number) => {
      node.type.isTextblock && node.type.spec.code && codeblocks.push({node, pos})
      return node.isBlock
    })

    this.codeblocks = codeblocks.map(({pos}) => pos)
    this.decorations = DecorationSet.create(state.doc, this.getDecorations(codeblocks))
  }

  applyTransaction(tr: Transaction) {
    // Keep old decorations if no new imported languages or no change in document.
    let imported = tr.getMeta(SyntaxHighlightKey)
    if (imported === undefined && tr.docChanged === false) return this

    // Map previous decorations through transaction.
    this.decorations = this.decorations.map(tr.mapping, tr.doc)

    // Check if syntax highlighting needs to be re-applied with newly loaded languages.
    if (imported) {

      // Collect codeblocks whose language are included in the array meta key.
      let modified = this.codeblocks.map(pos => ({node: tr.doc.resolve(pos + 1).parent, pos}))
        .filter(({node}) => imported.includes(findLanguage(node.attrs.lang || defaultLang[node.type.name])))

      this.decorations = this.decorations.add(tr.doc, this.getDecorations(modified))
      return this

    } else if (tr.docChanged) {

      // Map previous codeblocks through transaction, removing deleted codeblocks.
      const mappedPos = this.codeblocks.map(pos => tr.mapping.mapResult(pos))
      this.codeblocks = mappedPos.reduce((codeblocks, {deleted, pos}) => deleted ? codeblocks : codeblocks.concat([pos]), [])

      // Remove decorations that correspond to deleted codeblocks.
      const deleted = mappedPos.reduce((codeblocks, {deleted, pos}) => deleted ? codeblocks.concat([pos]) : codeblocks, [])
      const removed = deleted.map(pos => this.decorations.find(pos, pos - tr.doc.resolve(pos).parentOffset + tr.doc.resolve(pos).parent.nodeSize)).flat()
      this.decorations = this.decorations.remove(removed)

      // Calculate list of ranges which this transaction has modified.
      const trRanges = replacedRanges(tr)

      // Use startPos as key since the same node can appear twice in `stepMap.ranges` (e.g. change in node.attrs).
      const modifiedCodeblocks = new Map<number, {node: PMNode, pos: number}>()
      trRanges.forEach(({from, to}) => tr.doc.nodesBetween(from, to, (node, pos) => {
        node.type.isTextblock && node.type.spec.code && modifiedCodeblocks.set(pos, {node, pos})
        return node.isBlock
      }))
      
      // Merge with newly added codeblocks.
      let modified = Array.from(modifiedCodeblocks.values())
      if (modified.length === 0) return this

      this.codeblocks = Array.from(new Set(this.codeblocks.concat(modified.map(({pos}) => pos))))

      // Reuse decorations in unmodified nodes and update decorations in modified nodes.
      // Remove old decorations in the interior of modified nodes.
      let oldDecos = modified.map(({node, pos}) => this.decorations.find(pos + 1, pos + node.nodeSize - 1)).flat()
      let newDecos = this.getDecorations(modified)
      const diff = diffDecorationSets(oldDecos, newDecos)
      
      this.decorations = this.decorations.remove(diff.diffA).add(tr.doc, diff.diffB)
      return this
    }
  }

  /**
   * TODO: cache syntax tree state and calculate changed ranges to incrementally re-parse
   * instead of throwing away all decorations within a codeblock and starting from scratch.
   * tr.steps.getMaps(oldStart, oldEnd, newStart, newEnd) == TreeFragment.applyChanges(fragments, [{fromA: from, toA: to, fromB: from, toB: to}])?
   * See: https://lezer.codemirror.net/docs/ref/#tree.TreeFragment^applyChanges
   *      https://github.com/codemirror/language/blob/main/src/language.ts
   */
   getDecorations(nodePos: {node: PMNode, pos: number}[]): Decoration[] {
    let decorations: Decoration[] = [];
    let languagesToImport = new Set<LanguageDescription>();
    nodePos.forEach(({node, pos}) => {
      let lang = findLanguage(node.attrs.lang || defaultLang[node.type.name]);
      if (lang) {
        // Get inline decorations if language has support.
        if (lang.support) {
          // Push CodeMirror language name as a node decoration for language-specific css styling.
          decorations.push(Decoration.node(pos, pos + node.nodeSize, {class: `language-${lang.name.toLowerCase()}`}))
          let startPos = pos + 1;
          syntaxHighlight(node.textContent, lang.support, ({from, to, style}) => style && decorations.push(Decoration.inline(startPos + from, startPos + to, {class: style})));
        // Import language if support is null.
        } else {
          languagesToImport.add(lang);
        }
      }
      if (node.attrs.lineNumbers) {
        const lines = node.textContent.split(/\n/);
        const lineWidth = lines.length.toString().length;
        let startPos = pos + 1;
        lines.forEach((line, index) => {
          decorations.push(Decoration.widget(startPos, lineNumberSpan(index + 1, lineWidth), {side: -1, ignoreSelection: true}));
          startPos += line.length + 1; 
        }); 
      }
    });
    this.languagesToImport = languagesToImport;
    return decorations;
  }
}

/**
 * Higher-order function to create line-number widget decorations.
 */
function lineNumberSpan(index: number, lineWidth: number) {
  return function(): HTMLSpanElement {
    const span = document.createElement("span")
    span.className = "ProseMirror-linenumber"
    span.innerText = "" + index
    Object.assign(span.style, {display: "inline-block", width: lineWidth + "ch", "user-select": "none"})
    return span
  }
}

const defaultLang = {
  "codeblock": null,
  "mathblock": "latex",
}

/**
 * TODO: Cache replacedRanges per transaction if used multiple times by `applyTransaction`.
 * Source: https://discuss.prosemirror.net/t/find-new-node-instances-and-track-them/96
 */
 import { ReplaceStep, ReplaceAroundStep } from "prosemirror-transform"
 function replacedRanges(tr: Transaction): {from: number, to: number, stepMap}[] {
   var ranges = []
   for (var i = 0; i < tr.steps.length; i++) {
     var step = tr.steps[i], stepMap = step.getMap()
     if (step instanceof ReplaceStep || step instanceof ReplaceAroundStep) {
       // Could write a more complicated algorithm to insert it in
       // sorted order and join with overlapping ranges here. That way,
       // you wouldn't have to worry about scanning nodes multiple
       // times.
       // @ts-ignore
       ranges.push({from: step.from, to: step.to, stepMap})
     }
     for (var j = 0; j < ranges.length; j++) {
       var range = ranges[j]
       range.from = stepMap.map(range.from, -1)
       range.to = stepMap.map(range.to, 1)
     }
   }
   return ranges
 }

 function diffDecorationSets(a: Decoration[], b: Decoration[]) {
   
  let diffA = []
  let diffB = []

  for (var i = 0, j = 0; i < a.length || j < b.length;) {

    if (j >= b.length) {
      diffA.push(a[i])
      i++
      continue;
    }

    if (i >= a.length) {
      diffB.push(b[j])
      j++
      continue;
    }

    // @ts-ignore
    if (a[i].eq(b[j])) {
      i++
      j++
      continue;
    }

    if (a[i].from < b[j].from) {
      diffA.push(a[i])
      i++
      continue;
    }

    if (a[i].from > b[j].from) {
      diffB.push(b[j])
      j++
      continue;
    }

    if (a[i].to < b[j].to) {
      diffA.push(a[i])
      i++
      continue;
    }

    if (a[i].to > b[j].to) {
      diffB.push(b[j])
      j++
      continue;
    }

    if (i < a.length) {
      diffA.push(a[i])
      i++
    }

    if (j < b.length) {
      diffB.push(b[j])
      j++
    }
  }
  return {diffA, diffB}
 }