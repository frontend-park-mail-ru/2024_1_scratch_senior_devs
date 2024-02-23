export class NoteEditor{
    #parent;

    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    render() {
        this.#parent.insertAdjacentHTML('beforebegin', window.Handlebars.templates['note-editor.hbs'](this.#config.noteEditor));
    }
}
