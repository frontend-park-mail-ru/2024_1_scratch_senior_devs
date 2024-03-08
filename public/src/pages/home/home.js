import "../../../build/home.js";
import {AppUserStore} from "../../stores/user/userStore.js";
import {router} from "../../modules/router.js";
import {Button} from "../../components/button/button.js";
import Page from "../page.js";
import {mapNumberRange} from "../../modules/utils.js";

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
                        setTimeout(() => {
                            entry.target.classList.remove("animate")
                        }, 1000)
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
     * Инициализация 3d tilt эффекта при ховере карточки
     * @param card {Element} карточка
     */
    #initCard(card) {
        card.addEventListener('mousemove', (e) => {
            const pointerX = e.clientX
            const pointerY = e.clientY

            const cardRect = card.getBoundingClientRect()

            const halfWidth = cardRect.width / 2
            const halfHeight = cardRect.height / 2

            const cardCenterX = cardRect.left + halfWidth
            const cardCenterY = cardRect.top + halfHeight

            const deltaX = pointerX - cardCenterX
            const deltaY = pointerY - cardCenterY

            const distanceToCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

            const maxDistance = Math.max(halfWidth, halfHeight)

            const degree = mapNumberRange(distanceToCenter, 0, maxDistance, 0, 10)

            const rx = mapNumberRange(deltaY, 0, halfWidth, 0, 1)
            const ry = mapNumberRange(deltaX, 0, halfHeight, 0, 1)

            card.style.transform = `perspective(400px) rotate3d(${-rx}, ${ry}, 0, ${degree}deg)`
        })

        card.addEventListener('mouseleave', () => {
            card.style = null
        })
    }

    /**
     * Инициализация 3d tilt эффекта при ховере карточек
     */
    #setupTilt() {
        Array.from(document.querySelectorAll(".second .cards-container .card")).map((cardEl) =>
            this.#initCard(cardEl)
        )
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
        this.#setupTilt();


        document.title = "Главная";
    }
}
