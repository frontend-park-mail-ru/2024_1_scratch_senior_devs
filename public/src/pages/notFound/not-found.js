import "../../../build/not-found.js";
import {router} from "../../modules/router.js";
import {Button} from "../../components/button/button.js";
import Page from "../page.js";

export default class NotFoundPage extends Page {
    handleButtonClick = () => {
        router.redirect("/");
    };

    render() {
        console.log("404 page render");

        this.parent.insertAdjacentHTML(
            "afterbegin",
            window.Handlebars.templates["not-found.hbs"](this.config)
        );

        const link = new Button(this.self, this.config.link, this.handleButtonClick);
        link.render();

        document.title = "404";
    }
}
