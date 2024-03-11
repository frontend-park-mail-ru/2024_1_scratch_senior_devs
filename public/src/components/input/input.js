import "../../../build/input.js";
import {inputEvents} from "./events.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {create_UUID} from "../../shared/uuid.js";

export class Input {
    #parent;
    #config;
    #listeners = {
        togglePassword: "",
        change: ""
    };

    #images;
    #input;
    #error;
    id;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     * @param config {Object} - пропсы
     */
    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
        this.#config.id = create_UUID();

        this.id = this.#config.id;

        this.#listeners.togglePassword = this.#togglePassword.bind(this);
        this.#listeners.change = this.#change.bind(this);

        this.#config.isPassword = this.#config.type === "password";
    }

    /**
     * Возвращает HTML элемент компонента
     * @returns {Element}
     */
    get self() {
        return document.querySelector(`#input-${this.#config.id}`);
    }

    /**
     * Возвращает значение инпута
     * @returns {string}
     */
    get value() {
        return this.#input.value;
    }

    /**
     * Показывает сообщение об ошибке
     * @param message {string}
     */
    throwError(message) {
        this.self.classList.remove("success");
        this.self.classList.add("error");
        this.#error.innerText = message;
    }

    /**
     * Убирает сообщение об ошибке
     */
    cleanError() {
        this.self.classList.remove("error");
        this.#error.innerText = "";
    }

    /**
     * При изменении оповещает все подписанные на него компоненты
     */
    #change = () => {
        AppEventMaker.notify(inputEvents.INPUT_CHANGE, this.#config.id);
    };

    /**
     * Меняет отображение пароля
     */
    #togglePassword() {
        if (this.#input.type === "password") {
            this.#input.type = "text";
        } else {
            this.#input.type = "password";
        }
    }

    /**
     * Подписка на события
     */
    #addEventListeners() {
        if(this.#config.isPassword){
            this.#images.forEach(img => img.addEventListener("click", this.#listeners.togglePassword));
        }

        this.#input.addEventListener("input", this.#listeners.change);
    }

    /**
     * Отписка от событий
     */
    #removeEventListeners() {
        if (this.#config.isPassword){
            this.#images.forEach(img => img.removeEventListener("click", this.#listeners.togglePassword));
        }

        this.#input.removeEventListener("input", this.#listeners.change);
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
    render() {
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["input.hbs"](this.#config)
        );

        this.#images = document.querySelectorAll(`#input-${this.#config.id} > img`);
        this.#input = document.querySelector(`#input-${this.#config.id} > input`);
        this.#error = this.self.querySelector(".errors-container");

        this.#addEventListeners();
    }
}
