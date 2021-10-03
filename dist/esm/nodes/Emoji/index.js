import { Node } from "../../Node.js";
import { InputRule } from 'prosemirror-inputrules';
import { Plugin } from "prosemirror-state";
import emojiRegex from "emoji-regex";
const EMOJI_REGEX = emojiRegex();
function unicodeToEmojiSource(unicode) {
    return `https://brianhung.info/EmojiPicker/assets/twemoji.064e717d.svg#${unicode}`;
}
function nativeEmojiToUnicode(nativeEmoji) {
    return raw(nativeEmoji).split(' ').map(val => parseInt(val).toString(16)).join('-');
}
;
function raw(input) {
    if (input.length === 1) {
        return input.charCodeAt(0).toString();
    }
    else if (input.length > 1) {
        const pairs = [];
        for (var i = 0; i < input.length; i++) {
            if (input.charCodeAt(i) >= 0xd800 && input.charCodeAt(i) <= 0xdbff) {
                if (input.charCodeAt(i + 1) >= 0xdc00 && input.charCodeAt(i + 1) <= 0xdfff) {
                    pairs.push((input.charCodeAt(i) - 0xd800) * 0x400 + (input.charCodeAt(i + 1) - 0xdc00) + 0x10000);
                }
            }
            else if (input.charCodeAt(i) < 0xd800 || input.charCodeAt(i) > 0xdfff) {
                pairs.push(input.charCodeAt(i));
            }
        }
        return pairs.join(' ');
    }
    return '';
}
;
export const Emoji = (options) => Node(Object.assign({ name: 'emoji', attrs: { char: {} }, inline: true, group: "inline", draggable: false, selectable: false, parseDOM: [{
            tag: ".emoji",
            getAttrs: (dom) => {
                return { char: dom.getAttribute("alt") };
            }
        }], toDOM: (node) => {
        return ['img', { class: "emoji", draggable: "false", alt: node.attrs.char,
                src: unicodeToEmojiSource(nativeEmojiToUnicode(node.attrs.char))
            }];
    }, inputRules({ nodeType }) {
        return [
            new InputRule(EMOJI_REGEX, function insertEmoji(state, match, start, end) {
                const [char] = match;
                console.log("char", char, char.length, match, start, end);
                return state.tr.replaceWith(start, end, nodeType.create({ char }));
            })
        ];
    },
    plugins() {
        return [
            new Plugin({
                props: {
                    transformPasted: (slice) => {
                        return new Slice(textToEmoji(slice.content), slice.openStart, slice.openEnd);
                    },
                }
            })
        ];
    } }, options));
import { Fragment, Slice } from "prosemirror-model";
function textToEmoji(fragment) {
    var parsed = [];
    fragment.forEach(function replaceTextWithEmoji(child) {
        if (child.isText) {
            const text = child.text;
            var pos = 0, match;
            while (match = EMOJI_REGEX.exec(text)) {
                var start = match.index;
                var end = start + match[0].length;
                var emojiType = child.type.schema.nodes.emoji;
                if (start > 0 && start > pos) {
                    parsed.push(child.cut(pos, start));
                }
                var emojiChar = text.slice(start, end);
                parsed.push(emojiType.create({ char: emojiChar }));
                pos = end;
            }
            if (pos < text.length) {
                parsed.push(child.cut(pos));
            }
        }
        else {
            parsed.push(child.copy(textToEmoji(child.content)));
        }
    });
    return Fragment.fromArray(parsed);
}
function emojiToText(fragment) {
    var parsed = [];
    fragment.forEach(function replaceEmojiWithText(child) {
        if (child.type == child.type.schema.nodes.emoji) {
            var emojiChar = child.attrs.char;
            var textType = child.type.schema.nodes.text;
            parsed.push(textType.create(null, emojiChar));
        }
        else {
            parsed.push(child.copy(emojiToText(child.content)));
        }
    });
    return Fragment.fromArray(parsed);
}
