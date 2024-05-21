import { browser } from '@brianhung/editor';
import React from 'react';
import { SelectionToolbarPositioner } from '../EditorSelectionTooltip';
import Toolbar from '../EditorToolbar';

export const EditorFloatingToolbar = React.memo(() => {
	if (browser.ios) return <></>;
	return (
		<SelectionToolbarPositioner
			hideWhenBlurred={true}
			id="editor-floating-toolbar"
			className="shadow-dropdown-menu absolute flex h-9 select-none items-center justify-center overflow-y-hidden overscroll-contain rounded-lg bg-white [overflow-x:overlay]"
		>
			<Toolbar className="sticky top-0 flex items-center rounded-md bg-white px-1 py-2 [overflow:overlay] [&_button]:shrink-0" />
		</SelectionToolbarPositioner>
	);
});

export default EditorFloatingToolbar;
