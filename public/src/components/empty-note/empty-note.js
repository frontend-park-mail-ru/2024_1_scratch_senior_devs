import "../../../build/empty-note.js";

export class EmptyNote {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    render() {
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["empty-note.hbs"](this.#config)
        );
    }
}