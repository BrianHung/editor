import { Editor } from '@brianhung/editor';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

export const ReactSyncExternalStoreKey = new PluginKey('ReactSyncExternalStore');

export type EditorListener = (view: EditorView, prevState?: EditorState) => void;
export type EditorSelector = <T>(selector: (state: any) => T, isEqual?: (state: any) => boolean) => T;

export const EditorContext = createContext<{
	editor: Editor | undefined;
	setEditor: (editor: Editor) => void;

	listeners: Set<EditorListener>;
	subscribe: (listener: EditorListener) => Function;

	ReactSyncExternalStorePlugin: Plugin;
}>(undefined);

EditorContext.displayName = 'EditorContext';

export const useEditorContext = () => {
	const context = useContext(EditorContext);
	if (!context) {
		throw Error('EditorContext is not defined. Did you forget to wrap your component in an EditorProvider?');
	}
	return context;
};

/**
 * Alternatively called `useEditorView`.
 */
export const useEditor: EditorSelector = (
	selector: (view: EditorView) => any = view => view,
	isEqual?: (view: EditorView) => boolean
) => {
	const context = useEditorContext();
	return useSyncExternalStoreWithSelector(context.subscribe, () => context.editor, null, selector, isEqual);
};

export const useEditorView = useEditor;

export const useEditorState: EditorSelector = (
	selector: (state: EditorState) => any = state => state,
	isEqual?: (state: EditorState) => boolean
) => {
	const context = useEditorContext();
	return useSyncExternalStoreWithSelector(context.subscribe, () => context.editor?.state, null, selector, isEqual);
};

class StateListenerView {
	constructor(
		readonly view: EditorView,
		readonly listeners: Set<EditorListener>
	) {
		listeners.forEach(l => l(view, undefined));
	}
	update(view, prevState) {
		this.listeners.forEach(l => l(view, prevState));
	}
	destroy() {
		const view = this.view;
		this.listeners.forEach(l => l(view, undefined));
	}
}

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
	const [editor, setEditor] = useState<Editor | undefined>(undefined);

	const [listeners, subscribe, ReactSyncExternalStorePlugin] = useMemo(() => {
		const listeners = new Set<EditorListener>();
		const subscribe = (listener: EditorListener) => {
			listeners.add(listener);
			return () => listeners.delete(listener);
		};

		/**
		 * Direct plugin that updates all editor selectors.
		 * https://prosemirror.net/docs/ref/#view.DirectEditorProps.plugins
		 */
		const ReactSyncExternalStorePlugin = new Plugin({
			key: ReactSyncExternalStoreKey,
			view: view => new StateListenerView(view, listeners),
		});

		return [listeners, subscribe, ReactSyncExternalStorePlugin];
	}, []);

	return (
		<EditorContext.Provider
			value={{
				editor,
				setEditor,
				listeners,
				subscribe,
				ReactSyncExternalStorePlugin,
			}}
		>
			{children}
		</EditorContext.Provider>
	);
};
