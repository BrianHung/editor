"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLanguage = exports.syntaxHighlight = exports.highlightStyle = exports.CodeMirrorSyntaxHighlight = void 0;
var SyntaxHighlightPlugin_1 = require("./SyntaxHighlightPlugin");
Object.defineProperty(exports, "CodeMirrorSyntaxHighlight", { enumerable: true, get: function () { return __importDefault(SyntaxHighlightPlugin_1).default; } });
var highlightStyle_1 = require("./highlightStyle");
Object.defineProperty(exports, "highlightStyle", { enumerable: true, get: function () { return highlightStyle_1.highlightStyle; } });
var syntaxHighlight_1 = require("./syntaxHighlight");
Object.defineProperty(exports, "syntaxHighlight", { enumerable: true, get: function () { return syntaxHighlight_1.syntaxHighlight; } });
var findLanguage_1 = require("./findLanguage");
Object.defineProperty(exports, "findLanguage", { enumerable: true, get: function () { return findLanguage_1.findLanguage; } });
