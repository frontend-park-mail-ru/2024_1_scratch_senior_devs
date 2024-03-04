import "../../../build/note.js";
import {truncate} from "../../modules/utils.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {noteEvents} from "../../pages/notes/events.js";

export class Note {
    #parent;
    #props;
    #config;

    #selectNote;

    constructor(parent, config, selectNote) {
        this.#parent = parent;
        this.#config = config;
        this.#selectNote = selectNote;
        this.#props = {
            id: this.#config.id,
            title: this.#config.data.title,
            content: truncate(this.#config.data.content, 50)
        };
    }

    get self() {
        return document.getElementById(this.#config.id);
    }

    render() {
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["note.hbs"](this.#props)
        );

        this.self.addEventListener("click", () => {
            console.log("click");
            console.log(this.#config.id);
            AppEventMaker.notify(noteEvents.NOTE_SELECTED, this.#config);
        });

        console.log(this.#props);
    }
}