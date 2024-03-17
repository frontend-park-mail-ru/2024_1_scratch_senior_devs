import {ScReact} from "@veglem/screact";
import "./style.sass"
import {Note} from "../../components/Note/note";
import {SearchBar} from "../../components/SearchBar/SearchBar";
import {NoteEditor} from "../../components/NoteEditor/NoteEditor";

export class NotesPage extends ScReact.Component<any, any> {

    state = {
        noteSelected: true
    }

    notes = [
        {
            id: 1,
            title: "Note title №1",
            content: "Note content №1"
        },
        {
            id: 2,
            title: "Note title №2",
            content: "Note content №3"
        },
        {
            id: 3,
            title: "Note title №3",
            content: "Note content №3"
        },
        {
            id: 4,
            title: "Note title №4",
            content: "Note content №4"
        },
        {
            id: 5,
            title: "Note title №5",
            content: "Note content №5"
        }
    ]

    handleSelectNote = (e) => {
        let id = undefined;

        if (e.target.matches(".note-container")) {
            id = e.target.id;
        } else if (e.target.matches(".note-container *")) {
            id = e.target.parentNode.id;
        }

        if (id !== undefined) {
            console.log(id) // TODO
            this.setNoteSelected(true)
        }
    };

    setNoteSelected = (value:boolean) => {
        this.setState(state => ({
            ...state,
            noteSelected: value
        }))
    }

    render() {
        return (
            <div className={"notes-page-wrapper " + (this.state.noteSelected ? "active" : "")}>
                <aside>
                    <SearchBar />
                    <div className="notes-container" onclick={this.handleSelectNote}>
                        { this.notes.map(note => (
                            <Note key1={note.id} id={note.id} title={note.title} content={note.content}></Note>
                        ))}
                    </div>
                </aside>
               <NoteEditor />
            </div>
        )
    }
}