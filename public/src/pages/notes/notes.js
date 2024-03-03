import "../../../build/notes.js"
import {Note} from "../../components/note/note.js";

export default class NotesPage {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get self () {
        return document.getElementById(this.#config.id);
    }

    get href () {
        return this.#config.href;
    }

    get needAuth () {
        return this.#config.needAuth;
    }

    remove() {
        this.self.remove()
    }

    render() {
        this.#parent.insertAdjacentHTML(
            'afterbegin',
            window.Handlebars.templates['notes.hbs'](this.#config)
        );

        const notesContainer = document.createElement("div");
        notesContainer.id = "notes-container"

        for (let i = 0; i < 3; i++) {
            const note = new Note(notesContainer, this.#config)
            note.render()
        }

        this.self.appendChild(notesContainer)
    }

}