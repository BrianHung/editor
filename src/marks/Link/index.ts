import Mark from '../Mark';
import { InputRule } from "prosemirror-inputrules"
import { toggleMark } from "prosemirror-commands";
import { NodeSelection, Plugin, TextSelection } from "prosemirror-state";
import type { Mark as PMMark, MarkSpec, Node as PMNode } from "prosemirror-model";
import { Fragment, Slice } from "prosemirror-model"; 
import { defaultOnClick } from "./utils"

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

  get schema(): MarkSpec {
    return {
      attrs: {href: {}, title: {default: null}, internal: {default: false}},
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
    };
  }

  keys({markType}) {
    return {
      "Mod-k": toggleMark(markType, {href: "/"}),
      "Mod-K": toggleMark(markType, {href: "/"}),
      "Alt-k": openLinksAcrossTextSelection,
    }
  }

  commands({markType}) {
    return ({href} = {href: ""}) => toggleMark(markType, {href});
  }

  inputRules({markType}) {
    return [
      // Markdown link
      new InputRule(/\[(.+|:?)]\((\S+)\)/, (state, match, start, end) => {
        const [okay, alt, href] = match;
        const { tr, schema} = state;
        if (okay) {
          tr.replaceWith(start, end, schema.text(alt));
          tr.addMark(start, start + alt.length, markType.create({ href }));
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
  }

  get plugins() {
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
              return this.options.onHover && this.options.onHover(event, view);
            },
            click: (view, event) => {
              if (!(event.target instanceof HTMLAnchorElement)) return false; // Escape if target is not a link.
              return this.options.onClick && this.options.onClick(event, view);
            }
          },

          // Disable default ProseMirror meta/ctrl+leftclick NodeSelection behavior when target is a link.
          // See: https://discuss.prosemirror.net/t/disable-ctrl-click/995
          handleClick: (view, pos, event) => {
            if (!(event.target instanceof HTMLAnchorElement)) return false; // Escape if target is not a link.
            return event.button == 0 ? /Mac/.test(navigator.platform) ? event.metaKey : event.ctrlKey
              : this.options.onClick && this.options.onClick(event, view);
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
  }
}

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

function openLinksAcrossTextSelection(state: EditorState) {
  let {selection, doc, schema} = state
  if (!(selection instanceof TextSelection)) return false
  let links = []
  doc.nodesBetween(selection.from, selection.to, node => {links.push(...node.marks.filter(mark => mark.type == schema.marks.link).map(mark => mark.attrs.href))})
  Array.from(new Set(links)).forEach(link => window.open(link, '_blank'))
  return false
}