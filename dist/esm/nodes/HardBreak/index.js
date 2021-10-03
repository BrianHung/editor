import { Node } from "../../Node.js";
import { chainCommands, exitCode } from 'prosemirror-commands';
export const HardBreak = (options) => Node(Object.assign({ name: 'hardbreak', inline: true, group: "inline", selectable: false, parseDOM: [{ tag: 'br' }], toDOM() { return ['br']; },
    commands({ nodeType }) {
        return {
            hardbreak: () => exitAndInsert(nodeType)
        };
    },
    keymap({ nodeType }) {
        return {
            'Mod-Enter': exitAndInsert(nodeType),
            'Shift-Enter': exitAndInsert(nodeType),
        };
    } }, options));
function exitAndInsert(nodeType) {
    return chainCommands(exitCode, (state, dispatch) => {
        dispatch(state.tr.replaceSelectionWith(nodeType.create()).scrollIntoView());
        return true;
    });
}
