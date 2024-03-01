import "../../../build/register.js"
import {Input} from "../../components/input/input.js";
import {Link} from "../../components/link/link.js";
import {Button} from "../../components/button/button.js";
import {ValidateLogin, ValidatePassword} from "../../shared/validation.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {inputEvents} from "../../components/input/events.js";
import {AppDispatcher} from "../../modules/dispathcer.js";
import {UserActions} from "../../stores/user/userStore.js";
import {router} from "../../modules/router.js";

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

    get self () {
        return document.getElementById(this.#config.id)
    }

    validateData = () => {
        const validateLogin = this.#validateLogin()
        const validatePassword = this.#validatePassword()
        if (validateLogin && validatePassword) {

            AppDispatcher.dispatch({
                type: UserActions.LOGIN,
                payload: this.#loginInput.value
            })

            router.redirect("/")
        }
    }

    #validateLogin(){
        delete this.#loginInput.self.dataset.error;

        const value = this.#loginInput.value;

        const validationResult = ValidateLogin(value);

        if (!validationResult.result){
            this.#loginInput.throwError(validationResult.message);
        }

        return validationResult.result;
    }

    #validatePassword(){
        delete this.#passwordInput.self.dataset.error;

        const value = this.#passwordInput.value;

        const validationResult = ValidatePassword(value);

        if (!validationResult.result){
            this.#passwordInput.throwError(validationResult.message);
            this.#repeatPasswordInput.throwError(validationResult.message);
        }

        if (this.#passwordInput.value !== this.#repeatPasswordInput.value) {
            this.#passwordInput.throwError("Пароли не совпадают");
            this.#repeatPasswordInput.throwError("Пароли не совпадают");
        }

        return validationResult.result;
    }

    #inputEventHandler = (id) => {
        if (id === this.#loginInput.id){
            this.#validateLogin();
        } else if (id === this.#passwordInput.id){
            this.#validatePassword();
        } else if (id === this.#repeatPasswordInput.id){
            this.#validateRepeatPassword();
        }
    }

    #validateRepeatPassword(){
        delete this.#repeatPasswordInput.self.dataset.error;

        const value = this.#repeatPasswordInput.value;

        const validationResult = ValidatePassword(value);

        if (!validationResult.result){
            this.#repeatPasswordInput.throwError(validationResult.message);
        }

        return validationResult.result;
    }

    #subscribeToEvents(){
        AppEventMaker.subscribe(inputEvents.INPUT_CHANGE, this.#inputEventHandler);
    }

    #unsubscribeToEvents(){
        AppEventMaker.unsubscribe(inputEvents.INPUT_CHANGE, this.#inputEventHandler);
    }

    remove(){
        this.#unsubscribeToEvents();
        this.self.remove()
    }

    render() {

        this.#parent.insertAdjacentHTML(
            'beforeend',
            window.Handlebars.templates['register.hbs'](this.#config.form)
        );

        const self = document.getElementById("register-page") // Не понятно зачем это, анализатор ругается

        this.#loginInput = new Input(this.form, this.#config.form.inputs.login);
        this.#loginInput.render();

        this.#passwordInput = new Input(this.form, this.#config.form.inputs.password);
        this.#passwordInput.render();

        this.#repeatPasswordInput = new Input(this.form, this.#config.form.inputs.repeatPassword);
        this.#repeatPasswordInput.render();

        this.#link = new Link(this.form, this.#config.form.links.loginPage);
        this.#link.render();

        this.#submitBtn = new Button(this.form, this.#config.form.buttons.submitBtn, this.validateData);
        this.#submitBtn.render();

        this.#subscribeToEvents();
    }
}
