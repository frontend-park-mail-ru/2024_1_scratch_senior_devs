import {AppDispatcher} from "../../modules/dispathcer.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {UserStoreEvents} from "./events.js";
import {router} from "../../modules/router.js";
import {AppAuthRequests} from "../../modules/ajax.js";

class UserStore {
    #state

    /**
     * Конструктор класса
     */
    constructor() {
        this.#state = {
            username: "",
            avatarUrl: "/src/assets/avatar.png",
            isAuth: false
        };
    }

    /**
     * Регистрирует ивенты
     */
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
                case UserActions.CHECK_USER:
                    console.log("action handled");
                    await this.checkUser();
                    break;
            }
        });
    }

    /**
     * Возвращает логин пользователя
     * @returns {string}
     */
    get username() {
        return this.#state.username;
    }

    /**
     * Возвращает url аватарки пользователя
     * @returns {string}
     */
    get avatar() {
        return this.#state.avatarUrl;
    }

    /**
     * Возвращает true, если пользователь авторизован, иначе false
     * @returns {boolean}
     */
    IsAuthenticated() {
        console.log("IsAuthenticated")
        console.log(this.#state)
        return this.#state.isAuth;
    }

    /**
     * Выполняет авторизацию пользователя
     * @param credentials{{login: string, password: string}} принимает логин и пароль
     * @returns {Promise<void>}
     */
    async login(credentials){
        try {
            const res = await AppAuthRequests.Login(credentials.login, credentials.password);
            console.log("login successfull");
            this.#state.isAuth = true;
            this.#state.username = res.username;
            router.redirect("/notes");
            AppEventMaker.notify(UserStoreEvents.SUCCESSFUL_LOGIN);
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Делает выход из аккаунта
     * @returns {Promise<void>}
     */
    async logout() {
        try {
            await AppAuthRequests.Logout();
            console.log("logout successful");
            this.#state.isAuth = false;
            this.#state.username = "";
            router.redirect("/");
            AppEventMaker.notify(UserStoreEvents.LOGOUT);
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Выполняет регистрацию пользователя
     * @param credentials
     * @returns {Promise<void>}
     */
    async register(credentials) {
        try {
            const res = await AppAuthRequests.SignUp(credentials.login, credentials.password);
            console.log("signup successfull");
            this.#state.isAuth = true;
            this.#state.username = res.username;
            router.redirect("/notes");
            AppEventMaker.notify(UserStoreEvents.SUCCESSFUL_LOGIN);
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Проверяет, авторизован ли пользователь
     * @returns {Promise<void>}
     */
    async checkUser(){
        try {
            console.log("зареган");
            const res = await AppAuthRequests.CheckUser();
            this.#state.isAuth = true;
            this.#state.username = res.username;
            // router.redirect("/notes")
            AppEventMaker.notify(UserStoreEvents.SUCCESSFUL_LOGIN);
        } catch (err) {
            console.log("не зареган");
            console.log(err);
            // router.redirect("/");
        }
    }
}

/**
 *
 * @type {UserStore}
 */
export const AppUserStore = new UserStore();

/**
 *
 * @type {{REGISTER: string, LOGOUT: string, CHANGE_PAGE: string, LOGIN: string, CHECK_USER: string}}
 */
export const UserActions = {
    LOGIN: "LOGIN",
    REGISTER: "REGISTER",
    LOGOUT: "LOGOUT",
    CHANGE_PAGE: "CHANGE_PAGE",
    CHECK_USER: "CHECK_USER"
};