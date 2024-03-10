import {Input} from "../../../components/input/input.js";
import {Button} from "../../../components/button/button.js";
import "../../../../build/login.js";
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
     * @param parent {HTMLElement} - родительский элемент
     * @param config {Object} - пропсы
     */
    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    /**
     * Получение HTML элемента формы
     * @returns {HTMLElement}
     */
    get self () {
        return document.getElementById(this.#config.id);
    }

    /**
     * Валидация данных
     */
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

    /**
     * Валидация логина
     * @returns {boolean}
     */
    #validateLogin(){
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

    /**
     * Валидация пароля
     * @returns {boolean}
     */
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

    /**
     * Обработка события ввода данных
     * @param id {number}
     */
    #inputEventHandler = (id) => {
        if(id === this.#passwordInput.id){
            this.#validatePassword();
        } else if (id === this.#loginInput.id){
            this.#validateLogin();
        }
    };

    /**
     * Отображение сообщения об ошибках
     */
    #throwIncorrectData = () => {
        this.#loginInput.throwError("Неправильный логин или пароль!");
        this.#passwordInput.throwError("Неправильный логин или пароль!");
    };

    /**
     * Подписка на события
     */
    #subscribeToEvents(){
        AppEventMaker.subscribe(inputEvents.INPUT_CHANGE, this.#inputEventHandler);
        AppEventMaker.subscribe(UserStoreEvents.INVALID_LOGIN_OR_PASSWORD, this.#throwIncorrectData);
    }

    /**
     * Отписка от событий
     */
    #unsubscribeToEvents(){
        AppEventMaker.unsubscribe(inputEvents.INPUT_CHANGE, this.#inputEventHandler);
        AppEventMaker.unsubscribe(UserStoreEvents.INVALID_LOGIN_OR_PASSWORD, this.#throwIncorrectData);
    }

    /**
     * Очистка
     */
    remove(){
        this.#unsubscribeToEvents();
        this.#submitBtn.remove();
        this.#passwordInput.remove();
        this.#loginInput.remove();
        this.self.remove();
    }

    /**
     * Рендеринг формы
     */
    render() {
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