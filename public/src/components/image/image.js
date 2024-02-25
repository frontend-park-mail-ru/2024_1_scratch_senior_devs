import "../../../build/image.js"

export class Image {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get self() {
        return document.getElementById(this.#config.id)
    }

    updateImage(path) {
        this.self.src = path
    }

    render() {
        const tmp = document.createElement('div');
        const template = Handlebars.templates["image.hbs"];
        tmp.innerHTML = template(this.#config);
        this.#parent.appendChild(tmp.firstElementChild);
    }
}
