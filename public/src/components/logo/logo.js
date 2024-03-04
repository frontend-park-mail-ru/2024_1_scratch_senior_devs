import {Image} from "../image/image.js";
import "../../../build/logo.js";
import {AppUserStore} from "../../stores/user/userStore.js";
import {router} from "../../modules/router.js";

export class Logo {
    #parent;
    #config;

    #img;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get self(){
        return document.getElementById(this.#config.id);
    }

    #handleClick() {
        const href = AppUserStore.IsAuthenticated() ? "/notes" : "/";
        router.redirect(href);
    }

    render() {
        this.#parent.insertAdjacentHTML(
            "afterbegin",
            window.Handlebars.templates["logo.hbs"](this.#config)
        );

        this.self.addEventListener("click", this.#handleClick)

        this.#img = new Image(this.self, this.#config.img);
        this.#img.render();
    }
}