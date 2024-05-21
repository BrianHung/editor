import { useEditorEffect } from '@brianhung/editor-react';
import React from 'react';

export const WindowView = React.memo(() => {
	useEditorEffect(view => {
		if (view === null) return;
		window.view = view;
		return () => {
			delete window.view;
		};
	}, []);

	return <></>;
});
