import "../../../build/not-found.js"
import {router} from "../../modules/router.js";
import {Button} from "../../components/button/button.js";

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
        this.self.remove()
    }

    handleButtonClick = () => {
        router.redirect("/")
    }

    render() {
        console.log("404 page render")

        this.#parent.insertAdjacentHTML(
            'afterbegin',
            window.Handlebars.templates['not-found.hbs'](this.#config)
        );

        const link = new Button(this.self, this.#config.link, this.handleButtonClick)
        link.render()
    }
}
