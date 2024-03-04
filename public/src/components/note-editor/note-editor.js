import "../../../build/note-editor.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {noteEvents} from "../../pages/notes/events.js";
import {Image} from "../image/image.js"

export class NoteEditor{
    #parent;
    #config;

    #active;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;

        this.#active = false;
    }

    get self() {
        return document.getElementById(this.#config.id);
    }

    #onNoteSelect (note) {
        this.self.querySelector(".note-title").innerHTML = "";
        this.self.querySelector(".note-content").innerHTML = "";

        const title = document.createElement("h2");
        title.innerText = note.data.title;
        this.self.querySelector(".note-title").appendChild(title);

        const content = document.createElement("span");
        content.innerText = note.data.content;
        this.self.querySelector(".note-content").appendChild(content);

        this.self.classList.add("active");
    }

    #closeEditor = () => {
        this.self.classList.remove("active");
    }

    #subscribeToEvents() {
        AppEventMaker.subscribe(noteEvents.NOTE_SELECTED, (e) => this.#onNoteSelect(e));
    }

    #unsubscribeToEvents() {
        AppEventMaker.unsubscribe(noteEvents.NOTE_SELECTED,(e) =>  this.#onNoteSelect(e));
    }

    remove() {
        this.#unsubscribeToEvents();
    }

    render() {
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["note-editor.hbs"](this.#config)
        );

        const closeBtn = new Image(this.self, this.#config.closeBtn)
        closeBtn.render()
        closeBtn.self.addEventListener("click", this.#closeEditor)

        this.#subscribeToEvents();
    }
}
