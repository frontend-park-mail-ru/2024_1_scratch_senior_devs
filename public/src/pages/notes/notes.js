import "../../../build/notes.js"
import {Note} from "../../components/note/note.js";
import {AppNoteRequests} from "../../modules/ajax.js";

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

    #renderNotes = (self, notes) => {
        for (const note of notes) {
            const noteClass = new Note(self, {note: {title: note.data.title, content: note.data.content}});
            noteClass.render();
        }
    }

    render() {
        this.#parent.insertAdjacentHTML(
            'afterbegin',
            window.Handlebars.templates['notes.hbs'](this.#config)
        );

        const notesContainer = document.createElement("div");
        notesContainer.id = "notes-container"

        this.self.appendChild(notesContainer)

        AppNoteRequests.GetAll().then(resp => {
            this.#renderNotes(notesContainer, resp)
        })
    }

}