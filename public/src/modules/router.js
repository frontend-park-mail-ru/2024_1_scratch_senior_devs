import Main from "../pages/main/main.js";
import LoginPage from "../pages/login/login.js";
import RegisterPage from "../pages/register/register.js";
import ProfilePage from "../pages/profile/profile.js";

class Router {
    #currentUrl;
    #currentPage;
    #pages;

    constructor() {
        this.#currentUrl = window.location.href.split("/").slice(-1)[0];
        this.#currentPage = undefined;
        this.#pages = [];

        this.registerEvents();
    }

    init(root, config){
        const mainPage = new Main(root, config.mainPage)
        this.#pages.push(mainPage)

        const loginPage = new LoginPage(root, config.loginPage)
        this.#pages.push(loginPage)

        const registerPage = new RegisterPage(root, config.registerPage)
        this.#pages.push(registerPage)

        const profilePage = new ProfilePage(root, config.profilePage)
        this.#pages.push(profilePage)

        this.changePage(this.#currentUrl)
    }

    changePage(href) {
        if (href === "") href = "/"

        this.#pages.forEach(page => {
            if (this.#currentPage !== page && page.href === href) {
                this.#currentPage?.remove()
                page.render()
                this.#currentPage = page
                history.pushState(null, null, page.href)
            }
        })
    }

    registerEvents() {
        window.addEventListener('click', (e) => this.listenClick(e));
    }

    listenClick (e) {
        e.preventDefault();
        const anchor = e.target.closest('a');
        if (!anchor) return;
        const href = anchor.getAttribute('href').replace('/', '');
        this.changePage(href);
    }
}

export const router = new Router()
