import {Note} from "../note/note.js";

export class NotesContainer {
    #parent;

    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    render() {
        const tmp = document.createElement('div');
        const template = Handlebars.templates["notes.hbs"];
        tmp.innerHTML = template(this.#config.notes);
        this.#parent.appendChild(tmp.firstElementChild);


        const self = document.getElementById('notes-container');

        for (let i = 0; i < 3; i++) {
            const note = new Note(self, this.#config)
            note.render()
        }
    }
}
