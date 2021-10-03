import { Mark } from '../../Mark.js'
import { InputRule } from "prosemirror-inputrules"
import { toggleMark } from "prosemirror-commands";
import { NodeSelection, Plugin, TextSelection } from "prosemirror-state";
import type { Mark as PMMark, Node as PMNode } from "prosemirror-model";
import { Fragment, Slice } from "prosemirror-model"; 
import { defaultOnClick } from "./utils.js"

export const Link = (options?: Partial<Mark>) => Mark({
  name: 'link',

  onClick: defaultOnClick,

  attrs: {href: {default: null}, title: {default: null}, internal: {default: false}},
  inclusive: false,
  group: "inline block",
  parseDOM: [{
    tag: "a[href]", 
    getAttrs(dom: HTMLElement) { 
      return { href: dom.getAttribute("href"), title: dom.getAttribute("title"), internal: dom.dataset.internalLink !== undefined };
    }
  }],
  toDOM(mark: PMMark) { 
    const { href, title, internal } = mark.attrs; 
    return ["a", {href, title, rel: "noopener noreferrer nofollow", ...internal && {"data-internal-link": ""}}, 0];
  },

  commands({markType}) {
    return {
      link: ({attrs}) => toggleMark(markType, attrs)
    }
  },

  keymap({markType}) {
    return {
      "Mod-k": toggleMark(markType, {href: "/"}),
      "Mod-K": toggleMark(markType, {href: "/"}),
      "Alt-k": openLinksAcrossSelection,
    }
  },

  inputRules({markType}) {
    return [
      // Markdown link
      new InputRule(/\[(.+|:?)]\((\S+)\)/, (state, match, start, end) => {
        const [okay, text, href] = match;
        const tr = state.tr
        if (okay) {
          const slice = state.doc.slice(start + okay.indexOf(text), start + okay.indexOf(text) + text.length)
          tr.replace(start, end, slice)
          tr.addMark(start, start + text.length, markType.create({ href }))
          tr.setStoredMarks([])
        }
        return tr
      }),
      // Wikipedia+Mediawiki
      new InputRule(/\[\[([\w\s]+)(?:\|([\w\s]+))?\]\]$/, (state, match, start, end) => {
        const tr = state.tr;
        const [okay, link, text] = match;
        if (okay) {
          tr.replaceWith(start, end, state.schema.text(text || link));
          tr.addMark(start, start + (text || link).length, markType.create({href: `/p/${link.replace(/ /g,"-")}`, internal: true}));
        }
        return tr;
      }),
    ];
  },

  plugins() {
    let shiftKey = false;
    return [
      new Plugin({
        props: {

          // Hack to detect if shift is held down for paste as plain text.
          // See: https://discuss.prosemirror.net/t/change-transformpasted-behaviour-when-shift-key-is-pressed/949
          handleKeyDown(view, event) {
            shiftKey = event.shiftKey;
            return false;
          },

          // Register mouseover and click event handlers for onHover and onClick.
          handleDOMEvents: {
            mouseover: (view, event) => {
              if (!(event.target instanceof HTMLAnchorElement)) return false; // Escape if target is not a link.
              return this.onHover?.(event, view);
            },
            click: (view, event) => {
              if (!(event.target instanceof HTMLAnchorElement)) return false; // Escape if target is not a link.
              return this.onClick?.(event, view);
            }
          },

          // Disable default ProseMirror meta/ctrl+leftclick NodeSelection behavior when target is a link.
          // See: https://discuss.prosemirror.net/t/disable-ctrl-click/995
          handleClick: (view, pos, event) => {
            if (!(event.target instanceof HTMLAnchorElement)) return false; // Escape if target is not a link.
            return event.button == 0 ? /Mac/.test(navigator.platform) ? event.metaKey : event.ctrlKey
              : this.onClick?.(event, view);
          },
          
          // Adds a link mark to selected text nodes if the pasted slice is a valid link.
          handlePaste(view, event, slice) {
            let link = linkFromSlice(slice);
            if (link) {
              let {schema, selection, tr} = view.state;
              if (selection.empty) { return false; }

              // Use relative pathname if internal link in style of wikipedia.
              let internal = link.origin == location.origin;
              let href = internal ? link.pathname : link.href;

              // Add link to all children within current TextSelection.

              if (selection instanceof TextSelection) {
                selection.ranges.forEach(({$from, $to}) =>
                  tr.addMark($from.pos, $to.pos, schema.mark('link', {href, internal}))
                );
              }

              if (selection instanceof NodeSelection) {
                const { node, from } = selection;
                switch (node.type) {
                  case schema.nodes.image:
                    tr.setNodeMarkup(from, null, node.attrs, [schema.mark('link', {href, internal})]);
                }
              }

              view.dispatch(tr);
              return true;
            }

            // Return if pasted text is not valid URL.
            return false;
          },

          // Adds link mark to text nodes with urls.
          transformPasted(slice: Slice) {
            if (shiftKey) { return slice; }
            return new Slice(linkify(slice.content), slice.openStart, slice.openEnd)
          },

        }
      })
    ]
  },

  ...options
})

/**
 * Recursively iterate through slice to see if it contains _only_ a valid url.
 */
function linkFromSlice(slice: Slice): URL | null {
  if (slice.content.childCount == 1) {
    // @ts-ignore
    let child = slice.content.content[0];
    if (child.isText) {
      try {
        return new URL(child.text);
      } catch (error) {}; // no-op
    } else if (child.isTextblock) {
      return linkFromSlice(child);
    }
  }
  return null;
}


import linkifyIt from 'linkify-it';
const linkifyit = linkifyIt();

/**
 * Source: https://github.com/ProseMirror/prosemirror/issues/90
 */
function linkify(fragment: Fragment): Fragment {
  var linkified : PMNode[] = []
  fragment.forEach(function findTextLinks(child) {
    if (child.isText) {
      var pos = 0, matches = linkifyit.match(child.text) || [];
      matches.forEach(({index, raw, url}) => {
        var start = index, end = start + raw.length;
        var linkType = child.type.schema.marks['link'];
        // copy leading text from before the match
        if (start > 0) { linkified.push(child.cut(pos, start)); }
        linkified.push(child.cut(start, end).mark(linkType.create({href: url}).addToSet(child.marks)))
        pos = end;
      })
      // copy over trailing text
      if (pos < child.text.length) { linkified.push(child.cut(pos)); }
    } else {
      linkified.push(child.copy(linkify(child.content)))
    }
  })
  return Fragment.fromArray(linkified);
}

import type { EditorState } from "prosemirror-state"

function openLinksAcrossSelection(state: EditorState) {
  let {selection, doc, schema} = state
  let links = []
  doc.nodesBetween(selection.from, selection.to, (node) => {
    links.push(...node.marks.reduce((links, mark) => mark.type === schema.marks.link ? links.concat([mark.attrs.href]) : links, []))
  })
  Array.from(new Set(links)).forEach(link => window.open(link, '_blank'))
  return false
}