import { Plugin, PluginKey } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
export interface AutocompletePlugin extends Plugin {
    onEnter?: (props: (AutocompletePluginState & {
        view: EditorView;
    })) => void;
    onLeave?: (props: (AutocompletePluginState & {
        view: EditorView;
    })) => void;
    onChange?: (props: (AutocompletePluginState & {
        view: EditorView;
    })) => void;
    onKeyDown?: (props: (AutocompletePluginState & {
        view: EditorView;
        event: KeyboardEvent;
    })) => boolean;
}
export interface AutocompletePluginProps {
    regexp: RegExp;
    pluginKey: PluginKey;
    style?: string;
    onEnter?: AutocompletePlugin['onEnter'];
    onLeave?: AutocompletePlugin['onLeave'];
    onChange?: AutocompletePlugin['onChange'];
    onKeyDown?: AutocompletePlugin['onKeyDown'];
}
export interface AutocompletePluginState {
    active: boolean;
    range: {
        from: number;
        to: number;
    } | null;
    query: string | null;
    text: string | null;
}
export declare function Autocomplete({ regexp, pluginKey, style, onEnter, onChange, onLeave, onKeyDown }: AutocompletePluginProps): AutocompletePlugin;
export default Autocomplete;
//# sourceMappingURL=Autocomplete.d.ts.map