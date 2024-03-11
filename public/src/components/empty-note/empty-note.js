import "../../../build/empty-note.js";

export class EmptyNote {
    #parent;
    #config;

    /**
     * Конструктор класса
     * @param parent {HTMLElement}
     * @param config {Object}
     */
    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    /**
     * Рендеринг компонента
     */
    render() {
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["empty-note.hbs"](this.#config)
        );
    }
}