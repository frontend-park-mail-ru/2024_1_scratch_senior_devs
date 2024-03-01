import "../../../build/footer.js"

export class Footer {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get self() {
        return document.getElementById(`${this.#config.id}`)
    }

    render() {
        const template = window.Handlebars.templates["footer.hbs"];
        this.#parent.insertAdjacentHTML('beforeend', template(this.#config));
    }
}