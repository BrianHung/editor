import * as ContextMenu from '@radix-ui/react-context-menu';

export const ContextMenuImpl = props => {
	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger>{props.children}</ContextMenu.Trigger>
			<ContextMenu.Portal>
				<ContextMenu.ContextMenuContent className="shadow-dropdown-menu w-56 select-none rounded bg-white p-2 text-xs font-medium text-gray-500">
					Context Menu (WIP)
				</ContextMenu.ContextMenuContent>
			</ContextMenu.Portal>
		</ContextMenu.Root>
	);
};

export default ContextMenuImpl;
