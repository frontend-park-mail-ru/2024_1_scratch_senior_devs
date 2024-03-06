import "../../../build/wrapper.js";

export class Wrapper {
    #parent;
    #config;

    /**
     * Конструктор класса
     * @param parent объект родителя
     * @param config конфиг
     */
    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get self() {
        return document.getElementById(this.#config.id);
    }

    render() {
        const template = window.Handlebars.templates["wrapper.hbs"];
        this.#parent.insertAdjacentHTML("afterbegin", template(this.#config));
    }
}