"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = void 0;
const Mark_js_1 = require("../../Mark.js");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_commands_1 = require("prosemirror-commands");
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_model_1 = require("prosemirror-model");
const utils_js_1 = require("./utils.js");
const Link = (options) => (0, Mark_js_1.Mark)(Object.assign({ name: 'link', onClick: utils_js_1.defaultOnClick, attrs: { href: { default: null }, title: { default: null }, internal: { default: false } }, inclusive: false, group: "inline block", parseDOM: [{
            tag: "a[href]",
            getAttrs(dom) {
                return { href: dom.getAttribute("href"), title: dom.getAttribute("title"), internal: dom.dataset.internalLink !== undefined };
            }
        }], toDOM(mark) {
        const { href, title, internal } = mark.attrs;
        return ["a", Object.assign({ href, title, rel: "noopener noreferrer nofollow" }, internal && { "data-internal-link": "" }), 0];
    },
    commands({ markType }) {
        return {
            link: ({ attrs }) => (0, prosemirror_commands_1.toggleMark)(markType, attrs)
        };
    },
    keymap({ markType }) {
        return {
            "Mod-k": (0, prosemirror_commands_1.toggleMark)(markType, { href: "/" }),
            "Mod-K": (0, prosemirror_commands_1.toggleMark)(markType, { href: "/" }),
            "Alt-k": openLinksAcrossSelection,
        };
    },
    inputRules({ markType }) {
        return [
            new prosemirror_inputrules_1.InputRule(/\[(.+|:?)]\((\S+)\)/, (state, match, start, end) => {
                const [okay, text, href] = match;
                const tr = state.tr;
                if (okay) {
                    const slice = state.doc.slice(start + okay.indexOf(text), start + okay.indexOf(text) + text.length);
                    tr.replace(start, end, slice);
                    tr.addMark(start, start + text.length, markType.create({ href }));
                    tr.setStoredMarks([]);
                }
                return tr;
            }),
            new prosemirror_inputrules_1.InputRule(/\[\[([\w\s]+)(?:\|([\w\s]+))?\]\]$/, (state, match, start, end) => {
                const tr = state.tr;
                const [okay, link, text] = match;
                if (okay) {
                    tr.replaceWith(start, end, state.schema.text(text || link));
                    tr.addMark(start, start + (text || link).length, markType.create({ href: `/p/${link.replace(/ /g, "-")}`, internal: true }));
                }
                return tr;
            }),
        ];
    },
    plugins() {
        let shiftKey = false;
        return [
            new prosemirror_state_1.Plugin({
                props: {
                    handleKeyDown(view, event) {
                        shiftKey = event.shiftKey;
                        return false;
                    },
                    handleDOMEvents: {
                        mouseover: (view, event) => {
                            var _a;
                            if (!(event.target instanceof HTMLAnchorElement))
                                return false;
                            return (_a = this.onHover) === null || _a === void 0 ? void 0 : _a.call(this, event, view);
                        },
                        click: (view, event) => {
                            var _a;
                            if (!(event.target instanceof HTMLAnchorElement))
                                return false;
                            return (_a = this.onClick) === null || _a === void 0 ? void 0 : _a.call(this, event, view);
                        }
                    },
                    handleClick: (view, pos, event) => {
                        var _a;
                        if (!(event.target instanceof HTMLAnchorElement))
                            return false;
                        return event.button == 0 ? /Mac/.test(navigator.platform) ? event.metaKey : event.ctrlKey
                            : (_a = this.onClick) === null || _a === void 0 ? void 0 : _a.call(this, event, view);
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
                            if (selection instanceof prosemirror_state_1.TextSelection) {
                                selection.ranges.forEach(({ $from, $to }) => tr.addMark($from.pos, $to.pos, schema.mark('link', { href, internal })));
                            }
                            if (selection instanceof prosemirror_state_1.NodeSelection) {
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
                        return new prosemirror_model_1.Slice(linkify(slice.content), slice.openStart, slice.openEnd);
                    },
                }
            })
        ];
    } }, options));
exports.Link = Link;
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
const linkify_it_1 = __importDefault(require("linkify-it"));
const linkifyit = (0, linkify_it_1.default)();
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
    return prosemirror_model_1.Fragment.fromArray(linkified);
}
function openLinksAcrossSelection(state) {
    let { selection, doc, schema } = state;
    let links = [];
    doc.nodesBetween(selection.from, selection.to, (node) => {
        links.push(...node.marks.reduce((links, mark) => mark.type === schema.marks.link ? links.concat([mark.attrs.href]) : links, []));
    });
    Array.from(new Set(links)).forEach(link => window.open(link, '_blank'));
    return false;
}
