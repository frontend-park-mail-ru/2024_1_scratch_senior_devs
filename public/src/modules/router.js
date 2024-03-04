import Home from "../pages/home/home.js";
import LoginPage from "../pages/login/login.js";
import RegisterPage from "../pages/register/register.js";
import NotFoundPage from "../pages/notFound/not-found.js";
import NotesPage from "../pages/notes/notes.js";
import {AppUserStore, UserActions} from "../stores/user/userStore.js";
import {AppEventMaker} from "./eventMaker.js";
import {AppDispatcher} from "./dispathcer.js";

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
        const homePage = new Home(root, config.homePage)
        this.registerPage(homePage)

        const notesPage = new NotesPage(root, config.notesPage)
        this.registerPage(notesPage)

        const loginPage = new LoginPage(root, config.loginPage)
        this.registerPage(loginPage)

        const registerPage = new RegisterPage(root, config.registerPage)
        this.registerPage(registerPage)

        const notFoundPage = new NotFoundPage(root, config.notFoundPage)
        this.registerPage(notFoundPage)

        console.log("dispatching")

        AppDispatcher.dispatch({type: UserActions.CHECK_USER});
    }

    registerPage(page) {
        this.#pages[page.href] = page
    }

    redirect(href) {
        console.log("redirect " + href)

        if (href === "") href = "/"

        const page = this.#pages[href]

        console.log(page)

        if (page === undefined) {
            this.redirect("/404")
            return;
        }
        console.log(page.href)

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

        AppEventMaker.notify(UserActions.CHANGE_PAGE, href)
    }

    parseUrl() {
        return  "/" + window.location.href.split("/").slice(-1)[0];
    }
}

export const router = new Router()
