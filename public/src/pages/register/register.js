import "../../../build/register.js"
import {Input} from "../../components/input/input.js";

export default class RegisterPage {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    remove(){

    }

    render() {
        this.#parent.innerHTML = '';

        this.#parent.insertAdjacentHTML('beforeend', window.Handlebars.templates['register.hbs'](this.#config.registerPage));

        const self = document.getElementById("register-page")

        const input1 = new Input(self, this.#config.registerPage.inputs.login)
        input1.render()

        const input2 = new Input(self, this.#config.registerPage.inputs.password)
        input2.render()

        const input3 = new Input(self, this.#config.registerPage.inputs.repeatPassword)
        input3.render()
    }
}
