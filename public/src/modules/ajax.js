const baseUrl = "http://you-note.ru:8080/api"

const methods = {
    POST: 'POST',
    GET: 'GET',
    DELETE: 'DELETE',
    PUT: 'PUT'
}

let JWT = null

const baseRequest = async (method, url, data = null) => {
    const options = {
        method: method,
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }

    if (JWT !== null) {
        options.headers.Authorization = JWT;
    }

    if (data !== null) {
        options.body = JSON.stringify(data)
    }

    try{
        const response = await fetch(baseUrl + url, options)
        let body = null
        try {
            body = await response.json()
        } catch (err) {
            console.log("no body")
        }
        for (const header of response.headers) {
            console.log(header)
        }
        if (response.headers.get('Authorization') !== null) {
            JWT = response.headers.get('Authorization');
            console.log(JWT)
        }
        return {status: response.status, body}
    } catch (err) {
        console.log(err)
        return {status: 503, body: {message: err}}
    }
}

class AuthRequests {
    #baseUrl = '/auth'

    Login = async (username, password) => {
        const {status, body} = await baseRequest(
            methods.POST,this.#baseUrl + '/login',
            {username, password}
        )

        if (status === 200) {
            return {
                id: body.id,
                username: body.username,
                create_time: body.create_time,
                image_path: body.image_path
            }
        } else {
            throw Error(body.message)
        }
    }

    SignUp = async (username, password) => {
        const {status, body} = await baseRequest(
            methods.POST,this.#baseUrl + '/signup',
            {username, password}
        )

        if (status === 201) {
            return {
                id: body.id,
                username: body.username,
                create_time: body.create_time,
                image_path: body.image_path
            }
        } else {
            throw Error(body.message)
        }
    }

    Logout = async () => {
        const {status, body} = await baseRequest(
            methods.DELETE,this.#baseUrl + '/logout'
        )

        console.log(status)

        if (status === 204){
            console.log("logged out")
            JWT = null
            return {
                message: 'ok'
            }
        } else {
            throw Error(body.message)
        }
    }
}

class NoteRequests {
    #baseUrl = '/note'

    GetAll = async () => {
        const {status, body} = await baseRequest(
            methods.GET,this.#baseUrl + '/get_all'
        )

        if (status === 200) {
            for (const elem of body) {
                elem.data = JSON.parse( atob(elem.data))
            }
            console.log(body)
            return body
        } else {
            throw Error(body.message)
        }
    }
}

export const AppAuthRequests = new AuthRequests();

export const AppNoteRequests = new NoteRequests();