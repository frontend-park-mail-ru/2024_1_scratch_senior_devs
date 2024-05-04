import {Component} from "@veglem/screact/dist/component";
import {VDomNode} from "@veglem/screact/dist/vdom";
import "./Editor.sass"
import {Editor} from "./Editor";
import {Dropdown} from "../Dropdown/Dropdown";
import {AppNoteStore, NoteStoreState} from "../../modules/stores/NoteStore";
import {Tippy} from "../Tippy/Tippy";

type EditorState = {
    tippyOpen: boolean,
    tippyPos: {
        left: number,
        top: number
    }
    dropdownOpen: boolean,
    dropdownPos: {
        left: number,
        top: number
    }
}

export class EditorWrapper extends Component<any, EditorState> {
    state = {
        tippyOpen: false,
        tippyPos: {
            left: 0,
            top: 0
        },
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
        console.log("updateState")
        console.log(store.note)
        this.syncTitle(store.note.title)

        this.self.innerHTML = ""
        this.editor = new Editor(
            store.note.blocks,
            this.self,
            {open: this.openDropdown, close: this.closeDropdown},
            this.props.onChangeContent,
            {open: this.openTippy, close: this.closeTippy}
        );

        this.setState(state => ({
            ...state,
            dropdownOpen: store.dropdownOpen
        }))
    }

    syncTitle = (title:string) => {
        console.log("syncTitle")
        this.noteTitleRef.textContent = title

        if (this.noteTitleRef.textContent.length == 0) {
            this.noteTitleRef.dataset.placeholder = 'Введите название';
        } else {
            this.noteTitleRef.dataset.placeholder = '';
        }
    }

    openDropdown = (elem: HTMLElement) => {
        console.log("openDropdown")

        this.setState(state => ({
            ...state,
            dropdownOpen: true,
            dropdownPos: {
                left: elem.offsetLeft + 20,
                top: elem.offsetTop + 20
            }
        }))
    }

    closeDropdown = () => {
        
        this.setState(state => ({
            ...state,
            dropdownOpen: false
        }))
    }

    openTippy = (elem: HTMLElement) => {
        this.setState(state => ({
            ...state,
            tippyOpen: true,
            tippyPos: {
                left: elem.offsetLeft,
                top: elem.offsetTop - 40
            }
        }))
    }

    closeTippy = () => {
        
        this.setState(state => ({
            ...state,
            tippyOpen: false
        }))
    }
    
    onChangeTitle = () => {
        console.log("onChangeTitle")

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

                </div>

                <Dropdown
                    style={`left: ${this.state.dropdownPos.left}px; top: ${this.state.dropdownPos.top}px;`}
                    onClose={this.closeDropdown}
                    open={this.state.dropdownOpen}
                />

                <Tippy style={`left: ${this.state.tippyPos.left}px; top: ${this.state.tippyPos.top}px;`}
                    open={this.state.tippyOpen}
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
