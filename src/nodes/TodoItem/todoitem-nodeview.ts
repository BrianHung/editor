import type { NodeView } from 'prosemirror-view'
import type { Node as PMNode } from 'prosemirror-model'
import { NodeViewProps } from '../../Node.js'

export class TodoItemNodeView implements NodeView {

  dom: HTMLElement
  contentDOM: HTMLElement
  node: NodeViewProps['node']
  view: NodeViewProps['view']
  getPos: NodeViewProps['getPos']
  checkbox: HTMLInputElement

  constructor (props: NodeViewProps) {
    this.node = props.node
    this.view = props.view
    this.getPos = props.getPos

    this.dom = document.createElement('li')
    this.dom.classList.add('todo-item')

    this.checkbox = this.dom.appendChild(document.createElement('input'))
    this.checkbox.classList.add('todo-checkbox')
    this.checkbox.type = 'checkbox'
    this.checkbox.tabIndex = -1 // remove checkbox from tab navigation because it's contained within editor
    this.checkbox.contentEditable = 'false'
    this.checkbox.onmousedown = event => event.preventDefault() // prevent default behavior of input focus + editor blur
    this.checkbox.onclick = event => {
      let checked = (event.target as HTMLInputElement).checked
      this.view.dispatch(this.view.state.tr.setNodeMarkup(this.getPos(), null, {checked}))
    }

    this.dom.dataset.checked = this.checkbox.checked = this.node.attrs.checked
    this.checkbox.toggleAttribute('checked', this.node.attrs.checked)
    
    this.contentDOM = this.dom.appendChild(document.createElement('div'))
    this.contentDOM.classList.add('todo-content')
  }

  update (node: PMNode): boolean {
    if (node.type !== this.node.type) return false
    this.node = node
    this.dom.dataset.checked = this.checkbox.checked = this.node.attrs.checked
    this.checkbox.toggleAttribute('checked', this.node.attrs.checked)
    return true
  }
}