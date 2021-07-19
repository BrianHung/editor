import { ResolvedPos } from 'prosemirror-model';
import type { EditorState } from 'prosemirror-state'
import { Plugin, PluginKey, Transaction } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { TextSelection } from "prosemirror-state";

/**
 * Create a matcher that matches when a specific character is typed.
 * Used for @mentions and #tags.
 * @param {Regex} regexp
 * @returns {match}
 */
function positionMatcher(regexp: RegExp, pos: ResolvedPos) {
  const text = pos.doc.textBetween(pos.before(), pos.end(), '\0', '\0');
  let match = regexp.exec(text);
  if (match) {
    let from = pos.start() + match.index, to = from + match[0].length;
    if (from < pos.pos && to >= pos.pos) {
      return {range: {from, to}, query: match[1] || "", text: match[0]}
    }
  }
}

export type AutocompletePluginProps = {
  regexp: RegExp;
  style?: string;
  pluginKey?: PluginKey;
  onEnter?: Function;
  onChange?: Function;
  onLeave?: Function;
  onKeyDown?: Function;
}

export type AutocompletePluginState = {
  active: boolean;
  range: {from: number, to: number} | null;
  query: string | null;
  text: string | null;
}

const initialPluginState: AutocompletePluginState = {active: false, range: null, query: null, text: null }

export function Autocomplete({regexp, style = '', pluginKey = new PluginKey('Autocomplete'), onEnter, onChange, onLeave, onKeyDown}: AutocompletePluginProps) {
  return new Plugin({

    key: pluginKey,

    // this: PluginSpec
    view () {
      return {
        update: (view: EditorView, prevState: EditorState) => {
          // get plugin state from editor state
          const prev = this.key.getState(prevState);
          const next = this.key.getState(view.state);

          // compute how plugin state has changed
          const started = !prev.active &&  next.active;
          const stopped =  prev.active && !next.active;
          const changed =  prev.active &&  next.active && prev.query !== next.query;
          
          // handler may not be set until after plugin is initialized with PluginSpec
          let plugin = this.key.get(view.state);
          onEnter  = onEnter  || plugin.onEnter;
          onLeave  = onLeave  || plugin.onLeave;
          onChange = onChange || plugin.onChange;

          // call handler depending on state
          const props = { view, range: next.range, query: next.query, text: next.text };
          started && onEnter  && onEnter(props);
          stopped && onLeave  && onLeave(props);
          changed && onChange && onChange(props);

          // PSA: If external autocomplete is initialized after this plugin (s.t. onEnter is null),
          // external state should grab plugin state via key.getState(view.state).
        },
      }
    },

    // this: PluginInstance
    state: {
      init: (config, editorState) => initialPluginState,
      apply: (tr: Transaction, prevState: AutocompletePluginState): AutocompletePluginState => {
        const $from = tr.selection.$from;
        // autocomplete only on text selection and in non-code textblocks
        if (tr.selection instanceof TextSelection && !$from.parent.type.spec.code && $from.parent.isTextblock) {
          let match = positionMatcher(regexp, $from);
          if (match) {
            return {active: true, ...match};
          }
        }
        return initialPluginState;
      },
    },


    // this: PluginInstance
    props: {

      // call the keydown hook if autocomplete is active
      handleKeyDown(view, event) {
        const state = this.getState(view.state)
        if (!state.active) { return false; }
        // handler may not be set until after plugin is initialized with PluginSpec
        // @ts-ignore
        onKeyDown = this.onKeyDown || onKeyDown;
        return onKeyDown && onKeyDown({view, event, ...state});
      },

      // setup decorations on active autocomplete range
      decorations(editorState) {
        const state = this.getState(editorState)
        if (!state.active) return DecorationSet.empty;
        return DecorationSet.create(editorState.doc, [
          Decoration.inline(state.range.from, state.range.to, {
            nodeName: 'span', class: `ProseMirror-autocomplete ${style}`
          })
        ]);
      },
    },
  })
}

export default Autocomplete;