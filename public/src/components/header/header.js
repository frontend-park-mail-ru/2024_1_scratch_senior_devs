import "../../../build/header.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {UserStoreEvents} from "../../stores/user/events.js";
import {AppUserStore} from "../../stores/user/userStore.js";
import {router} from "../../modules/router.js";
import {Button} from "../button/button.js";
import {SettingsPanel} from "../settings-panel/settings-panel.js";
import {Logo} from "../logo/logo.js";

export class Header {
    #parent;
    #config;

    #logo;

    #menu;

    #authPageLink;

    #settingsPanel;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get self () {
        return document.getElementById("header");
    }

    #addEventListeners(){
        AppEventMaker.subscribe(UserStoreEvents.SUCCESSFUL_LOGIN, () => {
            if (this.#settingsPanel === undefined) {
                this.#settingsPanel = new SettingsPanel(document.querySelector(".right-container"), this.#config.settings);
            }
            this.#settingsPanel.render();

            this.#authPageLink.self.classList.add("hidden");
        });

        AppEventMaker.subscribe(UserStoreEvents.CHANGE_PAGE, (href) => {
            console.log("CHANGE_PAGE");
            if (href === "/") {
                if (!AppUserStore.IsAuthenticated()) {
                    this.#authPageLink.self.classList.remove("hidden");
                }
            } else {
                this.#authPageLink.self.classList.add("hidden");
            }
        });

        AppEventMaker.subscribe(UserStoreEvents.LOGOUT, () => {
            console.log("LOGOUT");

            this.#settingsPanel.remove();

            if (this.#authPageLink === undefined) {
                this.#authPageLink = new Button(this.#menu, this.#config.menu.auth, this.handleButtonClick);
                this.#authPageLink.render();
            } else {
                this.#authPageLink.self.classList.remove("hidden");
            }
        });
    }

    handleButtonClick = () => {
        router.redirect("/login");
    };

    render() {
        console.log("header render");

        this.#parent.insertAdjacentHTML(
            "afterbegin",
            window.Handlebars.templates["header.hbs"](this.#config)
        );

        this.#logo = new Logo(document.querySelector(".logo-container"), this.#config.logo);
        this.#logo.render();


        const rightContainer = document.querySelector(".right-container");

        this.#menu = document.createElement("div");
        this.#menu.className = "menu-container";

        rightContainer.appendChild(this.#menu);

        if (AppUserStore.IsAuthenticated()) {
            this.#settingsPanel = new SettingsPanel(document.querySelector(".right-container"), this.#config.settings);
            this.#settingsPanel.render();
        } else {
            this.#authPageLink = new Button(this.#menu, this.#config.menu.auth, this.handleButtonClick);
            this.#authPageLink.render();
        }

        this.#addEventListeners();

    }
}
