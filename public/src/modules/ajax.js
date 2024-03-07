import {AppEventMaker} from "./eventMaker.js";
import {UserStoreEvents} from "../stores/user/events.js";

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
 *
 * @param method {methods}
 * @param url {string}
 * @param data {any}
 * @returns {Promise<{body: {message}, status: number}|{body: any, status: number}>}
 */
const baseRequest = async (method, url, data = null) => {
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

    try{
        const response = await fetch(baseUrl + url, options);
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
     *
     * @param username{string}
     * @param password{string}
     * @returns {Promise<{create_time: string, image_path: string, id: string, username: string}>}
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
     *
     * @param username{string}
     * @param password{string}
     * @returns {Promise<{create_time: string, image_path: string, id: string, username: string}>}
     */
    SignUp = async (username, password) => {
        const {status, body} = await baseRequest(
            methods.POST,this.#baseUrl + "/signup",
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
     *
     * @returns {Promise<{message: string}>}
     */
    Logout = async () => {
        const {status, body} = await baseRequest(
            methods.DELETE,this.#baseUrl + "/logout"
        );

        console.log(status);

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
     *
     * @returns {Promise<{message}|null>}
     * @throws Error - not authorized
     */
    CheckUser = async () => {
        const {status, body} = await baseRequest(methods.GET, this.#baseUrl + "/check_user");

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
     *
     * @returns {Promise<{message}|{any}>}
     */
    GetAll = async () => {
        const {status, body} = await baseRequest(
            methods.GET,this.#baseUrl + "/get_all"
        );

        if (status === 200) {
            for (const elem of body) {
                const decoded = atob(elem.data);
                const bytes = Uint8Array.from(decoded, (m) => m.codePointAt(0));
                elem.data = JSON.parse(new TextDecoder().decode(bytes));
            }
            return body;
        } else {
            throw Error(body.message);
        }
    };
}

export const AppAuthRequests = new AuthRequests();

export const AppNoteRequests = new NoteRequests();