import {ScReact} from "@veglem/screact";
import "./NoteEditor.sass"
import {Img} from "../Image/Image";
import {AppNotesStore, NotesActions, NotesStoreState} from "../../modules/stores/NotesStore";
import {AppDispatcher} from "../../modules/dispatcher";
import {debounce} from "../../modules/utils";
import {Dropdown} from "../Dropdown/Dropdown";


export class NoteEditor extends ScReact.Component<any, any> {
    state = {
        open: false,
        selectedNote: undefined,
        saving: undefined,
        content: undefined,
        dropdownOpen: false
    }

    componentDidMount() {
        AppNotesStore.SubscribeToStore(this.updateState)
        document.querySelector(".note-editor").addEventListener("input", debounce(this.handleKeypress, 1000))
        document.querySelector(".note-editor").addEventListener("keydown", (e) => this.handleKeyDown(e))
    }

    handleKeyDown = (e) => {
        if (e.key === "/") {
            this.setState(state => ({
                ...state,
                dropdownOpen: true
            }))
        }
    }

    closeDropdown = () => {
        this.setState(state => ({
            ...state,
            dropdownOpen: false
        }))
    }

    handleKeypress = () => {
        if (this.state.selectedNote) {
            this.saveNote()
        }
    }

    saveNote = () => {
        const titleElem = document.querySelector(".note-title") as HTMLElement
        const contentElem = document.querySelector(".note-content > span") as HTMLElement

        const data = {
            id: this.state.selectedNote.id,
            title: titleElem.innerText,
            content: contentElem.innerText
        }

        if (data.title !== this.state.selectedNote.data.title || data.content !== this.state.selectedNote.data.content) {
            AppDispatcher.dispatch(NotesActions.SAVE_NOTE, data)
        }

        // this.setState(state => ({
        //     ...state,
        //     selectedNote: {
        //         id: state.selectedNote.id,
        //         data: {
        //             title: data.title,
        //             content: data.content
        //         },
        //         update_time: state.selectedNote.update_time
        //     }
        // }))
    }

    closeEditor = () => {
        this.saveNote()

        AppDispatcher.dispatch(NotesActions.CLOSE_NOTE)
    }

    updateState = (store:NotesStoreState) => {
        this.setState(state => {
            return {
                ...state,
                selectedNote: store.selectedNote,
                open: store.selectedNote !== undefined,
                saving: store.saving
            }
        })
    }

    deleteNote = () => {
        AppDispatcher.dispatch(NotesActions.OPEN_DELETE_NOTE_DIALOG)
    }

    render() {
        return (
            <div className={"note-editor " + (this.state.open ? "active" : "") }>

                <div className="top-panel">
                    <div className="left-container">

                    </div>
                    <div className="right-container">
                        <Img src="trash.svg" className="icon" onClick={this.deleteNote}/>
                        <Img src="close.svg" className="icon" onClick={this.closeEditor}/>
                    </div>
                </div>

                <div className="bottom-panel">
                    <div className="note-title-container" contentEditable="true">
                        <h3 className="note-title">{this.state.selectedNote?.data.title}</h3>
                    </div>

                    <div className="note-content" contentEditable="true">
                        <span>{this.state.selectedNote?.data.content}</span>
                    </div>

                    <div className="note-save-indicator">
                        {this.state.saving === false ? <h3>Сохранено</h3> : ""}
                    </div>

                    {/*<Dropdown open={this.state.dropdownOpen} onClose={this.closeDropdown} />*/}

                </div>
            </div>
        )
    }
}