import Extension from './Extension';
import { selectParentNode } from "prosemirror-commands";
export default class Keymaps extends Extension {
    get name(): string;
    keys(): {
        "Mod-c": typeof selectEntireTextblock;
        "Mod-x": typeof selectEntireTextblock;
        Escape: typeof selectParentNode;
        "Ctrl-Space": typeof clearTextFormatting;
    };
}
import type { EditorState } from "prosemirror-state";
declare function selectEntireTextblock(state: EditorState, dispatch: any): boolean;
declare function clearTextFormatting(state: EditorState, dispatch: any): boolean;
export {};
//# sourceMappingURL=Keymaps.d.ts.map