import "../../../build/settings-panel.js";
import {Image} from "../image/image.js";
import {Button} from "../button/button.js";
import {Span} from "../span/span.js";
import {AppUserStore, UserActions} from "../../stores/user/userStore.js";
import {AppDispatcher} from "../../modules/dispathcer.js";
import {SettingsButton} from "./settings-button/settings-button.js";

export class SettingsPanel {
    #parent;
    #config;

    #settingsButton;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get self(){
        return document.getElementById(this.#config.id);
    }

    get panel(){
        return document.getElementById(this.#config.panel.id);
    }

    remove() {
        this.#settingsButton.remove();
        this.self.remove();
    }

    handleLogout() {
        AppDispatcher.dispatch({
            type: UserActions.LOGOUT
        });
    }

    handleClick = () => {
        this.self.classList.toggle("show");
    };


    render(){
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["settings-panel.hbs"](this.#config)
        );

        this.#settingsButton = new SettingsButton(this.self, this.handleClick)
        this.#settingsButton.render()

        const avatar = new Image(this.panel, this.#config.panel.avatar);
        avatar.render();
        avatar.updateImage(AppUserStore.avatar);

        const span = new Span(this.panel, this.#config.panel.username);
        span.render();
        span.setText(AppUserStore.username);

        const logoutBtn = new Button(this.panel, this.#config.panel.logoutBtn, this.handleLogout);
        logoutBtn.render();
    }
}