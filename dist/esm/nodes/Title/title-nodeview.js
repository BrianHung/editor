export default class TitleView {
    constructor(props) {
        this.extension = props.extension;
        this.node = props.node;
        this.extension.options.handleTitleChange(this.node.textContent);
        const titleDiv = document.createElement("h1");
        titleDiv.classList.add("title");
        this.dom = this.contentDOM = titleDiv;
    }
    update(node) {
        if (node.type !== this.node.type)
            return false;
        this.node.textContent !== node.textContent && this.extension.options.handleTitleChange(node.textContent);
        this.node = node;
        return true;
    }
}
