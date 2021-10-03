"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLanguage = exports.syntaxHighlight = exports.highlightStyle = exports.CodeMirrorSyntaxHighlight = void 0;
var SyntaxHighlightPlugin_js_1 = require("./SyntaxHighlightPlugin.js");
Object.defineProperty(exports, "CodeMirrorSyntaxHighlight", { enumerable: true, get: function () { return __importDefault(SyntaxHighlightPlugin_js_1).default; } });
var highlightStyle_js_1 = require("./highlightStyle.js");
Object.defineProperty(exports, "highlightStyle", { enumerable: true, get: function () { return highlightStyle_js_1.highlightStyle; } });
var syntaxHighlight_js_1 = require("./syntaxHighlight.js");
Object.defineProperty(exports, "syntaxHighlight", { enumerable: true, get: function () { return syntaxHighlight_js_1.syntaxHighlight; } });
var findLanguage_js_1 = require("./findLanguage.js");
Object.defineProperty(exports, "findLanguage", { enumerable: true, get: function () { return findLanguage_js_1.findLanguage; } });
