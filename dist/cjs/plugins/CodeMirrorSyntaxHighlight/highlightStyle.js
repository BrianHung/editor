"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highlightStyle = void 0;
const highlight_1 = require("@codemirror/highlight");
exports.highlightStyle = highlight_1.HighlightStyle.define([
    { tag: highlight_1.tags.link, class: "cm-link" },
    { tag: highlight_1.tags.heading, class: "cm-heading" },
    { tag: highlight_1.tags.emphasis, class: "cm-emphasis" },
    { tag: highlight_1.tags.strong, class: "cm-strong" },
    { tag: highlight_1.tags.keyword, class: "cm-keyword" },
    { tag: highlight_1.tags.atom, class: "cm-atom" },
    { tag: highlight_1.tags.bool, class: "cm-bool" },
    { tag: highlight_1.tags.url, class: "cm-url" },
    { tag: highlight_1.tags.labelName, class: "cm-labelName" },
    { tag: highlight_1.tags.inserted, class: "cm-inserted" },
    { tag: highlight_1.tags.deleted, class: "cm-deleted" },
    { tag: highlight_1.tags.literal, class: "cm-literal" },
    { tag: highlight_1.tags.string, class: "cm-string" },
    { tag: highlight_1.tags.number, class: "cm-number" },
    { tag: [highlight_1.tags.regexp, highlight_1.tags.escape, highlight_1.tags.special(highlight_1.tags.string)], class: "cm-string2" },
    { tag: highlight_1.tags.variableName, class: "cm-variableName" },
    { tag: highlight_1.tags.local(highlight_1.tags.variableName), class: "cm-variableName cm-local" },
    { tag: highlight_1.tags.definition(highlight_1.tags.variableName), class: "cm-variableName cm-definition" },
    { tag: highlight_1.tags.special(highlight_1.tags.variableName), class: "cm-variableName" },
    { tag: highlight_1.tags.typeName, class: "cm-typeName" },
    { tag: highlight_1.tags.namespace, class: "cm-namespace" },
    { tag: highlight_1.tags.macroName, class: "cm-macroName" },
    { tag: highlight_1.tags.definition(highlight_1.tags.propertyName), class: "cm-propertyName" },
    { tag: highlight_1.tags.operator, class: "cm-operator" },
    { tag: highlight_1.tags.comment, class: "cm-comment" },
    { tag: highlight_1.tags.meta, class: "cm-meta" },
    { tag: highlight_1.tags.invalid, class: "cm-invalid" },
    { tag: highlight_1.tags.punctuation, class: "cm-punctuation" },
    { tag: highlight_1.tags.modifier, class: "cm-modifier" },
    { tag: highlight_1.tags.function(highlight_1.tags.definition(highlight_1.tags.variableName)), class: "cm-function cm-definition" },
    { tag: highlight_1.tags.definition(highlight_1.tags.className), class: "cm-class cm-definition" },
    { tag: highlight_1.tags.operatorKeyword, class: "cm-operator" },
]);
