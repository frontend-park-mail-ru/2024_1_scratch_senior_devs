import {decode, timeout} from "./utils";

const isDebug = true;

const REQUEST_TIMEOUT = 1000;

const baseUrl = `http://${isDebug ? "127.0.0.1" : "you-note.ru"}:8080/api`;

enum RequestMethods {
    POST = "POST",
    GET = "GET",
    DELETE = "DELETE",
    PUT = "PUT"
}

type RequestParams = {
    headers?: HeadersInit,
    body?: any;
    query?: Record<string, string>
}

type Response = {
    body: any,
    headers: Record<string, string>,
    status: number
}

const Ajax = {
    Request: async (method: RequestMethods, url: string, params: RequestParams): Promise<Response> => {
        const options: RequestInit = {
            method: method,
            mode: "cors",
            credentials: "include",
            signal: timeout(REQUEST_TIMEOUT),
            headers: {
                ...params.headers,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(params.body)
        }

        const reqUrl = new URL(baseUrl + url);
        for (const paramKey in params.query) {
            reqUrl.searchParams.set(paramKey, params.query[paramKey]);
        }

        try {
            const response:globalThis.Response = await fetch(reqUrl, options);
            let responseData: Response = {
                body: null,
                headers: {},
                status: 503
            };
            try {
                responseData.body = response.json();
            } catch (er) {
                responseData.body = null;
            }
            responseData.status = response.status;
            response.headers.forEach((key, value) => {
                responseData.headers[key] = value;
            });

            return responseData;
        } catch (err) {
            return {body: null, headers: {}, status: 503}
        }
    },

    Post: async (url: string, params: RequestParams): Promise<Response> => {
        return Ajax.Request(RequestMethods.POST, url, params);
    },

    Get:  async (url: string, params: RequestParams): Promise<Response> => {
        return Ajax.Request(RequestMethods.GET, url, params);
    },

    Put:  async (url: string, params: RequestParams): Promise<Response> => {
        return Ajax.Request(RequestMethods.PUT, url, params);
    },

    Delete:  async (url: string, params: RequestParams): Promise<Response> => {
        return Ajax.Request(RequestMethods.DELETE, url, params);
    }
}

class AuthRequests {
    private baseUrl = "/auth";

    public Login = async (username: string, password: string) => {
        const response = await Ajax.Post(this.baseUrl + "/login", {
            body: {
                username,
                password
            }
        });

        if (response.status == 200) {
            return {
                id: response.body.id,
                username: response.body.username,
                create_time: response.body.create_time,
                image_path: response.body.image_path,
                jwt: response.headers["Authorization"]
            }
        }

        throw Error(response.body.message);
    };

    SignUp = async (username: string, password: string) => {
        const response = await Ajax.Post(this.baseUrl + "/signup", {
            body: {
                username,
                password
            }
        });

        if (response.status === 201) {
            return {
                id: response.body.id,
                username: response.body.username,
                create_time: response.body.create_time,
                image_path: response.body.image_path,
                jwt: response.headers["Authorization"]
            };
        }

        throw Error(response.body.message);
    };

    Logout = async (jwt: string) => {
        const response = await Ajax.Delete(this.baseUrl + "/logout", {
            headers: {
                "Authorization": jwt
            }
        });

        if (response.status === 204){
            return {
                message: "ok"
            };
        }

        throw Error(response.body.message);
    };

    CheckUser = async (jwt: string) => {
        const response = await Ajax.Get(this.baseUrl + "/check_user", {
            headers: {
                "Authorization": jwt
            }
        });

        if (response.status === 200) {
            return {
                id: response.body.id,
                username: response.body.username,
                create_time: response.body.create_time,
                image_path: response.body.image_path,

            }
        } else {
            throw Error("not authorized");
        }
    };
}


class NoteRequests {
    private baseUrl = "/note";

    GetAll = async (jwt: string, params: Record<string, string> | null = null) => {

        const response = await Ajax.Get(this.baseUrl + "/get_all", {
            headers: {
                "Authorization": jwt
            },
            query: params
        });

        if (response.status === 200) {
            for (const elem of response.body) {
                elem.data = decode(elem.data);
            }
            return response.body;
        }

        throw Error(response.body.message);
    };

    Get = async (id: number, jwt: string) => {

        const response = await Ajax.Get(this.baseUrl + "/" + id, {
            headers: {
                "Authorization": jwt
            },
        });

        if (response.status === 200) {
            response.body.data = decode(response.body.data);
            return response.body;
        }

        throw Error(response.body.message);
    };
}

export const AppAuthRequests = new AuthRequests();

export const AppNoteRequests = new NoteRequests();