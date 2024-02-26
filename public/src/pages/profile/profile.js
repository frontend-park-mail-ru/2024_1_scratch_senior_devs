import "../../../build/profile.js"
import {AppUserStore} from "../../stores/user/userStore.js";
import {Button} from "../../components/button/button.js";

export default class ProfilePage {
    #parent;
    #config;

    #logoutBtn;

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

    remove(){
        this.#parent.innerHTML = '';
    }

    render() {
        console.log("Profile page render")

        this.#parent.insertAdjacentHTML(
            'afterbegin',
            window.Handlebars.templates['profile.hbs'](this.#config)
        );

        console.log(this.self)

        this.#logoutBtn = new Button(this.self, this.#config.logoutBtn)
        this.#logoutBtn.render()

        console.log(AppUserStore.username)

        const test = document.createElement("h1")
        test.innerText = `Добро пожаловать, ${AppUserStore.username}`

        this.self.appendChild(test)
    }
}
