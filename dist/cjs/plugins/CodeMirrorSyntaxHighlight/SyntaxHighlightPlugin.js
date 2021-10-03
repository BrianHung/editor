"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyntaxHighlightState = exports.CodeBlockState = exports.SyntaxHighlightView = exports.syntaxHighlight = exports.SyntaxHighlightPlugin = exports.SyntaxHighlightKey = void 0;
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_view_1 = require("prosemirror-view");
const findLanguage_js_1 = require("./findLanguage.js");
exports.SyntaxHighlightKey = new prosemirror_state_1.PluginKey("syntaxHighlight");
function SyntaxHighlightPlugin(options) {
    return new prosemirror_state_1.Plugin({
        key: exports.SyntaxHighlightKey,
        props: {
            decorations(state) {
                return this.getState(state).decorations;
            },
        },
        state: {
            init: (config, state) => {
                return new SyntaxHighlightState(config, state);
            },
            apply: (tr, pluginState) => {
                return pluginState.applyTransaction(tr);
            },
        },
        view(editorView) {
            return new SyntaxHighlightView(editorView);
        },
    });
}
exports.SyntaxHighlightPlugin = SyntaxHighlightPlugin;
exports.default = SyntaxHighlightPlugin;
class SyntaxHighlightView {
    constructor(view) {
        this.update(view);
    }
    update(view) {
        this.view = view;
        let pluginState = exports.SyntaxHighlightKey.getState(this.view.state);
        let languagesToImport = pluginState.languagesToImport;
        if (languagesToImport.size) {
            this.importLanguages(Array.from(languagesToImport));
            pluginState.languages = new Set([...pluginState.languages, ...languagesToImport]);
            pluginState.languagesToImport = new Set();
        }
    }
    importLanguages(langs) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(langs.map(language => language.load()).concat(exports.syntaxHighlight ? [] : [
                Promise.resolve().then(() => __importStar(require("./syntaxHighlight"))).then(module => {
                    exports.syntaxHighlight = module.syntaxHighlight;
                })
            ]));
            this.view.dispatch(this.view.state.tr.setMeta(exports.SyntaxHighlightKey, langs));
        });
    }
}
exports.SyntaxHighlightView = SyntaxHighlightView;
class CodeBlockState {
}
exports.CodeBlockState = CodeBlockState;
class SyntaxHighlightState {
    constructor(config, state) {
        this.languagesToImport = new Set();
        this.languages = new Set();
        const codeblocks = [];
        state.doc.descendants((node, pos) => {
            node.type.isTextblock && node.type.spec.code && codeblocks.push({ node, pos });
            return node.isBlock;
        });
        this.codeblocks = codeblocks.map(({ pos }) => pos);
        this.decorations = prosemirror_view_1.DecorationSet.create(state.doc, this.getDecorations(codeblocks));
    }
    applyTransaction(tr) {
        let imported = tr.getMeta(exports.SyntaxHighlightKey);
        if (imported === undefined && tr.docChanged === false)
            return this;
        this.decorations = this.decorations.map(tr.mapping, tr.doc);
        if (imported) {
            let modified = this.codeblocks.map(pos => ({ node: tr.doc.resolve(pos + 1).parent, pos }))
                .filter(({ node }) => imported.includes((0, findLanguage_js_1.findLanguage)(node.attrs.lang || defaultLang[node.type.name])));
            this.decorations = this.decorations.add(tr.doc, this.getDecorations(modified));
            return this;
        }
        else if (tr.docChanged) {
            const mappedPos = this.codeblocks.map(pos => tr.mapping.mapResult(pos));
            this.codeblocks = mappedPos.reduce((codeblocks, { deleted, pos }) => deleted ? codeblocks : codeblocks.concat([pos]), []);
            const deleted = mappedPos.reduce((codeblocks, { deleted, pos }) => deleted ? codeblocks.concat([pos]) : codeblocks, []);
            const removed = deleted.map(pos => this.decorations.find(pos, pos - tr.doc.resolve(pos).parentOffset + tr.doc.resolve(pos).parent.nodeSize)).flat();
            this.decorations = this.decorations.remove(removed);
            const trRanges = replacedRanges(tr);
            const modifiedCodeblocks = new Map();
            trRanges.forEach(({ from, to }) => tr.doc.nodesBetween(from, to, (node, pos) => {
                node.type.isTextblock && node.type.spec.code && modifiedCodeblocks.set(pos, { node, pos });
                return node.isBlock;
            }));
            let modified = Array.from(modifiedCodeblocks.values());
            if (modified.length === 0)
                return this;
            this.codeblocks = Array.from(new Set(this.codeblocks.concat(modified.map(({ pos }) => pos))));
            let oldDecos = modified.map(({ node, pos }) => this.decorations.find(pos + 1, pos + node.nodeSize - 1)).flat();
            let newDecos = this.getDecorations(modified);
            const diff = diffDecorationSets(oldDecos, newDecos);
            this.decorations = this.decorations.remove(diff.diffA).add(tr.doc, diff.diffB);
            return this;
        }
    }
    getDecorations(nodePos) {
        let decorations = [];
        let languagesToImport = new Set();
        nodePos.forEach(({ node, pos }) => {
            let lang = (0, findLanguage_js_1.findLanguage)(node.attrs.lang || defaultLang[node.type.name]);
            if (lang) {
                if (lang.support) {
                    decorations.push(prosemirror_view_1.Decoration.node(pos, pos + node.nodeSize, { class: `language-${lang.name.toLowerCase()}` }));
                    let startPos = pos + 1;
                    (0, exports.syntaxHighlight)(node.textContent, lang.support, ({ from, to, style }) => style && decorations.push(prosemirror_view_1.Decoration.inline(startPos + from, startPos + to, { class: style })));
                }
                else {
                    languagesToImport.add(lang);
                }
            }
            if (node.attrs.lineNumbers) {
                const lines = node.textContent.split(/\n/);
                const lineWidth = lines.length.toString().length;
                let startPos = pos + 1;
                lines.forEach((line, index) => {
                    decorations.push(prosemirror_view_1.Decoration.widget(startPos, lineNumberSpan(index + 1, lineWidth), { side: -1, ignoreSelection: true }));
                    startPos += line.length + 1;
                });
            }
        });
        this.languagesToImport = languagesToImport;
        return decorations;
    }
}
exports.SyntaxHighlightState = SyntaxHighlightState;
function lineNumberSpan(index, lineWidth) {
    return function () {
        const span = document.createElement("span");
        span.className = "ProseMirror-linenumber";
        span.innerText = "" + index;
        Object.assign(span.style, { display: "inline-block", width: lineWidth + "ch", "user-select": "none" });
        return span;
    };
}
const defaultLang = {
    "codeblock": null,
    "mathblock": "latex",
};
const prosemirror_transform_1 = require("prosemirror-transform");
function replacedRanges(tr) {
    var ranges = [];
    for (var i = 0; i < tr.steps.length; i++) {
        var step = tr.steps[i], stepMap = step.getMap();
        if (step instanceof prosemirror_transform_1.ReplaceStep || step instanceof prosemirror_transform_1.ReplaceAroundStep) {
            ranges.push({ from: step.from, to: step.to, stepMap });
        }
        for (var j = 0; j < ranges.length; j++) {
            var range = ranges[j];
            range.from = stepMap.map(range.from, -1);
            range.to = stepMap.map(range.to, 1);
        }
    }
    return ranges;
}
function diffDecorationSets(a, b) {
    let diffA = [];
    let diffB = [];
    for (var i = 0, j = 0; i < a.length || j < b.length;) {
        if (j >= b.length) {
            diffA.push(a[i]);
            i++;
            continue;
        }
        if (i >= a.length) {
            diffB.push(b[j]);
            j++;
            continue;
        }
        if (a[i].eq(b[j])) {
            i++;
            j++;
            continue;
        }
        if (a[i].from < b[j].from) {
            diffA.push(a[i]);
            i++;
            continue;
        }
        if (a[i].from > b[j].from) {
            diffB.push(b[j]);
            j++;
            continue;
        }
        if (a[i].to < b[j].to) {
            diffA.push(a[i]);
            i++;
            continue;
        }
        if (a[i].to > b[j].to) {
            diffB.push(b[j]);
            j++;
            continue;
        }
        if (i < a.length) {
            diffA.push(a[i]);
            i++;
        }
        if (j < b.length) {
            diffB.push(b[j]);
            j++;
        }
    }
    return { diffA, diffB };
}
