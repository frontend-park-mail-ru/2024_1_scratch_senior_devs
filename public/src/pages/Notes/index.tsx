import {ScReact} from "@veglem/screact";
import "./style.sass"
import {Note} from "../../components/Note/note";
import {SearchBar} from "../../components/SearchBar/SearchBar";
import {NoteEditor} from "../../components/NoteEditor/NoteEditor";
import {AppNotesStore, NotesActions, NotesStoreState} from "../../modules/stores/NotesStore";
import {AppDispatcher} from "../../modules/dispatcher";
import {Modal} from "../../components/Modal/Modal";
import {Button} from "../../components/Button/Button";
import {Img} from "../../components/Image/Image";
import {DeleteNoteDialog} from "../../components/DeleteNoteDialog/DeleteNoteDialog";
import {AppNoteStore, NoteStoreState} from "../../modules/stores/NoteStore";

export class NotesPage extends ScReact.Component<any, any> {
    state = {
        notes: [],
        selectedNote: undefined,
        deleteNoteModal: false,
        editorOpen: false
    }

    componentDidMount() {
        document.title = "Заметки"

        AppNotesStore.SubscribeToStore(this.updateState)
        AppNoteStore.AddSaver(this.updateNotesTitles);

        this.setState(state => ({
            ...state,
            notes: this.props.notes
        }))

        this.createObserver()
    }

    updateNotesTitles = () => {
        setTimeout(()=> {
            console.log(AppNoteStore.state.note)
            const notes = AppNotesStore.state.notes;
            notes.forEach((note, index) => {
                if (note.id == this.state.selectedNote?.id) {
                    console.log("Yeeees")
                    notes[index].data.title = AppNoteStore.state.note.title
                    console.log(notes)
                }
            })
            this.setState(s=>({
                    ...s,
                    notes: notes

            }))
        }, 10)
    }

    componentWillUnmount() {
        AppDispatcher.dispatch(NotesActions.EXIT)
        AppNotesStore.UnSubscribeToStore(this.updateState)
    }

    updateState = (store:NotesStoreState) => {
        this.setState(state => {
            if (state.notes.length > 0 && state.notes.length < AppNotesStore.state.notes.length) {
                this.createObserver()
            }

            return {
                ...state,
                selectedNote: store.selectedNote,
                editorOpen: store.selectedNote != undefined,
                notes: store.notes,
                deleteNoteModal: store.modalOpen
            }
        })
    }

    handleSelectNote = (e) => {
        let id = undefined;

        if (e.target.matches(".note-container")) {
            id = e.target.id;
        } else if (e.target.matches(".note-container *")) {
            id = e.target.parentNode.id;
        }

        if (id) {
            this.setState(state => ({
                ...state,
                editorOpen: true
            }))

            AppDispatcher.dispatch(NotesActions.SELECT_NOTE, id)
        }
    }

    closeEditor = () => {
        this.setState(state => ({
            ...state,
            editorOpen: false
        }))
    }

    createObserver() {
        const observer = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        AppDispatcher.dispatch(NotesActions.LOAD_NOTES);
                        observer.unobserve(entry.target);
                    }
                });
            });

        const lastNote = document.querySelector(".note-container:last-child")
        lastNote && observer.observe(lastNote);
    }

    searchNotes = (value:string) => {
        AppDispatcher.dispatch(NotesActions.SEARCH_NOTES, value)
    }

    createNewNote = () => {
        console.log("createNewNote")
        AppDispatcher.dispatch(NotesActions.CREATE_EMPTY_NOTE)
    }

    render() {
        const notes = this.state.notes.map(note => (
            <Note key1={note.id} note={note} selected={this.state.selectedNote?.id == note.id} />
        ))

        return (
            <div className={"notes-page-wrapper " + (this.state.editorOpen ? "active" : "")} >
                <aside>
                    <Modal open={this.state.deleteNoteModal} content={<DeleteNoteDialog />} handleClose={() => AppDispatcher.dispatch(NotesActions.CLOSE_DELETE_NOTE_DIALOG)} />
                    <div className="top-panel">
                        <SearchBar onChange={this.searchNotes}/>
                        <div className="add-note-btn-container" onclick={this.createNewNote}>
                            <Button label="Новая заметка" className="add-note-btn" />
                            <div className="add-note-icon-wrapper">
                                <Img src="plus.svg" className="add-note-icon" />
                            </div>
                        </div>
                    </div>
                    <div className="notes-container" onclick={this.handleSelectNote}>
                        {notes}
                    </div>
                </aside>
                <NoteEditor open={this.state.editorOpen} setClose={this.closeEditor} />
            </div>
        )
    }
}