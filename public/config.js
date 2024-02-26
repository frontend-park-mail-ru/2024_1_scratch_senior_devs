const mainPage = {
    href: "/",
    needAuth: true
}

const header = {
    name: "YouNote",
    avatarLink: {
        href: "/profile"
    },
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
            href: "/",
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

const footer = {
    id: "footer"
}

const wrapper = {
    id: "wrapper"
}

const profilePage = {
    href: "profile",
    id: "profile-page",
    logoutBtn: {
        btnLabel: "Выйти"
    }
}

const loginPage = {
    href: "login",
    form: {
        id: "login-form",
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
        links: {
            registerPage: {
                href: "/register",
                text: "Ещё не зарегистрированы?",
            }
        },
        buttons: {
            submitBtn: {
                btnLabel: "Войти"
            }
        }
    }
}

const registerPage = {
    href: "register",
    form: {
        id: "register-form",
        inputs: {
            login: {
                type: "text",
                placeholder: "Введите логин"
            },
            password: {
                type: "password",
                placeholder: "Введите пароль"
            },
            repeatPassword: {
                type: "password",
                placeholder: "Повторите пароль"
            }
        },
        links: {
            loginPage: {
                href: "/login",
                text: "Уже есть аккаунт?",
            }
        },
        buttons: {
            submitBtn: {
                btnLabel: "Зарегистрироваться"
            }
        }
    },
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
    profilePage: profilePage,
    header: header,
    notes: notes,
    noteEditor: noteEditor,
    note: note,
    avatar: avatar,
    wrapper: wrapper,
    footer: footer
};
