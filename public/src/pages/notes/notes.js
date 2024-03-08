import "../../../build/notes.js";
import {Note} from "../../components/note/note.js";
import Page from "../page.js";
import {NoteEditor} from "../../components/note-editor/note-editor.js";
import {AppNotesStore} from "../../stores/notes/notesStore.js";
import {SearchBar} from "../../components/search-bar/search-bar.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {NotesStoreEvents} from "../../stores/notes/events.js";

export default class NotesPage extends Page {
    #notesContainer;

    #notesEditor;

    #searchBar;

    #renderNotes = (notes) => {
        this.#notesContainer.innerHTML = "";
        for (const note of notes) {
            const noteClass = new Note(this.#notesContainer, note, this.selectNote);
            noteClass.render();
        }
    };

    remove() {
        this.#searchBar.remove();
        this.#notesEditor.remove();
        this.#unsubscribeFromEvents();
        super.remove();
    }

    selectNote = (note) => {
        AppNotesStore.unselectNote();
        AppNotesStore.selectNote(note);
        note.classList.add("selected");
    }

    #subscribeToEvents() {
        AppEventMaker.subscribe(NotesStoreEvents.NOTES_RECEIVED, this.#renderNotes);
    }

    #unsubscribeFromEvents() {
        AppEventMaker.subscribe(NotesStoreEvents.NOTES_RECEIVED, this.#renderNotes);
    }

    render() {
        this.parent.insertAdjacentHTML(
            "afterbegin",
            window.Handlebars.templates["notes.hbs"](this.config)
        );

        this.#notesContainer = document.querySelector(".notes-container");

        this.#searchBar = new SearchBar(this.self.querySelector("aside"), this.config.searchBar);
        this.#searchBar.render();

        this.#notesEditor = new NoteEditor(this.self, this.config.noteEditor);
        this.#notesEditor.render();

        document.title = "Заметки";
        this.#subscribeToEvents();


        AppNotesStore.init();

    }
}