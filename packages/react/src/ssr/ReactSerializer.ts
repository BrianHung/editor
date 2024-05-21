import type { Schema, Fragment, DOMOutputSpec } from "prosemirror-model";
import { createElement, Fragment as ReactFragment, ReactNode } from "react";
import type { Node as PMNode, Mark as PMMark } from "prosemirror-model";
import { DOMAttributesToReactProps } from "./ssrutils";

type NodeToReactProps = {
  node: PMNode;
  children?: ReactNode;
};

type MarkToReactProps = {
  mark: PMMark;
  children?: ReactNode;
};

/**
 * https://github.com/remirror/remirror/blob/beta/packages/remirror__react-ssr/src/react-serializer.tsx
 * https://github.com/remirror/remirror/blob/beta/packages/remirror__react-renderer/src/renderer.tsx
 * https://github.com/ProseMirror/prosemirror-model/blob/master/src/to_dom.js
 */

// ::- A React serializer knows how to convert ProseMirror nodes and
// marks of various types to React nodes.
export class ReactSerializer {
  nodes: Record<string, (nodeProps: NodeToReactProps) => ReactNode>;
  marks: Record<string, (markProps: MarkToReactProps) => ReactNode>;

  constructor(nodes, marks) {
    this.nodes = nodes || {};
    this.marks = marks || {};
  }

  serializeFragment(
    fragment: Fragment,
    options = {},
    target = null
  ): ReactNode {
    if (!target) target = <ReactFragment />;

    let top = target,
      active = null;
    fragment.forEach((node) => {
      if (active || node.marks.length) {
        if (!active) active = [];
        let keep = 0,
          rendered = 0;

        while (keep < active.length && rendered < node.marks.length) {
          let next = node.marks[rendered];
          if (!this.marks[next.type.name]) {
            rendered++;
            continue;
          }
          if (!next.eq(active[keep]) || next.type.spec.spanning === false)
            break;
          keep += 2;
          rendered++;
        }

        while (keep < active.length) {
          top = active.pop(); // dom element
          active.pop(); // mark of that dom element
        }

        while (rendered < node.marks.length) {
          let add = node.marks[rendered++];
          let markDOM = this.serializeMark(add, node.isInline, options);
          if (markDOM) {
            active.push(add, top);
            top.appendChild(markDOM.dom);
            top = markDOM.contentDOM || markDOM.dom;
          }
        }
      }

      top.appendChild(this.serializeNode(node));
    });

    return createElement();
  }

  serializeNode(node: PMNode): ReactNode {
    let nodeProps: NodeToReactProps = node.content
      ? { node, children: this.serializeFragment(node.content) }
      : { node };
    let toReact = this.nodes[node.type.name];
    if (toReact) {
      return toReact(nodeProps);
    } else {
      throw RangeError(`toReact not found for ${node.type.name}`);
    }
  }

  serializeMark(mark: PMMark): ReactNode {
    let markProps: MarkToReactProps = { mark };
    let toReact = this.marks[mark.type.name];
    if (toReact) {
      return toReact(markProps);
    } else {
      throw RangeError(`toReact not found for ${mark.type.name}`);
    }
  }

  /**
   * Fallback serializer if node or mark spec has `toDOM` defined but not `toReact`.
   * Will not work if the `toDOM` method contains actual DOM elements and without document shim.
   */
  static toReactDOMOutputSpec(
    structure: DOMOutputSpec,
    children?: ReactNode
  ): ReactNode {
    let Component = structure[0];

    let props = {};
    children = children || [];

    let attrs = structure[1],
      start = 1;
    if (
      attrs &&
      typeof attrs == "object" &&
      attrs.nodeType == null &&
      !Array.isArray(attrs)
    ) {
      start = 2;
      attrs = DOMAttributesToReactProps(attrs);
    }

    for (let i = start; i < structure.length; i++) {
      let child = structure[i];
      if (child === 0) {
        if (i < structure.length - 1 || i > start)
          throw RangeError(
            "Content hole must be the only child of its parent node"
          );
      }

      children.push(this.renderSpec(child as DOMOutputSpec));
    }

    return createElement(Component, attrs, ...children);
  }

  static fromSchema(schema: Schema) {
    return (
      schema.cached.ReactSerializer ||
      (schema.cached.ReactSerializer = new ReactSerializer(
        this.nodesFromSchema(schema),
        this.marksFromSchema(schema)
      ))
    );
  }

  static nodesFromSchema(schema: Schema) {
    return gatherToReact(schema.nodes);
  }

  static marksFromSchema(schema: Schema) {
    return gatherToReact(schema.marks);
  }
}

function gatherToReact(obj): Record<string, Function> {
  let result = {};
  for (let name in obj) {
    let toReact = obj[name].spec.toReact;
    if (toReact) result[name] = toReact;
  }
  return result;
}

function doc(options) {
  // declare global: globalThis
  return options.document || globalThis.document;
}
