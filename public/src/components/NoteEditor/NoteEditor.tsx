import {ScReact} from "@veglem/screact";
import "./NoteEditor.sass"
import {Img} from "../Image/Image";
import {AppNotesStore, NotesActions, NotesStoreState} from "../../modules/stores/NotesStore";
import {AppDispatcher} from "../../modules/dispatcher";
import {SwipeArea} from "../SwipeArea/SwipeArea";
import {Editor} from "../Editor/Editor";
import {AppNoteStore} from "../../modules/stores/NoteStore";


export class NoteEditor extends ScReact.Component<any, any> {
    state = {
        selectedNote: undefined,
        content: undefined
    }

    private savingLabelRef

    componentDidMount() {
        AppNotesStore.SubscribeToStore(this.updateState)
        AppNoteStore.AddSaver(this.saveNote)
    }

    saveNote = () => {
        if (this.state.selectedNote) {
            AppDispatcher.dispatch(NotesActions.SAVE_NOTE,  {
                id: this.state.selectedNote.id,
                note: AppNoteStore.state.note
            })
        }

        this.savingLabelRef.innerHTML = "Сохранено"
        this.savingLabelRef.style.opacity = 1
    }

    onChangeNote = () => {
        this.savingLabelRef.innerHTML = ""
        this.savingLabelRef.style.opacity = 0
    }

    closeEditor = () => {
        this.saveNote()
        this.props.setClose()
        setTimeout(() => AppDispatcher.dispatch(NotesActions.CLOSE_NOTE), 300)
    }

    updateState = (store:NotesStoreState) => {
        console.log("updateState")

        if (store.selectedNote != this.state.selectedNote) {
            this.savingLabelRef.innerHTML = ""
        }

        this.setState(state => {
            return {
                ...state,
                selectedNote: store.selectedNote
            }
        })

        if (this.state.selectedNote) {
            AppNoteStore.SetNote({
                title: this.state.selectedNote.data.title,
                blocks: this.state.selectedNote.data.content
            })
        }
    }

    deleteNote = () => {
        AppDispatcher.dispatch(NotesActions.OPEN_DELETE_NOTE_DIALOG)
    }

    render() {
        return (
            <div className={"note-editor-wrapper " + (this.props.open ? "active" : "")}>

                <SwipeArea enable={this.props.open} right={this.closeEditor} target=".note-editor-wrapper"/>

                <div className="top-panel">
                    <div className="left-container">
                        <div className="close-editor-label-container" onclick={this.closeEditor}>
                            <Img src="left-chevron.svg" className="back-icon"/>
                            <span className="back-label">Заметки</span>
                        </div>
                    </div>
                    <div className="right-container">
                        <div className="note-save-indicator">
                            <span ref={ref => this.savingLabelRef = ref}></span>
                        </div>
                        <Img src="trash.svg" className="icon delete-note-icon" onClick={this.deleteNote}/>
                        <Img src="close.svg" className="icon close-editor-icon" onClick={this.closeEditor}/>
                    </div>
                </div>

                <div className="bottom-panel">

                    <Editor
                        onChangeTitle={(value) => {
                            console.log("onChangeTitle")
                            this.props.onChangeTitle(value)
                            this.onChangeNote()
                        }}
                        onChangeContent={this.onChangeNote}
                    />

                </div>
            </div>
        )
    }
}