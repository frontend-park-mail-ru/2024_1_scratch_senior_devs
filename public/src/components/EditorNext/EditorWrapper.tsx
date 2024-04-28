import {Component} from "@veglem/screact/dist/component";
import {VDomNode} from "@veglem/screact/dist/vdom";
import "./Editor.sass"
import {Editor} from "./Editor";
import {insertBlockPlugin} from "./Plugin";
import {Dropdown} from "../Dropdown/Dropdown";
import {AppNoteStore, NoteStoreState} from "../../modules/stores/NoteStore";
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
        AppNoteStore.SubscribeToStore(this.updateState)
    }

    updateState = (store:NoteStoreState) => {
        console.log("UPDATE STATE")

        console.log(store)

        this.syncTitle(store.note.title)

        this.self.innerHTML = ""
        this.editor = new Editor(store.note.blocks, this.self, this.openDropdown, this.props.onChangeContent);
    }

    syncTitle = (title) => {
        this.noteTitleRef.innerText = title

        if (this.noteTitleRef.textContent.length == 0) {
            this.noteTitleRef.dataset.placeholder = 'Введите название';
        } else {
            this.noteTitleRef.dataset.placeholder = '';
        }
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


    onChangeTitle = () => {
        if (this.noteTitleRef.textContent.length == 0) {
            this.noteTitleRef.dataset.placeholder = 'Введите название';
        } else {
            this.noteTitleRef.dataset.placeholder = '';
        }

        this.props.onChangeTitle(this.noteTitleRef.textContent)
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
                    style={`left: ${this.state.dropdownPos.left}px; top: ${this.state.dropdownPos.top}px;`}
                    onClose={this.closedDropdown}
                    open={this.state.dropdownOpen}
                />

                <Tippy open={this.state.tippyOpen}
                       onClose={this.closeTippy}
                />

                <div className="note-editor-content">
                    <div className="note-title" contentEditable={true} oninput={this.onChangeTitle} ref={ref => this.noteTitleRef = ref}></div>
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
