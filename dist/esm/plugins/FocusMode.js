import { Plugin, PluginKey } from 'prosemirror-state';
export const FocusModeKey = new PluginKey('FocusMode');
export function FocusMode(options = { initState: false }) {
    return new Plugin({
        key: FocusModeKey,
        props: {
            attributes(state) {
                return this.getState(state) ? { class: "ProseMirror-focusmode" } : null;
            }
        },
        state: {
            init: (config, state) => options.initState,
            apply(tr, prevState) {
                let focus = tr.getMeta(FocusModeKey);
                if (focus === undefined)
                    return prevState;
                return typeof focus === 'boolean' ? focus : !prevState;
            }
        },
    });
}
export default FocusMode;
export function toggleFocusMode(focus = null) {
    return (state, dispatch) => {
        dispatch(state.tr.setMeta(FocusModeKey, focus));
        return true;
    };
}
