import "../../../build/toast.js";
import {create_UUID} from "../../shared/uuid.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {TOAST_TYPE, ToastEvents} from "../../modules/toasts.js";

export class Toast {
    #parent;

    #closeBtn;
    #progressBar;

    #title;
    #message;

    id;
    type;

    #props;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     * @param title {string}
     * @param message {string}
     * @param type {string}
     */
    constructor(parent, title, message, type) {
        this.id = create_UUID();
        this.type = type;
        this.#props = {
            id: this.id,
            type: type,
            icon: this.#icon(type)
        };
        this.#parent = parent;
        this.#title = title;
        this.#message = message;
    }

    /**
     * Возвращает HTML элемент компонента
     * @returns {HTMLElement}
     */
    get self(){
        return document.getElementById(this.id);
    }

    #icon(type) {
        if (type === TOAST_TYPE.SUCCESS) {
            return "./src/assets/success.png";
        } else if (type === TOAST_TYPE.ERROR) {
            return "./src/assets/error.png";
        }
    }

    close() {
        if (!this.self) {
            return;
        }

        this.self.classList.add("hide");

        setTimeout(() => {
            this.self.remove();
        }, 500);

        AppEventMaker.notify(ToastEvents.TOAST_CLOSE, this.id);
    }

    /**
     * Рендеринг компонента
     */
    render() {
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["toast.hbs"](this.#props)
        );

        this.self.classList.add("active");

        this.self.querySelector(".title").innerText = this.#title;

        this.self.querySelector(".message").innerText = this.#message;

        this.#closeBtn = this.self.querySelector(".close");
        this.#closeBtn.addEventListener("click", () => this.close());

        this.#progressBar = this.self.querySelector(".progress");
        this.#progressBar.classList.add("active");

        setTimeout(() => this.close(), 3000);
    }
}