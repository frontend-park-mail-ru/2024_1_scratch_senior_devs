import {AppDispatcher} from "../modules/dispathcer.js";
import {AppEventMaker} from "../modules/eventMaker.js";

class UserStore {
    #state = {
        username: '',
        isAuth: false
    }

    constructor() {

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
        AppEventMaker.notify();
    }
}

export const AppUserStore = new UserStore();

export const UserActions = {
    LOGIN: "LOGIN"
}