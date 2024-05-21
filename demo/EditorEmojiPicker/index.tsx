import type { Editor } from '@brianhung/editor';
import { Autocomplete } from '@brianhung/editor-autocomplete';
import Tippy from '@tippyjs/react';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { EmojiObject, EmojiPicker, EmojiPickerRef, throttleIdleTask, unifiedToNative } from 'react-twemoji-picker';
import emojiData from 'react-twemoji-picker/data/twemoji.json';
import { Placement } from 'tippy.js';
import 'tippy.js/animations/shift-away.css';

export const EditorEmojiPicker = memo(({ editor }: { editor: Editor }): JSX.Element => {
	const [range, setRange] = useState<{ from: Number; to: Number } | null>(null);
	const picker = useRef<EmojiPickerRef>();

	// keep reference to same function to throttle
	const throttledQuery = useCallback(
		throttleIdleTask((query: string) => picker.current?.search(query)),
		[picker.current]
	);

	const onKeyDown = ({ event }: { event: KeyboardEvent }) => {
		if (!['Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return false;
		// @ts-ignore
		picker.current.handleKeyDownScroll(event);
		event.key == 'Enter' && picker.current.search('');
		return true;
	};

	useEffect(() => {
		editor.registerPlugin(
			Autocomplete({
				matcher: /\:([a-zA-Z]+)/,
				onEnter: ({ query, range }) => {
					setRange(range);
					throttledQuery(query.toLowerCase());
				},
				onChange: ({ query, range }) => {
					setRange(range);
					throttledQuery(query.toLowerCase());
				},
				onLeave: ({ query, range }) => {
					setRange(null);
				},
				onKeyDown,
			})
		);
	}, [editor]);

	const onEmojiSelect = (emoji: EmojiObject): void => {
		const {
			state: { tr },
			dispatch,
		} = editor.view;
		dispatch(tr.insertText(unifiedToNative(emoji.unicode), range.from, range.to));
	};

	const getReferenceClientRect = (): DOMRect => {
		const refElement = editor.view.dom.querySelector(`.ProseMirror-autocomplete`);
		// avoid shifts in transformX between onChange
		if (refElement)
			return Object.assign(refElement.getBoundingClientRect().toJSON(), {
				width: 0,
			});
		return new DOMRect(-9999, -9999, 0, 0);
	};

	const tippyProps = {
		getReferenceClientRect,
		arrow: false,
		interactive: true,
		placement: 'bottom-start' as Placement,
		maxWidth: 'none',
		animation: 'shift-away',
		duration: 100,
		visible: range !== null,
		reference: editor.view.dom,
		theme: '@editor-command-menu',
	};

	const emojiPickerProps = {
		ref: picker,
		emojiData,
		onEmojiSelect,
		showNavbar: false,
		showFooter: false,
		collapseHeightOnSearch: true,
		numberScrollRows: 6,
		emojisPerRow: 10,
	};

	return (
		<Tippy
			{...tippyProps}
			content={
				<div className="@editor-emoji-menu">
					<EmojiPicker {...emojiPickerProps} />
				</div>
			}
		/>
	);
});
