import {ScReact} from "@veglem/screact";
import "./NoteEditor.sass"
import {Img} from "../Image/Image";
import {AppNotesStore, NotesActions, NotesStoreState} from "../../modules/stores/NotesStore";
import {AppDispatcher} from "../../modules/dispatcher";
import {debounce} from "../../modules/utils";


export class NoteEditor extends ScReact.Component<any, any> {
    state = {
        open: false,
        selectedNote: undefined,
        saving: undefined
    }

    componentDidMount() {
        AppNotesStore.SubscribeToStore(this.updateState)
        const saveNote = debounce(this.handleKeypress, 1000)
        document.querySelector(".note-editor").addEventListener("input", saveNote)
    }

    handleKeypress = () => {
        if (!this.state.selectedNote) {
            return
        }

        this.saveNote()
    }

    saveNote = () => {
        const titleElem = document.querySelector(".note-title") as HTMLElement
        const contentElem = document.querySelector(".note-content > span") as HTMLElement

        const data = {
            id: this.state.selectedNote.id,
            title: titleElem.innerText,
            content: contentElem.innerText
        }

        AppDispatcher.dispatch(NotesActions.SAVE_NOTE, data)
    }

    closeEditor = () => {
        AppDispatcher.dispatch(NotesActions.CLOSE_NOTE)
    }

    updateState = (store:NotesStoreState) => {
        // if (this.state.open && store.)

        this.setState(state => ({
            ...state,
            selectedNote: store.selectedNote,
            open: store.selectedNote !== undefined,
            saving: store.saving
        }))
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
                        <Img src="/src/assets/trash.svg" className="icon" onClick={this.deleteNote}/>
                        <Img src="/src/assets/close.svg" className="icon" onClick={this.closeEditor}/>
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
                </div>
            </div>
        )
    }
}