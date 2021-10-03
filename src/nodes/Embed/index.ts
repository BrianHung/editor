import { Node } from "../../Node.js"
import type { Node as PMNode } from "prosemirror-model";
import { nodeInputRule } from '../../utils/index.js'

export const Embed = (options?: Partial<Node>) => Node({
  name: 'embed',
  
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
  },

  inputRules({nodeType}) {
    return [
      nodeInputRule(/^embed:([^\s]*)[\s\n]$/, nodeType, match => ({...match[1] && {url: match[1]}}))
    ];
  },

  ...options,
})