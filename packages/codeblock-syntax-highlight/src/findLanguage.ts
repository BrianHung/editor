import { LanguageDescription } from '@codemirror/language';
import { languages } from '@codemirror/language-data';

export function findLanguage(mode: string) {
	return LanguageDescription.matchFilename(languages, mode) || LanguageDescription.matchLanguageName(languages, mode);
}
