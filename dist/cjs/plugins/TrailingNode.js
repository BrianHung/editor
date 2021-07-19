"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_state_1 = require("prosemirror-state");
function TrailingNode(options = { node: 'paragraph' }) {
    return new prosemirror_state_1.Plugin({
        view: () => ({
            update: view => {
                const { dispatch, state } = view;
                let insertTrailingNode = this.key.getState(state);
                if (insertTrailingNode) {
                    dispatch(state.tr.insert(state.doc.content.size, state.schema.nodes[options.node].create()));
                }
            },
        }),
        state: {
            init: (configs, state) => state.tr.doc.lastChild.type.name != "paragraph",
            apply: (tr, prevState) => !tr.docChanged ? prevState : tr.doc.lastChild.type.name != "paragraph"
        },
    });
}
exports.default = TrailingNode;
