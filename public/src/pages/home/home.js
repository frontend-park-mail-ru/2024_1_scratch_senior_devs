import "../../../build/home.js"
import {AppUserStore} from "../../stores/user/userStore.js";
import {router} from "../../modules/router.js";
import {Button} from "../../components/button/button.js";

export default class Home {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get href () {
        return this.#config.href;
    }

    get self () {
        return document.getElementById(this.#config.id);
    }

    remove(){
        console.log("Home remove")
        this.self.remove()
    }


    handleButtonClick = () => {
        const href = AppUserStore.IsAuthenticated() ? "/notes" : "/login"
        router.redirect(href)
    }

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
    };

    render() {
        console.log("Home page render")

        this.#parent.insertAdjacentHTML(
            'afterbegin',
            window.Handlebars.templates['home.hbs'](this.#config)
        );

        const link = new Button(this.self.querySelector(".left-container"), this.#config.linkToLoginPage, this.handleButtonClick)
        link.render()

        this.createObserver()
    }
}
