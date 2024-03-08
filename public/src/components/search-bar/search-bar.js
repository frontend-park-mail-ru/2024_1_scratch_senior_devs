import "../../../build/search-bar.js"
import {AppNotesStore} from "../../stores/notes/notesStore.js";

export class SearchBar {
    #parent;
    #config;

    #input;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get self() {
        return document.getElementById(this.#config.id);
    }

    #handleChange = (e) => {
        console.log(e.target.value);
        const query = e.target.value;
        AppNotesStore.searchNotes(query);
    }

    #addEventListeners() {
        this.#input.addEventListener("input", this.#handleChange)
    }

    #removeEventListeners() {
        this.#input.removeEventListener("input", this.#handleChange)
    }

    remove() {
        this.#removeEventListeners();
    }

    render() {
        this.#parent.insertAdjacentHTML(
            "afterbegin",
            window.Handlebars.templates["search-bar.hbs"](this.#config)
        );

        this.#input = this.self.querySelector("input");

        this.#addEventListeners();
    }
}