import {Input} from "../../../components/input/input.js";
import {Button} from "../../../components/button/button.js";
import "../../../../build/login.js"
import {AppEventMaker} from "../../../modules/eventMaker.js";
import {inputEvents} from "../../../components/input/events.js";
import {UserStoreEvents} from "../../../stores/user/events.js";
import {AppDispatcher} from "../../../modules/dispathcer.js";
import {UserActions} from "../../../stores/user/userStore.js";
import {ValidateLogin, ValidatePassword} from "../../../shared/validation.js";

export class LoginForm {
    #parent;
    #config;

    #loginInput;
    #passwordInput;
    #submitBtn;

    /**
     * Конструктор класса
     * @param parent объект родителя
     * @param config конфиг
     */
    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get self () {
        return document.getElementById(this.#config.id);
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

    #validatePassword(){
        const value = this.#passwordInput.value;

        const validationResult = ValidatePassword(value);

        if (!validationResult.result){
            this.#passwordInput.throwError(validationResult.message);
            return false;
        }

        if (validationResult.result) {
            this.#passwordInput.cleanError();
            this.#passwordInput.self.classList.add("success");
        }

        return validationResult.result;
    }

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

    remove(){
        this.#unsubscribeToEvents();
        this.#submitBtn.remove();
        this.#passwordInput.remove();
        this.#loginInput.remove();
        this.self.remove();
    }

    render() {
        console.log("login form render");

        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["login.hbs"](this.#config)
        );

        this.#loginInput = new Input(this.self, this.#config.inputs.login);
        this.#loginInput.render();

        this.#passwordInput = new Input(this.self, this.#config.inputs.password);
        this.#passwordInput.render();

        this.#submitBtn = new Button(this.self, this.#config.buttons.submitBtn, this.validateData);
        this.#submitBtn.render();

        this.#subscribeToEvents();
    }
}