import {AppDispatcher} from "../../modules/dispathcer.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {UserStoreEvents} from "./events.js";
import {router} from "../../modules/router.js";
import {AppAuthRequests} from "../../modules/ajax.js";

class UserStore {
    #state = {
        username: 'YarikMix',
        avatarUrl: '/src/assets/avatar.png',
        isAuth: false
    }

    registerEvents(){
        AppDispatcher.register(async (action) => {
            switch (action.type){
                case UserActions.LOGIN:
                    await this.login(action.payload);
                    break;
                case UserActions.LOGOUT:
                    await this.logout();
                    break;
                case UserActions.REGISTER:
                    await this.register(action.payload);
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

    async login(credentials){
        try {
            const res = await AppAuthRequests.Login(credentials.login, credentials.password)
            console.log("login successfull");
            this.#state.isAuth = true;
            this.#state.username = res.username;
            AppEventMaker.notify(UserStoreEvents.SUCCESSFUL_LOGIN);
        } catch (err) {
            console.log(err);
        }
    }

    async logout() {
        try {
            await AppAuthRequests.Logout();
            console.log("logout successful");
            this.#state.isAuth = false;
            this.#state.username = "";
            router.redirect('/');
            AppEventMaker.notify(UserStoreEvents.LOGOUT);
        } catch (err) {
            console.log(err);
        }
    }

    async register(credentials) {
        try {
            const res = await AppAuthRequests.SignUp(credentials.login, credentials.password)
            console.log("signup successfull");
            this.#state.isAuth = true;
            this.#state.username = res.username;
            router.redirect('/');
            AppEventMaker.notify(UserStoreEvents.SUCCESSFUL_LOGIN);
        } catch (err) {
            console.log(err);
        }
    }
}

export const AppUserStore = new UserStore();

export const UserActions = {
    LOGIN: "LOGIN",
    REGISTER: "REGISTER",
    LOGOUT: "LOGOUT",
    CHANGE_PAGE: "CHANGE_PAGE"
}