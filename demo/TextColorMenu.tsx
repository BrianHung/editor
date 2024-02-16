import { browser, markAttrs } from '@brianhung/editor';
import { useEditorEventCallback, useEditorState } from '@brianhung/editor-react';
import * as Popover from '@radix-ui/react-popover';
import React from 'react';
import CharacterIcon from './icons/character.svg?react';

/**
 * Same author behind both packages!
 */
import { colord } from 'colord';
import { RgbStringColorPicker } from 'react-colorful';
import { useEditorFocusRestore } from './useEditorFocus';

export const TextColorIcon = React.memo(props => {
	const state = useEditorState();
	const attrs = props.textStyle ?? markAttrs(state, state.schema.marks.textStyle);
	const bttrs = props.highlight ?? markAttrs(state, state.schema.marks.highlight);
	return (
		<div style={{ color: attrs.color, backgroundColor: bttrs.color, borderRadius: '1px' }} className="h-4 w-4">
			<CharacterIcon width="100%" height="100%" />
		</div>
	);
});

export interface TextColorMenuProps {
	className: string;
	onChange: (color: string) => void;
	color: string;
	TriggerAs?: React.ComponentType<{ asChild?: boolean }>;
}

/**
 * Example of a custom icon that changes color based on the current text color.
 * Depends on how color and backgroundColor are implemented in the schema!
 */
export const TextColorMenu = React.memo(props => {
	const { TriggerAs = React.Fragment } = props;

	const state = useEditorState();
	const attrs = markAttrs(state, state.schema.marks.textStyle);
	const bttrs = markAttrs(state, state.schema.marks.highlight);

	const onColorChange = useEditorEventCallback((view, color: string) => {
		color = colord(color).toRgbString(); // normalize to rgb
		const colorMark = state.schema.marks.textStyle.create({ color });
		const { selection, tr } = view.state;
		if (selection.empty) {
			tr.addStoredMark(colorMark);
		} else {
			tr.addMark(selection.from, selection.to, colorMark);
		}
		view.dispatch(tr);
	});

	const menuProps: TextColorMenuProps = {
		className: props.className,
		color: attrs.color,
		onChange: onColorChange,
		TriggerAs,
	};

	if (browser.ios) {
		return <TextColorMobileMenu {...menuProps} />;
	}
	return <TextColorPopoverMenu {...menuProps} />;
});

/**
 * iOS input color is pretty nice, so we can use that instead of a custom color picker.
 */
export const TextColorMobileMenu = React.memo((props: TextColorMenuProps) => {
	const { TriggerAs = React.Fragment } = props;
	const color = props.color ? colord(props.color).toHex() : '#000000';
	const { onOpenCheckFocus, onCloseAutoFocus } = useEditorFocusRestore();
	return (
		<div className="relative">
			<TriggerAs asChild>
				<button className={props.className}>
					<TextColorIcon />
				</button>
			</TriggerAs>
			<input
				type="color"
				value={color}
				onChange={event => props.onChange(colord(event.target.value).toRgbString())}
				className="absolute inset-0 h-full w-full opacity-0"
				tabIndex={-1}
				onFocus={onOpenCheckFocus}
				onBlur={onCloseAutoFocus}
			/>
		</div>
	);
});

export const TextColorPopoverMenu = React.memo((props: TextColorMenuProps) => {
	const { TriggerAs = React.Fragment } = props;
	const color = props.color ? colord(props.color).toRgbString() : 'rgb(0, 0, 0)';
	const { onOpenCheckFocus, onCloseAutoFocus } = useEditorFocusRestore();
	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<TriggerAs asChild>
					<button className={props.className} onPointerDown={onOpenCheckFocus}>
						<TextColorIcon />
					</button>
				</TriggerAs>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					className="shadow-dropdown-menu w-52 rounded bg-white"
					sideOffset={4}
					onCloseAutoFocus={onCloseAutoFocus}
				>
					<RgbStringColorPicker
						className="!h-64 !w-full"
						color={colord(color).toRgbString()}
						onChange={props.onChange}
					/>
					<div className="mx-1.5 flex items-center">
						<div style={{ backgroundColor: color }} className="h-5 w-5 shrink-0 rounded-sm border border-gray-200" />
						<div className="flex h-7 w-full select-none items-center justify-center text-xs tabular-nums">{color}</div>
					</div>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
});
