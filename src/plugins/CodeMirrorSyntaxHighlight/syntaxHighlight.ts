import type { LanguageSupport } from "@codemirror/language"
import { highlightTree } from "@codemirror/highlight"
import { highlightStyle } from "./highlightStyle"

/**
 * Replicates functionality and api of CodeMirror 5 runmode:
 * https://github.com/codemirror/CodeMirror/blob/master/addon/runmode/runmode.js
 */
export function syntaxHighlight(text: string, support: LanguageSupport, callback: (token: {text: string; style: string; from: number; to: number}) => void, options = {match: highlightStyle.match}) {
  let pos = 0;
  let tree = support.language.parseString(text);
  highlightTree(tree, options.match, (from, to, classes) => {
    from > pos && callback({text: text.slice(pos, from), style: null, from: pos, to: from});
    callback({text: text.slice(pos, from), style: classes, from, to});
    pos = to;
  });
  pos != tree.length && callback({text: text.slice(pos, tree.length), style: null, from: pos, to: tree.length});
}