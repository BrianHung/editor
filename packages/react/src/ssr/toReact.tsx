import type { Node as PMNode } from 'prosemirror-model';
import React, { useEffect, useState } from 'react';

export const Text: FC = ({ node: PMNode }) => {
	return node.textContent;
};

export const Paragraph = ({ node: PMNode, children }) => {
	return <p>{children}</p>;
};

export const Heading = ({ node: PMNode, children }) => {
	const HeadingTag = `h${node.attrs.level}` as keyof JSX.IntrinsicElements;
	return <HeadingTag>{children}</HeadingTag>;
};

function CodeBlock(node: PMNode) {
	const [text, setText] = useState(node.attrs.text);

	const syntaxHighlight = async () => {
		const language = CodeMirror.findLanguage(node.attrs.lang);
		const tokens = [];
		CodeMirror.syntaxHighlight(node.attrs.text, language.support, ({ token, style }) =>
			style ? <span className={style}>{token}</span> : token
		);
		setText(tokens);
	};

	useEffect(() => {
		syntaxHighlight();
	}, []);

	return (
		<pre
			className="codeblock"
			data-language={node.attrs.lang || null}
		>
			<code>{text}</code>
		</pre>
	);
}

export const Doc: FC = ({ node, ...props }) => {
	const content = node.content;

	if (!content || content.length === 0) {
		return null;
	}

	const children = content.map((child, i) => {
		return (
			<PMRenderer
				json={child}
				key={i}
				{...props}
			/>
		);
	});

	return <div {...(node.attrs ?? {})}>{children}</div>;
};

import KaTeX from 'katex';
function MathBlock(node: PMNode) {
	var html = KaTeX.renderToString(node.attrs.textContent, {
		displayMode: true,
	});
	return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export const Anchor: FC = ({ href, onClick }) => {
	return (
		<a
			onClick={onClick}
			href={href}
		></a>
	);
};

export const defaultNodeMap = {
	text: Text,
	paragraph: Paragraph,
	codeblock: CodeBlock,
	heading: Heading,
	hardBreak: 'br',
};

export const defaultMarkMap = {
	italic: 'em',
	bold: 'strong',
	code: 'code',
	link: 'a',
	underline: 'u',
};

import { FC, Fragment } from 'react';

/**
 * A recursively rendered tree.
 */
export const PMRenderer = props => {
	const {
		json,
		markMap = defaultMarkMap,
		nodeMap = defaultNodeMap,
		skipUnknownMarks = false,
		skipUnknownTypes = false,
	} = props;

	if (json.type === 'text' && json.text && (!json.marks || json.marks.length === 0)) {
		return <Fragment>{json.text}</Fragment>;
	}

	const rest = { markMap, nodeMap, skipUnknownMarks, skipUnknownTypes };
	const TypeHandler = nodeMap[json.type];

	if (!TypeHandler) {
		if (!skipUnknownTypes) {
			throw new Error(`No handler for node type \`${json.type}\` registered`);
		}
		return null;
	}

	const childProps = typeof TypeHandler === 'string' ? json.attrs ?? {} : { ...rest, node: json };
	const { content } = json;

	if (!content || content.length === 0) {
		return <TypeHandler {...childProps} />;
	}

	const children = content.map((child, i) => {
		return (
			<PMRenderer
				key={i}
				json={child}
				{...rest}
			/>
		);
	});

	return <TypeHandler {...childProps}>{children}</TypeHandler>;
};
