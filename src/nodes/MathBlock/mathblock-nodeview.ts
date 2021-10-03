import { NodeViewProps } from '../../Node.js'
import type { Node as PMNode } from 'prosemirror-model'
import type { NodeView } from 'prosemirror-view'
import { copyToClipboard } from '../../utils/copyToClipboard.js'

export class MathBlockNodeView implements NodeView {

  dom: HTMLDivElement
  contentDOM: HTMLElement
  node: PMNode
  render: HTMLDivElement
  katex: typeof import('./katex') | null

  constructor (props: NodeViewProps) {
    this.node = props.node

    this.dom = document.createElement('div')
    this.dom.classList.add('mathblock')

    let editor = this.dom.appendChild(document.createElement('pre'))
    editor.classList.add('katex-editor')

    let render = this.dom.appendChild(document.createElement('div'))
    render.classList.add('katex-render')
    render.contentEditable = 'false'
    render.onmousedown = event => event.preventDefault()
    render.onclick = () => copyToClipboard(this.node.textContent)
    render.setAttribute('aria-label', 'click to copy')
    
    this.render = render
    this.renderLaTeX(this.node.textContent)

    this.contentDOM = editor.appendChild(document.createElement('code'))
    this.contentDOM.spellcheck = false
  }

  // Re-render latex on change in node textContent.
  update: NodeView['update'] = (node) => { 
    if (node.type !== this.node.type) { return false }
    node.textContent !== this.node.textContent && this.renderLaTeX(node.textContent)
    this.node = node
    return true
  }

  // Allow katex to mutate innerHTML of render element.
  ignoreMutation: NodeView['ignoreMutation'] = (mutation) => {
    return this.render.contains(mutation.target) // alternatively, !this.contentDOM.contains(mutation.target)
  }

  renderLaTeX (text: string) {
    if (this.katex) {
      try {
        this.render.innerHTML = this.katex.renderToString(text || '\\text{Mathblock}', {displayMode: true, throwOnError: true})
        this.render.classList.toggle('katex-error', false)
      } catch (error) {
        const outer = document.createElement('span')
        const inner = outer.appendChild(document.createElement('span'))
        inner.classList.add('katex-error')
        inner.textContent = error.message
          .replace('KaTeX parse error', 'Invalid equation')
          .replace(/\n/g, ' ')
          .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        this.render.innerHTML = outer.innerHTML
      }

    } else {
      import('./katex').then(katex => { 
        this.katex = katex
        this.renderLaTeX(this.node.textContent)
      })
    }
  }
}
