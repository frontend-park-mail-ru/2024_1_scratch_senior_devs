export class Note {
    #parent;

    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    render() {
        const tmp = document.createElement('div');
        const template = Handlebars.templates["note.hbs"];
        tmp.innerHTML = template(this.#config.note);
        this.#parent.appendChild(tmp.firstElementChild);
    }
}