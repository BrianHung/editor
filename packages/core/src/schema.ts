/**
 * Similar to cellAttributes.
 * https://github.com/ProseMirror/prosemirror-tables/blob/master/README.md
 */
export interface SchemaAttributeSpec extends AttributeSpec {
	/**
	 * Which node or mark types should be extended.
	 */
	types: string[];
	/**
	 * Defines the way an attribute should be serialized with toDOM of types.
	 */
	setDOMAttr?: ((value: any, attributes: Record<string, any>) => void) | null;
	/**
	 * Associates DOM parser information with parseDOM of types.
	 */
	getFromDOM?: ((element: HTMLElement) => any | null) | null;
}

import { AttributeSpec, Attrs, MarkSpec, NodeSpec, ParseRule, Schema, SchemaSpec } from 'prosemirror-model';

/**
 * Extends parseRules with schemaAttrs when getAttrs is defined.
 * https://github.com/ProseMirror/prosemirror-tables/blob/master/src/schema.ts
 * @param parseRule
 * @param schemaAttrs
 * @returns
 */
export function schemaAttrsParseRule(
	parseRule: ParseRule,
	schemaAttrs: { [key: string]: SchemaAttributeSpec }
): ParseRule {
	if (parseRule.style) {
		return parseRule;
	}
	return {
		...parseRule,
		getAttrs: node => {
			const attrs = parseRule.getAttrs ? parseRule.getAttrs(node) : parseRule.attrs;
			if (attrs === false) {
				return false;
			}
			return { ...attrs, ...getDOMAttrs(node, schemaAttrs) };
		},
	};
}

type MutableAttrs = Record<string, unknown>;

/**
 * Similar to getCellAttrs used in parseDOM.
 */
function getDOMAttrs(dom: HTMLElement | string, extraAttrs: Attrs): Attrs {
	if (typeof dom === 'string') {
		return {};
	}
	const result: MutableAttrs = {};
	for (const prop in extraAttrs) {
		const getter = extraAttrs[prop].getFromDOM;
		const value = getter ? getter(dom) : fromHTMLString(dom.getAttribute(prop));
		if (value != null) {
			result[prop] = value;
		}
	}
	return result;
}

export function fromHTMLString(value: any): any {
	if (typeof value !== 'string') {
		return value;
	}
	if (value.match(/^[+-]?(?:\d*\.)?\d+$/)) {
		return Number(value);
	}
	if (value === 'true') {
		return true;
	}
	if (value === 'false') {
		return false;
	}
	return value;
}

/**
 * Similar to setCellAttrs used in toDOM.
 * https://github.com/ProseMirror/prosemirror-tables/blob/master/src/schema.ts
 * @param node
 * @param extraAttrs
 * @returns
 */
function setDOMAttrs(node: Node, extraAttrs: Attrs): Attrs {
	const attrs: MutableAttrs = Object.create(null);
	for (const prop in extraAttrs) {
		const setter = extraAttrs[prop].setDOMAttr;
		if (setter) setter(node.attrs[prop], attrs);
	}
	return attrs;
}

import type { Extension } from './extension.js';
import type { Mark } from './mark.js';
import type { Node } from './node.js';
type Extensions = (Extension | Mark | Node | Plugin)[];

function copy(obj: { [prop: string]: any }) {
	let copy: { [prop: string]: any } = {};
	for (let prop in obj) copy[prop] = obj[prop];
	return copy;
}

/**
 * https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.ts
 * @param obj
 * @param props
 * @returns
 */
function add(obj: { [prop: string]: any }, props: { [prop: string]: any }) {
	let copy: { [prop: string]: any } = {};
	for (let prop in obj) copy[prop] = obj[prop];
	for (let prop in props) copy[prop] = props[prop];
	return copy;
}

/**
 * Allows for a more flexible way to create a schema from extensions.
 *
 * Similar to how tableNodes can be dynamically extended with cellAttributes.
 * https://github.com/ProseMirror/prosemirror-tables/blob/master/src/schema.ts
 *
 * TODO: use EditorState and DOMParser prop instead
 * https://prosemirror.net/docs/ref/#view.EditorProps.domParser
 *
 * @param extensions
 * @param topNode
 * @returns
 */
export function schemaFromExtensions(extensions: Extensions, topNode: SchemaSpec['topNode']): Schema {
	const nodes = NodeSpecs(extensions);
	const marks = MarkSpecs(extensions);
	const schemaAttrs = getSchemaAttrs(extensions);
	return extendSchemaWithAttrs(new Schema({ nodes, marks, topNode }), schemaAttrs);
}

interface withAttrs {
	schemaAttrs: Record<string, SchemaAttributeSpec>;
}

export function extendSchemaWithAttrs(schema: Schema, schemaAttrs: Record<string, SchemaAttributeSpec>): Schema {
	let nodes = schema.spec.nodes;
	let marks = schema.spec.marks;

	nodes.forEach((type, spec) => {
		const extraAttrs = schemaAttrs[type];
		if (!extraAttrs) return;
		spec = copy(spec);
		spec.attrs = {
			...spec.attrs,
			...extraAttrs,
		};
		let rules = spec.parseDOM;
		if (rules) spec.parseDOM = rules.map(rule => schemaAttrsParseRule(copy(rule), extraAttrs));
		if (spec.toDOM) {
			const toDOM = spec.toDOM;
			spec.toDOM = node => {
				Object.assign(node, {
					attrs: { ...node.attrs, ...setDOMAttrs(node, extraAttrs) },
				});
				return toDOM(node);
			};
		}
		nodes = nodes.update(type, spec);
	});

	marks.forEach((type, spec) => {
		const extraAttrs = schemaAttrs[type];
		if (!extraAttrs) return;
		spec = copy(spec);
		spec.attrs = {
			...spec.attrs,
			...extraAttrs,
		};
		let rules = spec.parseDOM;
		if (rules) spec.parseDOM = rules.map(rule => schemaAttrsParseRule(copy(rule), extraAttrs));
		if (spec.toDOM) {
			const toDOM = spec.toDOM;
			spec.toDOM = mark => {
				Object.assign(mark, {
					attrs: { ...mark.attrs, ...setDOMAttrs(mark, extraAttrs) },
				});
				return toDOM(mark);
			};
		}
		marks = marks.update(type, spec);
	});

	return new Schema({
		topNode: schema.topNodeType.name,
		nodes,
		marks,
	});
}

/**
 * Aggregates schemaAttrs by their types.
 * @param extensions
 * @returns
 */
function getSchemaAttrs(withAttrs: withAttrs[]): Record<string, SchemaAttributeSpec> {
	const attrs = Object.create(null);
	for (const { schemaAttrs } of withAttrs) {
		if (schemaAttrs == null) continue;
		for (const [name, attribute] of Object.entries(schemaAttrs)) {
			for (const type of attribute.types) {
				attrs[type] = {
					...attrs[type],
					[name]: attribute,
				};
			}
		}
	}
	return attrs;
}

/**
 * Gather map of node schemas while maintaining order extensions were passed in.
 *
 * Ideally, end-user will know not to pass ProseMirror plugins into this function
 * because plugins do not contain node schemas.
 */
export function NodeSpecs(nodes: Extensions): Record<string, NodeSpec> {
	return nodes.reduce(
		(nodes, extension) =>
			!(extension instanceof Plugin) && extension.type === 'node' ? { ...nodes, [extension.name]: extension } : nodes,
		Object.create(null)
	);
}

/**
 * Gather map of mark schemas while maintaining order extensions were passed in.
 *
 * Ideally, end-user will know not to pass ProseMirror plugins into this function
 * because plugins do not contain mark schemas.
 */
export function MarkSpecs(marks: Extensions): Record<string, MarkSpec> {
	return marks.reduce(
		(marks, extension) =>
			!(extension instanceof Plugin) && extension.type === 'mark' ? { ...marks, [extension.name]: extension } : marks,
		Object.create(null)
	);
}
