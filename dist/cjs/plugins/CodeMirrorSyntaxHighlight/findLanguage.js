"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLanguage = void 0;
const language_1 = require("@codemirror/language");
const language_data_1 = require("@codemirror/language-data");
function findLanguage(mode) {
    return mode && (language_1.LanguageDescription.matchFilename(language_data_1.languages, mode) ||
        language_1.LanguageDescription.matchLanguageName(language_data_1.languages, mode));
}
exports.findLanguage = findLanguage;
