"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchTermSyntaxHighlight = exports.SearchTermPluginKey = void 0;
const prosemirror_transform_1 = require("prosemirror-transform");
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_view_1 = require("prosemirror-view");
exports.SearchTermPluginKey = new prosemirror_state_1.PluginKey("SearchTerm");
const SearchTermSyntaxHighlight = (options) => {
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
                decorations.push(prosemirror_view_1.Decoration.inline(0, 0, { class: style }));
            }
        });
        return decorations;
    };
    return new prosemirror_state_1.Plugin({
        props: {
            decorations(state) {
                return this.getState(state);
            },
        },
        state: {
            init: (config, state) => {
                return prosemirror_view_1.DecorationSet.create(state.doc, getDecorations(state));
            },
            apply: (tr, decorationSet) => {
                let textChange = tr.steps.some((step) => step instanceof prosemirror_transform_1.ReplaceStep || step instanceof prosemirror_transform_1.ReplaceAroundStep);
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
        key: exports.SearchTermPluginKey,
    });
};
exports.SearchTermSyntaxHighlight = SearchTermSyntaxHighlight;
exports.default = exports.SearchTermSyntaxHighlight;
