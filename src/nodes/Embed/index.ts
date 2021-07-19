import Node from "../Node"
import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import { nodeInputRule } from '../../commands'

/**
 * 
 */
export default class Embed extends Node {

  get name() {
    return "embed"
  }
  
  get schema(): NodeSpec {
    return {
      attrs: {url: {default: null}, alt: {default: null}, title: {default: null}, align: {default: "center"}},
      inline: false,
      group: "block",
      draggable: true,
      parseDOM: [{
        tag: 'a.embed', 
        getAttrs(a: HTMLAnchorElement) { 
          return {url: a.href}; 
        }
      }],
      toDOM(node: PMNode) { 
        return ['a', {class: 'embed', href: node.attrs.url}, node.attrs.url]; 
      }
    }
  }

  inputRules({nodeType}) {
    return [
      nodeInputRule(/^embed:([^\s]*)[\s\n]$/, nodeType, match => ({...match[1] && {url: match[1]}}))
    ];
  }
}