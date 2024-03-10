import Page from "../page.js";
import {LoginForm} from "./login/login.js";
import {RegisterForm} from "./register/register.js";
import "../../../build/auth.js";
import {Button} from "../../components/button/button.js";

export class AuthPage extends Page{
    #loginForm;
    #registerForm;

    /**
     * Отображение формы входа
     * Вызывается один раз, если url заканчивается на /login
     */
    renderLoginForm = () => {
        this.self.classList.remove("active");
        this.self.querySelector(".form-container.sign-up").classList.remove("toggle-left");
        this.self.querySelector(".form-container.sign-up").classList.add("toggle-right");
        document.title = "Вход";

        this.#loginForm = new LoginForm(this.self.querySelector(".sign-in"), this.config.forms.login);
        this.#loginForm.render();
    };

    /**
     * Отображение формы регистрации
     * Вызывается один раз, если url заканчивается на /register
     */
    renderRegisterForm = () => {
        this.self.classList.add("active");
        document.title = "Регистрация";

        this.#registerForm = new RegisterForm(this.self.querySelector(".sign-up"), this.config.forms.register);
        this.#registerForm.render();
    };

    /**
     * Прячет форму регистрации и отображает форму входа
     * Вызывается при нажатии на кнопку "Уже зарегистрированы?"
     */
    toggleLoginForm = () => {
        this.self.classList.remove("active");
        this.self.querySelector(".form-container.sign-up").classList.remove("fade-left");
        this.self.querySelector(".form-container.sign-up").classList.add("fade-right");
        history.pushState(null, null, "login");
        document.title = "Вход";

        if (this.#loginForm === undefined) {
            this.#loginForm = new LoginForm(this.self.querySelector(".sign-in"), this.config.forms.login);
            this.#loginForm.render();
        }
    };

    /**
     * Прячет форму входа и отображает форму регистрации
     * Вызывается при нажатии на кнопку "Ещё нет аккаунта?"
     */
    toggleRegisterForm = () => {
        this.self.classList.add("active");
        this.self.querySelector(".form-container.sign-up").classList.add("fade-left");
        this.self.querySelector(".form-container.sign-up").classList.remove("fade-right");
        history.pushState(null, null, "register");
        document.title = "Регистрация";

        if (this.#registerForm === undefined) {
            this.#registerForm = new RegisterForm(this.self.querySelector(".sign-up"), this.config.forms.register);
            this.#registerForm.render();
        }
    };

    /**
     * Очищает DOM
     */
    remove() {
        if (this.#loginForm !== undefined) {
            this.#loginForm.remove();
            this.#loginForm = undefined;
        }

        if (this.#registerForm !== undefined) {
            this.#registerForm.remove();
            this.#registerForm = undefined;
        }

        this.self.remove();
    }

    /**
     * Возвращает true, если открыта страница логина
     * @returns {boolean}
     */
    isLoginPage() {
        return window.location.href.includes("login");
    }

    /**
     * Рендерит страницу
     */
    render() {
        console.log("auth page render");

        this.parent.insertAdjacentHTML(
            "afterbegin",
            window.Handlebars.templates["auth.hbs"](this.config)
        );

        this.isLoginPage() ? this.renderLoginForm() : this.renderRegisterForm();

        const linkToLogin = new Button(this.self.querySelector(".toggle-panel.toggle-left"), this.config.links.linkToLogin, this.toggleLoginForm);
        linkToLogin.render();

        const linkToRegister = new Button(this.self.querySelector(".toggle-panel.toggle-right"), this.config.links.linkToRegister, this.toggleRegisterForm);
        linkToRegister.render();
    }
}