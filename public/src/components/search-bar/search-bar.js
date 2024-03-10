import "../../../build/search-bar.js"
import {AppNotesStore} from "../../stores/notes/notesStore.js";

export class SearchBar {
    #parent;
    #config;

    #input;

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
    get self() {
        return document.getElementById(this.#config.id);
    }

    /**
     * При наборе символов отправляется поисковой запрос
     * @param e
     */
    #handleChange = (e) => {
        const query = e.target.value;
        AppNotesStore.searchNotes(query);
    }

    /**
     * Подписка на события
     */
    #addEventListeners() {
        this.#input.addEventListener("input", this.#handleChange)
    }

    /**
     * Отписка от событий
     */
    #removeEventListeners() {
        this.#input.removeEventListener("input", this.#handleChange)
    }

    /**
     * Очистка
     */
    remove() {
        this.#removeEventListeners();
    }

    /**
     * Рендеринг формы
     */
    render() {
        this.#parent.insertAdjacentHTML(
            "afterbegin",
            window.Handlebars.templates["search-bar.hbs"](this.#config)
        );

        this.#input = this.self.querySelector("input");

        this.#addEventListeners();
    }
}