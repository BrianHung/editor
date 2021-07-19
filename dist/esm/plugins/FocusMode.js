import { Plugin, PluginKey } from 'prosemirror-state';
export const FocusModeKey = new PluginKey('FocusMode');
export function FocusMode() {
    return new Plugin({
        key: FocusModeKey,
        props: {
            attributes(state) {
                return this.getState(state) ? { class: "ProseMirror-focusmode" } : null;
            }
        },
        state: {
            init: (config, state) => false,
            apply(tr, prevState) {
                let focus = tr.getMeta(FocusModeKey);
                if (focus === undefined) {
                    return prevState;
                }
                return (typeof focus == 'boolean') ? focus : !prevState;
            }
        },
    });
}
export default FocusMode;
export function toggleFocusMode(state, dispatch) {
    dispatch(state.tr.setMeta(FocusModeKey, null));
    return true;
}
