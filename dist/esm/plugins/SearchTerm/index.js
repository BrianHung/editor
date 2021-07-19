import { ReplaceStep, ReplaceAroundStep } from "prosemirror-transform";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
export const SearchTermPluginKey = new PluginKey("SearchTerm");
export const SearchTermSyntaxHighlight = (options) => {
    const regexArray = [
        {
            regex: /".*?"/g,
            style: "st-exact",
        }
    ];
    const getDecorations = (state) => {
        const decorations = [];
        const { $from, $to, from, to, $cursor, empty } = state.selection;
        let textAround = $from.parent.textBetween(Math.max(0, $from.parentOffset - 128), Math.min($from.parentOffset + 128, $from.parent.nodeSize - 2), null, "\ufffc") + "";
        regexArray.forEach(({ regex, style }) => {
            let match;
            while (match = regex.exec(textAround)) {
                decorations.push(Decoration.inline(0, 0, { class: style }));
            }
        });
        return decorations;
    };
    return new Plugin({
        props: {
            decorations(state) {
                return this.getState(state);
            },
        },
        state: {
            init: (config, state) => {
                return DecorationSet.create(state.doc, getDecorations(state));
            },
            apply: (tr, decorationSet) => {
                let textChange = tr.steps.some((step) => step instanceof ReplaceStep || step instanceof ReplaceAroundStep);
                if (textChange == false)
                    return decorationSet;
                decorationSet = decorationSet.map(tr.mapping, tr.doc);
                const decorationsNew = [];
                const decorationsOld = [];
                decorationSet = decorationSet.remove(decorationsOld);
                decorationSet = decorationSet.add(tr.doc, decorationsNew);
                return decorationSet;
            },
        },
        key: SearchTermPluginKey,
    });
};
export default SearchTermSyntaxHighlight;
