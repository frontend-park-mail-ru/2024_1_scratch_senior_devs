const button = {
    "text": "toast",
    "id": "hehe123"
}

const mainPage = {
    button: button
}

const header = {
    name: "YouNote",
    menu: [
        {
            href: "",
            text: "Главная",
            needAuth: false
        },
        {
            href: "main",
            text: "Мои заметки",
            needAuth: true
        },
        {
            href: "login",
            text: "Вход",
            needAuth: false
        },
        {
            href: "register",
            text: "Регистрация",
            needAuth: false
        }
    ]
}

const loginPage = {

}

const registerPage = {
    inputs: {
        login: {
           type: "text",
           placeholder: "Придумайте логин"
        },
        password: {
            type: "password",
            placeholder: "Придумайте пароль"
        },
        repeatPassword: {
            type: "password",
            placeholder: "Повторите пароль"
        }
    }
}

const notes = {

}

const noteEditor = {

}

const note = {

}

const avatar = {

}

export const config = {
    isAuthorized: false,
    mainPage: mainPage,
    loginPage: loginPage,
    registerPage: registerPage,
    header: header,
    notes: notes,
    noteEditor: noteEditor,
    note: note,
    avatar: avatar
};
