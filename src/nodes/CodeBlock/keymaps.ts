/**
 * Helper functions for CodeBlock keymaps, kindly taken from:
 * bitbucket.org/atlassian/.../editor/editor-core/src/plugins/code-block/
 */

import type { EditorState } from "prosemirror-state"
import type { EditorView } from "prosemirror-view"

export function lineIndent(state: EditorState, dispatch, view: EditorView) {
  if (!isSelectionEntirelyInsideCodeBlock(state)) return false;
  return indent(state, dispatch);
}

export function lineUndent(state: EditorState, dispatch, view: EditorView) {
  if (!isSelectionEntirelyInsideCodeBlock(state)) return false;
  return undent(state, dispatch);
}

export function newLine(state: EditorState, dispatch, view: EditorView) {
  if (!isSelectionEntirelyInsideCodeBlock(state)) return false;
  return insertNewlineWithIndent(state, dispatch);
}

import { chainCommands, deleteSelection, joinBackward, selectNodeBackward } from "prosemirror-commands"

export function backspaceCodeBlock (state: EditorState, dispatch, view: EditorView) {
  if (!isSelectionEntirelyInsideCodeBlock(state)) return false;
  return chainCommands(deleteSelection, deleteCodeBlock, joinBackward, selectNodeBackward)(state, dispatch, view);
}

/**
 * Replace codeblock with a paragraph when cursor is at beginning of codeblock.
 */
export function deleteCodeBlock(state: EditorState, dispatch, view: EditorView) {
  let { tr, selection, schema } = state;
  if (!(selection instanceof TextSelection)) { return false; }
  let {$cursor} = selection;
  if (!$cursor || (view ? !view.endOfTextblock("backward", state) : $cursor.parentOffset > 0)) { return false; }
  
  const from = $cursor.before($cursor.depth), 
    to = $cursor.end($cursor.depth) + 1, codeblock = $cursor.node();

  dispatch(
    tr.replaceRangeWith(from, to, schema.nodes.paragraph.create(null, codeblock.textContent ? schema.text(codeblock.textContent) : null))
      .setSelection(TextSelection.create(tr.doc, from + 1))
  );
  return true;
}

/**
 * Return the current indentation level
 * @param indentText - Text in the code block that represent an indentation
 * @param indentSize - Size of the indentation token in a string
 */
function getIndentLevel(indentText, indentSize) {
  return (indentSize && indentText.length) ? indentText.length / indentSize : 0;
}

import { TextSelection } from 'prosemirror-state';

function indent(state: EditorState, dispatch) {
  const { text, start } = getLinesFromSelection(state);
  const { tr, selection } = state;
  forEachLine(text, (line, offset) => {
    const { indentText, indentToken } = getLineInfo(line);
    const indentLevel = getIndentLevel(indentText, indentToken.size);
    const indentToAdd = indentToken.token.repeat(
      indentToken.size - (indentText.length % indentToken.size) || indentToken.size,
    );
    tr.insertText(indentToAdd, tr.mapping.map(start + offset, -1));

    if (!selection.empty) {
      tr.setSelection(TextSelection.create(
        tr.doc,
        tr.mapping.map(selection.from, -1),
        tr.selection.to,
      ));
    }
  });
  if (dispatch) {
    dispatch(tr);
  }
  return true;
}

function undent(state: EditorState, dispatch) {
  const { text, start } = getLinesFromSelection(state);
  const { tr } = state;
  forEachLine(text, (line, offset) => {
    const { indentText, indentToken } = getLineInfo(line);
    if (indentText) {
      const indentLevel = getIndentLevel(indentText, indentToken.size);
      const undentLength = indentText.length % indentToken.size || indentToken.size;
      tr.delete(
        tr.mapping.map(start + offset),
        tr.mapping.map(start + offset + undentLength),
      );
    }
  });
  if (dispatch) {
    dispatch(tr);
  }
  return true;
}

function insertIndent(state: EditorState, dispatch) {
  const { text: textAtStartOfLine } = getStartOfCurrentLine(state);
  const { indentToken } = getLineInfo(textAtStartOfLine);
  const indentToAdd = indentToken.token.repeat(
    indentToken.size - (textAtStartOfLine.length % indentToken.size) || indentToken.size,
  );
  dispatch(state.tr.insertText(indentToAdd));
  return true;
}

function insertNewlineWithIndent(state: EditorState, dispatch) {
  const { text: textAtStartOfLine } = getStartOfCurrentLine(state);
  const { indentText } = getLineInfo(textAtStartOfLine);
  if (indentText && dispatch) {
    dispatch(state.tr.insertText('\n' + indentText));
    return true;
  }
  return false;
}

function isSelectionEntirelyInsideCodeBlock(state: EditorState) {
  const {$from, $to} = state.selection;
  return $from.sameParent($to) && $from.parent.type === state.schema.nodes.codeblock;
}

function getStartOfCurrentLine(state: EditorState) {
  const { $from } = state.selection;
  if ($from.nodeBefore && $from.nodeBefore.isText) {
    const prevNewLineIndex = $from.nodeBefore.text.lastIndexOf('\n');
    return {
      text: $from.nodeBefore.text.substring(prevNewLineIndex + 1),
      pos: $from.start() + prevNewLineIndex + 1,
    };
  }
  return { text: '', pos: $from.pos };
};

function getEndOfCurrentLine(state: EditorState) {
  const { $to } = state.selection;
  if ($to.nodeAfter && $to.nodeAfter.isText) {
    const nextNewLineIndex = $to.nodeAfter.text.indexOf('\n');
    return {
      text: $to.nodeAfter.text.substring(
        0,
        nextNewLineIndex >= 0 ? nextNewLineIndex : undefined,
      ),
      pos: nextNewLineIndex >= 0 ? $to.pos + nextNewLineIndex : $to.end(),
    };
  }
  return { text: '', pos: $to.pos };
};

function getLinesFromSelection(state: EditorState) {
  const { pos: start } = getStartOfCurrentLine(state);
  const { pos: end } = getEndOfCurrentLine(state);
  const text = state.doc.textBetween(start, end);
  return { text, start, end };
}

function forEachLine(text, callback) {
  let offset = 0;
  text.split('\n').forEach(line => {
    callback(line, offset);
    offset += line.length + 1;
  });
};

const SPACE = { token: ' ', size: 2, regex: /[^ ]/ };
const TAB = { token: '\t', size: 1, regex: /[^\t]/ };
function getLineInfo(line) {
  const indentToken = line.startsWith('\t') ? TAB : SPACE;
  const indentLength = line.search(indentToken.regex);
  const indentText = line.substring(
    0,
    indentLength >= 0 ? indentLength : line.length,
  );
  return { indentToken, indentText };
};


export function toggleLineNumbers(state: EditorState, dispatch) {
  if (!isSelectionEntirelyInsideCodeBlock(state)) return false;
  if (dispatch) {
    const {parent: node, pos, parentOffset} = state.selection.$from;
    const start = pos - parentOffset - 1;
    dispatch(state.tr.setNodeMarkup(start, undefined, {...node.attrs, lineNumbers: !node.attrs.lineNumbers}));
  }
  return true;
}