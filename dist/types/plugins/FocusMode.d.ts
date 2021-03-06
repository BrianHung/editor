import type { EditorState } from 'prosemirror-state';
import { Plugin, PluginKey } from 'prosemirror-state';
export declare const FocusModeKey: PluginKey<any, any>;
export declare function FocusMode(): Plugin<any, any>;
export default FocusMode;
export declare function toggleFocusMode(state: EditorState, dispatch: any): boolean;
//# sourceMappingURL=FocusMode.d.ts.map