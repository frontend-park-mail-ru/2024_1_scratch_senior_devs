const homePage = {
    id: "home",
    href: "/",
    needAuth: false,
    linkToLoginPage: {
        text: "Попробовать"
    }
}

const notesPage = {
    id: "notes-page",
    href: "/notes",
    needAuth: true,
    noteEditor: {
        id: "note-editor",
        closeBtn: {
            id: "close-editor-btn",
            src: "/src/assets/close.png"
        }
    }
}

const header = {
    name: "YouNote",
    logo: {
        id: "logo",
        img: {
            id: "logo-icon",
            src: "/src/assets/logo.png"
        }
    },
    settings: {
        id: "settings-wrapper",
        panel: {
            id: "popup-content",
            avatar: {
                id: "user-avatar"
            },
            username: {
                class: "username"
            },
            logoutBtn: {
                id: "logout-btn",
                text: "Выйти"
            }
        }
    },
    menu: {
        home: {
            href: "/",
            text: "Главная"
        },
        main: {
            href: "/",
            text: "Мои заметки"
        },
        auth: {
            id: "link-to-login",
            href: "/login",
            text: "Вход"
        },
        register: {
            href: "/register",
            text: "Регистрация"
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
    href: "/profile",
    id: "profile-page",
    logoutBtn: {
        text: "Выйти"
    }
}

const loginPage = {
    id: "login-page",
    href: "/login",
    form: {
        id: "login-form",
        inputs: {
            login: {
                id: "login",
                type: 'text',
                placeholder: 'Введите логин'
            },
            password: {
                id: "password",
                type: "password",
                placeholder: "Введите пароль"
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
                text: "Войти"
            }
        }
    }
}

const registerPage = {
    href: "/register",
    id: "register-page",
    form: {
        id: "register-form",
        inputs: {
            login: {
                type: "text",
                placeholder: "Введите логин"
            },
            password: {
                type: "password",
                placeholder: "Придумайте пароль"
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
                text: "Зарегистрироваться"
            }
        }
    },
}

const notFoundPage = {
    href: "/404",
    id: "not-found",
    link: {
        href: "/",
        text: "Вернуться на главную"
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
    homePage: homePage,
    notesPage: notesPage,
    loginPage: loginPage,
    registerPage: registerPage,
    profilePage: profilePage,
    notFoundPage: notFoundPage,
    header: header,
    notes: notes,
    note: note,
    avatar: avatar,
    wrapper: wrapper,
    footer: footer
};
