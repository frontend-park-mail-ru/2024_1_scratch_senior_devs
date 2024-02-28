import {Image} from "../image/image.js";
import {Link} from "../link/link.js";
import '../../../build/header.js';
import {AppEventMaker} from "../../modules/eventMaker.js";
import {UserStoreEvents} from "../../stores/user/events.js";
import {AppUserStore} from "../../stores/user/userStore.js";
import {LinkButton} from "../link-button/link-button.js";

export class Header {
    #parent;
    #config;

    #menu;

    #authPageLink;

    #avatar;
    #avatarLink;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get self () {
        return document.getElementById("header")
    }

    #addEventListeners(){
        document.addEventListener("scroll", (event) => {
            if (window.scrollY > 100) {
                this.self.classList.add("black")
            } else {
                this.self.classList.remove("black")
            }
        });


        AppEventMaker.subscribe(UserStoreEvents.SUCCSSESFUL_LOGIN, () => {
            console.log("log hueg")

            if (this.#avatarLink === undefined) {
                this.#avatarLink = new Link(document.querySelector(".right-container"), this.#config.avatarLink)
                this.#avatarLink.render()
            } else {
                this.#avatarLink.self.hidden = false;
            }

            if (this.#avatar === undefined) {
                this.#avatar = new Image(this.#avatarLink.self, this.#config.avatar);
                this.#avatar.render();
            }
            this.#avatar.updateImage(AppUserStore.avatar)


            this.#authPageLink.self.classList.add("hidden");
        })

        AppEventMaker.subscribe(UserStoreEvents.LOGOUT, () => {
            console.log(this.#avatar.self)

            this.#avatarLink.self.hidden = true;

            this.#authPageLink.self.classList.remove("hidden");
        });
    }

    render() {
        console.log("header render")

        this.#parent.insertAdjacentHTML(
            'afterbegin',
            window.Handlebars.templates['header.hbs'](this.#config)
        );

        const logo = new Link(document.querySelector(".logo-container"), this.#config.logo)
        logo.render()

        const rightContainer = document.querySelector(".right-container")

        this.#menu = document.createElement("div")
        this.#menu.className = "menu-container"

        rightContainer.appendChild(this.#menu)

        if (this.#authPageLink === undefined) {
            this.#authPageLink = new LinkButton(this.#menu, this.#config.menu.auth)
            this.#authPageLink.render()
        }


        // TODO
        // Сделать logout

        this.#addEventListeners();

    }
}
