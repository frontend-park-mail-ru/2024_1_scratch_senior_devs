import "../../../build/home.js"
import {router} from "../../modules/router.js";
import {Button} from "../button/button.js";
import {Image} from "../image/image.js";

export class Home {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get self () {
        return document.getElementById('home');
    }

    handleButtonClick = () => {
        router.redirect("/login")
    }

    createObserver () {
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
        this.#parent.insertAdjacentHTML(
            'afterbegin',
            window.Handlebars.templates['home.hbs'](this.#config)
        );

        const link = new Button(this.self.querySelector(".left-container"), this.#config.linkToLogin, this.handleButtonClick)
        link.render()

        this.createObserver()
    }
}
