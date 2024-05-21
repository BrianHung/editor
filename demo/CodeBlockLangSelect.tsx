import { languages as cmLanguages } from '@codemirror/language-data';
const supported = new Set(cmLanguages.map(lang => lang.name));

import React from 'react';
// import { ComboBox, Item, Section } from '@adobe/react-spectrum';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as Select from '@radix-ui/react-select';

const languages = [
	'C',
	'C++',
	'CSS',
	'Go',
	'HTML',
	'Java',
	'JavaScript',
	'JSON',
	'JSX',
	'Markdown',
	'PHP',
	'Python',
	'Rust',
	'SQL',
	'TSX',
	'TypeScript',
	'WebAssembly',
	'YAML',
	'C#',
	'Clojure',
	'Lisp',
	'Diff',
];

const supportedLanguages = cmLanguages
	.map(lang => lang.name)
	.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

export const CodeBlockLangSelect = React.memo(props => {
	return (
		<Select.Root value="Python">
			<Select.Trigger
				className="flex h-8 w-fit items-center space-x-1 rounded-sm px-2 text-sm hover:bg-gray-200/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 disabled:text-gray-300 disabled:hover:bg-gray-100"
				aria-label="codeblock language"
			>
				<Select.Value placeholder="language" />
				<Select.Icon className="text-gray-400">
					<ChevronDownIcon />
				</Select.Icon>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content className="shadow-dropdown-menu w-60 select-none rounded bg-white text-sm">
					<Select.ScrollUpButton className="grid place-items-center">
						<ChevronUpIcon className="text-gray-400" />
					</Select.ScrollUpButton>
					<Select.Viewport className="max-h-[50vh] py-1">
						{supportedLanguages.map(lang => (
							<SelectItem value={lang}>{lang}</SelectItem>
						))}
					</Select.Viewport>
					<Select.ScrollDownButton className="grid place-items-center">
						<ChevronDownIcon className="text-gray-400" />
					</Select.ScrollDownButton>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
});

const SelectItem = React.forwardRef<any, React.PropsWithChildren & { className: string }>(
	({ children, className, ...props }, forwardedRef) => {
		return (
			<Select.Item
				className={
					'data-[highlighted,state="checked"]:bg-sky-300 mx-1 flex h-7 cursor-pointer items-center space-x-1.5 rounded px-2.5 capitalize transition-colors duration-[25ms] focus-visible:outline-0 data-[highlighted]:bg-sky-100 data-[state="checked"]:bg-sky-200'
				}
				{...props}
				ref={forwardedRef}
			>
				<div className="box-content h-4 w-4">
					<Select.ItemIndicator className="">
						<CheckIcon />
					</Select.ItemIndicator>
				</div>
				<Select.ItemText>{children}</Select.ItemText>
			</Select.Item>
		);
	}
);
