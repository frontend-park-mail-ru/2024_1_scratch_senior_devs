const homePage = {
    id: "home",
    href: "/",
    linkToLoginPage: {
        text: "Попробовать"
    }
}

const notesPage = {
    id: "notes-page",
    href: "/notes",
    needAuth: true,
    searchBar: {
        id: "notes-search-bar",
    },
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
        auth: {
            id: "link-to-login",
            href: "/auth",
            text: "Вход"
        }
    }
}

const footer = {
    id: "footer"
}

const wrapper = {
    id: "wrapper"
}

const authPage = {
    id: "auth-page",
    href: "/auth",
    needAuth: false,
    forms: {
        login: {
            id: "login-form",
            inputs: {
                login: {
                    type: 'text',
                    icon: "/src/assets/user.png",
                    placeholder: 'Введите логин'
                },
                password: {
                    type: "password",
                    icon: "/src/assets/password.png",
                    placeholder: "Введите пароль"
                }
            },
            buttons: {
                submitBtn: {
                    text: "Войти"
                }
            }
        },
        register: {
            id: "register-form",
            inputs: {
                login: {
                    type: "text",
                    icon: "/src/assets/user.png",
                    placeholder: "Придумайте логин"
                },
                password: {
                    type: "password",
                    icon: "/src/assets/password.png",
                    placeholder: "Придумайте пароль"
                },
                repeatPassword: {
                    type: "password",
                    icon: "/src/assets/password.png",
                    placeholder: "Повторите пароль"
                }
            },
            buttons: {
                submitBtn: {
                    text: "Зарегистрироваться"
                }
            }
        }
    },
    links: {
        linkToLogin: {
            text: "Войти"
        },
        linkToRegister: {
            text: "Регистрация"
        }
    }
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

const note = {

}

const avatar = {

}

export const config = {
    homePage: homePage,
    notesPage: notesPage,
    authPage: authPage,
    notFoundPage: notFoundPage,
    header: header,
    notes: notes,
    note: note,
    avatar: avatar,
    wrapper: wrapper,
    footer: footer
};
