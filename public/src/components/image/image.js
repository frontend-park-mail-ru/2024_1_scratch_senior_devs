import "../../../build/image.js";

export class Image {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get self() {
        return document.getElementById(this.#config.id);
    }

    updateImage(path) {
        this.self.src = path;
    }

    render() {
        this.#parent.insertAdjacentHTML(
            "afterbegin",
            window.Handlebars.templates["image.hbs"](this.#config)
        );

        if (this.#config.src) {
            this.updateImage(this.#config.src);
        }
    }
}
