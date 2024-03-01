import Main from "../pages/main/main.js";
import LoginPage from "../pages/login/login.js";
import RegisterPage from "../pages/register/register.js";
import {AppUserStore} from "../stores/user/userStore.js";
import NotFoundPage from "../pages/notFound/not-found.js";

class Router {
    #currentUrl;
    #currentPage;
    #pages;

    constructor() {
        this.#currentUrl = this.parseUrl();
        this.#currentPage = undefined;
        this.#pages = new Map();
    }

    init(root, config){
        const mainPage = new Main(root, config.mainPage)
        this.registerPage(mainPage)

        const loginPage = new LoginPage(root, config.loginPage)
        this.registerPage(loginPage)

        const registerPage = new RegisterPage(root, config.registerPage)
        this.registerPage(registerPage)
        const notFoundPage = new NotFoundPage(root, config.notFoundPage)
        this.registerPage(notFoundPage)

        this.redirect(this.#currentUrl)
    }

    registerPage(page) {
        this.#pages[page.href] = page
    }

    redirect(href) {
        if (href === "") href = "/"

        const page = this.#pages[href]

        if (page === undefined) {
            this.redirect("/404")
            return;
        }

        if (page.needAuth === true && !AppUserStore.IsAuthenticated()) {
            this.redirect("/")
            return
        }

        if (page.needAuth === false && AppUserStore.IsAuthenticated()) {
            this.redirect("/")
            return
        }

        this.#currentPage?.remove()
        page.render()
        this.#currentPage = page
        history.pushState(null, null, page.href)

    }

    parseUrl() {
        return  "/" + window.location.href.split("/").slice(-1)[0];
    }
}

export const router = new Router()
