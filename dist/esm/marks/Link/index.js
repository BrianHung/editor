import Mark from '../Mark';
import { InputRule } from "prosemirror-inputrules";
import { toggleMark } from "prosemirror-commands";
import { NodeSelection, Plugin, TextSelection } from "prosemirror-state";
import { Fragment, Slice } from "prosemirror-model";
import { defaultOnClick } from "./utils";
export default class Link extends Mark {
    get name() {
        return "link";
    }
    get defaultOptions() {
        return {
            onClick: defaultOnClick,
            onHover: undefined,
        };
    }
    get schema() {
        return {
            attrs: { href: {}, title: { default: null }, internal: { default: false } },
            inclusive: false,
            group: "inline block",
            parseDOM: [{
                    tag: "a[href]",
                    getAttrs(dom) {
                        return { href: dom.getAttribute("href"), title: dom.getAttribute("title"), internal: dom.dataset.internalLink !== undefined };
                    }
                }],
            toDOM(mark) {
                const { href, title, internal } = mark.attrs;
                return ["a", Object.assign({ href, title, rel: "noopener noreferrer nofollow" }, internal && { "data-internal-link": "" }), 0];
            },
        };
    }
    keys({ markType }) {
        return {
            "Mod-k": toggleMark(markType, { href: "/" }),
            "Mod-K": toggleMark(markType, { href: "/" }),
            "Alt-k": openLinksAcrossTextSelection,
        };
    }
    commands({ markType }) {
        return ({ href } = { href: "" }) => toggleMark(markType, { href });
    }
    inputRules({ markType }) {
        return [
            new InputRule(/\[(.+|:?)]\((\S+)\)/, (state, match, start, end) => {
                const [okay, alt, href] = match;
                const { tr, schema } = state;
                if (okay) {
                    tr.replaceWith(start, end, schema.text(alt));
                    tr.addMark(start, start + alt.length, markType.create({ href }));
                }
                return tr;
            }),
            new InputRule(/\[\[([\w\s]+)(?:\|([\w\s]+))?\]\]$/, (state, match, start, end) => {
                const tr = state.tr;
                const [okay, link, text] = match;
                if (okay) {
                    tr.replaceWith(start, end, state.schema.text(text || link));
                    tr.addMark(start, start + (text || link).length, markType.create({ href: `/p/${link.replace(/ /g, "-")}`, internal: true }));
                }
                return tr;
            }),
        ];
    }
    get plugins() {
        let shiftKey = false;
        return [
            new Plugin({
                props: {
                    handleKeyDown(view, event) {
                        shiftKey = event.shiftKey;
                        return false;
                    },
                    handleDOMEvents: {
                        mouseover: (view, event) => {
                            if (!(event.target instanceof HTMLAnchorElement))
                                return false;
                            return this.options.onHover && this.options.onHover(event, view);
                        },
                        click: (view, event) => {
                            if (!(event.target instanceof HTMLAnchorElement))
                                return false;
                            return this.options.onClick && this.options.onClick(event, view);
                        }
                    },
                    handleClick: (view, pos, event) => {
                        if (!(event.target instanceof HTMLAnchorElement))
                            return false;
                        return event.button == 0 ? /Mac/.test(navigator.platform) ? event.metaKey : event.ctrlKey
                            : this.options.onClick && this.options.onClick(event, view);
                    },
                    handlePaste(view, event, slice) {
                        let link = linkFromSlice(slice);
                        if (link) {
                            let { schema, selection, tr } = view.state;
                            if (selection.empty) {
                                return false;
                            }
                            let internal = link.origin == location.origin;
                            let href = internal ? link.pathname : link.href;
                            if (selection instanceof TextSelection) {
                                selection.ranges.forEach(({ $from, $to }) => tr.addMark($from.pos, $to.pos, schema.mark('link', { href, internal })));
                            }
                            if (selection instanceof NodeSelection) {
                                const { node, from } = selection;
                                switch (node.type) {
                                    case schema.nodes.image:
                                        tr.setNodeMarkup(from, null, node.attrs, [schema.mark('link', { href, internal })]);
                                }
                            }
                            view.dispatch(tr);
                            return true;
                        }
                        return false;
                    },
                    transformPasted(slice) {
                        if (shiftKey) {
                            return slice;
                        }
                        return new Slice(linkify(slice.content), slice.openStart, slice.openEnd);
                    },
                }
            })
        ];
    }
}
function linkFromSlice(slice) {
    if (slice.content.childCount == 1) {
        let child = slice.content.content[0];
        if (child.isText) {
            try {
                return new URL(child.text);
            }
            catch (error) { }
            ;
        }
        else if (child.isTextblock) {
            return linkFromSlice(child);
        }
    }
    return null;
}
import linkifyIt from 'linkify-it';
const linkifyit = linkifyIt();
function linkify(fragment) {
    var linkified = [];
    fragment.forEach(function findTextLinks(child) {
        if (child.isText) {
            var pos = 0, matches = linkifyit.match(child.text) || [];
            matches.forEach(({ index, raw, url }) => {
                var start = index, end = start + raw.length;
                var linkType = child.type.schema.marks['link'];
                if (start > 0) {
                    linkified.push(child.cut(pos, start));
                }
                linkified.push(child.cut(start, end).mark(linkType.create({ href: url }).addToSet(child.marks)));
                pos = end;
            });
            if (pos < child.text.length) {
                linkified.push(child.cut(pos));
            }
        }
        else {
            linkified.push(child.copy(linkify(child.content)));
        }
    });
    return Fragment.fromArray(linkified);
}
function openLinksAcrossTextSelection(state) {
    let { selection, doc, schema } = state;
    if (!(selection instanceof TextSelection))
        return false;
    let links = [];
    doc.nodesBetween(selection.from, selection.to, node => { links.push(...node.marks.filter(mark => mark.type == schema.marks.link).map(mark => mark.attrs.href)); });
    Array.from(new Set(links)).forEach(link => window.open(link, '_blank'));
    return false;
}
