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

    #image;
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
            this.#image.src = "/src/assets/eye-open.svg";
        } else {
            this.#input.type = "password";
            this.#image.src = "/src/assets/eye-close.svg";
        }
    }

    #addEventListeners() {
        if(this.#config.isPassword){
            this.#image.addEventListener("click", this.#listeners.showPassword);
        }

        this.#input.addEventListener("input", this.#listeners.change);
    }

    #removeEventListeners() {
        if (this.#config.isPassword){
            this.#image.removeEventListener("click", this.#listeners.showPassword);
        }

        this.#input.removeEventListener("input", this.#listeners.change);
    }

    remove(){
        this.#removeEventListeners();
    }

    render() {
        const template = window.Handlebars.templates["input.hbs"];

        if(this.self === null){
            this.#parent.insertAdjacentHTML(
                "beforeend",
                template(this.#config)
            );

            this.#image = document.querySelector(`#input-${this.#config.id} > img`);
            this.#input = document.querySelector(`#input-${this.#config.id} > input`);
            this.#addEventListeners();
        }


        // const div = document.createElement('div');
        // div.className = "input-container"
        //
        // // const template = Handlebars.templates["input.hbs"];
        // div.innerHTML = template(this.#config);
        //
        // const input = div.querySelector("input");
        //
        // if (this.#config.type === "password") {
        //     this.#image = document.createElement("img");
        //     image.src = "/src/assets/eye-close.svg";
        //     image.className = "show-password-btn";
        //
        //     image.addEventListener("click", function () {
        //         if (input.type === "password") {
        //             input.type = "text";
        //             image.src = "/src/assets/eye-open.svg";
        //         } else {
        //             input.type = "password";
        //             image.src = "/src/assets/eye-close.svg";
        //         }
        //     })
        //
        //     div.appendChild(image);
        // }
        //
        // this.#parent.appendChild(div);

    }
}
