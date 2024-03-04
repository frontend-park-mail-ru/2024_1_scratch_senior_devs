import "../../../build/login.js";
import {Input} from "../../components/input/input.js";
import {Button} from "../../components/button/button.js";
import {inputEvents} from "../../components/input/events.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {AppDispatcher} from "../../modules/dispathcer.js";
import {UserActions} from "../../stores/user/userStore.js";
import {Link} from "../../components/link/link.js";
import {ValidateLogin, ValidatePassword} from "../../shared/validation.js";
import {router} from "../../modules/router.js";
import Page from "../page.js";
import {UserStoreEvents} from "../../stores/user/events.js";

export default class LoginPage extends Page {
    #loginInput;
    #passwordInput;
    #link;
    #submitBtn;

    get form () {
        return document.getElementById(this.config.form.id);
    }

    validateData = () => {
        const validateLogin = this.#validateLogin();
        const validatePassword = this.#validatePassword();
        if (validateLogin && validatePassword) {
            AppDispatcher.dispatch({
                type: UserActions.LOGIN,
                payload: {
                    login: this.#loginInput.value,
                    password: this.#passwordInput.value
                }
            });
        }
    };

    #successfulLogin = () => {
        router.redirect("/");
    };

    #inputEventHandler = (id) => {
        if(id === this.#passwordInput.id){
            this.#validatePassword();
        } else if (id === this.#loginInput.id){
            this.#validateLogin();
        }
    };

    #throwIncorrectData = () => {
        this.#loginInput.throwError("Неправильный логин или пароль!");
        this.#passwordInput.throwError("Неправильный логин или пароль!");
    }

    #subscribeToEvents(){
        console.log("subscribeToEvents");
        AppEventMaker.subscribe(inputEvents.INPUT_CHANGE, this.#inputEventHandler);
        AppEventMaker.subscribe(UserStoreEvents.INVALID_LOGIN_OR_PASSWORD, this.#throwIncorrectData);
    }

    #unsubscribeToEvents(){
        console.log("unsubscribeToEvents login");
        AppEventMaker.unsubscribe(inputEvents.INPUT_CHANGE, this.#inputEventHandler);
        AppEventMaker.unsubscribe(UserStoreEvents.INVALID_LOGIN_OR_PASSWORD, this.#throwIncorrectData);
    }

    #validatePassword(){
        console.log("password validation started");

        delete this.#passwordInput.self.dataset.error;

        const value = this.#passwordInput.value;

        const validationResult = ValidatePassword(value);

        if (validationResult.result) {
            this.#passwordInput.cleanError();
            this.#passwordInput.self.classList.add("success");
        } else {
            this.#passwordInput.throwError(validationResult.message);
        }

        return validationResult.result;
    }

    #validateLogin(){
        console.log("login validation started");

        delete this.#loginInput.self.dataset.error;

        const value = this.#loginInput.value;

        const validationResult = ValidateLogin(value);

        if (validationResult.result) {
            this.#loginInput.cleanError();
            this.#loginInput.self.classList.add("success");
        } else {
            this.#loginInput.throwError(validationResult.message);
        }

        return validationResult.result;
    }

    remove(){
        this.#unsubscribeToEvents();
        this.#submitBtn.remove();
        this.#passwordInput.remove();
        this.#loginInput.remove();
        this.self.remove();
    }

    render() {
        console.log("loginPage render");

        this.parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["login.hbs"](this.config)
        );

        this.#loginInput = new Input(this.form, this.config.form.inputs.login);
        this.#loginInput.render();

        this.#passwordInput = new Input(this.form, this.config.form.inputs.password);
        this.#passwordInput.render();

        this.#link = new Link(this.form, this.config.form.links.registerPage);
        this.#link.render();

        this.#submitBtn = new Button(this.form, this.config.form.buttons.submitBtn, this.validateData);
        this.#submitBtn.render();

        this.#subscribeToEvents();

        document.title = "Вход";
    }
}
