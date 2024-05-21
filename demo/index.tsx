import React from 'react';
import { createRoot } from 'react-dom/client';
import { EditorDemo } from './EditorDemo';
import './index.css';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
	<React.StrictMode>
		<EditorDemo />
	</React.StrictMode>
);
