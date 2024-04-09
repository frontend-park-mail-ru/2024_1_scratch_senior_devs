import {createUUID, decode} from "./utils";
import {
    UserLoginCredentialsType,
    UserRegisterCredentialsType,
    UserUpdatePasswordCredentialsType
} from "./stores/UserStore";
import {Exception} from 'sass';

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

    public Login = async ({username, password, code}:UserLoginCredentialsType) => {

        return await Ajax.Post(this.baseUrl + "/login", {
            body: {
                username,
                password,
                code
            }
        });
    };

    SignUp = async ({username, password}:UserRegisterCredentialsType) => {
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
                jwt: response.headers.authorization,
                csrf: response.headers["x-csrf-token"]
            };
        }

        throw Error(response.body.message);
    };

    Logout = async (jwt: string, csrf:string) => {
        const response = await Ajax.Delete(this.baseUrl + "/logout", {
            headers: {
                "Authorization": jwt,
                "x-csrf-token": csrf
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

        return URL.createObjectURL(blob)
    }

    DisableOTF = async (jwt: string, csrf:string) => {
        const response = await Ajax.Delete(this.baseUrl + "/disable_2fa", {
            headers: {
                "Authorization": jwt,
                "x-csrf-token": csrf
            }
        });

        return {
            status: response.status,
            csrf: response.headers["x-csrf-token"]
        }
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
                otp: response.body.second_factor
            }
        }
    }

    UpdateAvatar = async(photo:File, jwt:string, csrf:string) => {
        const form_data = new FormData()

        form_data.append("avatar", photo)

        const options: RequestInit = {
            method: RequestMethods.POST,
            mode: "cors",
            credentials: "include",
            headers: {
                "Authorization": jwt,
                "x-csrf-token": csrf
            },
            body: form_data
        }

        const response = await fetch(baseUrl + "/profile/update_avatar/", options);

        const body = await response.json()

        return {
            status: response.status,
            avatarUrl: body.image_path,
            csrf: response.headers.get("x-csrf-token")
        }
    }

    UpdatePassword = async({oldPassword, newPassword}:UserUpdatePasswordCredentialsType, jwt:string, csrf:string)=> {
        const response = await Ajax.Post("/profile/update/", {
            headers: {
                "Authorization": jwt,
                "x-csrf-token": csrf
            },
            body: {
                description: "string",
                password: {
                    new: newPassword,
                    old: oldPassword
                }
            }
        });

        console.log("UpdatePassword")
        console.log(response.headers)

        return {
            status: response.status,
            csrf: response.headers["x-csrf-token"]
        }
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

    Delete = async (id: number, jwt: string, csrf:string) => {
        const response = await Ajax.Delete(this.baseUrl + "/" + id + "/delete", {
            headers: {
                "Authorization": jwt,
                "x-csrf-token": csrf
            },
        });

        return {
            status: response.status,
            csrf: response.headers["x-csrf-token"]
        }
    }

    Update = async({id, note}, jwt: string, csrf:string)=> {
        console.log("Update")

        const response = await Ajax.Post(this.baseUrl + "/" + id + "/edit", {
            headers: {
                "Authorization": jwt,
                "x-csrf-token": csrf
            },
            body: {
                data: {
                    title: note.title,
                    content: note.blocks
                }
            }
        });

        return {
            status: response.status,
            csrf: response.headers["x-csrf-token"]
        }
    }

    Add = async (jwt:string, csrf:string) => {
        const response = await Ajax.Post(this.baseUrl + "/add", {
            headers: {
                "Authorization": jwt,
                "x-csrf-token": csrf
            },
            body: {
                data: {
                    content: [
                        {
                            "id": "1",
                            "type": "div",
                            "content": [
                                {
                                    "id": "2",
                                    "content": "Привет!"
                                }
                            ]
                        }
                    ],
                    title: "Новая заметка"
                }
            }
        });

        response.body.data = decode(response.body.data);
        return response
    }

    UploadFile = async (id:string, file:File, jwt:string, csrf:string) => {
        console.log("UploadImageRequest")
        console.log(id)
        console.log(file)
        console.log(jwt)
        console.log(csrf)

        const form_data = new FormData()

        form_data.append("id", id)
        form_data.append("attach", file)

        const options: RequestInit = {
            method: RequestMethods.POST,
            mode: "cors",
            credentials: "include",
            headers: {
                "Authorization": jwt,
                "x-csrf-token": csrf
            },
            body: form_data
        }

        return await fetch(baseUrl + this.baseUrl + "/" + id + "/add_attach/", options)
        //
        // try {
        //     const response = await fetch(baseUrl + this.baseUrl + "/" + id + "/add_attach/", options);
        //     console.log(response.status)
        //     console.log(response.body)
        //
        //     if (response.status == 200) {
        //         const body = await response.json()
        //
        //         console.log(body)
        //
        //         return {
        //             id: body.id,
        //             note_id: body.note_id,
        //             attachId: body.path.split(".")[0],
        //             status: response.status,
        //             csrf: response.headers.get("x-csrf-token")
        //         }
        //     }
        //
        //    throw new Error()
        // } catch (e) {
        //     console.log(e.status)
        //     console.log("asdfasdfa")
        //
        //
        // }
    }

    GetImage = async (id:string, jwt:string, csrf:string) => {
        const options: RequestInit = {
            method: RequestMethods.GET,
            mode: "cors",
            credentials: "include",
            headers: {
                "Authorization": jwt,
                "x-csrf-token": csrf
            }
        }

        console.log("GetImage")
        const response = await fetch(baseUrl + "/attach/" + id, options);

        console.log(response.status)

        // TODO: сделать скачку при открытии заметки, а не только при отправке
        const blob = await response.blob()

        const url = URL.createObjectURL(blob)

        return url
    }

    GetFile = async (id:string, fileName:string, jwt:string, csrf:string) => {
        const options: RequestInit = {
            method: RequestMethods.GET,
            mode: "cors",
            credentials: "include",
            headers: {
                "Authorization": jwt,
                "x-csrf-token": csrf
            }
        }

        const response = await fetch(baseUrl + "/attach/" + id, options);

        console.log(response.status)
        console.log(response.body)
        console.log(typeof response.body)

        const blob = await response.blob()

        console.log(blob)

        const url = URL.createObjectURL(blob)

        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        return url
    }
}

export const AppAuthRequests = new AuthRequests();

export const AppNoteRequests = new NoteRequests();

export const AppProfileRequests = new ProfileRequests();