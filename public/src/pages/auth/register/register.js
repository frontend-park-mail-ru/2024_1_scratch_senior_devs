import "../../../../build/register.js";
import {Input} from "../../../components/input/input.js";
import {Button} from "../../../components/button/button.js";
import {AppEventMaker} from "../../../modules/eventMaker.js";
import {UserStoreEvents} from "../../../stores/user/events.js";
import {inputEvents} from "../../../components/input/events.js";
import {AppDispatcher} from "../../../modules/dispathcer.js";
import {UserActions} from "../../../stores/user/userStore.js";
import {ValidateLogin, ValidatePassword} from "../../../shared/validation.js";

export class RegisterForm {
    #parent;
    #config;

    #loginInput;
    #passwordInput;
    #repeatPasswordInput;
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
     * Возвращает HTML элемент компонента
     * @returns {HTMLElement}
     */
    get self () {
        return document.getElementById(this.#config.id);
    }

    /**
     * Валидация введенных данных
     */
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

    /**
     * Валидация логина
     * @returns {boolean}
     */
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

    /**
     * Валидация пароля
     * @returns {boolean}
     */
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

    /**
     * Обработка события ввода данных
     * @param id {number}
     */
    #inputEventHandler = (id) => {
        if (id === this.#loginInput.id){
            this.#validateLogin();
        } else if (id === this.#passwordInput.id){
            this.#validatePassword();
        } else if (id === this.#repeatPasswordInput.id){
            this.#validateRepeatPassword();
        }
    };

    /**
     * Валидация пароля
     * @returns {boolean}
     */
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

    /**
     * Вывод сообщения об ошибке
     */
    #throwLoginAlreadyExistError = () => {
        this.#loginInput.throwError("Пользователь с таким логином уже существует!");
    };

    /**
     * Подписка на события
     */
    #subscribeToEvents(){
        AppEventMaker.subscribe(inputEvents.INPUT_CHANGE, this.#inputEventHandler);
        AppEventMaker.subscribe(UserStoreEvents.LOGIN_ALREADY_EXIST, this.#throwLoginAlreadyExistError);
    }

    /**
     * Отписка от событий
     */
    #unsubscribeToEvents(){
        AppEventMaker.unsubscribe(inputEvents.INPUT_CHANGE, this.#inputEventHandler);
        AppEventMaker.unsubscribe(UserStoreEvents.LOGIN_ALREADY_EXIST, this.#throwLoginAlreadyExistError);
    }

    /**
     * Очистка
     */
    remove(){
        this.#unsubscribeToEvents();
        this.self.remove();
    }

    /**
     * Рендеринг формы
     */
    render() {
        console.log("register form render");

        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["register.hbs"](this.#config)
        );

        this.#loginInput = new Input(this.self, this.#config.inputs.login);
        this.#loginInput.render();

        this.#passwordInput = new Input(this.self, this.#config.inputs.password);
        this.#passwordInput.render();

        this.#repeatPasswordInput = new Input(this.self, this.#config.inputs.repeatPassword);
        this.#repeatPasswordInput.render();

        this.#submitBtn = new Button(this.self, this.#config.buttons.submitBtn, this.validateData);
        this.#submitBtn.render();

        this.#subscribeToEvents();
    }
}