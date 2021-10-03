import React from "react"
import "./editor.css"

import { 
  Editor,
  Doc,
  Text,
  Title,
  TitleDoc,
  HardBreak,
  BlockQuote,
  HorizontalRule,
  Paragraph,
  CodeBlock,
  MathBlock,
  Heading,
  Math as InlineMath,
  Figcaption,
  Figure,
  Image,
  ListItem,
  ItemList,
  EnumList,
  TodoItem,
  TodoList,
  ToggleItem,
  ToggleList,
  Highlight,
  History,
  Placeholder,
  Bold,
  Code,
  Underline,
  Italic,
  Strikethrough,
  Link,
  CodeMirrorSyntaxHighlight as SyntaxHighlight,
  Punctuation,
  Keymaps,
  FocusMode,
  ImageToolbar,
  Source,
  Video,
  TrailingNode
} from '../src'

import { Emoji } from "../src/nodes/Emoji"
import { Embed } from "../src/nodes/Embed"
import "../src/nodes/Emoji/Emoji.css"

import "../src/nodes/TodoItem/style.css"
import "../src/nodes/ToggleItem/style.css"
import "../src/plugins/CodeMirrorSyntaxHighlight/style.css"
import "katex/dist/katex.css"

import { Superscript } from "../src/marks/Superscript"
import { Subscript } from "../src/marks/Subscript"

import { Selection } from "prosemirror-state"

import EditorContent from "./EditorContent"

import applyDevTools from "prosemirror-dev-tools"

import { MathBlockNodeView } from "../src/nodes/MathBlock/index"
import { TodoItemNodeView } from "../src/nodes/TodoItem/index"

import { ImageNodeView } from "../src/nodes/Image/image-nodeview"


interface EditorComponentProps {

}

interface EditorComponentState {
  editor: Editor;
}


import { Hashtag } from "../src/marks/Hashtag"
// import NodeSelection from "../src/plugins/MultiNodeSelection"

export default class EditorComponent extends React.PureComponent<EditorComponentProps, EditorComponentState> {

  constructor(props: EditorComponentProps) {
    super(props)

    this.state = {
      editor: new Editor({
        // editable: false,
        content: JSON.parse(localStorage.getItem('content')),
        onChange: (transaction) => {
          localStorage.setItem('content', JSON.stringify(this.state.editor.JSON));
        },
        extensions: [

          Text(),
          Paragraph({
            attrs: {src:{ default: false}}
          }),
          Doc(), 

          Punctuation(),
          BlockQuote(),
          HorizontalRule(),
          Heading(),

          InlineMath(),
          MathBlock({
            nodeView: props => new MathBlockNodeView(props)
          }),

          CodeBlock(),


          Superscript(),
          Subscript(),

          TodoItem({
            nodeView: props => new TodoItemNodeView(props)
          }),

          TodoList(),

          ListItem(),
          ItemList(),
          EnumList(),

          ToggleItem(),
          ToggleList(),
        
          Emoji(),

          Figcaption(),
          Image({
            nodeView: props => new ImageNodeView(props)
          }),
          Figure(),

          HardBreak(),

          Bold(),
          Code(),
          Strikethrough(),
          Italic(),
          Underline(),
          Link(),
          Highlight(),

          Hashtag(),
          
          History(),

          
          Placeholder(),
          Keymaps(),
          FocusMode(),
          SyntaxHighlight(),

          // Source(),
          // Video(),

          // Embed(),

          // NodeSelection(),

          // TrailingNode(),
        ]
      })
    }
  }

  componentDidMount() {
    // applyDevTools(this.state.editor.view);
    // StyleModule.mount(document, highlightStyle.module)
  }

  render () {
    return (
      <EditorContent editor={this.state.editor}/>
    )
  }
}