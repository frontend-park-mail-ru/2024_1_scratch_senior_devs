import "../../../build/input.js";
import {inputEvents} from "./events.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {create_UUID} from "../../shared/uuid.js";

export class Input {
    #parent;
    #config;
    #listeners = {
        showPassword: "",
        change: ""
    };

    #images;
    #input;

    id;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
        this.#config.id = create_UUID();

        this.id = this.#config.id;

        this.#listeners.showPassword = this.#showPassword.bind(this);
        this.#listeners.change = this.#change.bind(this);

        this.#config.isPassword = this.#config.type === "password";
    }

    get self() {
        return document.querySelector(`#input-${this.#config.id}`);
    }

    get value() {
        return this.#input.value;
    }

    throwError(message) {
        this.self.classList.remove("success");
        this.self.classList.add("error");
        this.self.querySelector(".errors-container").innerText = message;
    }

    cleanError() {
        this.self.classList.remove("error");
        this.self.querySelector(".errors-container").innerText = "";
    }

    #change = () => {
        AppEventMaker.notify(inputEvents.INPUT_CHANGE, this.#config.id);
    };

    #showPassword() {
        if (this.#input.type === "password") {
            this.#input.type = "text";
        } else {
            this.#input.type = "password";
        }
    }

    #addEventListeners() {
        if(this.#config.isPassword){
            this.#images.forEach(img => img.addEventListener("click", this.#listeners.showPassword));
        }

        this.#input.addEventListener("input", this.#listeners.change);
    }

    #removeEventListeners() {
        if (this.#config.isPassword){
            this.#images.forEach(img => img.removeEventListener("click", this.#listeners.showPassword));
        }

        this.#input.removeEventListener("input", this.#listeners.change);
    }

    remove(){
        this.#removeEventListeners();
    }

    render() {
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["input.hbs"](this.#config)
        );

        this.#images = document.querySelectorAll(`#input-${this.#config.id} > img`);
        this.#input = document.querySelector(`#input-${this.#config.id} > input`);
        this.#addEventListeners();

    }
}
