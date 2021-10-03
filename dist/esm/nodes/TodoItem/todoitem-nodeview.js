export class TodoItemNodeView {
    constructor(props) {
        this.node = props.node;
        this.view = props.view;
        this.getPos = props.getPos;
        this.dom = document.createElement('li');
        this.dom.classList.add('todo-item');
        this.checkbox = this.dom.appendChild(document.createElement('input'));
        this.checkbox.classList.add('todo-checkbox');
        this.checkbox.type = 'checkbox';
        this.checkbox.tabIndex = -1;
        this.checkbox.contentEditable = 'false';
        this.checkbox.onmousedown = event => event.preventDefault();
        this.checkbox.onclick = event => {
            let checked = event.target.checked;
            this.view.dispatch(this.view.state.tr.setNodeMarkup(this.getPos(), null, { checked }));
        };
        this.dom.dataset.checked = this.checkbox.checked = this.node.attrs.checked;
        this.checkbox.toggleAttribute('checked', this.node.attrs.checked);
        this.contentDOM = this.dom.appendChild(document.createElement('div'));
        this.contentDOM.classList.add('todo-content');
    }
    update(node) {
        if (node.type !== this.node.type)
            return false;
        this.node = node;
        this.dom.dataset.checked = this.checkbox.checked = this.node.attrs.checked;
        this.checkbox.toggleAttribute('checked', this.node.attrs.checked);
        return true;
    }
}
