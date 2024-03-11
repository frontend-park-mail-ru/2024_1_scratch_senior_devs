import {Toast} from "../components/toast/toast.js";
import {AppEventMaker} from "./eventMaker.js";

class Toasts {
    #parent;

    #toasts;

    constructor() {
        this.#toasts = [];
    }

    get self() {
        return document.querySelector(".toasts-wrapper");
    }

    #show(title, message, type) {
        const toast = new Toast(this.#parent, title, message, type);
        toast.render();

        this.#toasts.forEach(toast => {
            toast.self.style.top = `${toast.self.offsetTop + 100}px`;
        });

        this.#toasts.push(toast);
        if (this.#toasts.length > 3) {
            const hiddenToast = this.#toasts[0];
            hiddenToast.close();
            this.#toasts = this.#toasts.filter(toast => toast.id !== hiddenToast.id);
        }
    }

    success(title, message) {
        this.#show(title, message, TOAST_TYPE.SUCCESS);
    }

    error(title, message) {
        this.#show(title, message, TOAST_TYPE.ERROR);
    }

    init (parent) {
        this.#parent = parent;

        AppEventMaker.subscribe(ToastEvents.TOAST_CLOSE, (id) => {
            let flag = false;
            this.#toasts.forEach(toast => {
                if (toast.id === id) {
                    flag = true;
                }

                if (!flag) {
                    setTimeout(() => {
                        toast.self.style.top = `${toast.self.offsetTop - 100}px`;
                    }, 250);
                }
            });

            this.#toasts = this.#toasts.filter(toast => toast.id !== id);
        });
    }
}

export const ToastEvents = {
    TOAST_CLOSE: "TOAST_CLOSE"
};

export const TOAST_TYPE = {
    SUCCESS: "success",
    ERROR: "error"
};

export const toasts = new Toasts();