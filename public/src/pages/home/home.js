import "../../../build/home.js";
import {AppUserStore} from "../../stores/user/userStore.js";
import {router} from "../../modules/router.js";
import {Button} from "../../components/button/button.js";
import Page from "../page.js";

export default class Home extends Page {
    handleButtonClick = () => {
        const href = AppUserStore.IsAuthenticated() ? "/notes" : "/login";
        router.redirect(href);
    };


    createObserver() {
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

    render() {
        this.parent.insertAdjacentHTML(
            "afterbegin",
            window.Handlebars.templates["home.hbs"](this.config)
        );

        const link = new Button(this.self.querySelector(".left-container"), this.config.linkToLoginPage, this.handleButtonClick);
        link.render();

        this.createObserver();

        document.title = "Главная";
    }
}
