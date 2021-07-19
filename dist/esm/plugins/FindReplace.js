import { Plugin, PluginKey } from 'prosemirror-state';
export const FindReplaceKey = new PluginKey("FindReplace");
export default function FindReplace() {
    return new Plugin({
        state: {
            init(configs, state) {
                return new FindReplaceState(state);
            },
            apply(tr, pluginState, prevState, nextState) {
                return pluginState.applyTransaction(tr);
            }
        },
        props: {
            decorations(state) {
                return this.getState(state).decorations;
            },
        },
        key: FindReplaceKey,
    });
}
class FindReplaceState {
    constructor(state) {
    }
}
