import type { Command } from 'prosemirror-state';

export type MarksJSONContent = {
	type: string;
	attrs?: Record<string, any>;
	[key: string]: any;
};

export type JSONContent = {
	type?: string;
	attrs?: Record<string, any>;
	content?: JSONContent[];
	marks?: MarksJSONContent[];
	text?: string;
	[key: string]: any;
};

export type MarkView = { dom: HTMLElement; contentDOM?: HTMLElement };

export type Keymap = { [key: string]: Command };
