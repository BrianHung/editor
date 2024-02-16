import { useEditorEventCallback } from '@nytimes/react-prosemirror';
import { EditorView } from 'prosemirror-view';
import React from 'react';

/**
 * Restores focus to the editor when it was focused but lost focus to UI.
 * https://github.com/ProseMirror/prosemirror-menu/blob/master/src/menu.ts
 * https://prosemirror.net/
 */
export const useEditorFocusRestore = function keepViewFocus() {
	const wasEditorFocusedOnOpen = React.useRef(false);

	const onOpenCheckFocus = useEditorEventCallback((view, event) => {
		wasEditorFocusedOnOpen.current = view != null && view.hasFocus();
	});

	const onCloseAutoFocus = useEditorEventCallback((view, event: FocusEvent) => {
		if (wasEditorFocusedOnOpen.current && view) {
			wasEditorFocusedOnOpen.current = false;
			event.preventDefault();
			view.focus();
		}
	});

	return {
		onOpenCheckFocus,
		onCloseAutoFocus,
	};
};

/**
 * Prevents editor blur on pointer down.
 * @returns
 */
export const usePointerDownKeepFocus = function keepViewFocus() {
	return useEditorEventCallback(function keepViewFocus(view, event: React.MouseEvent<HTMLDivElement>) {
		if (view && view.hasFocus()) {
			event.preventDefault();
			view.focus();
		}
	});
};

/**
 * Runs a command and focuses editor.
 * @param run
 * @returns
 */
export const useOnPointerDownFocusDispatch = function keepViewFocus(run: (view: EditorView, event) => void) {
	return useEditorEventCallback(function keepViewFocus(view, event: React.MouseEvent<HTMLDivElement>) {
		if (view == null) return;
		if (!view.hasFocus()) {
			event.preventDefault();
			view.focus();
		}
		run(view, event);
	});
};
