import "../../../build/home.js"
import {router} from "../../modules/router.js";
import {Button} from "../button/button.js";
import {Image} from "../image/image.js";

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


        const image = new Image(this.self.querySelector(".right-container"), this.#config.previewImage)
        image.render()

        const link = new Button(this.self.querySelector(".left-container"), this.#config.linkToLogin, this.handleButtonClick)
        link.render()

    }
}
