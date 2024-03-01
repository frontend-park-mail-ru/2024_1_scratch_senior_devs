import {AppDispatcher} from "../../modules/dispathcer.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {UserStoreEvents} from "./events.js";
import {router} from "../../modules/router.js";

class UserStore {
    #state = {
        username: '',
        avatarUrl: '/src/assets/settings.png',
        isAuth: false
    }

    registerEvents(){
        AppDispatcher.register((action) => {
            switch (action.type){
                case UserActions.LOGIN:
                    this.login(action.payload);
                    break;
                case UserActions.LOGOUT:
                    this.logout();
                    break;
            }
        })
    }

    get username() {
        return this.#state.username;
    }

    get avatar() {
        return this.#state.avatarUrl;
    }

    IsAuthenticated() {
        return this.#state.isAuth;
    }

    login(username){
        console.log("login successfull");
        this.#state.isAuth = true;
        this.#state.username = username;
        AppEventMaker.notify(UserStoreEvents.SUCCSSESFUL_LOGIN);
    }

    logout() {
        console.log("logout successfull");
        this.#state.isAuth = false;
        this.#state.username = "";
        AppEventMaker.notify(UserStoreEvents.LOGOUT);
        router.redirect("/");
    }
}

export const AppUserStore = new UserStore();

export const UserActions = {
    LOGIN: "LOGIN",
    REGISTER: "REGISTER",
    LOGOUT: "LOGOUT"
}