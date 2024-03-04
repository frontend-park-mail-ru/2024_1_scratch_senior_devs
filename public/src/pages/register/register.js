import "../../../build/register.js";
import {Input} from "../../components/input/input.js";
import {Link} from "../../components/link/link.js";
import {Button} from "../../components/button/button.js";
import {ValidateLogin, ValidatePassword} from "../../shared/validation.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {inputEvents} from "../../components/input/events.js";
import {AppDispatcher} from "../../modules/dispathcer.js";
import {UserActions} from "../../stores/user/userStore.js";
import Page from "../page.js";
import {UserStoreEvents} from "../../stores/user/events.js";

export default class RegisterPage extends Page {
    #loginInput;
    #passwordInput;
    #repeatPasswordInput;
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
                type: UserActions.REGISTER,
                payload: {
                    login: this.#loginInput.value,
                    password: this.#passwordInput.value
                }
            });
        }
    };

    #validateLogin(){
        delete this.#loginInput.self.dataset.error;

        const value = this.#loginInput.value;

        const validationResult = ValidateLogin(value);

        if (!validationResult.result){
            this.#loginInput.throwError(validationResult.message);
        }

        if (validationResult.result) {
            this.#loginInput.cleanError();
            this.#loginInput.self.classList.add("success");
        }

        return validationResult.result;
    }

    #validatePassword(){
        const value = this.#passwordInput.value;

        const validationResult = ValidatePassword(value);

        if (!validationResult.result){
            this.#passwordInput.throwError(validationResult.message);
            this.#repeatPasswordInput.throwError(validationResult.message);
            return false;
        }

        if (this.#passwordInput.value !== this.#repeatPasswordInput.value) {
            this.#passwordInput.throwError("Пароли не совпадают");
            this.#repeatPasswordInput.throwError("Пароли не совпадают");
            return false;
        }

        if (validationResult.result) {
            this.#passwordInput.cleanError();
            this.#passwordInput.self.classList.add("success");

            this.#repeatPasswordInput.cleanError();
            this.#repeatPasswordInput.self.classList.add("success");
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
    };

    #validateRepeatPassword(){
        const value = this.#repeatPasswordInput.value;

        const validationResult = ValidatePassword(value);

        if (!validationResult.result){
            this.#passwordInput.throwError(validationResult.message);
            this.#repeatPasswordInput.throwError(validationResult.message);
            return false;
        }

        if (this.#passwordInput.value !== this.#repeatPasswordInput.value) {
            this.#passwordInput.throwError("Пароли не совпадают");
            this.#repeatPasswordInput.throwError("Пароли не совпадают");
            return false;
        }

        if (validationResult.result) {
            this.#passwordInput.cleanError();
            this.#passwordInput.self.classList.add("success");

            this.#repeatPasswordInput.cleanError();
            this.#repeatPasswordInput.self.classList.add("success");
        }

        return validationResult.result;
    }

    #throwLoginAlreadyExistError = () => {
        this.#loginInput.throwError("Пользователь с таким логином уже существует!");
    };

    #subscribeToEvents(){
        AppEventMaker.subscribe(inputEvents.INPUT_CHANGE, this.#inputEventHandler);
        AppEventMaker.subscribe(UserStoreEvents.LOGIN_ALREADY_EXIST, this.#throwLoginAlreadyExistError);
    }

    #unsubscribeToEvents(){
        AppEventMaker.unsubscribe(inputEvents.INPUT_CHANGE, this.#inputEventHandler);
        AppEventMaker.unsubscribe(UserStoreEvents.LOGIN_ALREADY_EXIST, this.#throwLoginAlreadyExistError);
    }

    remove(){
        this.#unsubscribeToEvents();
        this.self.remove();
    }

    render() {

        this.parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["register.hbs"](this.config.form)
        );

        this.#loginInput = new Input(this.form, this.config.form.inputs.login);
        this.#loginInput.render();

        this.#passwordInput = new Input(this.form, this.config.form.inputs.password);
        this.#passwordInput.render();

        this.#repeatPasswordInput = new Input(this.form, this.config.form.inputs.repeatPassword);
        this.#repeatPasswordInput.render();

        this.#link = new Link(this.form, this.config.form.links.loginPage);
        this.#link.render();

        this.#submitBtn = new Button(this.form, this.config.form.buttons.submitBtn, this.validateData);
        this.#submitBtn.render();

        this.#subscribeToEvents();

        document.title = "Регистрация";
    }
}
