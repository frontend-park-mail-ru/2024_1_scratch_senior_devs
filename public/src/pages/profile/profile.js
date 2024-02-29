import "../../../build/profile.js"
import {AppUserStore, UserActions} from "../../stores/user/userStore.js";
import {Button} from "../../components/button/button.js";
import {AppDispatcher} from "../../modules/dispathcer.js";

export default class ProfilePage {
    #parent;
    #config;

    needAuth;

    #logoutBtn;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
        this.needAuth = true;
    }

    get href () {
        return this.#config.href;
    }

    get self () {
        return document.getElementById(this.#config.id);
    }

    remove(){
        this.self.remove()
    }

    handleLogout() {
        console.log('logout bitch')

        AppDispatcher.dispatch({
            type: UserActions.LOGOUT
        })
    }

    render() {
        console.log("Profile page render")

        this.#parent.insertAdjacentHTML(
            'afterbegin',
            window.Handlebars.templates['profile.hbs'](this.#config)
        );


        const test = document.createElement("h1")
        test.innerText = `Добро пожаловать, ${AppUserStore.username}`
        this.self.appendChild(test)

        this.#logoutBtn = new Button(this.self, this.#config.logoutBtn, this.handleLogout)
        this.#logoutBtn.render()


    }
}
