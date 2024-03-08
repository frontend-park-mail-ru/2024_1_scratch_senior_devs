import "../../../build/note-editor.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {noteEvents} from "../../pages/notes/events.js";
import {AppNotesStore} from "../../stores/notes/notesStore.js";

export class NoteEditor{
    #parent;
    #config;

    #title;
    #content;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get self() {
        return document.getElementById(this.#config.id);
    }

    #onNoteSelect = (note) => {
        this.#title.innerHTML = "";
        this.#content.innerHTML = "";

        const title = document.createElement("h2");
        title.innerText = note.data.title;
        this.#title.appendChild(title);

        const content = document.createElement("span");
        content.innerText = note.data.content;
        this.#content.appendChild(content);

        this.self.classList.add("active");
        this.#parent.classList.add("active");
    }

    #closeEditor = () => {
        this.self.classList.remove("active");
        this.#parent.classList.remove("active");

        this.#title.innerText = ""
        this.#content.innerText = ""

        AppNotesStore.unselectNote();
    }

    #subscribeToEvents() {
        AppEventMaker.subscribe(noteEvents.NOTE_SELECTED, this.#onNoteSelect);
    }

    #unsubscribeToEvents() {
        AppEventMaker.unsubscribe(noteEvents.NOTE_SELECTED,this.#onNoteSelect);
    }

    remove() {
        this.#unsubscribeToEvents();
    }

    render() {
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["note-editor.hbs"](this.#config)
        );

        const closeBtn = this.self.querySelector(".close-editor-btn")
        closeBtn.addEventListener("click", this.#closeEditor)

        this.#title = this.self.querySelector(".note-title")
        this.#content = this.self.querySelector(".note-content")

        this.#subscribeToEvents();
    }
}
