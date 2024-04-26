import {Component} from "@veglem/screact/dist/component";
import {VDomNode} from "@veglem/screact/dist/vdom";
import "./Editor.sass"
import {Editor} from "./Editor";
import {insertBlockPlugin} from "./Plugin";

export class EditorWrapper extends Component<any, any> {
    constructor() {
        super();
    }

    private self: HTMLElement;

    private editor: Editor;

    componentDidMount() {
        this.editor = new Editor([
            {
                pluginName: "textBlock",
                content: "Hello You-note"
            },
            {
                pluginName: "div",
                children: [
                    {
                        pluginName: "br",
                    }
                ]
            }
        ], this.self);
    }

    render(): VDomNode {
        return (
            <div className="note-editor">
                <button onclick={() => {
                    insertBlockPlugin('ol')
                }}>ol
                </button>
                <button onclick={() => {
                    insertBlockPlugin('ul')
                }}>ul
                </button>
                <button onclick={() => {
                    insertBlockPlugin('todo')
                }}>to-do
                </button>
                <button onclick={() => {
                    insertBlockPlugin('header', 'h2');
                }}>H3</button>
                <button onclick={() => {
                    document.execCommand('createLink', false, "https://google.com");
                }}>
                    bold
                </button>
                <div ref={(elem: HTMLElement) => {
                    this.self = elem
                }}></div>
            </div>
        )
    }
}

const getFirstElem = (node) => {
    if (node.nodeType === 1) {
        return node;
    }
    return getFirstElem(node.parentElement);
}
