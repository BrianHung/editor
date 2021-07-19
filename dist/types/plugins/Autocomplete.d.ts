import { Plugin, PluginKey } from 'prosemirror-state';
export declare type AutocompletePluginProps = {
    regexp: RegExp;
    style?: string;
    pluginKey?: PluginKey;
    onEnter?: Function;
    onChange?: Function;
    onLeave?: Function;
    onKeyDown?: Function;
};
export declare type AutocompletePluginState = {
    active: boolean;
    range: {
        from: number;
        to: number;
    } | null;
    query: string | null;
    text: string | null;
};
export declare function Autocomplete({ regexp, style, pluginKey, onEnter, onChange, onLeave, onKeyDown }: AutocompletePluginProps): Plugin<any, any>;
export default Autocomplete;
//# sourceMappingURL=Autocomplete.d.ts.map