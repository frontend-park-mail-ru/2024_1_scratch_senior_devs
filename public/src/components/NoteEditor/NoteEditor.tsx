import {ScReact} from "@veglem/screact";
import "./NoteEditor.sass"
import {Img} from "../Image/Image";
import {AppNotesStore, NotesActions} from "../../modules/stores/NotesStore";
import {AppDispatcher} from "../../modules/dispatcher";


export class NoteEditor extends ScReact.Component<any, any> {
    state = {
        open: false
    }

    componentDidMount() {
        AppNotesStore.SubscribeToStore(this.updateState)
    }

    closeEditor = () => {
        AppDispatcher.dispatch(NotesActions.CLOSE_NOTE)
    }

    updateState = (storeState) => {
        this.setState(state => ({
            ...state,
            open: storeState.selectedNote !== undefined
        }))
    }

    deleteNote = () => {
        // TODO
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
                        <h3 className="note-title">{AppNotesStore.state.selectedNote?.data.title}</h3>
                    </div>

                    <div className="note-content" contentEditable="true">
                        <span>{AppNotesStore.state.selectedNote?.data.content}</span>
                    </div>
                </div>

            </div>
        )
    }
}