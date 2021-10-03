import { Plugin, PluginKey } from 'prosemirror-state';
export const TrailingNodeKey = new PluginKey("TrailingNode");
export default function TrailingNode(options = { node: 'paragraph' }) {
    return new Plugin({
        key: TrailingNodeKey,
        view() {
            return {
                update: ({ state, dispatch }) => {
                    let insert = this.key.getState(state), nodeType;
                    if (insert && (nodeType = state.schema.nodes[options.node])) {
                        dispatch(state.tr.insert(state.doc.content.size, nodeType.create()));
                    }
                }
            };
        },
        state: {
            init(configs, state) {
                return state.tr.doc.lastChild.type != state.schema.nodes[options.node];
            },
            apply(tr, pluginState, oldState, newState) {
                return tr.docChanged ? tr.doc.lastChild.type != oldState.schema.nodes[options.node] : pluginState;
            }
        },
    });
}
