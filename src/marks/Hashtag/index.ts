import { Mark } from '../../Mark.js'
import { toggleMark } from "prosemirror-commands";
import { ReplaceStep, ReplaceAroundStep } from "prosemirror-transform"
import { EditorState, Plugin } from "prosemirror-state";
import type { Mark as PMMark, MarkSpec, Node as PMNode } from "prosemirror-model";
import { Fragment, Slice } from "prosemirror-model"; 
import { EditorView } from 'prosemirror-view';
import { TextSelection } from "prosemirror-state"

export const Hashtag = (options?: Partial<Mark>) => Mark({
  name: "hashtag",

  attrs: {href: {}},
  inclusive: false,
  excludes: "link",
  parseDOM: [{tag: "a.tag[href]", getAttrs(dom: HTMLElement) { return {href: dom.getAttribute("href")}; }}],
  toDOM(mark: PMMark) { return ["a", {class: 'tag', href: mark.attrs.href}, 0] },

  plugins() {
    let shiftKey = false;
    return [
      new Plugin({
        props: {

          handleKeyDown(view, event) {
            shiftKey = event.shiftKey;
            return false;
          },
          
          // Adds linkMark to selected text nodes if slice only has link.
          handlePaste: (view, event, slice) => {
            if (shiftKey) { return false; }
            return false;
          },

          // Adds link mark to text nodes with urls.
          transformPasted: (slice: Slice) => {
            if (shiftKey) { return slice; }
            return slice;
            return new Slice(linkify(slice.content), slice.openStart, slice.openEnd)
          },

        },

        appendTransaction(transactions, oldState, newState) {

          // Return if no change in text from transactions.
          let textChange = transactions.some(({steps}) => steps.some((step) => step instanceof ReplaceStep || step instanceof ReplaceAroundStep));
          if (textChange === false) return;

          if (!(newState.selection instanceof TextSelection)) return;
          const { $from, empty } = newState.selection;
          if ($from.parent.type.spec.code || !empty) return;

          // Hashtag-ify logic should run parent of both oldState and newState selection,
          // in case of a textblock split or join.
          const sameParent = newState.selection.from - newState.selection.$from.parentOffset == oldState.selection.from - oldState.selection.$from.parentOffset;
          console.log("sameParent?", sameParent)

          let tr = newState.tr

          const ENTITY_REGEX = /(?:^|\s)(@|#)([a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)?)(?:$|\b)/g;


          function hashify($from) {
            const relativeStart = Math.max($from.parentOffset - 128, 0);
            const relativeEnd = Math.min($from.parentOffset + 128, $from.parent.nodeSize - 2);
  
            let textAround = $from.parent.textBetween(relativeStart, relativeEnd, null, "\ufffc")
            console.log("textaround", textAround);

            const startOfTextBlock = Math.max($from.pos - 128, $from.pos - $from.parentOffset);
            const endOfTextRange = Math.min($from.pos + 128, $from.pos - $from.parentOffset + $from.parent.nodeSize - 2);
  
            tr.doc.nodesBetween(startOfTextBlock, endOfTextRange, (node, pos) => {
              node.marks.forEach(mark => {
                console.log("mark", mark.type.name, node.textContent, )
                if (mark.type.name == "hashtag") {
                  tr.removeMark(pos, pos + node.textContent.length, mark.type)
                }
              })
            })
  
            const matchToPath = {'#': 'ht', '@': 'at'};
  
            let match, pos = $from.pos - $from.parentOffset;
            while (match = ENTITY_REGEX.exec(textAround)) {
  
              let offset = match[0].length - match[1].length - match[2].length;
              let start = offset + pos + match.index, end = start + match[1].length + match[2].length;
  
              let href = `/${matchToPath[match[1]]}/${match[2]}`.toLowerCase();
              let link = newState.schema.marks.hashtag.create({href, internal: true})
              console.log("hi", link, newState.schema.mark("hashtag", {href, internal: true}))
  
              tr.removeMark(start, end, newState.schema.marks.hashtag).addMark(start, end, link);
            }
          }

          hashify($from)
          if (sameParent == false && oldState.selection.from < newState.doc.nodeSize - 1) {


            if (!(oldState.selection instanceof TextSelection)) return tr;
            const { $from, empty } = oldState.selection;
            if ($from.parent.type.spec.code || !empty) return tr;

            let $oldFrom = newState.doc.resolve(oldState.selection.from);
            hashify($oldFrom)
          }


          // let oldFrom = newState.doc.resolve(oldState.selection.$from.pos);
          // let oldText = oldFrom.parent.textBetween(Math.max(0, oldFrom.parentOffset - 128), Math.min(oldFrom.parentOffset + 128, oldFrom.parent.nodeSize - 2), null, "\ufffc") + ""


          return tr;
        }
      })
    ]
  },

  ...options
})


/**
 * Source: https://github.com/ProseMirror/prosemirror/issues/90
 * @param fragment 
 */
const HTTP_LINK_REGEX = /(@|#)[a-zA-Z0-0]+/g
function linkify(fragment: Fragment): Fragment {
  var linkified : PMNode[] = []
  fragment.forEach(function findTextLinks(child: PMNode) {
    if (child.isText) {
      const text = child.text
      var pos = 0, match: RegExpExecArray;
      while (match = HTTP_LINK_REGEX.exec(text)) {
        var start = match.index
        var end = start + match[0].length
        var link = child.type.schema.marks['hashtag']
        // simply copy across the text from before the match
        if (start > 0) {
          linkified.push(child.cut(pos, start))
        }
        const urlText = text.slice(start, end)
        linkified.push(child.cut(start, end).mark(link.create({href: urlText}).addToSet(child.marks)))
        pos = end
      }
      // copy over remaining text
      if (pos < text.length) {
        linkified.push(child.cut(pos))
      }
    } else {
      linkified.push(child.copy(linkify(child.content)))
    }
  })
  return Fragment.fromArray(linkified)
}