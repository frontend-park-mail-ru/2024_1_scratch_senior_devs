import {ScReact} from "@veglem/screact";
import "./NoteEditor.sass"
import {Img} from "../Image/Image";
import {AppNotesStore, NotesActions, NotesStoreState} from "../../modules/stores/NotesStore";
import {AppDispatcher} from "../../modules/dispatcher";


export class NoteEditor extends ScReact.Component<any, any> {
    state = {
        open: false,
        selectedNote: undefined
    }

    componentDidMount() {
        AppNotesStore.SubscribeToStore(this.updateState)
    }

    closeEditor = () => {
        AppDispatcher.dispatch(NotesActions.CLOSE_NOTE)
    }

    updateState = (store:NotesStoreState) => {
        this.setState(state => ({
            ...state,
            selectedNote: store.selectedNote,
            open: store.selectedNote !== undefined
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
                </div>

            </div>
        )
    }
}