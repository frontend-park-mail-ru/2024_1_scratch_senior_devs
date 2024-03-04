import "../../../build/button.js";
import {create_UUID} from "../../shared/uuid.js";

export class Button {
    #parent;
    #props = {
        id: "",
        text: "",
    };
    #onSubmit;

    constructor(parent, config, onSubmit) {
        this.id = create_UUID();
        this.#parent = parent;
        this.#props.id = this.id;
        this.#props.text = config.text;
        this.#onSubmit = onSubmit;
    }

    get self(){
        return document.getElementById(this.id);
    }

    #addEventListeners(){
        if (this.#onSubmit !== undefined) {
            this.self.addEventListener("click", (e) => {
                e.preventDefault();
                this.#onSubmit();
            });
        }
    }

    #removeEventListeners(){
        this.self.removeEventListener("click", this.#onSubmit);
    }

    remove(){
        if (this.#onSubmit !== undefined) {
            this.#removeEventListeners();
        }
    }

    render(){
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["button.hbs"](this.#props)
        );

        this.#addEventListeners();
    }
}