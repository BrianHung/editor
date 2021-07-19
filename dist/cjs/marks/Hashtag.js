"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mark_1 = __importDefault(require("./Mark"));
const prosemirror_transform_1 = require("prosemirror-transform");
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_model_1 = require("prosemirror-model");
const prosemirror_state_2 = require("prosemirror-state");
class Hashtag extends Mark_1.default {
    get name() {
        return "hashtag";
    }
    get defaultOptions() {
        return {
            onClick: undefined,
        };
    }
    get schema() {
        return {
            attrs: { href: {} },
            inclusive: false,
            excludes: "link hashtag",
            parseDOM: [{ tag: "a.tag[href]", getAttrs(dom) { return { href: dom.getAttribute("href") }; } }],
            toDOM(mark) { let { href } = mark.attrs; return ["a", { class: 'tag', href }, 0]; },
        };
    }
    get plugins() {
        let shiftKey = false;
        return [
            new prosemirror_state_1.Plugin({
                props: {
                    handleKeyDown(view, event) {
                        shiftKey = event.shiftKey;
                        return false;
                    },
                    handlePaste: (view, event, slice) => {
                        if (shiftKey) {
                            return false;
                        }
                        return false;
                    },
                    transformPasted: (slice) => {
                        if (shiftKey) {
                            return slice;
                        }
                        return slice;
                        return new prosemirror_model_1.Slice(linkify(slice.content), slice.openStart, slice.openEnd);
                    },
                },
                appendTransaction(transactions, oldState, newState) {
                    let textChange = transactions.some(({ steps }) => steps.some((step) => step instanceof prosemirror_transform_1.ReplaceStep || step instanceof prosemirror_transform_1.ReplaceAroundStep));
                    if (textChange === false)
                        return;
                    if (!(newState.selection instanceof prosemirror_state_2.TextSelection))
                        return;
                    const { $from, empty } = newState.selection;
                    if ($from.parent.type.spec.code || !empty)
                        return;
                    const sameParent = newState.selection.from - newState.selection.$from.parentOffset == oldState.selection.from - oldState.selection.$from.parentOffset;
                    console.log("sameParent?", sameParent);
                    let tr = newState.tr;
                    const ENTITY_REGEX = /(?:^|\s)(@|#)([a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)?)(?:$|\b)/g;
                    function hashify($from) {
                        const relativeStart = Math.max($from.parentOffset - 128, 0);
                        const relativeEnd = Math.min($from.parentOffset + 128, $from.parent.nodeSize - 2);
                        let textAround = $from.parent.textBetween(relativeStart, relativeEnd, null, "\ufffc");
                        console.log("textaround", textAround);
                        const startOfTextBlock = Math.max($from.pos - 128, $from.pos - $from.parentOffset);
                        const endOfTextRange = Math.min($from.pos + 128, $from.pos - $from.parentOffset + $from.parent.nodeSize - 2);
                        tr.doc.nodesBetween(startOfTextBlock, endOfTextRange, (node, pos) => {
                            node.marks.forEach(mark => {
                                console.log("mark", mark.type.name, node.textContent);
                                if (mark.type.name == "hashtag") {
                                    tr.removeMark(pos, pos + node.textContent.length, mark.type);
                                }
                            });
                        });
                        const matchToPath = { '#': 'ht', '@': 'at' };
                        let match, pos = $from.pos - $from.parentOffset;
                        while (match = ENTITY_REGEX.exec(textAround)) {
                            let offset = match[0].length - match[1].length - match[2].length;
                            let start = offset + pos + match.index, end = start + match[1].length + match[2].length;
                            let href = `/${matchToPath[match[1]]}/${match[2]}`.toLowerCase();
                            let link = newState.schema.marks.hashtag.create({ href, internal: true });
                            console.log("hi", link, newState.schema.mark("hashtag", { href, internal: true }));
                            tr.removeMark(start, end, newState.schema.marks.hashtag).addMark(start, end, link);
                        }
                    }
                    hashify($from);
                    if (sameParent == false && oldState.selection.from < newState.doc.nodeSize - 1) {
                        if (!(oldState.selection instanceof prosemirror_state_2.TextSelection))
                            return tr;
                        const { $from, empty } = oldState.selection;
                        if ($from.parent.type.spec.code || !empty)
                            return tr;
                        let $oldFrom = newState.doc.resolve(oldState.selection.from);
                        hashify($oldFrom);
                    }
                    return tr;
                }
            })
        ];
    }
}
exports.default = Hashtag;
const HTTP_LINK_REGEX = /(@|#)[a-zA-Z0-0]+/g;
function linkify(fragment) {
    var linkified = [];
    fragment.forEach(function findTextLinks(child) {
        if (child.isText) {
            const text = child.text;
            var pos = 0, match;
            while (match = HTTP_LINK_REGEX.exec(text)) {
                var start = match.index;
                var end = start + match[0].length;
                var link = child.type.schema.marks['hashtag'];
                if (start > 0) {
                    linkified.push(child.cut(pos, start));
                }
                const urlText = text.slice(start, end);
                linkified.push(child.cut(start, end).mark(link.create({ href: urlText }).addToSet(child.marks)));
                pos = end;
            }
            if (pos < text.length) {
                linkified.push(child.cut(pos));
            }
        }
        else {
            linkified.push(child.copy(linkify(child.content)));
        }
    });
    return prosemirror_model_1.Fragment.fromArray(linkified);
}
