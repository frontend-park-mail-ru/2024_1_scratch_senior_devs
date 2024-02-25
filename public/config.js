const mainPage = {
    href: "/",
    needAuth: true
}

const header = {
    name: "YouNote",
    avatar: {
        id: "user-avatar"
    },
    menu: {
        home: {
            href: "/",
            text: "Главная",
            needAuth: false
        },
        main: {
            href: "/main",
            text: "Мои заметки",
            needAuth: true
        },
        auth: {
            href: "/login",
            text: "Вход",
            needAuth: false
        },
        register: {
            href: "/register",
            text: "Регистрация",
            needAuth: false
        }
    }
}

const loginPage = {
    href: "login",
    inputs: {
        login: {
            type: 'text',
            placeholder: 'Введите логин'
        },
        password: {
            type: "password",
            placeholder: "Придумайте пароль"
        }
    },
    buttons: {
        submitBtn: {
            btnLabel: "Войти"
        }
    }
}

const registerPage = {
    href: "register",
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
