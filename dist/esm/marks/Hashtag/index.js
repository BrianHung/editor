import { Mark } from '../../Mark.js';
import { ReplaceStep, ReplaceAroundStep } from "prosemirror-transform";
import { Plugin } from "prosemirror-state";
import { Fragment, Slice } from "prosemirror-model";
import { TextSelection } from "prosemirror-state";
export const Hashtag = (options) => Mark(Object.assign({ name: "hashtag", attrs: { href: {} }, inclusive: false, excludes: "link", parseDOM: [{ tag: "a.tag[href]", getAttrs(dom) { return { href: dom.getAttribute("href") }; } }], toDOM(mark) { return ["a", { class: 'tag', href: mark.attrs.href }, 0]; },
    plugins() {
        let shiftKey = false;
        return [
            new Plugin({
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
                        return new Slice(linkify(slice.content), slice.openStart, slice.openEnd);
                    },
                },
                appendTransaction(transactions, oldState, newState) {
                    let textChange = transactions.some(({ steps }) => steps.some((step) => step instanceof ReplaceStep || step instanceof ReplaceAroundStep));
                    if (textChange === false)
                        return;
                    if (!(newState.selection instanceof TextSelection))
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
                        if (!(oldState.selection instanceof TextSelection))
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
    } }, options));
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
    return Fragment.fromArray(linkified);
}
