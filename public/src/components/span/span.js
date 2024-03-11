import "../../../build/span.js";

export class Span {
    #parent;
    #config;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     * @param config {Object} - пропсы
     */
    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    /**
     * Возвращает HTML элемент компонента
     * @returns {HTMLElement}
     */
    get self(){
        return document.querySelector(`.${this.#config.class}`);
    }

    /**
     * Меняет текст
     * @param text {string}
     */
    setText(text) {
        this.self.innerHTML = text;
    }

    /**
     * Рендеринг компонента
     */
    render() {
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["span.hbs"](this.#config)
        );
    }
}