export class NotesContainer {
    #parent;

    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    render() {
        this.#parent.insertAdjacentHTML('beforebegin', window.Handlebars.templates['notes.hbs'](this.#config.notes));
    }
}
