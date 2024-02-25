import "../../../build/note-editor.js"

export class NoteEditor{
    #parent;

    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    render() {
        const tmp = document.createElement('div');
        const template = Handlebars.templates["note-editor.hbs"];
        tmp.innerHTML = template(this.#config.mainPage);
        this.#parent.appendChild(tmp.firstElementChild);
    }
}
