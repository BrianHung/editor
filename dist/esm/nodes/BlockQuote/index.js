import { toggleWrapType } from "../../commands/index.js";
import { wrappingInputRule } from "prosemirror-inputrules";
import { wrapIn } from "prosemirror-commands";
import { Node } from "../../Node.js";
export const BlockQuote = (options) => Node(Object.assign({ name: "blockquote", attrs: { type: { default: null } }, content: "block+", group: "block", parseDOM: [{ tag: "blockquote", getAttrs(div) { return { type: div.dataset.type }; } }], toDOM(node) { return ["blockquote", Object.assign({}, node.attrs.type && { 'data-type': node.attrs.type }), 0]; },
    inputRules({ nodeType }) {
        return [
            wrappingInputRule(/^> $/, nodeType),
            wrappingInputRule(/^" $/, nodeType, { type: "pullquote" })
        ];
    },
    commands({ nodeType }) {
        return {
            "blockquote": attrs => toggleWrapType(nodeType, attrs),
            "pullquote": () => toggleWrapType(nodeType, { type: "pullquote" }),
        };
    },
    keymap({ nodeType }) {
        return {
            'Ctrl->': wrapIn(nodeType),
            'Ctrl-"': wrapIn(nodeType, { type: "pullquote" })
        };
    } }, options));
