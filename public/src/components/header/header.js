import {Image} from "../image/image.js";
import {Link} from "../link/link.js";
import '../../../build/header.js';
import {AppEventMaker} from "../../modules/eventMaker.js";
import {UserStoreEvents} from "../../stores/user/events.js";
import {AppUserStore} from "../../stores/user/userStore.js";
import {router} from "../../modules/router.js";

export class Header {
    #parent;
    #config;

    #menu;

    #homePageLink;
    #mainPageLink;
    #authPageLink;
    #registerPageLink;

    #avatar;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get self () {
        return document.getElementById("header")
    }

    #addEventListeners(){
        AppEventMaker.subscribe(UserStoreEvents.SUCCSSESFUL_LOGIN, () => {
            console.log("log hueg")

            const avatarLink = new Link(document.querySelector(".right-container"), this.#config.avatarLink)
            avatarLink.render()

            this.#avatar = new Image(avatarLink.self, this.#config.avatar);
            this.#avatar.render();
            this.#avatar.updateImage(AppUserStore.avatar)

            this.#authPageLink.self.hidden = true;

            this.#authPageLink.self.hidden = true;
            this.#registerPageLink.self.hidden = true;

            this.#homePageLink.self.hidden = true;

            this.#mainPageLink = new Link(this.#menu, this.#config.menu.main)
            this.#mainPageLink.render()

            router.changePage("/")
        })
    }

    render() {
        console.log("header render")

        this.#parent.insertAdjacentHTML(
            'afterbegin',
            window.Handlebars.templates['header.hbs'](this.#config)
        );

        const rightContainer = document.querySelector(".right-container")

        this.#menu = document.createElement("div")
        this.#menu.className = "menu-container"

        rightContainer.appendChild(this.#menu)

        if (this.#homePageLink === undefined){
            this.#homePageLink = new Link(this.#menu, this.#config.menu.home)
            this.#homePageLink.render()
        }

        if (this.#authPageLink === undefined) {
            this.#authPageLink = new Link(this.#menu, this.#config.menu.auth)
            this.#authPageLink.render()
        }

        if (this.#registerPageLink === undefined) {
            this.#registerPageLink = new Link(this.#menu, this.#config.menu.register)
            this.#registerPageLink.render()
        }


        // TODO
        // Сделать logout

        this.#addEventListeners();

    }
}
