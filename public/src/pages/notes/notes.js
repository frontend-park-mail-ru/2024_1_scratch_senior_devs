import "../../../build/notes.js";
import {Note} from "../../components/note/note.js";
import {AppNoteRequests} from "../../modules/ajax.js";
import Page from "../page.js";
import {NoteEditor} from "../../components/note-editor/note-editor.js";
import {EmptyNote} from "../../components/empty-note/empty-note.js";

export default class NotesPage extends Page {
    #notesContainer;

    #notesEditor;

    #selectedNote;

    #renderNotes = (notes) => {
        for (const note of notes) {
            const noteClass = new Note(this.#notesContainer, note, this.selectNote);
            noteClass.render();
        }
    };

    remove() {
        this.#notesEditor.remove();
        super.remove();
    }

    selectNote = (note) => {
        if (this.#selectedNote !== undefined) {
            this.#selectedNote.classList.remove("selected")
        }

        this.#selectedNote = note;
        note.classList.add("selected")
    }

    render() {
        this.parent.insertAdjacentHTML(
            "afterbegin",
            window.Handlebars.templates["notes.hbs"](this.config)
        );

        this.#notesContainer = document.querySelector(".notes-container");


        AppNoteRequests.GetAll().then((notes) => {
            if (notes.length > 0) {
                this.#renderNotes(notes);
            } else {
                let emptyNote = new EmptyNote(this.#notesContainer);
                emptyNote.render()
            }
        }).catch((err) => {
            console.log(err)
            let emptyNote = new EmptyNote(this.#notesContainer);
            emptyNote.render()
        })

        this.#notesEditor = new NoteEditor(this.self.querySelector(".wrapper"), this.config.noteEditor);
        this.#notesEditor.render();


        document.title = "Заметки";
    }
}