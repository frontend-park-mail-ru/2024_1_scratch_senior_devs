import "../../../build/notes.js";
import {Note} from "../../components/note/note.js";
import {AppNoteRequests} from "../../modules/ajax.js";
import Page from "../page.js";
import {NoteEditor} from "../../components/note-editor/note-editor.js";

export default class NotesPage extends Page {
    #notesContainer;

    #notesEditor;

    #renderNotes = (notes) => {
        for (const note of notes) {
            const noteClass = new Note(this.#notesContainer, note);
            noteClass.render();
        }
    };

    remove() {
        this.#notesEditor.remove();
        super.remove();
    }

    render() {
        this.parent.insertAdjacentHTML(
            "afterbegin",
            window.Handlebars.templates["notes.hbs"](this.config)
        );

        this.#notesContainer = document.querySelector(".notes-container");

        let notes = AppNoteRequests.GetAll()
        if (notes.length > 0) {
            notes.then(resp => {
                this.#renderNotes(resp);
            });
        } else {
            const emptyNoteData = {
                id: "empty-note",
                data: {
                    title: "У вас пока нет заметок :(",
                    content: ""
                }
            }
            let emptyNote = new Note(this.#notesContainer, emptyNoteData);
            emptyNote.render()
        }


        this.#notesEditor = new NoteEditor(this.self.querySelector(".wrapper"), this.config.noteEditor);
        this.#notesEditor.render();


        document.title = "Заметки";
    }
}