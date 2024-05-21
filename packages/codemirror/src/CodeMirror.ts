import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import {
	bracketMatching,
	defaultHighlightStyle,
	foldGutter,
	foldKeymap,
	indentOnInput,
	LanguageDescription,
	syntaxHighlighting,
} from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { lintKeymap } from '@codemirror/lint';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { Compartment, EditorState, Extension } from '@codemirror/state';
import {
	crosshairCursor,
	drawSelection,
	dropCursor,
	EditorView,
	gutter,
	gutters,
	highlightActiveLineGutter,
	highlightSpecialChars,
	keymap,
	lineNumbers,
	placeholder,
	rectangularSelection,
} from '@codemirror/view';

export const language = new Compartment();
export const lineNumber = new Compartment();
export const lineWrapping = new Compartment();
export const editable = new Compartment();

export function setLanguage(view: EditorView, name: string) {
	const lang =
		LanguageDescription.matchFilename(languages, name) || LanguageDescription.matchLanguageName(languages, name);
	if (lang) {
		lang.load().then(support =>
			view.dispatch({
				effects: language.reconfigure(support),
			})
		);
	}
}

export function setLineNumbers(view: EditorView, value: boolean) {
	view.dispatch({
		effects: lineNumber.reconfigure(value ? lineNumbers() : []),
	});
}

export function setLineWrapping(view: EditorView, value: boolean) {
	view.dispatch({
		effects: lineWrapping.reconfigure(value ? EditorView.lineWrapping : []),
	});
}

const guttersExtension = [lineNumbers(), highlightActiveLineGutter(), gutter({ class: 'cm-gutter' })];
const folding = [foldGutter()];

/**
 * Basic setup copied and pasted.
 * https://github.com/codemirror/basic-setup/blob/main/src/codemirror.ts
 */
export const basicSetup: Extension = (() => [
	gutters(),
	highlightSpecialChars(),
	history(),
	drawSelection(),
	dropCursor(),
	EditorState.allowMultipleSelections.of(true),
	indentOnInput(),
	syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
	bracketMatching(),
	closeBrackets(),
	autocompletion(),
	rectangularSelection(),
	crosshairCursor(),
	// highlightActiveLine(),
	highlightSelectionMatches(),
	keymap.of([
		...closeBracketsKeymap,
		...defaultKeymap,
		...searchKeymap,
		...historyKeymap,
		...foldKeymap,
		...completionKeymap,
		...lintKeymap,
		indentWithTab,
	]),
	placeholder('Add code'),
])();

export const minimalSetup: Extension = (() => [
	highlightSpecialChars(),
	history(),
	drawSelection(),
	syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
	keymap.of([...defaultKeymap, ...historyKeymap]),
])();

export const viewExtensions = [
	EditorView.theme({
		'&': {
			fontSize: '0.85rem',
		},
		'&.cm-focused': {
			outline: 'none',
		},
		'.cm-scroller': {
			padding: '1rem 0px 1rem 0px',
			lineHeight: '1.5',
			fontFamily: 'inherit',
		},
		'.cm-gutters': {
			borderRight: 'none',
			backgroundColor: 'transparent',
			color: '#a3a3a3',
			minWidth: '1rem' /* pseudo-padding so same width if lineNumbers */,
		},
		'.cm-activeLineGutter': {
			backgroundColor: '#cceeff44',
		},
		'.cm-placeholder': {
			color: '#a3a3a3',
		},
		'&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
			backgroundColor: '#bae6fdbf',
		},
		'& .cm-line': {
			padding: '0 0.6px' /* min-padding is 0.6px because that is cm-cursor width */,
		},
		'.cm-gutter.cm-lineNumbers': {
			padding: '0 0.50rem',
		},
	}),
];
