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
            type: type
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

    /**
     * Возвращаем иконку тоста
     * @param type - тип тоста
     * @returns {string} - svg
     */
    #icon(type) {
        if (type === TOAST_TYPE.SUCCESS) {
            return "<svg xmlns=\"http://www.w3.org/2000/svg\" class='icon' viewBox=\"0 0 50 50\" width=\"50px\" height=\"50px\"><path fill=\"#5ad937\" d=\"M25,2C12.318,2,2,12.318,2,25c0,12.683,10.318,23,23,23c12.683,0,23-10.317,23-23C48,12.318,37.683,2,25,2z M35.827,16.562\tL24.316,33.525l-8.997-8.349c-0.405-0.375-0.429-1.008-0.053-1.413c0.375-0.406,1.009-0.428,1.413-0.053l7.29,6.764l10.203-15.036\tc0.311-0.457,0.933-0.575,1.389-0.266C36.019,15.482,36.138,16.104,35.827,16.562z\"/></svg>";
        } else if (type === TOAST_TYPE.ERROR) {
            return "<svg xmlns=\"http://www.w3.org/2000/svg\" class='icon' data-name=\"Layer 1\" viewBox=\"0 0 24 24\" id=\"error\"><path fill=\"#c92432\" d=\"M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm4.242,14.829a1,1,0,0,1,0,1.414,1.026,1.026,0,0,1-1.414,0L12,13.414,9.172,16.243a1.01,1.01,0,0,1-1.414,0,1,1,0,0,1,0-1.414L10.586,12,7.758,9.171A1,1,0,1,1,9.172,7.757L12,10.586l2.828-2.829a1,1,0,1,1,1.414,1.414L13.414,12Z\"></path></svg>";
        }
    }

    /**
     * Закрывает тост
     */
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

        this.self.querySelector(".toast-content").insertAdjacentHTML("afterbegin", this.#icon(this.type));

        setTimeout(() => this.close(), 3000);
    }
}