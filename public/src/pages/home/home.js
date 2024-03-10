import "../../../build/home.js";
import {AppUserStore} from "../../stores/user/userStore.js";
import {router} from "../../modules/router.js";
import {Button} from "../../components/button/button.js";
import Page from "../page.js";

export default class Home extends Page {
    /**
     * Если пользователь авторизован, то перенаправляет его на страницу с заметками, если нет - то на страницу входа
     */
    handleButtonClick = () => {
        const href = AppUserStore.IsAuthenticated() ? "/notes" : "/login";
        router.redirect(href);
    };

    /**
     * Инициализация обсервера для анимации плавного появления карточек
     */
    #createObserver() {
        let observer = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate");
                        observer.unobserve(entry.target);
                    }
                });
            });


        let targetElements = document.querySelectorAll(".second .cards-container .card");

        targetElements.forEach((targetElement) => {
            observer.observe(targetElement);
        });
    }

    /**
     * Рендерит страницу
     */
    render() {
        this.parent.insertAdjacentHTML(
            "afterbegin",
            window.Handlebars.templates["home.hbs"](this.config)
        );

        const container = this.self.querySelector(".text-container");
        const link = new Button(container, this.config.linkToLoginPage, this.handleButtonClick);
        link.render();

        this.#createObserver();

        document.title = "Главная";
    }
}
