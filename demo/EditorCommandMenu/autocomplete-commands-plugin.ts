import { Autocomplete } from '@brianhung/editor-autocomplete';
import { PluginKey } from 'prosemirror-state';

export const AutocompleteCommandsKey = new PluginKey('AutocompleteCommands');

export const AutocompleteCommands = Autocomplete({
	regexp: /^\/([a-zA-Z0-9]*)?/,
	pluginKey: AutocompleteCommandsKey,
});
