import "../../../build/not-found.js";
import {router} from "../../modules/router.js";
import {Button} from "../../components/button/button.js";
import Page from "../page.js";

export default class NotFoundPage extends Page {
    /**
     * Перенаправление пользователя на главную страницу
     */
    handleButtonClick = () => {
        router.redirect("/");
    };

    /**
     * Рендеринг страницы
     */
    render() {
        this.parent.insertAdjacentHTML(
            "afterbegin",
            window.Handlebars.templates["not-found.hbs"](this.config)
        );

        const link = new Button(this.self, this.config.link, this.handleButtonClick);
        link.render();

        document.title = "404";
    }
}
