import {AppEventMaker} from "./eventMaker.js";
import {UserStoreEvents} from "../stores/user/events.js";
import {decode} from "./utils.js";

/** @typedef {Promise<{create_time: string, image_path: string, id: string, username: string}>} UserData **/


const isDebug = false;

const baseUrl = `http://${isDebug ? "127.0.0.1" : "you-note.ru"}:8080/api`;

const methods = {
    POST: "POST",
    GET: "GET",
    DELETE: "DELETE",
    PUT: "PUT"
};

let JWT = null;

JWT = window.localStorage.getItem("Authorization");

/**
 * Базовый запрос
 * @param method {methods}
 * @param url {string}
 * @param data {any}
 * @param params {Dict<string, string>}
 * @returns UserDataResponse
 */
const baseRequest = async (method, url, data = null, params=null) => {
    const options = {
        method: method,
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
    };

    if (JWT !== null) {
        options.headers.Authorization = JWT;
    }

    if (data !== null) {
        options.body = JSON.stringify(data);
    }

    let query_url = new URL(baseUrl + url);
    if (params != null) {
        query_url.search = new URLSearchParams(params);
    }

    try{
        const response = await fetch(query_url.toString(), options);
        let body = null;
        try {
            body = await response.json();
        } catch (err) {
            console.log("no body");
        }
        if (response.headers.get("Authorization") !== null) {
            JWT = response.headers.get("Authorization");
            window.localStorage.setItem("Authorization", JWT);
        }
        return {status: response.status, body};
    } catch (err) {
        console.log(err);
        return {status: 503, body: {message: err}};
    }
};

class AuthRequests {
    #baseUrl = "/auth";

    /**
     * Запрос на логин пользователя
     * @param username {string}
     * @param password {string}
     * @returns UserDataResponse
     */
    Login = async (username, password) => {
        const {status, body} = await baseRequest(
            methods.POST,this.#baseUrl + "/login",
            {username, password}
        );

        if (status === 401) {
            AppEventMaker.notify(UserStoreEvents.INVALID_LOGIN_OR_PASSWORD);
        }

        if (status === 200) {
            return {
                id: body.id,
                username: body.username,
                create_time: body.create_time,
                image_path: body.image_path
            };
        }

        throw Error(body.message);
    };

    /**
     * Запрос на регистрацию нового пользователя
     * @param username{string}
     * @param password{string}
     * @returns UserDataResponse
     */
    SignUp = async (username, password) => {
        const {status, body} = await baseRequest(
            methods.POST,
            this.#baseUrl + "/signup",
            {username, password}
        );

        if (status === 400) {
            AppEventMaker.notify(UserStoreEvents.LOGIN_ALREADY_EXIST);
        }

        if (status === 201) {
            return {
                id: body.id,
                username: body.username,
                create_time: body.create_time,
                image_path: body.image_path
            };
        }

        throw Error(body.message);
    };

    /**
     * Запрос на логаут пользователя
     * @returns {Promise<{message: string}>}
     */
    Logout = async () => {
        const {status, body} = await baseRequest(
            methods.DELETE,
            this.#baseUrl + "/logout"
        );

        if (status === 204){
            console.log("logged out");
            JWT = null;
            return {
                message: "ok"
            };
        } else {
            throw Error(body.message);
        }
    };

    /**
     * Запрос на проверку пользователя
     * @returns {Promise<{message}|null>}
     * @throws Error - not authorized
     */
    CheckUser = async () => {
        const {status, body} = await baseRequest(
            methods.GET,
            this.#baseUrl + "/check_user"
        );

        if (status === 200) {
            return body;
        } else {
            throw Error("not authorized");
        }
    };
}

class NoteRequests {
    #baseUrl = "/note";

    /**
     * Получение списка всех заметок
     * @returns {Promise<{message}|{any}>}
     */
    GetAll = async (params=null) => {

        const {status, body} = await baseRequest(
            methods.GET,
            this.#baseUrl + "/get_all",
            null,
            params
        );

        if (status === 200) {
            for (const elem of body) {
                elem.data = decode(elem.data)
            }
            return body;
        } else {
            throw Error(body.message);
        }
    };

    /**
     * Получение одной заметки
     * @param id {number} - id заметки
     * @returns {Promise<*>}
     */
    Get = async (id) => {

        const {status, body} = await baseRequest(
            methods.GET,
            this.#baseUrl + "/" + id,
            null
        );

        if (status === 200) {
            body.data = decode(body.data)
            return body;
        } else {
            throw Error(body.message);
        }
    };
}

export const AppAuthRequests = new AuthRequests();

export const AppNoteRequests = new NoteRequests();