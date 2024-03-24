import {createUUID, decode} from "./utils";
import {Note} from "./stores/NotesStore";

export const isDebug = process.env.NODE_ENV === "development";

const baseUrl = isDebug ? "http://localhost:8080/api" : "https://you-note.ru/api";

export const imagesUlr = isDebug ? "http://localhost/images/" : "https://you-note.ru/images/"

enum RequestMethods {
    POST = "POST",
    GET = "GET",
    DELETE = "DELETE",
    PUT = "PUT",
}

type RequestParams = {
    headers?: HeadersInit,
    body?: any;
    query?: Record<string, string | number>
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
            headers: {
                ...params.headers,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(params.body)
        }

        const reqUrl = new URL(baseUrl + url);
        for (const paramKey in params.query) {
            reqUrl.searchParams.set(paramKey, params.query[paramKey].toString());
        }

        try {
            const response:globalThis.Response = await fetch(reqUrl, options);

            const responseData: Response = {
                body: null,
                headers: {},
                status: 503
            };

            try {
                responseData.body = await response.json();
            } catch {
                // responseData.body = await response.blob();
                responseData.body = null;
            }

            responseData.status = response.status;
            response.headers.forEach((key, value) => {
                responseData.headers[value] = key;
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

    public Login = async (username: string, password: string, code:string) => {

        console.log("Login")
        console.log(code)

        const response = await Ajax.Post(this.baseUrl + "/login", {
            body: {
                username,
                password,
                code
            }
        });

        return response

        // console.log(response.status)
        //
        // if (response.status == 200) {
        //     return {
        //         id: response.body.id,
        //         username: response.body.username,
        //         create_time: response.body.create_time,
        //         image_path: response.body.image_path,
        //         jwt: response.headers.authorization
        //     }
        // }
        //
        // throw Error(response.body.message);
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
                jwt: response.headers.authorization
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
            return AppProfileRequests.Get(jwt)
        } else {
            throw Error("not authorized");
        }
    };

    GetQR = async (jwt: string) => {
        const options: RequestInit = {
            method: RequestMethods.GET,
            mode: "cors",
            credentials: "include",
            headers: {
                "Authorization": jwt
            }
        }

        const response = await fetch(baseUrl + this.baseUrl + "/get_qr", options)

        const blob = await response.blob()
        const img = URL.createObjectURL(blob)

        return img
    }
}

class ProfileRequests {
    Get = async (jwt:string)=> {
        const response = await Ajax.Get("/profile" + "/get", {
            headers: {
                "Authorization": jwt
            }
        });

        if (response.status == 200) {
            return {
                id: response.body.id,
                username: response.body.username,
                create_time: response.body.create_time,
                image_path: response.body.image_path,
                otp: response.body.secret
            }
        }
    }

    UpdateAvatar = async(photo:File, jwt:string) => {
        const form_data = new FormData()

        form_data.append('avatar', photo)

        const options: RequestInit = {
            method: RequestMethods.POST,
            mode: "cors",
            credentials: "include",
            headers: {
                "Authorization": jwt
            },
            body: form_data
        }

        const response = await fetch(baseUrl + "/profile/update_avatar/", options);

        const body = await response.json()

        return body.image_path
    }

    UpdatePassword = async(oldPassword:string, newPassword:string, jwt:string)=> {
        console.log("UpdatePassword")
        const response = await Ajax.Post("/profile/update/", {
            headers: {
                "Authorization": jwt
            },
            body: {
                description: "string",
                password: {
                    new: newPassword,
                    old: oldPassword
                }
            }
        });

        if (response.status == 200) {
            return
        }

        throw Error("Неверный пароль");
    }
}




class NoteRequests {
    private baseUrl = "/note";

    GetAll = async (jwt: string, params: Record<string, string | number> | null = null) => {
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

    Delete = async (id: number, jwt: string) => {
        const response = await Ajax.Delete(this.baseUrl + "/" + id + "/delete", {
            headers: {
                "Authorization": jwt
            },
        });

        return response.status
    }

    Update = async(note, jwt: string)=> {
        const response = await Ajax.Post(this.baseUrl + "/" + note.id + "/edit", {
            headers: {
                "Authorization": jwt
            },
            body: {
                data: note
            }
        });

        response.body.data = decode(response.body.data);
        return response.body
    }

    Add = async (jwt:string) => {
        const response = await Ajax.Post(this.baseUrl + "/add", {
            headers: {
                "Authorization": jwt
            },
            body: {
                data: {
                    content: createUUID(),
                    title: "Новая заметка"
                }
            }
        });

        console.log(response.status)
        console.log(response.body)
        response.body.data = decode(response.body.data);
        return response.body
    }
}

export const AppAuthRequests = new AuthRequests();

export const AppNoteRequests = new NoteRequests();

export const AppProfileRequests = new ProfileRequests();