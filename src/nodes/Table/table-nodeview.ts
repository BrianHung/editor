import { NodeView } from 'prosemirror-view'
import { Node as PMNode } from 'prosemirror-model'

export class TableView implements NodeView {

  node: PMNode;
  cellMinWidth: number;
  dom: HTMLElement;
  table: HTMLElement;
  colgroup: HTMLElement;
  contentDOM: HTMLElement;

  constructor(node: PMNode, cellMinWidth: number) {

    this.node = node;
    this.cellMinWidth = cellMinWidth;


    this.dom = this.table = document.createElement("table");

    this.colgroup   = this.table.appendChild(document.createElement("colgroup"));
    updateColumns(node, this.colgroup, this.table, cellMinWidth);

    this.contentDOM = this.table.appendChild(document.createElement("tbody"));

  }

  update(node) {
    if (node.type != this.node.type) return false;
    this.node = node;
    updateColumns(node, this.colgroup, this.table, this.cellMinWidth);
    return true;
  }

  ignoreMutation(record) {
    return record.type == "attributes" 
      && (record.target == this.table || this.colgroup.contains(record.target));
  }
}

export function updateColumns(node: PMNode, colgroup: HTMLElement, table: HTMLElement, cellMinWidth: number, overrideCol?: number, overrideValue?: any) {
  let totalWidth = 0, fixedWidth = true
  let nextDOM = colgroup.firstChild as HTMLElement, row = node.firstChild
  for (let i = 0, col = 0; i < row.childCount; i++) {
    let {colspan, colwidth} = row.child(i).attrs
    for (let j = 0; j < colspan; j++, col++) {
      let hasWidth = overrideCol == col ? overrideValue : colwidth && colwidth[j]
      let cssWidth = hasWidth ? hasWidth + "px" : ""
      totalWidth += hasWidth || cellMinWidth
      if (!hasWidth) fixedWidth = false
      if (!nextDOM) {
        colgroup.appendChild(document.createElement("col")).style.width = cssWidth
      } else {
        if (nextDOM.style.width != cssWidth) nextDOM.style.width = cssWidth
        nextDOM = nextDOM.nextSibling as HTMLElement
      }
    }
  }

  while (nextDOM) {
    let after = nextDOM.nextSibling as HTMLElement
    nextDOM.parentNode.removeChild(nextDOM)
    nextDOM = after
  }

  if (fixedWidth) {
    table.style.width = totalWidth + "px"
    table.style.minWidth = ""
  } else {
    table.style.width = ""
    table.style.minWidth = totalWidth + "px"
  }
}