import "../../../build/register.js"
import {Input} from "../../components/input/input.js";
import {Link} from "../../components/link/link.js";
import {Button} from "../../components/button/button.js";

export default class RegisterPage {
    #parent;
    #config;

    #loginInput;
    #passwordInput;
    #repeatPasswordInput;
    #link;
    #submitBtn;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get href () {
        return this.#config.href;
    }

    get form () {
        return document.getElementById(this.#config.form.id)
    }

    remove(){
        this.#parent.innerHTML = '';
    }

    render() {

        this.#parent.insertAdjacentHTML(
            'beforeend',
            window.Handlebars.templates['register.hbs'](this.#config.form)
        );

        const self = document.getElementById("register-page")

        this.#loginInput = new Input(this.form, this.#config.form.inputs.login);
        this.#loginInput.render();

        this.#passwordInput = new Input(this.form, this.#config.form.inputs.password);
        this.#passwordInput.render();

        this.#repeatPasswordInput = new Input(this.form, this.#config.form.inputs.repeatPassword);
        this.#repeatPasswordInput.render();

        this.#link = new Link(this.form, this.#config.form.links.loginPage);
        this.#link.render();

        this.#submitBtn = new Button(this.form, this.#config.form.buttons.submitBtn);
        this.#submitBtn.render();
    }
}
