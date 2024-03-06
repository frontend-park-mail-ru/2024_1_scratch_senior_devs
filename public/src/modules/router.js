import Home from "../pages/home/home.js";
import NotFoundPage from "../pages/notFound/not-found.js";
import NotesPage from "../pages/notes/notes.js";
import {AppUserStore, UserActions} from "../stores/user/userStore.js";
import {AppEventMaker} from "./eventMaker.js";
import {AppDispatcher} from "./dispathcer.js";
import {AuthPage} from "../pages/auth/auth.js";

class Router {
    #currentUrl;
    #currentPage;
    #pages;

    /**
     * Конструктор класса
     */
    constructor() {
        this.#currentUrl = this.parseUrl();
        this.#currentPage = undefined;
        this.#pages = new Map();
    }

    /**
     * Инициализирует основные страницы сайта
     * @param root родительский объект
     * @param config глобальный конфиг
     */
    init(root, config){
        const homePage = new Home(root, config.homePage);
        this.registerPage("/", homePage);

        const notesPage = new NotesPage(root, config.notesPage);
        this.registerPage("/notes", notesPage);

        const authPage = new AuthPage(root, config.authPage);
        this.registerPage("/login", authPage);
        this.registerPage("/register", authPage);

        const notFoundPage = new NotFoundPage(root, config.notFoundPage);
        this.registerPage("/404", notFoundPage);

        console.log("dispatching");
        AppDispatcher.dispatch({type: UserActions.CHECK_USER});
        this.redirect(this.#currentUrl);
    }

    /**
     * Регистрирует страницу
     * @param href адрес
     * @param page объект страницы
     */
    registerPage(href, page) {
        this.#pages[href] = page;
    }

    /**
     * Редиректит пользователя по переданному адресу
     * @param href адрес
     */
    redirect(href) {
        console.log("redirect " + href);

        if (href === "") href = "/";

        const page = this.#pages[href];

        if (page === undefined) {
            this.redirect("/404");
            return;
        }

        if (page.needAuth === true && !AppUserStore.IsAuthenticated()) {
            this.redirect("/");
            return;
        }

        console.log(page.needAuth)
        console.log(AppUserStore.IsAuthenticated())
        if (page.needAuth === false && AppUserStore.IsAuthenticated()) {
            this.redirect("/");
            return;
        }

        this.#currentPage?.remove();
        history.pushState(null, null, href);
        page.render();
        this.#currentPage = page;

        AppEventMaker.notify(UserActions.CHANGE_PAGE, href);
    }

    /**
     * Возвращает относительный адрес страницы
     * @returns {string} относительный адрес
     */
    parseUrl() {
        console.log("parseUrl")

        return  "/" + window.location.href.split("/").slice(-1)[0];
    }
}

export const router = new Router();
