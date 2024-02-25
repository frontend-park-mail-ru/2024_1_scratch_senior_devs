import {AppDispatcher} from "../../modules/dispathcer.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {UserStoreEvents} from "./events.js";

class UserStore {
    #state = {
        username: '',
        avatarUrl: '/src/assets/avatar.png',
        isAuth: false
    }

    registerEvents(){
        AppDispatcher.register((action) => {
            switch (action.type){
                case UserActions.LOGIN:
                    this.login(action.payload);
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
}

export const AppUserStore = new UserStore();

export const UserActions = {
    LOGIN: "LOGIN"
}