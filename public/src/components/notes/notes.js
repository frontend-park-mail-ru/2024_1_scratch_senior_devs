import {Note} from "../note/note.js";
import "../../../build/notes.js"
import {AppNoteRequests} from "../../modules/ajax.js";

export class NotesContainer {
    #parent;

    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    #renderNotes = (self, notes) => {
        for (const note of notes) {
            const noteClass = new Note(self, {note: {title: note.data.title, content: note.data.content}});
            noteClass.render();
        }
    }

    render() {
        const tmp = document.createElement('div');
        const template = Handlebars.templates["notes.hbs"];
        tmp.innerHTML = template(this.#config.notes);
        this.#parent.appendChild(tmp.firstElementChild);

        const self = document.getElementById('notes-container');

        AppNoteRequests.GetAll().then(resp => {
            this.#renderNotes(self, resp)
        })
    }
}
