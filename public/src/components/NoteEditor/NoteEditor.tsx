import {ScReact} from "@veglem/screact";
import "./NoteEditor.sass"
import {Img} from "../Image/Image";
import {AppNotesStore, NotesActions, NotesStoreState} from "../../modules/stores/NotesStore";
import {AppDispatcher} from "../../modules/dispatcher";
import {SwipeArea} from "../SwipeArea/SwipeArea";
import {Editor} from "../Editor/Editor";
import {AppNoteStore} from "../../modules/stores/NoteStore";
import {Tippy} from "../Tippy/Tippy";


export class NoteEditor extends ScReact.Component<any, any> {
    state = {
        selectedNote: undefined,
        saving: undefined,
        content: undefined
    }

    componentDidMount() {
        AppNotesStore.SubscribeToStore(this.updateState)
        AppNoteStore.AddSaver(this.saveNote)
    }

    saveNote = () => {
        // const titleElem = document.querySelector(".note-title") as HTMLElement
        // const contentElem = document.querySelector(".note-content > span") as HTMLElement

        // TODO
        console.log("saveNote")
        console.log(this.state.selectedNote.id)
        console.log(AppNoteStore.state.note)
        AppDispatcher.dispatch(NotesActions.SAVE_NOTE,  {
            id: this.state.selectedNote.id,
            note: AppNoteStore.state.note
        })

        // const data = {
        //     id: this.state.selectedNote.id,
        //     title: titleElem.innerText,
        //     content: contentElem.innerText
        // }

        // if (data.title !== this.state.selectedNote.data.title || data.content !== this.state.selectedNote.data.content) {
        //     AppDispatcher.dispatch(NotesActions.SAVE_NOTE, data)
        // }

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

        this.props.setClose()

        setTimeout(() => AppDispatcher.dispatch(NotesActions.CLOSE_NOTE), 300)
    }

    updateState = (store:NotesStoreState) => {
        this.setState(state => {
            return {
                ...state,
                selectedNote: store.selectedNote,
                saving: store.saving
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
                        <Img src="trash.svg" className="icon delete-note-icon" onClick={this.deleteNote}/>
                        <Img src="close.svg" className="icon close-editor-icon" onClick={this.closeEditor}/>
                    </div>
                </div>

                <div className="bottom-panel">

                    <Editor />

                    <div className="note-save-indicator">
                        {this.state.saving === false ? <h3>Сохранено</h3> : ""}
                    </div>
                </div>
            </div>
        )
    }
}