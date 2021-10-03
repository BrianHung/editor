import React, { createElement } from 'react'
import { createPortal, unmountComponentAtNode } from 'react-dom'
import type { NodeView } from 'prosemirror-view'
import type { Node as PMNode } from 'prosemirror-model'
// import { NodeViewProps } from '../../Node.js'


export const ReactNodeViewRenderer = component => props => new ReactNodeView({component, ...props})

// https://github.com/ueberdosis/tiptap/blob/main/packages/react/src/ReactNodeViewRenderer.tsx
// https://github.com/ueberdosis/tiptap/blob/main/packages/react/src/ReactRenderer.tsx
// https://github.com/outline/rich-markdown-editor/blob/main/src/lib/ComponentView.tsx
// https://github.com/johnkueh/prosemirror-react-nodeviews/blob/master/src/components/ReactNodeView.tsx

class ReactNodeView implements NodeView {

  component: React.ComponentClass | React.FunctionComponent | React.ForwardRefExoticComponent<any>
  props: Record<string, any>
  ref: React.Component | null = null
  dom: HTMLElement
  reactElement: React.ReactElement
  portal: React.ReactPortal

  node: PMNode
  decorations

  constructor ({component, ...props}) {
    
    this.component = component 
    this.props = props

    this.node = props.node
    this.decorations = props.decorations

    this.dom = document.createElement('div')
    this.dom.classList.add('ProseMirror-react-nodeview')
    
    this.render()
  }

  update (node, decorations) {
    if (node.type !== this.node.type) { return false }
    if (node === this.node && decorations === this.decorations) { return true }
    this.props = {...this.props, node, decorations}
    this.render()
    return true
  }


  destroy () {
    this.dom && unmountComponentAtNode(this.dom)
    this.dom = null
  }

  render () {
    const Component = this.component
    const props = this.props
    if (isClassComponent(Component) || isForwardRefComponent(Component)) {
      props.ref = (ref: React.Component) => this.ref = ref
    }
    this.reactElement = createElement(Component, props)
    this.portal = createPortal(this.reactElement, this.dom)
  }
}

const Portals: React.FC<{ renderers: Map<string, ReactNodeView> }> = ({renderers}) => {
  return (
    <>
      {Array.from(renderers).map(([key, renderer]) => {
        return createPortal(
          renderer.reactElement,
          renderer.dom,
          key,
        )
      })}
    </>
  )
}

const isClassComponent = (Component: any) => !!(typeof Component === 'function' && Component.prototype && Component.prototype.isReactComponent)

const isForwardRefComponent = (Component: any) => !!(typeof Component === 'object' && Component.$$typeof?.toString() === 'Symbol(react.forward_ref)')

export interface ReactRendererOptions {
  props?: Record<string, any>,
  as?: string,
}

export class ReactRenderer {
  id: string

  component: any

  element: Element

  props: Record<string, any>

  reactElement: React.ReactNode

  ref: React.Component | null = null

  constructor(component: React.Component | React.FunctionComponent, { props = {}, as = 'div' }: ReactRendererOptions) {
    this.id = Math.floor(Math.random() * 0xFFFFFFFF).toString()
    this.component = component
    this.props = props
    this.element = document.createElement(as)
    this.element.classList.add('react-renderer')
    this.render()
  }

  render(): void {
    const Component = this.component
    const props = this.props

    if (isClassComponent(Component)) {
      props.ref = (ref: React.Component) => {
        this.ref = ref
      }
    }

    this.reactElement = <Component {...props } />


  }

  updateProps(props: Record<string, any> = {}): void {
    this.props = {
      ...this.props,
      ...props,
    }

    this.render()
  }

  destroy(): void {

  }
}