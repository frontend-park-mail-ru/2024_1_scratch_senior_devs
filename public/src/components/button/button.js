import "../../../build/button.js";
import {create_UUID} from "../../shared/uuid.js";

export class Button {
    #parent;
    #props = {
        id: "",
        text: "",
    };
    #onSubmit;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     * @param config {Object} - пропсы
     * @param onSubmit {Function} - колбэк-функция, срабатывающая при клике
     */
    constructor(parent, config, onSubmit) {
        this.id = create_UUID();
        this.#parent = parent;
        this.#props.id = this.id;
        this.#props.text = config.text;
        this.#onSubmit = onSubmit;
    }

    /**
     * Возвращает элемент кнопки
     * @returns {HTMLElement}
     */
    get self(){
        return document.getElementById(this.id);
    }

    /**
     * Подписка на событие клика по кнопке
     */
    #addEventListeners(){
        if (this.#onSubmit !== undefined) {
            this.self.addEventListener("click", (e) => {
                e.preventDefault();
                this.#onSubmit();
            });
        }
    }

    /**
     * Отписка от события клика по кнопке
     */
    #removeEventListeners(){
        if (this.#onSubmit !== undefined) {
            this.self.removeEventListener("click", this.#onSubmit);
        }
    }

    /**
     * Очистка
     */
    remove(){
        this.#removeEventListeners();
    }

    /**
     * Рендеринг компонента
     */
    render(){
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["button.hbs"](this.#props)
        );

        this.#addEventListeners();
    }
}