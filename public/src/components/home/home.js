export class Home {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    render() {
        const tmp = document.createElement('div');
        const template = Handlebars.templates["home.hbs"];
        tmp.innerHTML = template(this.#config);
        this.#parent.appendChild(tmp.firstElementChild);
    }
}
