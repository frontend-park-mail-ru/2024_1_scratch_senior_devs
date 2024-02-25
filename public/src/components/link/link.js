import "../../../build/link.js"

export class Link {
    #parent;
    #config;

    id;

    constructor(parent, config) {
        this.id = crypto.randomUUID();
        this.#parent = parent;
        this.#config = config;
        this.#config.id = this.id;
    }

    get self(){
        return document.getElementById(`${this.id}`);
    }

    render() {
        const tmp = document.createElement('div');
        const template = Handlebars.templates["link.hbs"];
        tmp.innerHTML = template(this.#config);
        this.#parent.appendChild(tmp.firstElementChild);
    }
}
