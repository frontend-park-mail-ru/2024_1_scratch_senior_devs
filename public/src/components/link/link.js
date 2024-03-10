import "../../../build/link.js";
import {router} from "../../modules/router.js";
import {create_UUID} from "../../shared/uuid.js";

export class Link {
    #parent;

    #props = {};

    id;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     * @param config {Object} - пропсы
     */
    constructor(parent, config) {
        this.id = create_UUID();

        this.#parent = parent;

        this.#props.id = this.id;
        this.#props.text = config.text;
        this.#props.href = config.href;
    }

    /**
     * Возвращает HTML элемент компонента
     * @returns {HTMLElement}
     */
    get self(){
        return document.getElementById(this.id);
    }

    /**
     * При клике на ссылке происходит редирект на указанный адрес
     * @param e
     */
    handleClick = (e) => {
        e.preventDefault();
        router.redirect(this.#props.href);
    };

    /**
     * Подписка на события
     */
    #addListeners () {
        this.self.addEventListener("click", this.handleClick);
    }

    /**
     * Отписка от событий
     */
    #removeListeners () {
        this.self.removeEventListener("click", this.handleClick);
    }

    /**
     * Очистка
     */
    remove() {
        this.#removeListeners();
    }

    /**
     * Рендеринг компонента
     */
    render() {
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["link.hbs"](this.#props)
        );

        this.#addListeners();
    }
}
