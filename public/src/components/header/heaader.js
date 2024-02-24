import {Avatar} from "../avatar/avatar.js";
import {Link} from "../link/link.js";

export class Header {
    #parent;
    #config;
    #isAuth;

    constructor(parent, config, isAuth) {
        this.#parent = parent;
        this.#config = config;
        this.#isAuth = isAuth;
    }

    render() {
        this.#parent.insertAdjacentHTML('beforebegin', window.Handlebars.templates['header.hbs'](this.#config.header));

        const self = document.getElementById("header")

        const rightContainer = document.querySelector(".right-container")

        const menu = document.createElement("div")
        menu.className = "menu-container"

        this.#config.header.menu.forEach(item => {
            const link = new Link(menu, item, this.#isAuth)
            link.render()
        })

        // TODO
        // Сделать logout

        rightContainer.appendChild(menu)

        if (this.#isAuth) {
            const avatar = new Avatar(rightContainer, this.#config.avatar);
            avatar.render();
        }
    }
}
