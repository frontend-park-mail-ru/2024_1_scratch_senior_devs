import {ScReact} from "@veglem/screact";
import "./style.sass"
import {Note} from "../../components/Note/note";
import {SearchBar} from "../../components/SearchBar/SearchBar";
import {NoteEditor} from "../../components/NoteEditor/NoteEditor";
import {AppNotesStore, NotesActions, NotesStoreState} from "../../modules/stores/NotesStore";
import {AppDispatcher} from "../../modules/dispatcher";
import {Modal} from "../../components/Modal/Modal";
import {Button} from "../../components/Button/Button";

export class NotesPage extends ScReact.Component<any, any> {
    state = {
        notes: [],
        selectedNote: undefined
    }

    componentDidMount() {
        document.title = "Заметки"

        AppNotesStore.SubscribeToStore(this.updateState)

        this.setState(state => ({
            ...state,
            notes: this.props.notes
        }))

        this.createObserver()
    }

    componentWillUnmount() {
        AppDispatcher.dispatch(NotesActions.EXIT)
        AppNotesStore.UnSubscribeToStore(this.updateState)
    }

    updateState = (storeState:NotesStoreState) => {
        console.log("updateState")
        console.log(this.state.notes)
        this.setState(state => {
            if (state.notes.length > 0 && state.notes.length < AppNotesStore.state.notes.length) {
                this.createObserver()
            }

            return {
                ...state,
                selectedNote: storeState.selectedNote,
                notes: storeState.notes
            }
        })
        console.log(this.state.notes)
    }

    handleSelectNote = (e) => {
        let id = undefined;

        if (e.target.matches(".note-container")) {
            id = e.target.id;
        } else if (e.target.matches(".note-container *")) {
            id = e.target.parentNode.id;
        }

        console.log("handleSelectNote")
        console.log(id)

        id && AppDispatcher.dispatch(NotesActions.SELECT_NOTE, id)
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

        observer.observe(document.querySelector(".note-container:last-child"));
    }

    searchNotes = (value:string) => {
        AppDispatcher.dispatch(NotesActions.SEARCH_NOTES, value)
    }

    createEmptyNote = () => {
        console.log("createEmptyNote")
        AppDispatcher.dispatch(NotesActions.CREATE_EMPTY_NOTE)
    }

    render() {
        return (
            <div className={"notes-page-wrapper " + (this.state.selectedNote ? "active" : "")}>
                <aside>
                    <Modal />
                    <div className="top-panel">
                        <Button label="Новая заметка" onClick={this.createEmptyNote} />
                        <SearchBar onChange={this.searchNotes} />
                    </div>
                    <div className="notes-container" onclick={this.handleSelectNote}>
                        {this.state.notes.map(note => (
                            <Note key1={note.id} note={note} selected={this.state.selectedNote?.id == note.id} />
                        ))}
                    </div>
                </aside>
               <NoteEditor />
            </div>
        )
    }
}