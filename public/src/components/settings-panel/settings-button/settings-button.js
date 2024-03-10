import "../../../../build/settings-button.js";

export class SettingsButton {
    #config;
    #parent;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     */
    constructor(parent) {
        this.#parent = parent;
    }

    /**
     * Возвращает HTML элемент кнопки
     * @returns {HTMLElement}
     */
    get self() {
        return this.#parent.querySelector("#settings-button");
    }

    #handleClick = () => {
        this.#parent.classList.toggle("show");
    };

    /**
     * Подписка на события
     */
    #addEventListeners(){
        this.self.addEventListener("click", this.#handleClick);
    }

    /**
     * Отписка от событий
     */
    #removeEventListeners(){
        this.self.removeEventListener("click", this.#handleClick);
    }

    /**
     * Очистка
     */
    remove() {
        this.#removeEventListeners();
    }

    /**
     * Рендеринг компонента
     */
    render() {
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["settings-button.hbs"](this.#config)
        );

        this.#addEventListeners();
    }
}