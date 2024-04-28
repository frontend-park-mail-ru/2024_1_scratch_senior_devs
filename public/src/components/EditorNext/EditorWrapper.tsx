import {Component} from "@veglem/screact/dist/component";
import {VDomNode} from "@veglem/screact/dist/vdom";
import "./Editor.sass"
import {Editor} from "./Editor";
import {insertBlockPlugin} from "./Plugin";
import {Dropdown} from "../Dropdown/Dropdown";
import {AppNoteStore} from "../../modules/stores/NoteStore";
import {Tippy} from "../Tippy/Tippy";

export class EditorWrapper extends Component<any, any> {
    state = {
        tippyOpen: false,
        dropdownOpen: false,
        dropdownPos: {
            left: 0,
            top: 0
        }
    }

    constructor() {
        super();
    }

    private self: HTMLElement

    private editor: Editor

    private noteTitleRef: HTMLElement

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
        ], this.self, this.openDropdown);
    }

    openDropdown() {
        this.setState(state => ({
            ...state,
            dropdownOpen: true
        }))
    }

    closedDropdown() {
        this.setState(state => ({
            ...state,
            dropdownOpen: false
        }))
    }

    closeTippy() {
        this.setState(state => ({
            ...state,
            tippyOpen: false
        }))
    }

    optionsSetter = () => {

    }

    onChangeTitle = () => {
        
    }

    render(): VDomNode {
        return (
            <div className="note-editor">
                <div className="buttons-container">
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
                    }}>H3
                    </button>
                    <button onclick={() => {
                        document.execCommand('createLink', false, "https://google.com");
                    }}>
                        bold
                    </button>
                </div>

                <Dropdown
                    blockId={AppNoteStore.state.dropdownPos.blockId}
                    style={`left: ${this.state.dropdownPos.left}px; top: ${this.state.dropdownPos.top}px;`}
                    onClose={this.closeEditor}
                    open={this.state.dropdownOpen}
                />

                <Tippy open={this.state.tippyOpen}
                       onClose={this.closeTippy}
                       optionsSetter={(func) => {
                           this.optionsSetter = func;
                       }}
                />

                <div className="note-editor-content">
                    <div className="note-title" contentEditable={true} onInput={this.onChangeTitle} ref={ref => this.noteTitleRef = ref}></div>
                    <div className="note-body" ref={elem => this.self = elem}></div>
                </div>

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
