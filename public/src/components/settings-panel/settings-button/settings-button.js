import "../../../../build/settings-button.js"

export class SettingsButton {
    #config;
    #parent;

    #handleClick;

    constructor(parent, handleClick) {
        this.#parent = parent;
        this.#handleClick = handleClick;
    }

    get self() {
        return this.#parent.querySelector("#settings-button")
    }

    #addEventListeners(){
        this.self.addEventListener("click", this.#handleClick);
    }

    #removeEventListeners(){
        this.self.removeEventListener("click", this.#handleClick);
    }

    remove() {
        this.#removeEventListeners()
    }

    render() {
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["settings-button.hbs"](this.#config)
        );

        this.#addEventListeners()
    }
}