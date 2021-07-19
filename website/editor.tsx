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
  Math,
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
} from '../src'

import Emoji from "../src/nodes/Emoji"
import Embed from "../src/nodes/Embed"
import "../src/nodes/Emoji/Emoji.css"

import "../src/nodes/TodoItem/style.css"
import "../src/nodes/ToggleItem/style.css"
import "../src/plugins/CodeMirrorSyntaxHighlight/style.css"
import "katex/dist/katex.css"

import Superscript from "../src/marks/Superscript"
import Subscript from "../src/marks/Subscript"

import { Selection } from "prosemirror-state"

import EditorContent from "./EditorContent"

import applyDevTools from "prosemirror-dev-tools"

interface EditorComponentProps {

}

interface EditorComponentState {
  editor: Editor;
}


import Hashtag from "../src/marks/Hashtag"
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

          new Text(),
          new Paragraph(),
          new Doc(), 

          new Punctuation(),
          new BlockQuote(),
          new HorizontalRule(),
          new Heading(),

          new Math(),
          new MathBlock(),
          new CodeBlock(),


          new Superscript(),
          new Subscript(),

          new TodoItem(),
          new TodoList(),

          new ListItem(),
          new ItemList(),
          new EnumList(),

          new ToggleItem(),
          new ToggleList(),
        
          new Emoji(),

          new Figcaption(),
          new Image(),
          new Figure(),

          new HardBreak(),

          new Bold(),
          new Code(),
          new Strikethrough(),
          new Italic(),
          new Underline(),
          new Link(),
          new Highlight(),

          new Hashtag(),
          
          new History(),

          
          Placeholder(),
          new Keymaps(),
          new FocusMode(),
          ImageToolbar(),
          SyntaxHighlight(),

          new Source(),
          new Video(),

          new Embed(),

          // NodeSelection(),
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
      <div className="editor">
        <EditorContent editor={this.state.editor}/>
      </div>
    )
  }
}