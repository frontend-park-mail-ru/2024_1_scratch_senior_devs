import "../../../build/note.js";
import {truncate} from "../../modules/utils.js";

export class Note {
    #parent;
    #props;
    #config;

    #selectNote;

    constructor(parent, config, selectNote) {
        this.#parent = parent;
        this.#config = config;

        this.#props = {
            id: this.#config.id,
            title: this.#config.data.title,
            content: truncate(this.#config.data.content, 50),
            create_time: this.#config.create_time,
            update_time: new Intl.DateTimeFormat("ru", {
                month: 'short', day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hourCycle: 'h23'
            }).format(new Date(this.#config.update_time)).replace(',', '')
        };

        this.#selectNote = selectNote;
    }

    get self() {
        return document.getElementById(this.#config.id);
    }

    render() {
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["note.hbs"](this.#props)
        );
    }
}