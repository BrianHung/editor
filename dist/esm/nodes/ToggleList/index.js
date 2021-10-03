import { Node } from "../../Node.js";
import { toggleListType } from "../../commands/index.js";
import { wrappingInputRule } from 'prosemirror-inputrules';
export const ToggleList = (options) => Node(Object.assign({ name: 'togglelist', group: 'block', content: 'toggleitem+', toDOM: () => ['ul', { class: 'toggle-list' }, 0], parseDOM: [{ tag: 'ul.toggle-list' }], commands({ nodeType }) {
        return {
            toggleListType: () => toggleListType(nodeType)
        };
    },
    inputRules({ nodeType }) {
        return [
            wrappingInputRule(/^>>\s$/, nodeType),
        ];
    } }, options));
