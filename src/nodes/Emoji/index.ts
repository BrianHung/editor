import { Node } from "../../Node.js"
import type { Node as PMNode, NodeSpec } from "prosemirror-model"
import { InputRule } from 'prosemirror-inputrules'
import type { EditorState } from "prosemirror-state"
import { Plugin } from "prosemirror-state"

import emojiRegex from "emoji-regex"
const EMOJI_REGEX = emojiRegex()

function unicodeToEmojiSource(unicode: string) {
  return `https://brianhung.info/EmojiPicker/assets/twemoji.064e717d.svg#${unicode}`;
}

function nativeEmojiToUnicode(nativeEmoji: string) {
  return raw(nativeEmoji).split(' ').map(val => parseInt(val).toString(16)).join('-')
};

function raw(input) {
  if (input.length === 1) { return input.charCodeAt(0).toString();}
  else if (input.length > 1) {
    const pairs = [];
    for (var i = 0; i < input.length; i++) {
      // high surrogate
      if (input.charCodeAt(i) >= 0xd800 && input.charCodeAt(i) <= 0xdbff) {
        // low surrogate
        if (input.charCodeAt(i + 1) >= 0xdc00 && input.charCodeAt(i + 1) <= 0xdfff) {
          pairs.push((input.charCodeAt(i) - 0xd800) * 0x400 + (input.charCodeAt(i + 1) - 0xdc00) + 0x10000);
        }
      } else if (input.charCodeAt(i) < 0xd800 || input.charCodeAt(i) > 0xdfff) {
        // modifiers and joiners
        pairs.push(input.charCodeAt(i))
      }
    }
    return pairs.join(' ');
  }
  return '';
};


export const Emoji = (options?: Partial<Node>) => Node({
  name: 'emoji',

  attrs: {char: {}},
  inline: true,
  group: "inline",
  draggable: false,
  selectable: false,
  parseDOM: [{
    tag: ".emoji",
    getAttrs: (dom: HTMLImageElement) => {
      return {char: dom.getAttribute("alt")};
    }
  }],
  toDOM: (node: PMNode) => {
    // TODO: use native representation if twemoji not available
    return ['img', {class: "emoji", draggable: "false", alt: node.attrs.char, 
      src: unicodeToEmojiSource(nativeEmojiToUnicode(node.attrs.char))
    }];
  },

  inputRules({nodeType}) {
    return [
      new InputRule(EMOJI_REGEX, function insertEmoji(state: EditorState, match: RegExpExecArray, start: number, end: number) {
        const [char] = match;
        console.log("char", char, char.length, match, start, end)
        return state.tr.replaceWith(start, end, nodeType.create({char}));
      })
    ];
  },

  plugins() {
    return [
      new Plugin({
        props: {
          // Replaces emoji text chars with node repesentation.
          transformPasted: (slice: Slice): Slice => {
            return new Slice(textToEmoji(slice.content), slice.openStart, slice.openEnd);
          },
        }
      })
    ]
  },

  ...options,
})

import { Fragment, Slice } from "prosemirror-model"; 

function textToEmoji(fragment: Fragment): Fragment {
  var parsed : PMNode[] = []
  fragment.forEach(function replaceTextWithEmoji(child: PMNode) {
    if (child.isText) {
      const text = child.text
      var pos = 0, match: RegExpExecArray;
      while (match = EMOJI_REGEX.exec(text)) {
        var start = match.index
        var end = start + match[0].length
        var emojiType = child.type.schema.nodes.emoji
        // copy across the text from before the match
        if (start > 0 && start > pos) { parsed.push(child.cut(pos, start)); }
        var emojiChar = text.slice(start, end)
        parsed.push(emojiType.create({char: emojiChar}));
        pos = end
      }
      // copy remaining text in text node
      if (pos < text.length) { parsed.push(child.cut(pos)); }
    } else {
      parsed.push(child.copy(textToEmoji(child.content)))
    }
  })
  return Fragment.fromArray(parsed)
}

function emojiToText(fragment: Fragment): Fragment {
  var parsed : PMNode[] = []
  fragment.forEach(function replaceEmojiWithText(child: PMNode) {
    if (child.type == child.type.schema.nodes.emoji) {
      var emojiChar = child.attrs.char 
      var textType = child.type.schema.nodes.text
      parsed.push(textType.create(null, emojiChar))
    } else {
      parsed.push(child.copy(emojiToText(child.content)))
    }
  })
  return Fragment.fromArray(parsed);
}