import {AppDispatcher} from "../../modules/dispathcer.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {UserStoreEvents} from "./events.js";

class UserStore {
    #state = {
        username: '',
        isAuth: false
    }

    constructor() {
        this.registerEvents();
    }

    registerEvents(){
        AppDispatcher.register((action) => {
            switch (action.type){
                case UserActions.LOGIN:
                this.login();
            }
        })
    }

    login(){
        console.log("logged");
        this.#state.isAuth = true;
        AppEventMaker.notify(UserStoreEvents.SUCCSSESFUL_LOGIN);
    }
}

export const AppUserStore = new UserStore();

export const UserActions = {
    LOGIN: "LOGIN"
}