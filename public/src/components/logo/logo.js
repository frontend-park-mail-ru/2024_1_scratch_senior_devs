import {Image} from "../image/image.js";
import "../../../build/logo.js";
import {AppUserStore} from "../../stores/user/userStore.js";
import {router} from "../../modules/router.js";

export class Logo {
    #parent;
    #config;

    #img;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     * @param config {Object} - пропсы
     */
    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    /**
     * Возвращает HTML элемент компонента
     * @returns {HTMLElement}
     */
    get self(){
        return document.getElementById(this.#config.id);
    }

    /**
     * При клике по логотипу происходит перенаправление пользователя:
     * на страницу с заметками, если он авторизован
     * на главную страницу, если он не авторизован
     */
    #handleClick() {
        const href = AppUserStore.IsAuthenticated() ? "/notes" : "/";
        router.redirect(href);
    }

    /**
     * Рендеринг компонента
     */
    render() {
        this.#parent.insertAdjacentHTML(
            "afterbegin",
            window.Handlebars.templates["logo.hbs"](this.#config)
        );

        this.self.addEventListener("click", this.#handleClick);

        this.#img = new Image(this.self, this.#config.img);
        this.#img.render();
    }
}