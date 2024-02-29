import "../../../build/home.js"
import {router} from "../../modules/router.js";
import {Button} from "../button/button.js";

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

    handleButtonClick = () => {
        router.redirect("/login")
    }

    render() {
        this.#parent.insertAdjacentHTML(
            'afterbegin',
            window.Handlebars.templates['home.hbs'](this.#config)
        );

        const link = new Button(document.querySelector(".first"), this.#config.linkToLogin, this.handleButtonClick)
        link.render()

    }
}
