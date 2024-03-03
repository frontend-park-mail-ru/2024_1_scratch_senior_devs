import '../../../build/settings-panel.js'
import {Image} from "../image/image.js";
import {Button} from "../button/button.js";
import {Span} from "../span/span.js";
import {AppUserStore, UserActions} from "../../stores/user/userStore.js";
import {AppDispatcher} from "../../modules/dispathcer.js";
import {router} from "../../modules/router.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {UserStoreEvents} from "../../stores/user/events.js";

export class SettingsPanel {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get self(){
        return document.getElementById(this.#config.id);
    }

    get button() {
        return document.getElementById("settings-button")
    }

    get panel(){
        return document.getElementById(this.#config.panel.id)
    }

    remove() {
        this.#removeEventListeners()
        this.self.remove()
    }

    handleLogout() {
        AppDispatcher.dispatch({
            type: UserActions.LOGOUT
        })
    }

    handleClick = (e) => {
        e.preventDefault()
        this.self.classList.toggle("show")
    }

    #addEventListeners(){
        this.button.addEventListener('click', this.handleClick);
    }

    #removeEventListeners(){
        this.button.removeEventListener('click', this.handleClick);
    }

    render(){
        this.#parent.insertAdjacentHTML(
            'beforeend',
            Handlebars.templates['settings-panel.hbs'](this.#config)
        )

        const avatar = new Image(this.panel, this.#config.panel.avatar)
        avatar.render()
        avatar.updateImage(AppUserStore.avatar)

        const span = new Span(this.panel, this.#config.panel.username)
        span.render()
        span.setText(AppUserStore.username)

        const logoutBtn = new Button(this.panel, this.#config.panel.logoutBtn, this.handleLogout)
        logoutBtn.render()

        this.#addEventListeners();
    }
}