import { NodeViewProps } from '@brianhung/editor';
import { CellSelection } from '@brianhung/editor-table';
import { Node as PMNode } from 'prosemirror-model';
import { NodeView } from 'prosemirror-view';

export class TableNodeView implements NodeView {
	view: NodeViewProps['view'];
	node: PMNode;
	cellMinWidth: number;

	dom: HTMLElement;
	contentDOM: HTMLElement;

	table: HTMLElement;
	colgroup: HTMLElement;
	selectionOverlay: HTMLElement;

	redrawOnResize: EventListener;

	constructor(props: NodeViewProps, options = { cellMinWidth: 25 }) {
		this.view = props.view;
		this.node = props.node;
		this.cellMinWidth = options.cellMinWidth;
		this.dom = this.table = document.createElement('table');

		this.colgroup = this.table.appendChild(document.createElement('colgroup'));
		this.contentDOM = this.table.appendChild(document.createElement('tbody'));

		this.selectionOverlay = this.table.appendChild(document.createElement('div'));
		this.selectionOverlay.className = 'ProseMirror-selection-overlay';
		Object.assign(this.table.style, { position: 'relative' });

		this.redrawOnResize = (event: Event) => {
			this.drawCellSelection();
		};
		window.addEventListener('resize', this.redrawOnResize);

		// An expando property on the DOM node provides a link back to its
		// description.
		const dom = this.dom as any;
		dom.nodeView = this;

		this.updateColumns(this.cellMinWidth);
		this.drawCellSelection();
	}

	update: NodeView['update'] = node => {
		if (node.type != this.node.type) return false;
		this.node = node;
		this.updateColumns(this.cellMinWidth);
		this.drawCellSelection();
		return true;
	};

	ignoreMutation: NodeView['ignoreMutation'] = mutation => {
		return (
			(mutation.type === 'attributes' && (mutation.target == this.table || this.colgroup.contains(mutation.target))) ||
			this.selectionOverlay.contains(mutation.target)
		);
	};

	destroy: NodeView['destroy'] = () => {
		window.removeEventListener('resize', this.redrawOnResize);

		// @ts-ignore
		if (this.dom.nodeView == this) this.dom.nodeView = null;
	};

	drawCellSelection() {
		const view = this.view,
			table = this.table;

		// Remove overlay if current selection is not CellSelection or if CellSelection does not belong to this node.
		if (!(view.state.selection instanceof CellSelection) || view.state.selection.$anchorCell.node(-1) != this.node)
			return this.selectionOverlay.replaceChildren();

		const anchorRect = (view.nodeDOM(view.state.selection.$anchorCell.pos) as Element).getBoundingClientRect();
		const headRect = (view.nodeDOM(view.state.selection.$headCell.pos) as Element).getBoundingClientRect();

		// Calculate height and width of the selection box.
		const height = headRect.y > anchorRect.y ? headRect.bottom - anchorRect.top : anchorRect.bottom - headRect.top;
		const width = headRect.x > anchorRect.x ? headRect.right - anchorRect.left : anchorRect.right - headRect.left;

		const tableRect = table.getBoundingClientRect();

		// Calculate top-left origin of selection box relative to table.
		const top = headRect.y > anchorRect.y ? anchorRect.top - tableRect.top : headRect.top - tableRect.top;
		const left = headRect.x > anchorRect.x ? anchorRect.left - tableRect.left : headRect.left - tableRect.left;

		this.selectionOverlay.replaceChildren();
		const selection = this.selectionOverlay.appendChild(document.createElement('div'));

		Object.assign(selection.style, {
			position: 'absolute',
			border: '2px solid rgb(116, 182, 219)',
			backgroundColor: 'rgba(116, 182, 219, 0.15)',
			width: width - 3 + 'px',
			height: height - 3 + 'px',
			top: top - 1 + 'px',
			left: left - 1 + 'px',
			zIndex: 10,
			borderRadius: '2px',
			pointerEvents: 'none',
		});
	}

	updateColumns(cellMinWidth: number, overrideCol?: number, overrideValue?: any) {
		const colgroup = this.colgroup,
			node = this.node,
			table = this.table;
		let totalWidth = 0,
			fixedWidth = true;
		let nextDOM = colgroup.firstChild as HTMLElement,
			row = node.firstChild;
		for (let i = 0, col = 0; i < row.childCount; i++) {
			let { colspan, colwidth } = row.child(i).attrs;
			for (let j = 0; j < colspan; j++, col++) {
				let hasWidth = overrideCol == col ? overrideValue : colwidth && colwidth[j];
				let cssWidth = hasWidth ? hasWidth + 'px' : '';
				totalWidth += hasWidth || cellMinWidth;
				if (!hasWidth) fixedWidth = false;
				if (!nextDOM) {
					colgroup.appendChild(document.createElement('col')).style.width = cssWidth;
				} else {
					if (nextDOM.style.width != cssWidth) nextDOM.style.width = cssWidth;
					nextDOM = nextDOM.nextSibling as HTMLElement;
				}
			}
		}
		while (nextDOM) {
			let after = nextDOM.nextSibling as HTMLElement;
			nextDOM.parentNode.removeChild(nextDOM);
			nextDOM = after;
		}
		if (fixedWidth) {
			table.style.width = totalWidth + 'px';
			table.style.minWidth = '';
		} else {
			table.style.width = '';
			table.style.minWidth = totalWidth + 'px';
		}
	}
}
