import { defaultBlockAt } from '@brianhung/editor';
import { EditorView as CodeMirror, KeyBinding, keymap as cmKeymap, ViewUpdate } from '@codemirror/view';
import { exitCode, selectParentNode } from 'prosemirror-commands';
import { GapCursor } from 'prosemirror-gapcursor';
import { redo, undo } from 'prosemirror-history';
import { Node } from 'prosemirror-model';
import { Command, Selection, TextSelection } from 'prosemirror-state';
import { Decoration, DecorationSource, EditorView } from 'prosemirror-view';
import { basicSetup } from './CodeMirror';

/**
 * Replaces current codeblock with a default block.
 * Similar to exitCode and createParagraphNear.
 * @param state
 * @param dispatch
 * @returns
 */
export const createDefaultTextBlock: Command = (state, dispatch) => {
	let { $head, $anchor } = state.selection;
	const parent = $head.parent;
	if (!$head.parent.type.spec.code || !$head.sameParent($anchor)) return false;
	let above = $head.node(-1),
		after = $head.indexAfter(-1),
		type = defaultBlockAt(above.contentMatchAt(after));
	if (!type || !type.isTextblock || !above.canReplaceWith(after, after, type)) return false;
	if (dispatch) {
		let pos = $head.before(),
			tr = state.tr.replaceWith(
				pos,
				$head.after(),
				type.createAndFill(undefined, parent.textContent ? state.schema.text($head.parent.textContent) : undefined)!
			);
		tr.setSelection(Selection.near(tr.doc.resolve(pos + 1), 1));
		dispatch(tr.scrollIntoView());
	}
	return true;
};

/**
 * An extensible and reusable CodeMirror view for ProseMirror.
 * Only needs to be mounted with dom.
 */
export class CodeMirrorView {
	public node: Node;
	public view: EditorView;
	public getPos: () => number | undefined;

	public cmView: CodeMirror;
	private updating: boolean;

	constructor(
		node: Node,
		view: EditorView,
		getPos: () => number | undefined,
		decorations?: readonly Decoration[],
		innerDecorations?: DecorationSource
	) {
		this.node = node;
		this.view = view;
		this.getPos = getPos;

		this.cmView = new CodeMirror({
			doc: this.node.textContent,
			// extensions should be extensible for theming etc.
			extensions: this.cmExtensions,
		});

		// This flag is used to avoid an update loop between the outer and
		// inner editor
		this.updating = false;
	}

	// Override this to provide custom extensions into CodeMirror.
	get cmExtensions() {
		return [cmKeymap.of(this.keymap()), CodeMirror.updateListener.of(this.forwardUpdate.bind(this)), basicSetup];
	}

	public forwardUpdate(update: ViewUpdate) {
		if (this.updating || !this.cmView.hasFocus) return;
		let offset = this.getPos()! + 1,
			{ main } = update.state.selection;
		let selFrom = offset + main.from,
			selTo = offset + main.to;
		let pmSel = this.view.state.selection;
		if (update.docChanged || pmSel.from != selFrom || pmSel.to != selTo) {
			let tr = this.view.state.tr;
			update.changes.iterChanges((fromA, toA, fromB, toB, text) => {
				if (text.length) tr.replaceWith(offset + fromA, offset + toA, this.view.state.schema.text(text.toString()));
				else tr.delete(offset + fromA, offset + toA);
				offset += toB - fromB - (toA - fromA);
			});
			tr.setSelection(TextSelection.create(tr.doc, selFrom, selTo));
			this.view.dispatch(tr);
		}
	}

	setSelection(anchor: number, head: number) {
		this.cmView.focus();
		this.updating = true;
		this.cmView.dispatch({ selection: { anchor, head } });
		this.updating = false;
	}

	ignoreMutation(mutation: MutationRecord) {
		return true;
	}

	stopEvent(event: Event) {
		return this.cmView && this.cmView.dom.contains((event as any).target);
	}

	// Override this if you have custom attrs.
	// If overridden, you probably want to make sure this ends up calling updateInner.
	update(node: Node) {
		if (node.type != this.node.type) return false;
		this.node = node;
		this.updateInner(node);
		return true;
	}

	public updateInner(node: Node) {
		if (this.updating) return;
		let newText = node.textContent,
			curText = this.cmView.state.doc.toString();
		if (newText != curText) {
			let start = 0,
				curEnd = curText.length,
				newEnd = newText.length;
			while (start < curEnd && curText.charCodeAt(start) == newText.charCodeAt(start)) {
				++start;
			}
			while (curEnd > start && newEnd > start && curText.charCodeAt(curEnd - 1) == newText.charCodeAt(newEnd - 1)) {
				curEnd--;
				newEnd--;
			}
			this.updating = true;
			this.cmView.dispatch({
				changes: {
					from: start,
					to: curEnd,
					insert: newText.slice(start, newEnd),
				},
			});
			this.updating = false;
		}
	}

	maybeEscape(unit: 'line' | 'char', dir: -1 | 1) {
		let { state } = this.cmView,
			{ main } = state.selection;
		if (!main.empty) return false;
		if (unit == 'line') main = state.doc.lineAt(main.head);
		if (dir < 0 ? main.from > 0 : main.to < state.doc.length) return false;
		let targetPos = this.getPos()! + (dir < 0 ? 0 : this.node.nodeSize);
		let selection = Selection.near(this.view.state.doc.resolve(targetPos), dir);
		if (selection.eq(this.view.state.selection)) {
			let sel = this.view.state.selection;
			let $start = dir > 0 ? sel.$to : sel.$from;
			let $found = GapCursor.findGapCursorFrom($start, dir, false);
			if ($found) {
				selection = new GapCursor($found);
			}
		}
		let tr = this.view.state.tr.setSelection(selection).scrollIntoView();
		this.view.dispatch(tr);
		this.view.focus();
		return true;
	}

	// Should be prioritized over default keymap.
	public keymap(): KeyBinding[] {
		let view = this.view;
		return [
			{ key: 'ArrowUp', run: () => this.maybeEscape('line', -1) },
			{ key: 'ArrowLeft', run: () => this.maybeEscape('char', -1) },
			{ key: 'ArrowDown', run: () => this.maybeEscape('line', 1) },
			{ key: 'ArrowRight', run: () => this.maybeEscape('char', 1) },
			{
				key: 'Ctrl-Enter',
				run: () => {
					if (!exitCode(view.state, view.dispatch)) return false;
					view.focus();
					return true;
				},
			},
			{ key: 'Ctrl-z', mac: 'Cmd-z', run: () => undo(view.state, view.dispatch) },
			{ key: 'Shift-Ctrl-z', mac: 'Shift-Cmd-z', run: () => redo(view.state, view.dispatch) },
			{ key: 'Ctrl-y', mac: 'Cmd-y', run: () => redo(view.state, view.dispatch) },
			{
				key: 'Backspace',
				run: cmView => {
					const isEmpty = cmView.state.doc.length == 0;
					if (!isEmpty || !createDefaultTextBlock(view.state, view.dispatch)) return false;
					view.focus();
					return true;
				},
			},
			{
				key: 'Escape',
				run: () => {
					if (!selectParentNode(view.state, view.dispatch)) return false;
					view.focus();
					return true;
				},
			},
		];
	}

	destroy() {
		this.cmView.destroy();
		this.view.focus();
	}
}
