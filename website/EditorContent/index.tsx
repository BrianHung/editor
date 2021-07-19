import React from "react";
import type { Editor } from '../../src'
import "prosemirror-view/style/prosemirror.css"; /* required by prosemirror-view */
import "prosemirror-gapcursor/style/gapcursor.css"; /* required by prosemirror-gapcursor */
import "./style.css"

/**
 * Mount the ProseMirror managed DOM onto the React component.
 * Component is wrapped in simple memoization of editor.
 */

function EditorContent({editor}: {editor: Editor}) {
  return (
    <div className="editor-content" 
      ref={ref => ref && editor && ref.appendChild(editor.view.dom)}
    />
  )
};

export default React.memo(EditorContent);
