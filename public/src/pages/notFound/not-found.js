import "../../../build/not-found.js"
import {LinkButton} from "../../components/link-button/link-button.js";

export default class NotFoundPage {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get href () {
        return this.#config.href;
    }

    get self () {
        return document.getElementById(this.#config.id);
    }

    remove() {

    }


    render() {
        console.log("404 page render")

        this.#parent.insertAdjacentHTML(
            'afterbegin',
            window.Handlebars.templates['not-found.hbs'](this.#config)
        );

        const link = new LinkButton(this.self, this.#config.link)
        link.render()
    }
}
