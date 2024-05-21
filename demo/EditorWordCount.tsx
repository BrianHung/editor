import { WordCount, WordCountKey } from '@brianhung/editor';
import { EditorState } from 'prosemirror-state';
import React from 'react';

/**
 * Ask @nytimes/react-prosemirror for better way to dynamically set and unset plugins.
 * @returns
 */
export const EditorWordCount = ({
	state,
	setState,
}: {
	state: EditorState;
	setState: (state: EditorState) => EditorState;
}) => {
	const count = WordCountKey.getState(state);

	React.useEffect(function initPlugin() {
		const plugin = WordCount();
		setState(state =>
			state.reconfigure({
				plugins: state.plugins.concat([plugin]),
			})
		);
		return () => {
			setState(state =>
				state.reconfigure({
					plugins: state.plugins.filter(p => p !== plugin),
				})
			);
		};
	}, []);

	return (
		<div className="select-none space-x-2 px-4 py-2 text-right text-xs tabular-nums text-gray-400">
			{count && (
				<>
					{/* <span>Characters: {count.characters}</span> */}
					<span>Word count: {count.words}</span>
					{/* <span>Sentences: {count.sentences}</span> */}
				</>
			)}
		</div>
	);
};

export default EditorWordCount;
