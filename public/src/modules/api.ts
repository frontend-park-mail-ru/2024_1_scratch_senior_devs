import {downloadFile} from './utils';
import {
    UserLoginCredentialsType,
    UserRegisterCredentialsType,
    UserUpdatePasswordCredentialsType
} from './stores/UserStore';
import {isDebug} from "../utils/consts";

const baseUrl = isDebug ? 'http://localhost:8080/api' : 'https://you-note.ru/api';

export const imagesUlr = isDebug ? 'http://localhost/images/' : 'https://you-note.ru/images/';

enum RequestMethods {
    POST = 'POST',
    GET = 'GET',
    DELETE = 'DELETE',
    PUT = 'PUT',
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
        if (!window.navigator.onLine) {
            throw new Error('Offline');
        }

        const options: RequestInit = {
            method: method,
            mode: 'cors',
            credentials: 'include',
            headers: {
                ...params.headers,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(params.body)
        };

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
            return {body: null, headers: {}, status: 503};
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
};

class AuthRequests {
    private baseUrl = '/auth';

    public Login = async ({username, password, code}:UserLoginCredentialsType) => {

        return await Ajax.Post(this.baseUrl + '/login', {
            body: {
                username,
                password,
                code
            }
        });
    };

    SignUp = async ({username, password}:UserRegisterCredentialsType) => {
        const response = await Ajax.Post(this.baseUrl + '/signup', {
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
                csrf: response.headers['x-csrf-token']
            };
        }

        throw Error(response.body.message);
    };

    Logout = async (jwt: string, csrf:string) => {
        const response = await Ajax.Delete(this.baseUrl + '/logout', {
            headers: {
                'Authorization': jwt,
                'x-csrf-token': csrf
            }
        });

        if (response.status === 204){
            return {
                message: 'ok'
            };
        }

        throw Error(response.body.message);
    };

    CheckUser = async (jwt: string) => {
        const response = await Ajax.Get(this.baseUrl + '/check_user', {
            headers: {
                'Authorization': jwt
            }
        });

        if (response.status === 200) {
            return AppProfileRequests.Get(jwt);
        } else {
            throw Error('not authorized');
        }
    };

    GetQR = async (jwt: string) => {
        if (!window.navigator.onLine) {
            throw new Error('Offline');
        }

        const options: RequestInit = {
            method: RequestMethods.GET,
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Authorization': jwt
            }
        };

        const response = await fetch(baseUrl + this.baseUrl + '/get_qr', options);

        const blob = await response.blob();

        return URL.createObjectURL(blob);
    };

    DisableOTF = async (jwt: string, csrf:string) => {
        const response = await Ajax.Delete(this.baseUrl + '/disable_2fa', {
            headers: {
                'Authorization': jwt,
                'x-csrf-token': csrf
            }
        });

        return {
            status: response.status,
            csrf: response.headers['x-csrf-token']
        };
    };
}

class ProfileRequests {
    Get = async (jwt:string)=> {
        const response = await Ajax.Get('/profile' + '/get', {
            headers: {
                'Authorization': jwt
            }
        });

        if (response.status === 200) {
            return {
                id: response.body.id,
                username: response.body.username,
                create_time: response.body.create_time,
                image_path: response.body.image_path,
                otp: response.body.second_factor
            };
        }
    };

    UpdateAvatar = async(photo:File, jwt:string, csrf:string) => {
        if (!window.navigator.onLine) {
            throw new Error('Offline');
        }

        const form_data = new FormData();

        form_data.append('avatar', photo);

        const options: RequestInit = {
            method: RequestMethods.POST,
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Authorization': jwt,
                'x-csrf-token': csrf
            },
            body: form_data
        };

        const response = await fetch(baseUrl + '/profile/update_avatar/', options);

        const body = await response.json();

        return {
            status: response.status,
            avatarUrl: body.image_path,
            csrf: response.headers.get('x-csrf-token')
        };
    };

    UpdatePassword = async({oldPassword, newPassword}:UserUpdatePasswordCredentialsType, jwt:string, csrf:string)=> {
        const response = await Ajax.Post('/profile/update/', {
            headers: {
                'Authorization': jwt,
                'x-csrf-token': csrf
            },
            body: {
                description: 'string',
                password: {
                    new: newPassword,
                    old: oldPassword
                }
            }
        });

        return {
            status: response.status,
            csrf: response.headers['x-csrf-token']
        };
    };
}

class NoteRequests {
    private baseUrl = '/note';

    GetAll = async (jwt: string, params: Record<string, string | number> | null = null) => {
        const response = await Ajax.Get(this.baseUrl + '/get_all', {
            headers: {
                'Authorization': jwt
            },
            query: params
        });

        if (response.status === 200) {
            for (const elem of response.body) {
                elem.data = JSON.parse(elem.data);
            }
            return response.body;
        }


        throw Error(response.body.message);
    };

    Get = async (id: string, jwt: string) => {
        const response = await Ajax.Get(this.baseUrl + '/' + id, {
            headers: {
                'Authorization': jwt
            },
        });

        if (response.status === 200) {
            response.body.data = JSON.parse(response.body.data);
            return response.body;
        }

        throw Error(response.body.message);
    };

    Delete = async (id: string, jwt: string, csrf:string) => {
        const response = await Ajax.Delete(this.baseUrl + '/' + id + '/delete', {
            headers: {
                'Authorization': jwt,
                'x-csrf-token': csrf
            },
        });

        if (response.status == 204) {
            return {
                status: response.status,
                csrf: response.headers['x-csrf-token']
            };
        }

        throw new Error(response.body.message);
    };

    Update = async({id, note}, jwt: string, csrf:string)=> {
        console.log("Update")

        const response = await Ajax.Post(this.baseUrl + '/' + id + '/edit', {
            headers: {
                'Authorization': jwt,
                'x-csrf-token': csrf
            },
            body: {
                data: {
                    title: note.title,
                    content: note.blocks
                }
            }
        });

        console.log(response.status)

        return {
            status: response.status,
            csrf: response.headers['x-csrf-token']
        };
    };

    Add = async (jwt:string, csrf:string) => {
        const response = await Ajax.Post(this.baseUrl + '/add', {
            headers: {
                'Authorization': jwt,
                'x-csrf-token': csrf
            },
            body: {
                children: [],
                data: {
                    title: '',
                    content: [
                        {
                            pluginName: "textBlock",
                            content: "Hello You-note"
                        },
                        {
                            pluginName: "div",
                            children: [
                                {
                                    pluginName: "br"
                                }
                            ]
                        }
                    ]
                }
            }
        });

        if (response.status == 201) {
            response.body.data = JSON.parse(response.body.data);
            return response;
        }

        throw new Error();
    };

    AddSubNote = async (id:string, jwt:string, csrf:string) => {
        const response = await Ajax.Post(this.baseUrl + '/' + id + "/add_subnote", {
            headers: {
                'Authorization': jwt,
                'x-csrf-token': csrf
            },
            body: {
                data: {
                    title: '',
                    content: [
                        {
                            pluginName: "textBlock",
                            content: "Hello You-note"
                        },
                        {
                            pluginName: "div",
                            children: [
                                {
                                    pluginName: "br"
                                }
                            ]
                        }
                    ]
                }
            }
        });

        if (response.status == 200) {
            return {
                status: response.status,
                csrf: response.headers['x-csrf-token'],
                subnote_id: response.body.id
            }
        }

        return {
            status: response.status,
            csrf: response.headers['x-csrf-token']
        }
    };

    UploadFile = async (id:string, file:File, jwt:string, csrf:string) => {
        const form_data = new FormData();

        form_data.append('id', id);
        form_data.append('attach', file);

        const options: RequestInit = {
            method: RequestMethods.POST,
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Authorization': jwt,
                'x-csrf-token': csrf
            },
            body: form_data
        };

        return await fetch(baseUrl + this.baseUrl + '/' + id + '/add_attach/', options);
    };

    GetImage = async (id:string, jwt:string, csrf:string) => {
        const options: RequestInit = {
            method: RequestMethods.GET,
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Authorization': jwt,
                'x-csrf-token': csrf
            }
        };

        const response = await fetch(baseUrl + '/attach/' + id, options);

        const blob = await response.blob();

        return URL.createObjectURL(blob);
    };

    DownloadFile = async (id:string, fileName:string, jwt:string, csrf:string) => {
        const options: RequestInit = {
            method: RequestMethods.GET,
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Authorization': jwt,
                'x-csrf-token': csrf
            }
        };

        const response = await fetch(baseUrl + '/attach/' + id, options);
        const blob = await response.blob();

        const url = URL.createObjectURL(blob);

        downloadFile(url, fileName);

        return url;
    };

    AddCollaborator = async (id: string, username:string, jwt:string, csrf:string) => {
        const response = await Ajax.Post(this.baseUrl + '/' + id + '/add_collaborator/', {
            headers: {
                'Authorization': jwt,
                'x-csrf-token': csrf
            },
            body: {
                "username": username
            }
        });

        return {
            status: response.status,
            csrf: response.headers['x-csrf-token']
        }
    }

    AddTag = async (note_id: string, tag: string,  jwt:string, csrf:string)=> {
        const response = await Ajax.Post(this.baseUrl + '/' + note_id + '/add_tag/', {
            headers: {
                'Authorization': jwt,
                'x-csrf-token': csrf
            },
            body: {
                "tag_name": tag
            }
        });

        if (response.status == 200) {
            response.body.data = JSON.parse(response.body.data)

            return {
                note: response.body,
                status: response.status,
                csrf: response.headers['x-csrf-token']
            }
        }

        return {
            status: response.status,
            csrf: response.headers['x-csrf-token']
        }
    }

    RemoveTag = async (note_id: string, tag: string,  jwt:string, csrf:string)=> {
        const response = await Ajax.Delete(this.baseUrl + '/' + note_id + '/delete_tag/', {
            headers: {
                'Authorization': jwt,
                'x-csrf-token': csrf
            },
            body: {
                "tag_name": tag
            }
        });

        if (response.status == 200) {
            response.body.data = JSON.parse(response.body.data)
        }

        return {
            note: response.body,
            status: response.status,
            csrf: response.headers['x-csrf-token']
        }
    }
}

class TagRequests {
    private baseUrl = '/tags';

    GetAll = async (jwt:string) => {
        const response = await Ajax.Get(this.baseUrl , {
            headers: {
                'Authorization': jwt
            },
        });

        if (response.status === 200) {
            return response;
        }

        throw Error(response.body.message);
    }

    DeleteTag = async (tag: string,  jwt:string, csrf:string)=> {
        const response = await Ajax.Delete(this.baseUrl + '/forget/', {
            headers: {
                'Authorization': jwt,
                'x-csrf-token': csrf
            },
            body: {
                "tag_name": tag
            }
        });

        return {
            note: response.body,
            status: response.status,
            csrf: response.headers['x-csrf-token']
        }
    }

    AddTag = async (tag: string,  jwt:string, csrf:string)=> {
        const response = await Ajax.Post(this.baseUrl + '/remember/', {
            headers: {
                'Authorization': jwt,
                'x-csrf-token': csrf
            },
            body: {
                "tag_name": tag
            }
        });

        return {
            note: response.body,
            status: response.status,
            csrf: response.headers['x-csrf-token']
        }
    }
}

export const AppAuthRequests = new AuthRequests();

export const AppNoteRequests = new NoteRequests();

export const AppTagRequests = new TagRequests();

export const AppProfileRequests = new ProfileRequests();