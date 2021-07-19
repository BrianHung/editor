export default class HeadingView {
    constructor(props) {
        this.extension = props.extension;
        this.node = props.node;
        this.dom = this.contentDOM = document.createElement(`h${this.node.attrs.level}`);
        this.extension.options.modifyDOM && this.extension.options.modifyDOM(this.node, this.dom);
    }
    update(node) {
        if (node.type !== this.node.type)
            return false;
        this.node = node;
        this.extension.options.modifyDOM && this.extension.options.modifyDOM(this.node, this.dom);
        return true;
    }
}
