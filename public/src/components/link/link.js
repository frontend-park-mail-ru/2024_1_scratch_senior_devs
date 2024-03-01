import "../../../build/link.js"
import {router} from "../../modules/router.js";

export class Link {
    #parent;

    #props = {};

    id;

    constructor(parent, config) {
        this.id = crypto.randomUUID();

        this.#parent = parent;

        this.#props.id = this.id ;
        this.#props.text = config.text;
        this.#props.href = config.href;
    }

    get self(){
        return document.getElementById(this.id);
    }

    handleClick = (e) => {
        e.preventDefault()
        router.redirect(this.#props.href)
    }

    #addListeners () {
        this.self.addEventListener("click", this.handleClick)
    }


    render() {

        this.#parent.insertAdjacentHTML(
            'beforeend',
            window.Handlebars.templates['link.hbs'](this.#props)
        );

        this.#addListeners()
    }
}
