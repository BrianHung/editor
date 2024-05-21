import { browser, markAttrs } from '@brianhung/editor';
import { useEditorEventCallback, useEditorState } from '@brianhung/editor-react';
import * as Popover from '@radix-ui/react-popover';
import React from 'react';
import CharacterIcon from './icons/character.svg?react';
import MultiplyIcon from './icons/multiply.svg?react';

/**
 * Same author behind both packages!
 *
 * TODO: use react-spectrum for color ui.
 * https://react-spectrum.adobe.com/react-aria/useColorArea.html
 * https://react-spectrum.adobe.com/react-aria/useColorField.html
 * https://react-spectrum.adobe.com/react-aria/useColorSlider.html
 * https://react-spectrum.adobe.com/react-aria/useColorWheel.html
 */
import { colord } from 'colord';
import { RgbStringColorPicker } from 'react-colorful';
import { useEditorFocusRestore } from './useEditorFocus';

export const TextColorIcon = React.memo(props => {
	const state = useEditorState();
	const attrs = props.textStyle ?? markAttrs(state, state.schema.marks.textStyle);
	const bttrs = props.highlight ?? markAttrs(state, state.schema.marks.highlight);
	return (
		<div
			style={{ color: attrs.color, backgroundColor: bttrs.color, borderRadius: '1px' }}
			className="h-4 w-4"
		>
			<CharacterIcon
				width="100%"
				height="100%"
			/>
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

const colorPickerStyle = `
	.react-colorful__saturation {
		border-radius: 0 !important;
		margin-bottom: 0px;
		box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 0px 0.6px inset !important;
		border-bottom: 0;
		height: 13rem !important;
	}

	.react-colorful__hue,
	.react-colorful__alpha {
		margin: 16px;
		border-radius: 12px !important;
		height: 12px !important;
		box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 0px 0.6px inset;
	}

	.react-colorful__pointer {
		width: 16px !important;
		height: 16px !important;
		box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 0px 0.6px;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`;

export const TextColorPopoverMenu = React.memo((props: TextColorMenuProps) => {
	const { TriggerAs = React.Fragment } = props;
	const color = props.color ? colord(props.color).toRgbString() : 'rgb(0, 0, 0)';
	const { onOpenCheckFocus, onCloseAutoFocus } = useEditorFocusRestore();

	const rgb = colord(color).toRgb();
	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<TriggerAs asChild>
					<button
						className={props.className}
						onPointerDown={onOpenCheckFocus}
					>
						<TextColorIcon />
					</button>
				</TriggerAs>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					className="shadow-dropdown-menu w-52 rounded-md bg-white"
					sideOffset={6}
					onCloseAutoFocus={onCloseAutoFocus}
				>
					<div className="flex h-9 select-none items-center px-1">
						<div className="flex grow items-center px-2.5 text-xs font-medium text-gray-500">Text color</div>
						<Popover.Close className="grid h-7 w-7 cursor-pointer place-items-center rounded-md border border-transparent text-gray-900 hover:bg-gray-200/50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 aria-checked:bg-gray-200 aria-pressed:bg-gray-200">
							<MultiplyIcon className="h-4 w-4" />
						</Popover.Close>
					</div>
					<style>{colorPickerStyle}</style>
					<RgbStringColorPicker
						color={colord(color).toRgbString()}
						onChange={props.onChange}
						style={{
							height: '15rem',
							width: '100%',
						}}
					/>
					<div className="flex h-8 items-center px-2 pb-3">
						<div className="flex h-7 w-16 select-none items-center px-2 text-xs">RGB</div>
						<div className="flex divide-x divide-solid divide-transparent overflow-hidden rounded-sm border border-transparent text-xs tabular-nums focus-within:divide-gray-200 focus-within:border-gray-200 hover:divide-gray-200 hover:border-gray-200">
							<input
								className="h-7 w-9 pl-2 focus-visible:outline-none"
								type="number"
								value={rgb.r}
								min={0}
								max={255}
								onChange={event => props.onChange(colord({ ...rgb, r: Number(event.target.value) }).toRgbString())}
							/>
							<input
								className="h-7 w-9 pl-2 focus-visible:outline-none"
								type="number"
								value={rgb.g}
								onChange={event => props.onChange(colord({ ...rgb, g: Number(event.target.value) }).toRgbString())}
								min={0}
								max={255}
							/>
							<input
								className="h-7 w-9 pl-2 focus-visible:outline-none"
								type="number"
								value={rgb.b}
								onChange={event => props.onChange(colord({ ...rgb, b: Number(event.target.value) }).toRgbString())}
								min={0}
								max={255}
							/>
						</div>
					</div>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
});
