"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrailingNodeKey = void 0;
const prosemirror_state_1 = require("prosemirror-state");
exports.TrailingNodeKey = new prosemirror_state_1.PluginKey("TrailingNode");
function TrailingNode(options = { node: 'paragraph' }) {
    return new prosemirror_state_1.Plugin({
        key: exports.TrailingNodeKey,
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
exports.default = TrailingNode;
