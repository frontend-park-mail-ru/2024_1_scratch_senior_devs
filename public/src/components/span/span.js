import "../../../build/span.js";

export class Span {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get self(){
        return document.querySelector(`.${this.#config.class}`);
    }

    setText(text) {
        console.log(text);
        this.self.innerHTML = text;
    }

    render() {
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["span.hbs"](this.#config)
        );
    }
}