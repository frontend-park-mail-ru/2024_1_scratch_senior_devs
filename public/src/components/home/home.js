import "../../../build/home.js"
import {LinkButton} from "../link-button/link-button.js";

export class Home {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get self () {
        return document.getElementById('home');
    }

    render() {
        this.#parent.insertAdjacentHTML(
            'afterbegin',
            window.Handlebars.templates['home.hbs'](this.#config)
        );

        const link = new LinkButton(document.querySelector(".first"), this.#config.linkToLogin)
        link.render()

    }
}
